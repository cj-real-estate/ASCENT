# Ascent house — the 11 remaining `onb_*` fields (runbook)

15 September 2026. Companion to [`claude/ghl-outbound-build-runbook.md`](ghl-outbound-build-runbook.md),
which does the same job for the `prospect_*` schema in the Outbound sub-account.

Creates the 11 calendar / video / DNS onboarding fields in the **house** sub-account
(location id `pX8dNxneJPkYjJ8FVZJn`), idempotently.

Script: [`scripts/create_onb_fields.py`](../scripts/create_onb_fields.py)

## State as of 15 Sept (post-run)

**Complete. 11 / 11 created, verified, 0 failed.** The house sub-account went from 36 to 47
custom fields (41 of them `onb_*`), all parented to the one onboarding folder
`7jVS4aq3g3zxeXq7Y2Pq`, no duplicates. A re-run immediately after reported
`0 created, 11 skipped, 0 failed`.

Resolved at runtime from the three template fields, as designed:

| kind | template | dataType |
| --- | --- | --- |
| text | `onb_ein` | `TEXT` |
| dropdown | `onb_business_type` | `SINGLE_OPTIONS` |
| checkbox | `onb_meta_access_done` | `CHECKBOX` |

Worth noting that `checkbox` resolved to a **distinct** `CHECKBOX` type — not the
`SINGLE_OPTIONS` the dropdowns use, and not what the Outbound sub-account would have suggested.
Hardcoding it would have produced the wrong field type.

Options came back exactly as sent (plain strings under `picklistOptions`), so the
`[{"key":..,"label":..}]` shape never came into play on this API version.

### The credential (resolved)

The first attempt failed because the attached `GHL Ascent Outbound` credential is a Private
Integration token scoped to the *Outbound* sub-account; GHL scopes those per sub-account, and the
house location answered:

```
HTTP 403 {"statusCode":403,"message":"The token does not have access to this location."}
```

while the same token read Outbound fine in the same session. A house-scoped token was added and
the build ran clean. Keep this in mind for any future house-account script: **a token from one
sub-account can never be widened to another** — it needs its own Private Integration.

## Re-running

Safe and idempotent; a dry run against this location now plans zero creates.

```
python3 scripts/create_onb_fields.py --dry-run
python3 scripts/create_onb_fields.py
```

## What it creates

The script creates five text fields (`onb_calendar_backup_owner_email`, `onb_meeting_hours`, `onb_video_host_email`,
`onb_dns_admin_name`, `onb_dns_admin_email`), five dropdowns (`onb_calendar_system`,
`onb_meeting_length_min`, `onb_meeting_timezone`, `onb_video_platform`, `onb_dns_provider`) and
one checkbox (`onb_calendar_access_done`).

`dataType`, option shape and folder placement are **not hardcoded**. They are copied at runtime
from three fields that already exist in the account — `onb_ein`, `onb_business_type` and
`onb_meta_access_done` — so the new fields inherit whatever spelling that API version uses and
land in the same folder as the rest of the `onb_*` set. If any of the three is missing the script
aborts rather than guessing.

## Inherited gotcha

**A `User-Agent` is mandatory.** GHL sits behind Cloudflare, which rejects the default
`Python-urllib/3.x` signature with `403 error 1010 (browser_signature_banned)` on every endpoint.
The script sends `User-Agent: ascent-build/1.0`. Do not remove it — without it nothing works, and
the failure looks like an auth problem rather than a transport one.
