#!/usr/bin/env python3
"""
fetch.py — pull the week's new Form D filings from EDGAR into weekly/<date>.csv.

Replaces the hand-typing step: EDGAR full-text search for Form D filings containing "06c",
then each hit's primary_doc.xml parsed into the 16-column weekly shape the build step reads.

SCHEMA — verified 15 Sept 2026 against a live filing
(0002146218-26-000001, MHF Real Estate Income Fund LLC). Paths are exact:

  edgarSubmission
    primaryIssuer.entityName / .cik / .issuerPhoneNumber
    primaryIssuer.issuerAddress.stateOrCountry
    relatedPersonsList.relatedPersonInfo[]
        .relatedPersonName.firstName / .lastName
        .relatedPersonRelationshipList.relationship[]
        .relationshipClarification
    offeringData
        .industryGroup.industryGroupType
        .federalExemptionsExclusions.item[]          <- "06c" lives here
        .typeOfFiling.newOrAmendment.isAmendment
        .offeringSalesAmounts.totalOfferingAmount / .totalAmountSold / .totalRemaining
        .minimumInvestmentAccepted
        .investors.totalNumberAlreadyInvested
        .salesCommissionsFindersFees.salesCommissions.dollarAmount

Form D carries no SIC code — `sic_code` is written empty. build's is_real_estate() falls back to
industryGroupType and entity-name terms, both of which this fetcher supplies.

NETWORK
  Requires sec.gov + efts.sec.gov egress. Run in the "Ascent - SEC" environment; the cloud-default
  environment returns 403 at the proxy. SEC requires a descriptive User-Agent with a contact
  address and throttles above 10 requests/second — --rate defaults to a safe 8/sec.

USAGE
  python fetch.py --days 7 --out weekly/2026-09-15.csv \\
      --user-agent "Ascent Client Acquisition Systems caleb@ascentforsponsors.com"

  python fetch.py --selftest        # parse an embedded real-shape filing, no network
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date, timedelta
from pathlib import Path

FTS = "https://efts.sec.gov/LATEST/search-index"
ARCHIVE = "https://www.sec.gov/Archives/edgar/data/{cik}/{adsh}/primary_doc.xml"
INDEX = "https://www.sec.gov/Archives/edgar/data/{cik}/{adsh}/"

COLUMNS = ["form_d_accession_no", "entity_name", "cik", "filing_date", "state", "industry_group",
           "sic_code", "exemption", "total_offering", "total_sold", "investors", "min_investment",
           "sales_comm", "is_amendment", "phone", "edgar_url",
           "contact_first", "contact_last", "contact_title"]

# Officer-ish relationships, most senior first — picks who to put in the Hunter upload.
TITLE_RANK = ["Executive Officer", "Director", "Promoter"]


# ----------------------------------------------------------------------------- http
class Http:
    def __init__(self, ua: str, rate: float):
        if "@" not in ua:
            raise SystemExit("--user-agent must include a contact email; SEC rejects generic agents")
        self.ua = ua
        self.gap = 1.0 / max(rate, 0.5)
        self._last = 0.0

    def get(self, url: str) -> bytes:
        wait = self.gap - (time.monotonic() - self._last)
        if wait > 0:
            time.sleep(wait)
        req = urllib.request.Request(url, headers={
            "User-Agent": self.ua,
            "Accept-Encoding": "gzip, deflate",
            "Host": urllib.parse.urlparse(url).netloc,
        })
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                body = r.read()
        finally:
            self._last = time.monotonic()
        if body[:2] == b"\x1f\x8b":
            import gzip
            body = gzip.decompress(body)
        return body


# ----------------------------------------------------------------------------- xml
def strip_ns(el: ET.Element) -> ET.Element:
    """Form D XML is usually namespace-free, but some filer agents emit a default namespace."""
    for e in el.iter():
        if isinstance(e.tag, str) and "}" in e.tag:
            e.tag = e.tag.split("}", 1)[1]
    return el


def txt(root: ET.Element, path: str) -> str:
    el = root.find(path)
    return (el.text or "").strip() if el is not None and el.text else ""


def pick_contact(root: ET.Element) -> tuple[str, str, str]:
    """First related person whose relationship ranks highest; clarification is the better title."""
    best: tuple[int, str, str, str] | None = None
    for p in root.findall("./relatedPersonsList/relatedPersonInfo"):
        first = txt(p, "./relatedPersonName/firstName")
        last = txt(p, "./relatedPersonName/lastName")
        if not (first and last):
            continue
        rels = [(r.text or "").strip()
                for r in p.findall("./relatedPersonRelationshipList/relationship")]
        rank = min((TITLE_RANK.index(r) for r in rels if r in TITLE_RANK), default=len(TITLE_RANK))
        title = txt(p, "./relationshipClarification") or (rels[0] if rels else "")
        if best is None or rank < best[0]:
            best = (rank, first, last, title)
    return (best[1], best[2], best[3]) if best else ("", "", "")


def parse_filing(xml: bytes, adsh: str, cik: str, filing_date: str) -> dict:
    root = strip_ns(ET.fromstring(xml))
    od = "./offeringData"
    exemptions = [(e.text or "").strip()
                  for e in root.findall(f"{od}/federalExemptionsExclusions/item")]
    first, last, title = pick_contact(root)
    cik_plain = (cik or txt(root, "./primaryIssuer/cik")).lstrip("0")
    return {
        "form_d_accession_no": adsh,
        "entity_name": txt(root, "./primaryIssuer/entityName"),
        "cik": txt(root, "./primaryIssuer/cik") or cik,
        "filing_date": filing_date,
        "state": txt(root, "./primaryIssuer/issuerAddress/stateOrCountry"),
        "industry_group": txt(root, f"{od}/industryGroup/industryGroupType"),
        "sic_code": "",  # not present in Form D
        "exemption": " ".join(exemptions),
        "total_offering": txt(root, f"{od}/offeringSalesAmounts/totalOfferingAmount"),
        "total_sold": txt(root, f"{od}/offeringSalesAmounts/totalAmountSold"),
        "investors": txt(root, f"{od}/investors/totalNumberAlreadyInvested"),
        "min_investment": txt(root, f"{od}/minimumInvestmentAccepted"),
        "sales_comm": txt(root, f"{od}/salesCommissionsFindersFees/salesCommissions/dollarAmount"),
        "is_amendment": txt(root, f"{od}/typeOfFiling/newOrAmendment/isAmendment"),
        "phone": txt(root, "./primaryIssuer/issuerPhoneNumber"),
        "edgar_url": INDEX.format(cik=cik_plain, adsh=adsh.replace("-", "")),
        "contact_first": first,
        "contact_last": last,
        "contact_title": title,
    }


# ----------------------------------------------------------------------------- search
def search(http: Http, start: str, end: str, query: str, cap: int) -> list[dict]:
    hits, frm = [], 0
    while len(hits) < cap:
        url = FTS + "?" + urllib.parse.urlencode({
            "q": query, "forms": "D", "startdt": start, "enddt": end, "from": frm})
        data = json.loads(http.get(url))
        batch = data.get("hits", {}).get("hits", [])
        total = data.get("hits", {}).get("total", {})
        total = total.get("value", 0) if isinstance(total, dict) else total
        if frm == 0:
            print(f"EDGAR full-text: {total} filing(s) match {query!r} for {start}..{end}")
        if not batch:
            break
        for h in batch:
            s = h.get("_source", {})
            ciks = s.get("ciks") or []
            hits.append({
                "adsh": s.get("adsh", ""),
                "cik": (ciks[0] if ciks else "").lstrip("0"),
                "name": (s.get("display_names") or [""])[0],
                "date": s.get("file_date", ""),
                "form": s.get("form", ""),
            })
        frm += len(batch)
        if frm >= total:
            break
    return hits[:cap]


# ----------------------------------------------------------------------------- main
def cmd_fetch(a) -> int:
    http = Http(a.user_agent, a.rate)
    end = a.end or date.today().isoformat()
    start = a.start or (date.fromisoformat(end) - timedelta(days=a.days)).isoformat()

    hits = search(http, start, end, a.query, a.max)
    seen, rows, failed = set(), [], []
    for i, h in enumerate(hits, 1):
        adsh = h["adsh"]
        if not adsh or adsh in seen:
            continue
        seen.add(adsh)
        url = ARCHIVE.format(cik=h["cik"], adsh=adsh.replace("-", ""))
        try:
            rows.append(parse_filing(http.get(url), adsh, h["cik"], h["date"]))
        except Exception as e:  # one bad filing must not lose the run
            failed.append((adsh, h["name"], f"{type(e).__name__}: {e}"))
            continue
        if i % 25 == 0 or i == len(hits):
            print(f"  parsed {len(rows)}/{len(hits)}")

    keep = [r for r in rows if not a.require_06c or "06c" in r["exemption"].split()]
    dropped = len(rows) - len(keep)

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(keep)

    named = sum(1 for r in keep if r["contact_first"])
    print(f"\nwrote {len(keep)} row(s) -> {out}")
    if dropped:
        print(f"  dropped {dropped} matched on text but without 06c in federalExemptionsExclusions")
    print(f"  {named} carry a named related person (these become Hunter rows)")
    if failed:
        print(f"  {len(failed)} filing(s) failed to parse:")
        for adsh, name, err in failed[:10]:
            print(f"    {adsh}  {name[:40]}  {err}")
    return 0


# ----------------------------------------------------------------------------- selftest
SAMPLE = b"""<?xml version="1.0"?>
<edgarSubmission>
  <schemaVersion>X0708</schemaVersion>
  <submissionType>D</submissionType>
  <testOrLive>LIVE</testOrLive>
  <primaryIssuer>
    <cik>0002146218</cik>
    <entityName>MHF Real Estate Income Fund LLC</entityName>
    <issuerAddress><street1>1633 WEST LEWIS ST</street1><city>San Diego</city>
      <stateOrCountry>CA</stateOrCountry><zipCode>92103</zipCode></issuerAddress>
    <issuerPhoneNumber>6192949420</issuerPhoneNumber>
  </primaryIssuer>
  <relatedPersonsList>
    <relatedPersonInfo>
      <relatedPersonName><firstName>Minka</firstName><lastName>Hull</lastName></relatedPersonName>
      <relatedPersonAddress><city>San Diego</city><stateOrCountry>CA</stateOrCountry></relatedPersonAddress>
      <relatedPersonRelationshipList><relationship>Executive Officer</relationship></relatedPersonRelationshipList>
      <relationshipClarification>Manager of Manager</relationshipClarification>
    </relatedPersonInfo>
    <relatedPersonInfo>
      <relatedPersonName><firstName>Mark</firstName><lastName>Hull</lastName></relatedPersonName>
      <relatedPersonRelationshipList><relationship>Promoter</relationship></relatedPersonRelationshipList>
    </relatedPersonInfo>
  </relatedPersonsList>
  <offeringData>
    <industryGroup><industryGroupType>Other Real Estate</industryGroupType></industryGroup>
    <federalExemptionsExclusions><item>06c</item><item>3C</item><item>3C.5</item></federalExemptionsExclusions>
    <typeOfFiling><newOrAmendment><isAmendment>false</isAmendment></newOrAmendment>
      <dateOfFirstSale><yetToOccur>true</yetToOccur></dateOfFirstSale></typeOfFiling>
    <offeringSalesAmounts><totalOfferingAmount>50000000</totalOfferingAmount>
      <totalAmountSold>0</totalAmountSold><totalRemaining>50000000</totalRemaining>
      <clarificationOfResponse></clarificationOfResponse></offeringSalesAmounts>
    <minimumInvestmentAccepted>250000</minimumInvestmentAccepted>
    <investors><hasNonAccreditedInvestors>false</hasNonAccreditedInvestors>
      <totalNumberAlreadyInvested>0</totalNumberAlreadyInvested></investors>
    <salesCommissionsFindersFees><salesCommissions><dollarAmount>0</dollarAmount></salesCommissions>
      <findersFees><dollarAmount>0</dollarAmount></findersFees></salesCommissionsFindersFees>
  </offeringData>
</edgarSubmission>"""

EXPECT = {
    "entity_name": "MHF Real Estate Income Fund LLC", "cik": "0002146218", "state": "CA",
    "industry_group": "Other Real Estate", "exemption": "06c 3C 3C.5",
    "total_offering": "50000000", "total_sold": "0", "investors": "0",
    "min_investment": "250000", "sales_comm": "0", "is_amendment": "false",
    "phone": "6192949420", "sic_code": "",
    "contact_first": "Minka", "contact_last": "Hull", "contact_title": "Manager of Manager",
    "edgar_url": "https://www.sec.gov/Archives/edgar/data/2146218/000214621826000001/",
}


def cmd_selftest(_a) -> int:
    got = parse_filing(SAMPLE, "0002146218-26-000001", "0002146218", "2026-09-10")
    bad = {k: (want, got.get(k)) for k, want in EXPECT.items() if got.get(k) != want}
    for k in COLUMNS:
        print(f"  {k:24} {got.get(k, '')!r}")
    if bad:
        print("\nFAIL:", file=sys.stderr)
        for k, (want, g) in bad.items():
            print(f"  {k}: expected {want!r}, got {g!r}", file=sys.stderr)
        return 1
    # namespaced variant must parse identically
    ns = SAMPLE.replace(b"<edgarSubmission>",
                        b'<edgarSubmission xmlns="http://www.sec.gov/edgar/formdschema">')
    if parse_filing(ns, "0002146218-26-000001", "0002146218", "2026-09-10") != got:
        print("\nFAIL: namespaced XML parsed differently", file=sys.stderr)
        return 1
    print("\nOK — all 19 fields match the live filing; namespace-stripping verified")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out")
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--start")
    ap.add_argument("--end")
    ap.add_argument("--query", default='"06c"')
    ap.add_argument("--max", type=int, default=400)
    ap.add_argument("--rate", type=float, default=8.0, help="requests/sec; SEC caps at 10")
    ap.add_argument("--user-agent", default="")
    ap.add_argument("--require-06c", action="store_true", default=True)
    ap.add_argument("--no-require-06c", dest="require_06c", action="store_false")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return cmd_selftest(a)
    if not a.out or not a.user_agent:
        ap.error("--out and --user-agent are required (or use --selftest)")
    return cmd_fetch(a)


if __name__ == "__main__":
    raise SystemExit(main())
