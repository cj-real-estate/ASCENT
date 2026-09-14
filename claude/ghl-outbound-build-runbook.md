# Ascent Outbound — GHL schema build via API (runbook)

14 September 2026. Companion to `claude/sponsor-outbound-system-build-spec.md` §5. Builds the
Prospect folder, the `prospect_*` custom fields, the tag set and the custom values in the Ascent
Outbound sub-account (location id `UKGbpWRFkARlgnMtlB4C`) with one script, idempotently.
Pipeline and workflows are still built by hand in GHL (§5.3–§5.4 of the spec).

Script: [`scripts/ghl_outbound_build.py`](../scripts/ghl_outbound_build.py)

## State as of 14 Sept (post-run)

* Sub-account created (blank snapshot, no sample data). Gmail SMTP `caleb@growwithascent.com` is
  the active sender; reply tracking on. Agency-level and sub-account-level "restrict own email
  service" flags both off.
* Folder **Prospect** exists — id `6Y10UOlRdzhiJvUvtwyH`.
* **24 / 24 `prospect_*` fields exist**, all parented to that one folder. The 5 created by hand
  (`prospect_form_d_accession_no`, `_entity`, `_filing_date`, `_total`, `_remaining`) were skipped
  by the script; the other 19 it created.
* **7 / 7 custom values exist.** Two are still placeholders — fill them in GHL:
  `audit_booking_link`, `caleb_direct_line`.
* **0 / 25 tags exist — blocked.** The `ascent-build` token is missing `locations/tags.write`.
  See "Outstanding" below.
* Agency default LC domain `mg.growwithascent.com` is still the sender for the Ascent (house) and
  Westwin sub-accounts — move them to their own domains before any cold send.

## Outstanding — tags need one more scope

`POST /locations/{id}/tags` returns `401 The token is not authorized for this scope`. Reads
succeed, so `locations/tags.readonly` is granted and `locations/tags.write` is not.

Fix: GHL → Outbound sub-account → **Settings → Private Integrations → `ascent-build` → edit
scopes** → add **`locations/tags.write`** → save. The token does not need reissuing for a scope
add; if GHL does reissue it, update the `GHL Ascent Outbound` credential in the Claude environment
to match.

Then re-run the build. It is idempotent: the 24 fields and 7 custom values are skipped, and only
the 25 tags are created.

```
python scripts/ghl_outbound_build.py --location UKGbpWRFkARlgnMtlB4C --dry-run
python scripts/ghl_outbound_build.py --location UKGbpWRFkARlgnMtlB4C
python scripts/ghl_outbound_build.py --location UKGbpWRFkARlgnMtlB4C --verify
```

`--verify` is green when it reports 24 fields, 25 tags, 7 custom values and no `MISSING` line.

## One-time setup (Caleb, ~5 minutes)

1. In the Outbound sub-account: **Settings → Private Integrations → Create**. Name `ascent-build`.
   Scopes:
   * `locations/customFields.readonly`, `locations/customFields.write`
   * `locations/tags.readonly`, **`locations/tags.write`**
   * `locations/customValues.readonly`, `locations/customValues.write`
   * `contacts.readonly`, `contacts.write` (for the later CSV import)

   All eight matter. A missing *write* scope is invisible until the first POST of that type —
   reads keep working, so a dry run passes clean and the build fails partway.
2. claude.ai/code → cloud icon above the prompt → the environment (the one with `sec.gov` allowed)
   → **API credentials → Add credential**: Name `GHL Ascent Outbound`, Allowed websites
   `services.leadconnectorhq.com`, header `Authorization` / prefix `Bearer` / value = the token →
   **Connect**. The token is never visible to a session.
3. Start a new session in that environment and say: "Run the GHL outbound build script from
   `claude/ghl-outbound-build-runbook.md` against location UKGbpWRFkARlgnMtlB4C — dry run first."

## Notes on the script

Two corrections were made during the 14 Sept run; both are in
`scripts/ghl_outbound_build.py` now.

**A `User-Agent` is mandatory.** GHL sits behind Cloudflare, which rejects the default
`Python-urllib/3.x` signature with `403 error 1010 (browser_signature_banned)` on every endpoint.
The script sends `User-Agent: ascent-build/1.0`. Do not remove it — without it nothing works, and
the failure looks like an auth problem rather than a transport one.

**Folder detection cannot go by name.** `GET /locations/{id}/customFields` returns
`documentType: "field"` entries only — folders are never in the list — and the v2 route
`/custom-fields/object-key/contact` answers `400 Api does not support objectKey of type contact or
opportunity`. No endpoint lists folders. The original name-scan therefore never matched and would
have created a duplicate `Prospect` folder on every run, splitting the schema across two
identically-named folders. `find_folder` now derives the folder from the `parentId` shared by the
spec fields already inside it.

> Residual edge case: if the folder exists but is **empty**, there is nothing to derive from and
> the script will create a duplicate. Check the folder by eye before a first run against a
> sub-account whose Prospect folder was made by hand but never populated.

## After the script: still by hand

* Pipeline "Ascent New Business": New Inquiry · Contacted · Audit Booked · Audit Held ·
  Proposal Sent · Verbal / Negotiating · Closed Won · Nurture / Not Now · Disqualified.
* Workflows W1–W4 per spec §5.3 (W1 drip mode 20/day week 1 → 30/day; 08:00–16:00 CT; Mon–Thu).
* Fill the two placeholder custom values: `audit_booking_link`, `caleb_direct_line`.
