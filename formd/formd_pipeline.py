#!/usr/bin/env python3
"""
formd_pipeline.py — 506(c) sponsor list builder for Ascent.

Implements §3.1–§3.2 of claude/sponsor-outbound-system-build-spec.md exactly:
join → parse dates → real-estate filter → 06c / $10M / open → second screen → score → hold gate.

Deterministic. No network calls, no LLM calls. Same inputs → same CSVs.

USAGE
  # quarterly base run (one or more quarters of SEC Form D data sets, zips or extracted folders)
  python formd_pipeline.py build --raw ./raw --out ./out --hold hold_list.csv \
      --brands institutional_brands.txt --asof 2026-09-14

  # weekly run: new EDGAR hits, screened with history from the quarters in --raw
  python formd_pipeline.py build --raw ./raw --weekly weekly_hits.csv --out ./out_week --hold hold_list.csv

  # assign split-test arms after enrichment (stratified by segment, fixed seed)
  python formd_pipeline.py arms --enriched ./out/enriched.csv --out ./out --seed 2026

INPUTS
  --raw      Folder containing SEC Form D data-set quarters. Each quarter is either a zip
             (e.g. 2026q2_d.zip) or an extracted folder holding FORMDSUBMISSION.tsv, ISSUERS.tsv,
             OFFERING.tsv, RELATEDPERSONS.tsv. Download from
             sec.gov/data-research/sec-markets-data/form-d-data-sets in the browser (sec.gov is
             blocked from the shell). Load every quarter you have — history counts come from here.
  --weekly   Optional CSV of new filings from the Monday EDGAR full-text search. Columns (any
             order, extra columns ignored): form_d_accession_no, entity_name, cik, filing_date,
             state, industry_group, sic_code, exemption, total_offering, total_sold, investors,
             min_investment, sales_comm, is_amendment. Dates may be DD-MON-YYYY or ISO.
  --hold     hold_list.csv — append-only. Columns: form_d_accession_no, cik, entity_name, reason,
             date_added, note. Any one of the first three matching is a hold.
  --brands   institutional_brands.txt — one case-insensitive substring per line.

OUTPUTS (all share the column set in spec §9)
  candidates.csv     passed every filter and the hold gate, scored, tiered
  held.csv           matched the hold list (reason attached)
  screened_out.csv   dropped by a filter, with screen_reason
  hunter_upload.csv  candidates with contact names, in Hunter Email Finder's column shape
  ghl_import.csv     candidates in the GHL import column shape (§5.1 fields)
  run_log.txt        counts per stage, so the run is auditable
"""
from __future__ import annotations

import argparse
import csv
import io
import re
import zipfile
from datetime import date, datetime
from pathlib import Path

import pandas as pd

# --------------------------------------------------------------------------------------
# Parameters (spec §3.1). Change here, nowhere else.
# --------------------------------------------------------------------------------------
MIN_TOTAL = 10_000_000
RE_INDUSTRY_GROUPS = {
    "commercial", "construction", "reits and finance", "residential", "other real estate",
    "real estate",
}
RE_SIC_PREFIXES = ("65",)  # 65xx = real estate; 6798 REITs handled below
RE_SIC_EXACT = {"6798"}
RE_NAME_TERMS = [
    r"\breit\b", r"realty", r"multifamily", r"multi-family", r"apartment", r"storage",
    r"industrial", r"propert", r"real estate", r"residential", r"housing", r"land\b",
    r"self.?storage", r"btr\b", r"build.?to.?rent", r"opportunity zone", r"\bqof\b",
    r"income fund", r"mortgage", r"lending fund", r"debt fund",
]
OFFSHORE_TERMS = [r"scsp", r"s\.\s?à\s?r\.l", r"sarl", r"fcp-raif", r"raif", r"cayman",
                  r"\bfeeder\b", r"master fund", r"\bltd\.?$", r"\bicav\b", r"luxembourg"]
PLATFORM_FILER_MIN = 60          # 60+ prior new Form Ds → platform-scale, institutionally served
INSTITUTIONAL_CHECK = 3_000_000  # avg check above this = institutional LPs
MIN_INV_HOLD = 1_000_000         # minimum investment at/above this = not a retail vehicle
RETAIL_CHECK = (75_000, 500_000)
NEAR_RETAIL_CHECK = (50_000, 1_000_000)
FRESH_DAYS = 90

TIER_A, TIER_B = 70, 45

OUTPUT_COLUMNS = [
    "form_d_accession_no", "issuer_cik", "entity_name", "filing_date", "state", "industry_group",
    "sic_code", "exemption", "total_offering", "total_sold", "remaining", "investors", "avg_check",
    "investors_needed", "min_investment", "sales_comm", "prior_filings", "pct_open", "score", "tier",
    "hold_reason", "contact_first", "contact_last", "contact_title", "contact_type", "domain",
    "website", "hunter_email", "hunter_confidence", "hunter_status", "segment", "ad_status",
    "ad_status_checked", "funnel_observation", "test_arm", "email1_approved",
]

# --------------------------------------------------------------------------------------
# Loading
# --------------------------------------------------------------------------------------
TSV_NAMES = {"FORMDSUBMISSION", "ISSUERS", "OFFERING", "RELATEDPERSONS"}


def _read_tsv_bytes(name: str, data: bytes) -> pd.DataFrame:
    df = pd.read_csv(io.BytesIO(data), sep="\t", dtype=str, keep_default_na=False,
                     encoding="utf-8", encoding_errors="replace", quoting=csv.QUOTE_NONE,
                     on_bad_lines="skip")
    df.columns = [c.strip().upper() for c in df.columns]
    return df


def load_quarter(path: Path) -> dict[str, pd.DataFrame]:
    """Load one quarter from a zip or an extracted folder. Returns {TABLE: df}."""
    tables: dict[str, pd.DataFrame] = {}
    if path.is_file() and path.suffix.lower() == ".zip":
        with zipfile.ZipFile(path) as z:
            for member in z.namelist():
                stem = Path(member).stem.upper()
                if stem in TSV_NAMES and member.lower().endswith(".tsv"):
                    tables[stem] = _read_tsv_bytes(stem, z.read(member))
    elif path.is_dir():
        for f in path.rglob("*.tsv"):
            stem = f.stem.upper()
            if stem in TSV_NAMES:
                tables[stem] = _read_tsv_bytes(stem, f.read_bytes())
    missing = {"FORMDSUBMISSION", "ISSUERS", "OFFERING"} - tables.keys()
    if missing:
        raise SystemExit(f"{path}: missing tables {sorted(missing)}")
    return tables


def load_raw(raw_dir: Path) -> dict[str, pd.DataFrame]:
    """Concatenate every quarter found under raw_dir."""
    parts: dict[str, list[pd.DataFrame]] = {t: [] for t in TSV_NAMES}
    quarters = sorted([p for p in raw_dir.iterdir()
                       if (p.is_file() and p.suffix.lower() == ".zip") or
                       (p.is_dir() and any(p.rglob("OFFERING.tsv")))])
    if not quarters:
        raise SystemExit(f"No quarters found under {raw_dir}")
    for q in quarters:
        t = load_quarter(q)
        for k, df in t.items():
            df = df.copy()
            df["_QUARTER"] = q.name
            parts[k].append(df)
        print(f"loaded {q.name}: {len(t['OFFERING']):,} offerings")
    return {k: (pd.concat(v, ignore_index=True) if v else pd.DataFrame()) for k, v in parts.items()}


# --------------------------------------------------------------------------------------
# Parsing helpers — the two corrections from the build record live here
# --------------------------------------------------------------------------------------
_MONTHS = {m: i for i, m in enumerate(
    ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], 1)}


def parse_sec_date(s: str) -> date | None:
    """'22-JAN-2026' → date. Also accepts ISO and M/D/YYYY. Never string-compare a SEC date."""
    s = (s or "").strip()
    if not s:
        return None
    m = re.fullmatch(r"(\d{1,2})-([A-Za-z]{3})-(\d{4})", s)
    if m:
        d, mon, y = m.groups()
        try:
            return date(int(y), _MONTHS[mon.upper()], int(d))
        except (KeyError, ValueError):
            return None
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d-%b-%y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def to_num(s) -> float | None:
    """'12,500,000' → 12500000.0; 'Indefinite', '', None → None."""
    if s is None:
        return None
    s = str(s).strip().replace(",", "").replace("$", "")
    if not s or s.lower().startswith("indef"):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def v(x):
    """NaN/None → None; pandas turns None into NaN inside float columns, and NaN is truthy."""
    if x is None:
        return None
    try:
        if pd.isna(x):
            return None
    except (TypeError, ValueError):
        pass
    return x


def norm_name(s: str) -> str:
    s = (s or "").lower()
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    s = re.sub(r"\b(llc|l\.?p\.?|lp|inc|corp|co|ltd|fund|trust|holdings|partners|the|a|an|of)\b", " ", s)
    s = re.sub(r"\b(i{1,3}|iv|v|vi{0,3}|ix|x|\d+)\b", " ", s)  # strip series numerals
    return re.sub(r"\s+", " ", s).strip()


def find_col(df: pd.DataFrame, *patterns: str) -> str | None:
    for p in patterns:
        for c in df.columns:
            if re.search(p, c, re.I):
                return c
    return None


# --------------------------------------------------------------------------------------
# Build the unified filing table
# --------------------------------------------------------------------------------------
def unify(tables: dict[str, pd.DataFrame]) -> pd.DataFrame:
    sub, iss, off = tables["FORMDSUBMISSION"], tables["ISSUERS"], tables["OFFERING"]

    # Primary issuer only (a filing can list co-issuers)
    pflag = find_col(iss, r"PRIMARY")
    if pflag:
        prim = iss[iss[pflag].str.strip().str.lower().isin({"true", "1", "y", "yes"})]
        if prim.empty:
            prim = iss
    else:
        prim = iss
    prim = prim.drop_duplicates("ACCESSIONNUMBER", keep="first")

    df = off.merge(prim, on="ACCESSIONNUMBER", how="inner", suffixes=("", "_ISS"))
    df = df.merge(sub, on="ACCESSIONNUMBER", how="left", suffixes=("", "_SUB"))

    exemption_col = find_col(df, r"FEDERALEXEMPTION")
    date_col = find_col(df, r"^FILING_DATE$", r"FILING_DATE", r"FILINGDATE")
    sic_col = find_col(df, r"^SIC_CODE$", r"SIC")
    amend_col = find_col(df, r"^ISAMENDMENT$")

    out = pd.DataFrame({
        "form_d_accession_no": df["ACCESSIONNUMBER"].str.strip(),
        "issuer_cik": df["CIK"].str.strip().str.lstrip("0") if "CIK" in df else "",
        "entity_name": df["ENTITYNAME"].str.strip() if "ENTITYNAME" in df else "",
        "filing_date": df[date_col].map(parse_sec_date) if date_col else None,
        "state": df["STATEORCOUNTRY"].str.strip() if "STATEORCOUNTRY" in df else "",
        "industry_group": df["INDUSTRYGROUPTYPE"].str.strip() if "INDUSTRYGROUPTYPE" in df else "",
        "sic_code": df[sic_col].str.strip() if sic_col else "",
        "exemption": df[exemption_col].str.strip() if exemption_col else "",
        "total_offering": df["TOTALOFFERINGAMOUNT"].map(to_num),
        "total_sold": df["TOTALAMOUNTSOLD"].map(to_num),
        "investors": df["TOTALNUMBERALREADYINVESTED"].map(to_num),
        "min_investment": df["MINIMUMINVESTMENTACCEPTED"].map(to_num),
        "sales_comm": df["SALESCOMM_DOLLARAMOUNT"].map(to_num),
        "is_amendment": df[amend_col].str.strip().str.lower().isin({"true", "1", "y", "yes"})
        if amend_col else False,
        "entity_type": df["ENTITYTYPE"].str.strip() if "ENTITYTYPE" in df else "",
        "jurisdiction": df["JURISDICTIONOFINC"].str.strip() if "JURISDICTIONOFINC" in df else "",
        "phone": df["ISSUERPHONENUMBER"].str.strip() if "ISSUERPHONENUMBER" in df else "",
    })
    return out


def unify_weekly(path: Path) -> pd.DataFrame:
    w = pd.read_csv(path, dtype=str, keep_default_na=False)
    w.columns = [c.strip().lower() for c in w.columns]
    g = lambda c: w[c] if c in w else pd.Series([""] * len(w))  # noqa: E731
    out = pd.DataFrame({
        "form_d_accession_no": g("form_d_accession_no").str.strip(),
        "issuer_cik": g("cik").str.strip().str.lstrip("0"),
        "entity_name": g("entity_name").str.strip(),
        "filing_date": g("filing_date").map(parse_sec_date),
        "state": g("state").str.strip(),
        "industry_group": g("industry_group").str.strip(),
        "sic_code": g("sic_code").str.strip(),
        "exemption": g("exemption").str.strip(),
        "total_offering": g("total_offering").map(to_num),
        "total_sold": g("total_sold").map(to_num),
        "investors": g("investors").map(to_num),
        "min_investment": g("min_investment").map(to_num),
        "sales_comm": g("sales_comm").map(to_num),
        "is_amendment": g("is_amendment").str.strip().str.lower().isin({"true", "1", "y", "yes"}),
        "entity_type": "", "jurisdiction": g("jurisdiction").str.strip(), "phone": g("phone").str.strip(),
        # fetch.py reads related persons straight off primary_doc.xml. RELATEDPERSONS.tsv in the
        # quarterly zips cannot contain this week's filings, so without these the weekly path
        # produces no named contacts and therefore no Hunter rows.
        "contact_first": g("contact_first").str.strip(),
        "contact_last": g("contact_last").str.strip(),
        "contact_title": g("contact_title").str.strip(),
    })
    return out


# --------------------------------------------------------------------------------------
# History index — prior *new* filings per sponsor (CIK, and name stem for series sponsors)
# --------------------------------------------------------------------------------------
def history_index(all_filings: pd.DataFrame) -> tuple[dict, dict]:
    new = all_filings[~all_filings["is_amendment"]]
    by_cik = new.groupby("issuer_cik")["form_d_accession_no"].nunique().to_dict()
    stems = new.assign(_stem=new["entity_name"].map(norm_name))
    by_stem = stems[stems["_stem"] != ""].groupby("_stem")["form_d_accession_no"].nunique().to_dict()
    return by_cik, by_stem


def prior_filings(row, by_cik, by_stem) -> int:
    c = by_cik.get(row["issuer_cik"], 0)
    s = by_stem.get(norm_name(row["entity_name"]), 0)
    # subtract this offering's own original filing (this row, or the D it amends)
    return max(max(c, s) - 1, 0)


# --------------------------------------------------------------------------------------
# Filters — each returns a reason string or None
# --------------------------------------------------------------------------------------
def is_real_estate(row) -> bool:
    ig = (row["industry_group"] or "").strip().lower()
    if ig in RE_INDUSTRY_GROUPS:
        return True
    sic = str(row["sic_code"] or "").strip()
    if sic in RE_SIC_EXACT or any(sic.startswith(p) for p in RE_SIC_PREFIXES):
        return True
    name = (row["entity_name"] or "").lower()
    return any(re.search(t, name) for t in RE_NAME_TERMS)


def structural_screen(row) -> str | None:
    if v(row["filing_date"]) is None:
        return "unparseable_date"
    if not is_real_estate(row):
        return "not_real_estate"
    if "06c" not in (row["exemption"] or "").lower():
        return "not_506c"
    if v(row["total_offering"]) is None or row["total_offering"] < MIN_TOTAL:
        return "under_10m_or_indefinite"
    sold = v(row["total_sold"]) or 0.0
    if sold >= row["total_offering"]:
        return "fully_sold"
    return None


def second_screen(row, brands: list[str]) -> str | None:
    if row["prior_filings"] >= PLATFORM_FILER_MIN:
        return "platform_filer"
    if (v(row["sales_comm"]) or 0) > 0:
        return "placement_agent"
    if v(row["avg_check"]) is not None and row["avg_check"] > INSTITUTIONAL_CHECK:
        return "institutional_check"
    name = (row["entity_name"] or "").lower()
    if any(b and b in name for b in brands):
        return "institutional_brand"
    if any(re.search(t, name) for t in OFFSHORE_TERMS):
        return "offshore_feeder"
    if v(row["min_investment"]) is not None and row["min_investment"] >= MIN_INV_HOLD:
        return "min_inv_1m"
    st = (row["state"] or "").upper()
    if st and len(st) == 2 and st not in US_STATES:
        return "non_us"
    return None


US_STATES = set("""AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV
NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC PR VI GU AS MP""".split())


# --------------------------------------------------------------------------------------
# Score (spec §3.1 step 6)
# --------------------------------------------------------------------------------------
def score(row, asof: date) -> float:
    s = 0.0
    ac = v(row["avg_check"])
    if ac is not None:
        if RETAIL_CHECK[0] <= ac <= RETAIL_CHECK[1]:
            s += 30
        elif NEAR_RETAIL_CHECK[0] <= ac <= NEAR_RETAIL_CHECK[1]:
            s += 15
    pf = row["prior_filings"]
    if 3 <= pf < PLATFORM_FILER_MIN:
        s += 25
    elif 1 <= pf <= 2:
        s += 10
    inv = v(row["investors"]) or 0
    # % open weighted by investor count — a 100%-open shell with 0 investors scores 0 here
    s += (v(row["pct_open"]) or 0) / 100.0 * min(inv, 50) / 50.0 * 25
    if inv >= 25:
        s += 10
    if v(row["filing_date"]) and (asof - row["filing_date"]).days <= FRESH_DAYS:
        s += 10
    return round(s, 1)


def tier(s: float) -> str:
    return "A" if s >= TIER_A else "B" if s >= TIER_B else "C"


# --------------------------------------------------------------------------------------
# Hold gate (spec §3.2)
# --------------------------------------------------------------------------------------
def load_hold(path: Path | None) -> pd.DataFrame:
    if not path or not path.exists():
        return pd.DataFrame(columns=["form_d_accession_no", "cik", "entity_name", "reason"])
    h = pd.read_csv(path, dtype=str, keep_default_na=False)
    h.columns = [c.strip().lower() for c in h.columns]
    for c in ("form_d_accession_no", "cik", "entity_name", "reason"):
        if c not in h:
            h[c] = ""
    h["cik"] = h["cik"].str.strip().str.lstrip("0")
    h["_stem"] = h["entity_name"].map(norm_name)
    return h


def hold_reason(row, hold: pd.DataFrame) -> str | None:
    if hold.empty:
        return None
    acc = row["form_d_accession_no"]
    m = hold[hold["form_d_accession_no"].str.strip() == acc]
    if m.empty and row["issuer_cik"]:
        m = hold[(hold["cik"] != "") & (hold["cik"] == row["issuer_cik"])]
    if m.empty:
        stem = norm_name(row["entity_name"])
        if stem:
            # name match is best-effort: the hold stem equals, prefixes, or (2+ words) sits inside the filing stem
            def _hit(h: str) -> bool:
                if not h:
                    return False
                if stem == h or stem.startswith(h + " "):
                    return True
                return len(h.split()) >= 2 and (" " + h + " ") in (" " + stem + " ")
            m = hold[hold["_stem"].map(_hit)]
    if m.empty:
        return None
    return m.iloc[0]["reason"] or "held"


# --------------------------------------------------------------------------------------
# Related persons → contact names for Hunter
# --------------------------------------------------------------------------------------
EXEC_TITLES = ("chief executive", "ceo", "president", "managing", "founder", "principal",
               "chief operating", "coo", "investor relations", "capital markets", "chief investment")


def contacts_from_related(rel: pd.DataFrame) -> dict[str, tuple[str, str, str]]:
    """accession → (first, last, title). Prefers exec/IR titles; 'Executive Officer' relationship."""
    if rel is None or rel.empty:
        return {}
    first_c = find_col(rel, r"^FIRSTNAME$")
    last_c = find_col(rel, r"^LASTNAME$")
    rels = [c for c in rel.columns if c.startswith("RELATIONSHIP")]
    clar = find_col(rel, r"CLARIFICATION")
    out: dict[str, tuple[str, str, str]] = {}
    for acc, grp in rel.groupby("ACCESSIONNUMBER"):
        best, best_rank = None, 99
        for _, r in grp.iterrows():
            first, last = (r.get(first_c, "") or "").strip(), (r.get(last_c, "") or "").strip()
            if not first or not last or "n/a" in first.lower():
                continue
            rtext = " ".join(str(r.get(c, "")) for c in rels).lower()
            title = (r.get(clar, "") or "").strip() if clar else ""
            rank = 3
            if any(t in (title.lower() + " " + rtext) for t in EXEC_TITLES):
                rank = 1
            elif "executive officer" in rtext:
                rank = 2
            if rank < best_rank:
                best, best_rank = (first, last, title or rtext.title()), rank
        if best:
            out[acc.strip()] = best
    return out


# --------------------------------------------------------------------------------------
# Main build
# --------------------------------------------------------------------------------------
def build(args):
    asof = parse_sec_date(args.asof) if args.asof else date.today()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    log: list[str] = [f"formd_pipeline build · as of {asof.isoformat()}"]

    tables = load_raw(Path(args.raw))
    base = unify(tables)
    log.append(f"filings loaded (all quarters): {len(base):,}")

    by_cik, by_stem = history_index(base)

    if args.weekly:
        universe = unify_weekly(Path(args.weekly))
        log.append(f"weekly hits: {len(universe):,}")
    else:
        # latest filing per issuer within the most recent quarter loaded
        latest_q = sorted(tables["OFFERING"]["_QUARTER"].unique())[-1]
        accs = set(tables["OFFERING"].loc[tables["OFFERING"]["_QUARTER"] == latest_q, "ACCESSIONNUMBER"].str.strip())
        universe = base[base["form_d_accession_no"].isin(accs)].copy()
        universe = universe.sort_values("filing_date").drop_duplicates("issuer_cik", keep="last")
        log.append(f"universe = latest quarter {latest_q}, latest filing per CIK: {len(universe):,}")

    universe = universe.copy()
    universe["prior_filings"] = universe.apply(lambda r: prior_filings(r, by_cik, by_stem), axis=1)
    universe["remaining"] = universe.apply(
        lambda r: (r["total_offering"] - (v(r["total_sold"]) or 0)) if v(r["total_offering"]) else None, axis=1)
    universe["avg_check"] = universe.apply(
        lambda r: (r["total_sold"] / r["investors"]) if (v(r["total_sold"]) and v(r["investors"])) else None, axis=1)
    universe["pct_open"] = universe.apply(
        lambda r: round(100 * r["remaining"] / r["total_offering"], 1) if v(r["total_offering"]) else None, axis=1)
    universe["investors_needed"] = universe.apply(
        lambda r: int(round(r["remaining"] / r["avg_check"])) if (v(r["remaining"]) and v(r["avg_check"])) else None, axis=1)

    # Stage: structural
    universe["screen_reason"] = universe.apply(structural_screen, axis=1)
    passed = universe[universe["screen_reason"].isna()].copy()
    dropped = universe[universe["screen_reason"].notna()].copy()
    log.append(f"after structural filter (RE, 06c, >= $10M, open): {len(passed):,} kept, {len(dropped):,} dropped")
    for reason, n in dropped["screen_reason"].value_counts().items():
        log.append(f"   {reason}: {n:,}")

    # Stage: second screen
    brands = []
    if args.brands and Path(args.brands).exists():
        brands = [l.strip().lower() for l in Path(args.brands).read_text().splitlines()
                  if l.strip() and not l.startswith("#")]
    passed["screen_reason"] = passed.apply(lambda r: second_screen(r, brands), axis=1)
    dropped2 = passed[passed["screen_reason"].notna()].copy()
    passed = passed[passed["screen_reason"].isna()].copy()
    log.append(f"after second screen: {len(passed):,} kept, {len(dropped2):,} dropped")
    for reason, n in dropped2["screen_reason"].value_counts().items():
        log.append(f"   {reason}: {n:,}")
    screened_out = pd.concat([dropped, dropped2], ignore_index=True)

    # Stage: score
    passed["score"] = passed.apply(lambda r: score(r, asof), axis=1)
    passed["tier"] = passed["score"].map(tier)

    # Stage: hold gate — before anything is uploaded anywhere
    hold = load_hold(Path(args.hold) if args.hold else None)
    passed["hold_reason"] = passed.apply(lambda r: hold_reason(r, hold), axis=1)
    held = passed[passed["hold_reason"].notna()].copy()
    candidates = passed[passed["hold_reason"].isna()].copy()
    log.append(f"hold gate: {len(held):,} held, {len(candidates):,} candidates")
    for reason, n in held["hold_reason"].value_counts().items():
        log.append(f"   {reason}: {n:,}")
    log.append("tiers: " + ", ".join(f"{t}={n}" for t, n in candidates["tier"].value_counts().sort_index().items()))

    # Contacts from RELATEDPERSONS (quarterly runs only — weekly hits carry their own if any)
    contacts = contacts_from_related(tables.get("RELATEDPERSONS"))

    def finish(df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        for c in OUTPUT_COLUMNS:
            if c not in df:
                df[c] = ""
        # Fill from RELATEDPERSONS only where the row has no contact of its own. Weekly rows arrive
        # from fetch.py already carrying one; overwriting them blanked every weekly hit.
        for idx, col in enumerate(("contact_first", "contact_last", "contact_title")):
            from_tsv = df["form_d_accession_no"].map(lambda a, i=idx: contacts.get(a, ("", "", ""))[i])
            existing = df[col].fillna("").astype(str).str.strip() if col in df else ""
            df[col] = existing.where(existing != "", from_tsv)
        df["filing_date"] = df["filing_date"].map(lambda d: d.isoformat() if v(d) else "")
        for c in ("total_offering", "total_sold", "remaining", "investors", "min_investment",
                  "sales_comm", "avg_check", "investors_needed"):
            df[c] = df[c].map(lambda v: "" if v is None or pd.isna(v) else int(round(v)))
        df["hold_reason"] = df["hold_reason"].fillna("")
        cols = OUTPUT_COLUMNS + [c for c in ("screen_reason",) if c in df]
        return df[cols].sort_values(["score", "remaining"], ascending=[False, False], key=None)

    finish(candidates).to_csv(out_dir / "candidates.csv", index=False)
    finish(held).to_csv(out_dir / "held.csv", index=False)
    so = finish(screened_out)
    so.to_csv(out_dir / "screened_out.csv", index=False)

    # Hunter Email Finder bulk shape: first_name, last_name, company, domain(optional)
    cand = finish(candidates)
    hunter = cand[cand["contact_first"] != ""][["contact_first", "contact_last", "entity_name", "domain",
                                                "form_d_accession_no"]]
    hunter.columns = ["first_name", "last_name", "company", "domain", "form_d_accession_no"]
    hunter.to_csv(out_dir / "hunter_upload.csv", index=False)
    log.append(f"hunter_upload rows (named contact found on filing): {len(hunter):,}")

    # GHL import shape (spec §5.1) — filled further by the enrichment step
    ghl = pd.DataFrame({
        "First Name": cand["contact_first"], "Last Name": cand["contact_last"],
        "Email": cand["hunter_email"], "Company Name": cand["entity_name"], "Phone": "",
        "Tags": "src_cold_email,tier_" + cand["tier"].str.lower(),
        "prospect_source": "cold_email", "prospect_record_type": "production",
        "prospect_route": cand["tier"].map(lambda t: "A_priority" if t == "A" else "B_standard"),
        "prospect_form_d_accession_no": cand["form_d_accession_no"],
        "prospect_form_d_entity": cand["entity_name"],
        "prospect_form_d_filing_date": cand["filing_date"],
        "prospect_form_d_total": cand["total_offering"],
        "prospect_form_d_remaining": cand["remaining"],
        "prospect_form_d_investors": cand["investors"],
        "prospect_form_d_avg_check": cand["avg_check"],
        "prospect_investors_needed": cand["investors_needed"],
        "prospect_segment": cand["segment"], "prospect_ad_status": cand["ad_status"],
        "prospect_ad_status_checked": cand["ad_status_checked"],
        "prospect_funnel_observation": cand["funnel_observation"],
        "prospect_hunter_confidence": cand["hunter_confidence"],
        "prospect_test_arm": cand["test_arm"],
    })
    ghl.to_csv(out_dir / "ghl_import.csv", index=False)

    (out_dir / "run_log.txt").write_text("\n".join(log) + "\n")
    print("\n".join(log))


# --------------------------------------------------------------------------------------
# Split-test arms — after enrichment, stratified by segment, fixed seed (spec §8)
# --------------------------------------------------------------------------------------
def arms(args):
    import random
    df = pd.read_csv(args.enriched, dtype=str, keep_default_na=False)
    if "segment" not in df:
        raise SystemExit("enriched CSV needs a 'segment' column (B2/B1/A/C)")
    rng = random.Random(args.seed)
    df["test_arm"] = ""
    sendable = df[(df["segment"].str.upper() != "C") & (df["email1_approved"].str.lower().isin({"y", "yes", "true", "1"})
                                                          if "email1_approved" in df else True)]
    for seg, grp in sendable.groupby(df["segment"].str.upper()):
        idx = list(grp.index)
        rng.shuffle(idx)
        for i, ix in enumerate(idx):
            df.at[ix, "test_arm"] = "personalized" if i % 2 == 0 else "standard"
    out = Path(args.out) / "enriched_with_arms.csv"
    df.to_csv(out, index=False)
    print(df[df["test_arm"] != ""].groupby(["segment", "test_arm"]).size().to_string())
    print(f"→ {out}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    b = sp.add_parser("build")
    b.add_argument("--raw", required=True)
    b.add_argument("--out", required=True)
    b.add_argument("--weekly")
    b.add_argument("--hold")
    b.add_argument("--brands")
    b.add_argument("--asof", help="YYYY-MM-DD; default today")
    b.set_defaults(fn=build)
    a = sp.add_parser("arms")
    a.add_argument("--enriched", required=True)
    a.add_argument("--out", required=True)
    a.add_argument("--seed", type=int, default=2026)
    a.set_defaults(fn=arms)
    args = p.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
