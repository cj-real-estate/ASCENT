#!/usr/bin/env python3
"""
create_onb_fields.py — creates the 11 remaining onb_* calendar / DNS custom fields in the
Ascent house GHL sub-account (location id pX8dNxneJPkYjJ8FVZJn).

Companion to scripts/ghl_outbound_build.py, which builds the prospect_* schema in the
Outbound sub-account. Same auth model, same Cloudflare caveat (see claude/ghl-outbound-build-runbook.md).

Run this inside the Claude Code environment that has the "GHL Ascent Outbound" credential
attached (services.leadconnectorhq.com). The proxy injects auth, so no token is needed.
If you'd rather pass one explicitly, set GHL_TOKEN.

It is safe to re-run: existing field names are skipped, not duplicated.

    python3 scripts/create_onb_fields.py            # create
    python3 scripts/create_onb_fields.py --dry-run  # show what it would do
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request

LOCATION_ID = "pX8dNxneJPkYjJ8FVZJn"
BASE = f"https://services.leadconnectorhq.com/locations/{LOCATION_ID}/customFields"
DRY_RUN = "--dry-run" in sys.argv

# Fields to create. dataType is resolved from fields that already exist in the
# account rather than hardcoded, so we inherit whatever spelling this API
# version actually uses.
#
#   text     -> copy the dataType of onb_ein            (Single line)
#   dropdown -> copy the dataType of onb_business_type  (Dropdown, single)
#   checkbox -> copy the dataType of onb_meta_access_done (Checkbox)
FIELDS = [
    ("onb_calendar_backup_owner_email", "text", None),
    ("onb_meeting_hours",               "text", None),
    ("onb_video_host_email",            "text", None),
    ("onb_dns_admin_name",              "text", None),
    ("onb_dns_admin_email",             "text", None),
    ("onb_calendar_system",   "dropdown",
        ["Google Workspace", "Microsoft 365", "Calendly", "HubSpot Meetings", "Acuity", "Other"]),
    ("onb_meeting_length_min", "dropdown", ["30", "45", "60"]),
    ("onb_meeting_timezone",   "dropdown",
        ["Eastern", "Central", "Mountain", "Pacific", "Other"]),
    ("onb_video_platform",     "dropdown",
        ["Zoom", "Google Meet", "Microsoft Teams", "Phone", "Other"]),
    ("onb_dns_provider",       "dropdown",
        ["GoDaddy", "Cloudflare", "Namecheap", "Route 53", "Other"]),
    ("onb_calendar_access_done", "checkbox", ["yes"]),
]

# Existing fields we copy dataType, option shape and folder placement from.
TEMPLATE_FOR = {
    "text":     "onb_ein",
    "dropdown": "onb_business_type",
    "checkbox": "onb_meta_access_done",
}


def headers():
    h = {
        "Version": "2021-07-28",
        "Accept": "application/json",
        "Content-Type": "application/json",
        # Cloudflare fronting GHL rejects the default Python-urllib UA with
        # error 1010 (browser_signature_banned) on every endpoint. Without this
        # the failure looks like an auth problem rather than a transport one.
        # See claude/ghl-outbound-build-runbook.md.
        "User-Agent": "ascent-build/1.0",
    }
    token = os.environ.get("GHL_TOKEN")
    if token:
        h["Authorization"] = f"Bearer {token}"
    return h


def call(method, url, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers(), method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()[:600]}


def shape_options(template, options):
    """Format options the way the template field already stores them.

    Some API versions want plain strings, others [{"key":..,"label":..}]. Rather
    than guess, mirror whatever shape the existing dropdown on this account uses.
    """
    sample = (template.get("picklistOptions") or template.get("options") or [None])[0]
    if isinstance(sample, dict):
        key = "key" if "key" in sample else "value"
        label = "label" if "label" in sample else "name"
        return [{key: o, label: o} for o in options]
    return options


def main():
    status, payload = call("GET", BASE)
    if status != 200:
        print(f"Could not list custom fields (HTTP {status}).")
        print(payload.get("error", payload))
        print("\nIf this is a 401/403, the GHL credential isn't attached to this")
        print("environment. If it's a CONNECT failure, the host isn't allowlisted.")
        sys.exit(1)

    existing = payload.get("customFields") or payload.get("customField") or []
    by_name = {f.get("name"): f for f in existing}
    print(f"{len(existing)} existing custom fields.\n")

    # Resolve dataType + folder from the template fields.
    resolved, templates, folder_id = {}, {}, None
    for kind, template_name in TEMPLATE_FOR.items():
        t = by_name.get(template_name)
        if not t:
            print(f"Template field '{template_name}' not found — cannot infer the "
                  f"'{kind}' dataType. Aborting rather than guessing.")
            sys.exit(1)
        resolved[kind] = t.get("dataType")
        templates[kind] = t
        folder_id = folder_id or t.get("parentId")
        print(f"  {kind:9s} -> dataType {resolved[kind]!r}  (from {template_name})")
    print(f"  folder (parentId): {folder_id!r}\n")

    created, skipped, failed = 0, 0, 0
    for name, kind, options in FIELDS:
        if name in by_name:
            print(f"SKIP    {name} — already exists")
            skipped += 1
            continue

        body = {
            "name": name,
            "dataType": resolved[kind],
            "model": "contact",
        }
        if folder_id:
            body["parentId"] = folder_id
        if options:
            body["options"] = shape_options(templates[kind], options)

        if DRY_RUN:
            print(f"WOULD   {name}  {json.dumps(body)}")
            continue

        status, resp = call("POST", BASE, body)
        if status in (200, 201):
            print(f"CREATED {name}")
            created += 1
        else:
            print(f"FAILED  {name} — HTTP {status}: {resp.get('error', resp)}")
            failed += 1
        time.sleep(0.4)

    if not DRY_RUN:
        print(f"\n{created} created, {skipped} skipped, {failed} failed.")


if __name__ == "__main__":
    main()
