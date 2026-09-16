#!/usr/bin/env python3
"""
enrich.py — the web-research stage of the Form D pipeline.

Sits between `formd_pipeline.py build` and `formd_pipeline.py arms`, and fills the columns the
deterministic script leaves blank: domain, website, funnel_observation, ad_status, segment.

WHY THIS IS TWO COMMANDS AND NOT ONE
The container that runs this has no open-web egress — every host outside the package mirrors
returns 403 at the proxy. The agent driving it does have web access. So the work splits:

    worklist  →  [agent resolves domains, reads investor pages, writes findings]  →  merge

`worklist` emits exactly what the agent needs and nothing else. `merge` validates the agent's
findings and writes enriched.csv. Neither command touches the network, so both are testable
offline and deterministic.

USAGE
  python enrich.py worklist --candidates out/candidates.csv --out out/worklist.json
  #   ... agent fills out/findings.json ...
  python enrich.py merge --candidates out/candidates.csv --findings out/findings.json \
      --out out/enriched.csv

  python enrich.py merge ... --require-observation   # drop rows with no funnel_observation

FINDINGS SCHEMA  (list of objects, or {"findings": [...]})
  form_d_accession_no  required, must match a candidate row
  domain               apex domain only, no scheme, no path, no www.
  website              full URL actually fetched
  funnel_observation   one sentence, <= 240 chars, specific to THAT sponsor
  ad_status            confirmed_live | confirmed_none | unverified
  ad_status_checked    YYYY-MM-DD, required when ad_status != unverified
  segment              A | B1 | B2 | C   (omit to let this script derive it)
  ir_contact_type      ir_owner | founder | coo
  notes                free text, not written to the CSV

SEGMENT DERIVATION (spec §3.3), applied when `segment` is absent:
  ad_status confirmed_live                      -> B1
  ad_status confirmed_none                      -> B2
  funnel_observation present, ads unverified    -> A
  no domain or no observation                   -> C
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from datetime import date
from pathlib import Path

AD_STATUSES = {"confirmed_live", "confirmed_none", "unverified"}
SEGMENTS = {"A", "B1", "B2", "C"}
IR_TYPES = {"ir_owner", "founder", "coo", ""}
OBSERVATION_MAX = 240

# columns enrich.py is allowed to write; everything else is passed through untouched
OWNED = ["domain", "website", "funnel_observation", "ad_status", "ad_status_checked",
         "segment", "contact_type"]

DOMAIN_RE = re.compile(r"^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


# ----------------------------------------------------------------------------- helpers
def read_csv(path: Path) -> tuple[list[str], list[dict]]:
    with path.open(newline="", encoding="utf-8") as fh:
        r = csv.DictReader(fh)
        return list(r.fieldnames or []), list(r)


def clean_domain(raw: str) -> str:
    """Normalise whatever the agent hands back to an apex domain."""
    d = (raw or "").strip().lower()
    d = re.sub(r"^https?://", "", d)
    d = d.split("/")[0].split("?")[0].split("#")[0]
    d = d.removeprefix("www.")
    return d.rstrip(".")


def derive_segment(f: dict) -> str:
    ad = f.get("ad_status", "")
    if ad == "confirmed_live":
        return "B1"
    if ad == "confirmed_none":
        return "B2"
    if f.get("funnel_observation") and f.get("domain"):
        return "A"
    return "C"


# ----------------------------------------------------------------------------- worklist
def cmd_worklist(a) -> int:
    cols, rows = read_csv(Path(a.candidates))
    items = []
    for row in rows:
        if row.get("domain") and row.get("funnel_observation") and not a.all:
            continue  # already enriched
        items.append({
            "form_d_accession_no": row.get("form_d_accession_no", ""),
            "entity_name": row.get("entity_name", ""),
            "state": row.get("state", ""),
            "tier": row.get("tier", ""),
            "contact_first": row.get("contact_first", ""),
            "contact_last": row.get("contact_last", ""),
            "contact_title": row.get("contact_title", ""),
            "domain": row.get("domain", ""),
            "remaining": row.get("remaining", ""),
            "avg_check": row.get("avg_check", ""),
            "investors": row.get("investors", ""),
        })
    payload = {
        "generated": date.today().isoformat(),
        "count": len(items),
        "instructions": (
            "For each item: resolve the sponsor's apex domain (the one hosting the INVESTOR "
            "funnel, which is sometimes a second domain from the corporate site). Fetch the "
            "investor/offerings page. Write ONE specific sentence naming the concrete weakness in "
            "that sponsor's investor path — an accreditation gate missing on a 506(c) offering, a "
            "counter rendering zero, a dead /invest/ link, a form with no phone or calendar, a "
            "portal installed behind a page with no lead capture. Generic observations are worse "
            "than none: leave funnel_observation empty and the row becomes segment C. Never assert "
            "an ad_status you did not verify in the Meta Ad Library by exact-phrase brand search."
        ),
        "items": items,
    }
    Path(a.out).write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"worklist: {len(items)} of {len(rows)} candidates need enrichment -> {a.out}")
    return 0


# ----------------------------------------------------------------------------- merge
def cmd_merge(a) -> int:
    cols, rows = read_csv(Path(a.candidates))
    raw = json.loads(Path(a.findings).read_text(encoding="utf-8"))
    findings = raw.get("findings", raw) if isinstance(raw, dict) else raw
    if not isinstance(findings, list):
        print("findings must be a JSON list, or an object with a 'findings' list", file=sys.stderr)
        return 2

    by_acc = {r.get("form_d_accession_no", ""): r for r in rows}
    errors: list[str] = []
    warnings: list[str] = []
    applied = 0

    for i, f in enumerate(findings):
        acc = str(f.get("form_d_accession_no", "")).strip()
        where = f"findings[{i}]" + (f" ({acc})" if acc else "")
        if not acc:
            errors.append(f"{where}: missing form_d_accession_no")
            continue
        if acc not in by_acc:
            errors.append(f"{where}: no candidate row with that accession number")
            continue

        dom = clean_domain(f.get("domain", ""))
        if dom and not DOMAIN_RE.match(dom):
            errors.append(f"{where}: '{f.get('domain')}' is not a valid domain")
            continue

        obs = " ".join(str(f.get("funnel_observation", "")).split())
        if len(obs) > OBSERVATION_MAX:
            errors.append(f"{where}: funnel_observation is {len(obs)} chars, max {OBSERVATION_MAX}")
            continue

        ad = str(f.get("ad_status", "") or "").strip()
        if ad and ad not in AD_STATUSES:
            errors.append(f"{where}: ad_status '{ad}' not in {sorted(AD_STATUSES)}")
            continue
        checked = str(f.get("ad_status_checked", "") or "").strip()
        if ad and ad != "unverified":
            if not checked:
                errors.append(f"{where}: ad_status '{ad}' asserted with no ad_status_checked date")
                continue
            if not DATE_RE.match(checked):
                errors.append(f"{where}: ad_status_checked '{checked}' is not YYYY-MM-DD")
                continue

        seg = str(f.get("segment", "") or "").strip() or derive_segment(
            {"ad_status": ad, "funnel_observation": obs, "domain": dom})
        if seg not in SEGMENTS:
            errors.append(f"{where}: segment '{seg}' not in {sorted(SEGMENTS)}")
            continue

        ir = str(f.get("ir_contact_type", "") or "").strip()
        if ir not in IR_TYPES:
            errors.append(f"{where}: ir_contact_type '{ir}' not in {sorted(IR_TYPES - {''})}")
            continue

        if dom and not obs:
            warnings.append(f"{where}: domain resolved but no funnel_observation -> segment {seg}")
        if not dom:
            warnings.append(f"{where}: no domain resolved -> segment {seg}, phone-first route")

        row = by_acc[acc]
        row["domain"] = dom
        row["website"] = str(f.get("website", "") or "").strip()
        row["funnel_observation"] = obs
        row["ad_status"] = ad
        row["ad_status_checked"] = checked
        row["segment"] = seg
        if ir:
            row["contact_type"] = ir
        applied += 1

    if errors:
        print(f"MERGE REFUSED — {len(errors)} error(s), nothing written:", file=sys.stderr)
        for e in errors:
            print("  " + e, file=sys.stderr)
        return 1

    out_rows = rows
    dropped = 0
    if a.require_observation:
        keep = [r for r in rows if r.get("funnel_observation")]
        dropped = len(rows) - len(keep)
        out_rows = keep

    for c in OWNED:
        if c not in cols:
            cols.append(c)

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(out_rows)

    for wmsg in warnings:
        print("  warn: " + wmsg)
    seg_counts: dict[str, int] = {}
    for r in out_rows:
        seg_counts[r.get("segment", "") or "(none)"] = seg_counts.get(r.get("segment", "") or "(none)", 0) + 1
    print(f"merge: {applied} finding(s) applied to {len(rows)} candidate(s)")
    if dropped:
        print(f"  dropped {dropped} row(s) with no funnel_observation (--require-observation)")
    print("  segments: " + ", ".join(f"{k}={v}" for k, v in sorted(seg_counts.items())))
    print(f"  -> {out}")
    return 0


# ----------------------------------------------------------------------------- hunter
def cmd_hunter(a) -> int:
    """Regenerate the Hunter bulk upload AFTER enrichment, when domains actually exist.

    `formd_pipeline.py build` also writes hunter_upload.csv, but it runs before any domain is
    resolved, so that copy always has an empty domain column and Hunter cannot use it. This is
    the file to upload.
    """
    _, rows = read_csv(Path(a.enriched))
    out_rows, no_domain, no_name, no_route = [], 0, 0, 0
    for r in rows:
        dom, first, last = r.get("domain", ""), r.get("contact_first", ""), r.get("contact_last", "")
        if not dom:
            no_domain += 1
            continue
        if not (first and last):
            no_name += 1
            if a.domain_search_only or a.include_nameless:
                out_rows.append({"first_name": "", "last_name": "",
                                 "company": r.get("entity_name", ""), "domain": dom,
                                 "form_d_accession_no": r.get("form_d_accession_no", ""),
                                 "route": "domain_search"})
            continue
        if a.domain_search_only:
            no_route += 1
            continue
        out_rows.append({"first_name": first, "last_name": last,
                         "company": r.get("entity_name", ""), "domain": dom,
                         "form_d_accession_no": r.get("form_d_accession_no", ""),
                         "route": "email_finder"})

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    cols = ["first_name", "last_name", "company", "domain", "form_d_accession_no", "route"]
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(out_rows)

    finder = sum(1 for r in out_rows if r["route"] == "email_finder")
    dsearch = len(out_rows) - finder
    print(f"hunter: {len(out_rows)} row(s) -> {out}")
    print(f"  email_finder (name + domain): {finder}   domain_search (domain only): {dsearch}")
    # Report only what was actually left out. Nameless rows are emitted as domain_search under
    # either flag, and --domain-search-only drops the named ones — both were previously misreported.
    skipped = [f"{no_domain} with no domain (phone-first route)"] if no_domain else []
    if no_name and not (a.include_nameless or a.domain_search_only):
        skipped.append(f"{no_name} with no named contact")
    if no_route:
        skipped.append(f"{no_route} named (--domain-search-only)")
    print("  skipped: " + (", ".join(skipped) if skipped else "none"))
    print(f"  credits needed: ~{len(out_rows)}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)

    w = sp.add_parser("worklist", help="emit the rows needing web research")
    w.add_argument("--candidates", required=True)
    w.add_argument("--out", required=True)
    w.add_argument("--all", action="store_true", help="include already-enriched rows")
    w.set_defaults(fn=cmd_worklist)

    m = sp.add_parser("merge", help="validate agent findings and write enriched.csv")
    m.add_argument("--candidates", required=True)
    m.add_argument("--findings", required=True)
    m.add_argument("--out", required=True)
    m.add_argument("--require-observation", action="store_true")
    m.set_defaults(fn=cmd_merge)

    h = sp.add_parser("hunter", help="rebuild the Hunter upload from enriched.csv (domains present)")
    h.add_argument("--enriched", required=True)
    h.add_argument("--out", required=True)
    h.add_argument("--include-nameless", action="store_true",
                   help="also emit domain-only rows for Hunter Domain Search")
    h.add_argument("--domain-search-only", action="store_true",
                   help="emit ONLY the domain-only rows")
    h.set_defaults(fn=cmd_hunter)

    a = ap.parse_args()
    return a.fn(a)


if __name__ == "__main__":
    raise SystemExit(main())
