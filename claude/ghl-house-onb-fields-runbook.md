# Ascent house — the 11 remaining `onb_*` fields (runbook)

15 September 2026. Companion to [`claude/ghl-outbound-build-runbook.md`](ghl-outbound-build-runbook.md),
which does the same job for the `prospect_*` schema in the Outbound sub-account.

Creates the 11 calendar / video / DNS onboarding fields in the **house** sub-account
(location id `pX8dNxneJPkYjJ8FVZJn`), idempotently.

Script: [`scripts/create_onb_fields.py`](../scripts/create_onb_fields.py)

## Status: blocked on a credential, not on code

The script is written and its logic is validated, but it **has not run against the house
sub-account yet**. The `GHL Ascent Outbound` credential attached to the cloud environment is a
Private Integration token created *inside the Outbound sub-account*, and GHL scopes those per
sub-account. Against the house location every call returns:

```
HTTP 403 {"statusCode":403,"message":"The token does not have access to this location."}
```

The same token returns `HTTP 200, 24 fields` against `UKGbpWRFkARlgnMtlB4C` in the same session,
so this is authorization scope — not the Cloudflare/User-Agent transport failure, and not a
missing allowlist entry. A second token is required; no scope edit on the existing one can widen
it to another sub-account.

## Unblocking it (Caleb, ~5 minutes)

1. In the **house** sub-account (`pX8dNxneJPkYjJ8FVZJn`) → **Settings → Private Integrations →
   Create**. Name `ascent-house-build`. Scopes:
   * `locations/customFields.readonly`
   * `locations/customFields.write`

   Both matter. A missing *write* scope is invisible until the first POST — reads keep working,
   so a dry run passes clean and the build fails partway.
2. claude.ai/code → cloud icon above the prompt → the environment → **API credentials → Add
   credential**. Name `GHL Ascent House`, allowed website `services.leadconnectorhq.com`, header
   `Authorization` / prefix `Bearer` / value = the token → **Connect**.

   Note that the environment will then hold two credentials for the same host. If the proxy
   injects only one per host, swap the existing `GHL Ascent Outbound` value instead of adding a
   second, and swap it back before the next outbound run.
3. New session in that environment: "Run `scripts/create_onb_fields.py --dry-run`, then for real."

## What it will create

Five text fields (`onb_calendar_backup_owner_email`, `onb_meeting_hours`, `onb_video_host_email`,
`onb_dns_admin_name`, `onb_dns_admin_email`), five dropdowns (`onb_calendar_system`,
`onb_meeting_length_min`, `onb_meeting_timezone`, `onb_video_platform`, `onb_dns_provider`) and
one checkbox (`onb_calendar_access_done`).

`dataType`, option shape and folder placement are **not hardcoded**. They are copied at runtime
from three fields that already exist in the account — `onb_ein`, `onb_business_type` and
`onb_meta_access_done` — so the new fields inherit whatever spelling that API version uses and
land in the same folder as the rest of the `onb_*` set. If any of the three is missing the script
aborts rather than guessing.

## Validation already done

Run against the readable Outbound sub-account with `prospect_*` analogues substituted for the
templates, the script resolved `TEXT` / `SINGLE_OPTIONS`, derived the correct folder
(`6Y10UOlRdzhiJvUvtwyH`) and emitted well-formed create bodies. So the GET parsing, dataType
inference, folder derivation and option shaping are all exercised and correct — only the
authorization remains.

Options on this API version come back as `picklistOptions` holding **plain strings**, which is
what the script sends. `shape_options` mirrors the template's shape, so if the house account
returns `[{"key":..,"label":..}]` instead it adapts rather than failing.

## Inherited gotcha

**A `User-Agent` is mandatory.** GHL sits behind Cloudflare, which rejects the default
`Python-urllib/3.x` signature with `403 error 1010 (browser_signature_banned)` on every endpoint.
The script sends `User-Agent: ascent-build/1.0`. Do not remove it — without it nothing works, and
the failure looks like an auth problem rather than a transport one.
