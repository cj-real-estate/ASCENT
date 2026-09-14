#!/usr/bin/env python3
"""
ghl_outbound_build.py — builds the Ascent Outbound sub-account schema in GoHighLevel via API v2.

Creates (idempotently — anything that already exists is skipped, never duplicated):
  • the "Prospect" custom-field folder on Contact
  • the 24 prospect_* custom fields from claude/sponsor-outbound-system-build-spec.md §5.1
  • the tag set from §5.2
  • the custom values from the house build (§5 / ascent-house-ghl-inbound-lead-build §3.3)

Auth: NO token in this file or in the environment. Run it from a Claude cloud session whose
environment carries an API credential for host services.leadconnectorhq.com (Authorization: Bearer).
The agent proxy injects the header. Locally you can instead export GHL_TOKEN=... and it will be used.

Usage:
  python scripts/ghl_outbound_build.py --location UKGbpWRFkARlgnMtlB4C --dry-run     # show the plan
  python scripts/ghl_outbound_build.py --location UKGbpWRFkARlgnMtlB4C               # build
  python scripts/ghl_outbound_build.py --location UKGbpWRFkARlgnMtlB4C --verify      # list what exists

Private Integration scopes needed: locations/customFields.readonly, locations/customFields.write,
locations/tags.readonly, locations/tags.write, locations/customValues.readonly,
locations/customValues.write (contacts.readonly + contacts.write for the later CSV import).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE = "https://services.leadconnectorhq.com"
VERSION = "2021-07-28"

# ----------------------------------------------------------------------------- spec §5.1
FOLDER_NAME = "Prospect"

FIELDS = [
    # (name, dataType, options)
    ("prospect_form_d_accession_no", "TEXT", None),
    ("prospect_form_d_entity", "TEXT", None),
    ("prospect_form_d_filing_date", "DATE", None),
    ("prospect_form_d_total", "MONETORY", None),
    ("prospect_form_d_remaining", "MONETORY", None),
    ("prospect_form_d_investors", "NUMERICAL", None),
    ("prospect_form_d_avg_check", "MONETORY", None),
    ("prospect_investors_needed", "NUMERICAL", None),
    ("prospect_segment", "SINGLE_OPTIONS", ["B2", "B1", "A", "C"]),
    ("prospect_ad_status", "SINGLE_OPTIONS", ["confirmed_live", "confirmed_none", "unverified"]),
    ("prospect_ad_status_checked", "DATE", None),
    ("prospect_funnel_observation", "LARGE_TEXT", None),
    ("prospect_ir_contact_type", "SINGLE_OPTIONS", ["ir_owner", "founder", "coo"]),
    ("prospect_hunter_confidence", "NUMERICAL", None),
    ("prospect_test_arm", "SINGLE_OPTIONS", ["personalized", "standard"]),
    ("prospect_hold_reason", "SINGLE_OPTIONS",
     ["bd_affiliate", "distress", "cease_desist", "not_re", "placement_agent", "institutional", "other"]),
    ("prospect_reply_class", "SINGLE_OPTIONS",
     ["booked", "question", "not_now", "referral", "opt_out", "bounce", "ooo"]),
    ("prospect_email_version", "TEXT", None),
    # reused house fields, created here too because this is a separate sub-account
    ("prospect_source", "SINGLE_OPTIONS",
     ["website_audit", "website_contact", "cold_email", "referral", "paid_social", "linkedin", "unknown"]),
    ("prospect_record_type", "SINGLE_OPTIONS", ["production", "canary", "test"]),
    ("prospect_route", "SINGLE_OPTIONS",
     ["A_priority", "B_standard", "C_under_floor", "D_disqualified", "E_other_line"]),
    ("prospect_first_touch_ts", "DATE", None),
    ("prospect_first_human_touch_ts", "DATE", None),
    ("prospect_dq_reason", "SINGLE_OPTIONS",
     ["506b", "under_floor", "no_counsel_persistent", "capital_call", "not_raising", "competitor",
      "unreachable", "other"]),
]

# ----------------------------------------------------------------------------- spec §5.2
TAGS = [
    "seq_cold_enroll", "seq_cold_active", "seq_complete_no_reply", "seq_replied", "seq_bounced",
    "seq_paused_ooo", "arm_personalized", "arm_standard", "formd_hold", "enriched",
    "segment_b1", "segment_b2", "segment_a", "segment_c", "tier_a", "tier_b", "tier_c",
    "src_cold_email", "src_referral", "nurture_active", "do_not_contact", "booked_audit",
    "held_audit", "noshow_audit", "canary",
]

# ----------------------------------------------------------------------------- custom values
CUSTOM_VALUES = {
    "audit_booking_link": "REPLACE_WITH_20_MIN_DISCOVERY_CALENDAR_URL",
    "caleb_direct_line": "REPLACE_WITH_DIRECT_LINE",
    "ascent_reply_email": "caleb@growwithascent.com",
    "ascent_site": "ascentforsponsors.com",
    "ascent_signature": "Caleb Free · Founder, Ascent · Oklahoma City, OK",
    "ascent_postal_address": "1424 Highland Park Blvd, Oklahoma City, OK 73114",
    "opt_out_line": "If this isn't relevant, reply \"no thanks\" and I'll close the file.",
}


# ----------------------------------------------------------------------------- http
def call(method: str, path: str, body: dict | None = None, params: dict | None = None):
    url = BASE + path
    if params:
        from urllib.parse import urlencode
        url += "?" + urlencode(params)
    data = json.dumps(body).encode() if body is not None else None
    headers = {
        "Version": VERSION,
        "Accept": "application/json",
        "Content-Type": "application/json",
        # Cloudflare fronting GHL rejects the default Python-urllib UA with
        # error 1010 (browser_signature_banned). Identify the client honestly.
        "User-Agent": "ascent-build/1.0",
    }
    tok = os.environ.get("GHL_TOKEN")
    if tok:  # local run only; in a cloud session the proxy injects Authorization
        headers["Authorization"] = f"Bearer {tok}"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                txt = r.read().decode()
                return json.loads(txt) if txt else {}
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")
            if e.code == 429 and attempt < 3:
                time.sleep(2 * (attempt + 1))
                continue
            raise SystemExit(f"{method} {path} → HTTP {e.code}: {msg[:400]}")
    return {}


# ----------------------------------------------------------------------------- fields
def list_fields(loc: str) -> list[dict]:
    r = call("GET", f"/locations/{loc}/customFields", params={"model": "contact"})
    return r.get("customFields", [])


def find_folder(loc: str) -> str | None:
    # v2 objects API lists folders with the fields
    try:
        r = call("GET", "/custom-fields/object-key/contact", params={"locationId": loc})
        for f in r.get("folders", []):
            if f.get("name") == FOLDER_NAME:
                return f.get("id")
    except SystemExit as e:
        print(f"  (v2 folder lookup unavailable: {e}; falling back)")
    # The v1 list returns documentType == "field" entries ONLY — folders never
    # appear in it, so scanning it by name can never match and would silently
    # create a duplicate "Prospect" folder on every run. Derive the folder from
    # the parentId shared by the spec fields that already live inside it.
    spec_names = {n for n, _, _ in FIELDS}
    counts: dict[str, int] = {}
    for f in list_fields(loc):
        pid = f.get("parentId")
        if pid and f.get("name") in spec_names:
            counts[pid] = counts.get(pid, 0) + 1
    if counts:
        fid = max(counts, key=lambda k: counts[k])
        print(f"  (folder derived from parentId of {counts[fid]} existing field(s))")
        return fid
    # Genuinely nothing to derive from: either a fresh location, or an empty
    # folder we cannot see. Creating is right in the first case; in the second
    # it duplicates, so check GHL by eye before a real run on a used location.
    return None


def ensure_folder(loc: str, dry: bool) -> str | None:
    fid = find_folder(loc)
    if fid:
        print(f"folder {FOLDER_NAME}: exists ({fid})")
        return fid
    print(f"folder {FOLDER_NAME}: CREATE")
    if dry:
        return None
    r = call("POST", "/custom-fields/folder", {"locationId": loc, "name": FOLDER_NAME, "objectKey": "contact"})
    fid = (r.get("folder") or r).get("id")
    print(f"  created {fid}")
    return fid


def ensure_fields(loc: str, folder_id: str | None, dry: bool):
    existing = {f.get("fieldKey", "").split(".")[-1]: f for f in list_fields(loc)}
    existing.update({f.get("name"): f for f in list_fields(loc)})
    for name, dtype, options in FIELDS:
        if name in existing:
            print(f"field {name}: exists")
            continue
        print(f"field {name}: CREATE {dtype}" + (f" {options}" if options else ""))
        if dry:
            continue
        body = {"name": name, "dataType": dtype, "model": "contact"}
        if folder_id:
            body["parentId"] = folder_id
        if options:
            body["options"] = options
        call("POST", f"/locations/{loc}/customFields", body)
        time.sleep(0.4)


# ----------------------------------------------------------------------------- tags
def ensure_tags(loc: str, dry: bool):
    r = call("GET", f"/locations/{loc}/tags")
    have = {t.get("name", "").lower() for t in r.get("tags", [])}
    for t in TAGS:
        if t.lower() in have:
            print(f"tag {t}: exists")
            continue
        print(f"tag {t}: CREATE")
        if not dry:
            call("POST", f"/locations/{loc}/tags", {"name": t})
            time.sleep(0.3)


# ----------------------------------------------------------------------------- custom values
def ensure_custom_values(loc: str, dry: bool):
    r = call("GET", f"/locations/{loc}/customValues")
    have = {v.get("name"): v for v in r.get("customValues", [])}
    for k, v in CUSTOM_VALUES.items():
        if k in have:
            print(f"custom value {k}: exists (value unchanged)")
            continue
        print(f"custom value {k}: CREATE = {v}")
        if not dry:
            call("POST", f"/locations/{loc}/customValues", {"name": k, "value": v})
            time.sleep(0.3)


# ----------------------------------------------------------------------------- verify
def verify(loc: str):
    fields = list_fields(loc)
    names = sorted(f.get("name") for f in fields if str(f.get("name", "")).startswith("prospect_"))
    print(f"prospect_* fields ({len(names)}):")
    for n in names:
        print("  ", n)
    tags = call("GET", f"/locations/{loc}/tags").get("tags", [])
    print(f"tags ({len(tags)}):", ", ".join(sorted(t['name'] for t in tags)))
    cvs = call("GET", f"/locations/{loc}/customValues").get("customValues", [])
    print(f"custom values ({len(cvs)}):", ", ".join(sorted(v['name'] for v in cvs)))
    missing = [n for n, _, _ in FIELDS if n not in names]
    if missing:
        print("MISSING fields:", missing)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--location", required=True, help="sub-account (location) id")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--verify", action="store_true")
    a = ap.parse_args()
    if a.verify:
        verify(a.location)
        return
    fid = ensure_folder(a.location, a.dry_run)
    ensure_fields(a.location, fid, a.dry_run)
    ensure_tags(a.location, a.dry_run)
    ensure_custom_values(a.location, a.dry_run)
    if not a.dry_run:
        print("\n--- verify ---")
        verify(a.location)


if __name__ == "__main__":
    main()
