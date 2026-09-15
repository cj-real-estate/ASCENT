# formd_pipeline — 506(c) sponsor list builder

Implements §3.1–§3.2 of `claude/sponsor-outbound-system-build-spec.md`. Deterministic: no network,
no LLM. Same inputs → same CSVs. Runs on the Mac with Python 3.10+ and pandas (`pip install pandas`).

## Folder layout

```
~/Ascent/formd/
  formd_pipeline.py
  hold_list.csv              append-only; seeded with the 9 named holds from the 6 Sept build
  institutional_brands.txt   one substring per line
  raw/                       SEC quarterly zips, downloaded in the browser — keep every quarter
    2026q1_d.zip
    2026q2_d.zip
  weekly/                    one CSV per Monday, from the EDGAR full-text search
    2026-09-15.csv
  out/                       quarterly outputs
  out_week/                  weekly outputs
```

## Quarterly (within a week of the SEC posting the quarter)

1. Download the quarter's zip from `sec.gov/data-research/sec-markets-data/form-d-data-sets` into `raw/`.
2. `python formd_pipeline.py build --raw raw --out out --hold hold_list.csv --brands institutional_brands.txt`
3. Read `out/run_log.txt` first — counts per stage. Then `out/candidates.csv` (scored, tiered).

## Weekly (Monday)

1. `python fetch.py --days 7 --out weekly/2026-09-15.csv --user-agent "Ascent Client Acquisition Systems caleb@ascentforsponsors.com"`

   Needs `sec.gov` + `efts.sec.gov` egress — run it in the **Ascent - SEC** environment. The
   User-Agent must carry a contact address (SEC rejects generic agents) and `--rate` defaults to
   8 req/sec, under SEC's cap of 10. A filing that fails to parse is logged and skipped, never
   fatal. `weekly_hits_TEMPLATE.csv` documents the column shape fetch.py writes; fill it by hand
   only if EDGAR is unreachable.
2. `python formd_pipeline.py build --raw raw --weekly weekly/2026-09-15.csv --out out_week --hold hold_list.csv --brands institutional_brands.txt`
   History (prior-filing counts) comes from the quarters in `raw/`, so keep them loaded.
3. Also match `weekly/<date>.csv` against GHL contacts tagged `nurture_active` — a new filing by a
   nurtured sponsor is the re-trigger (spec §6).

## After enrichment (Hunter + research-verify, spec §3.3)

Fill `segment`, `hunter_email`, `hunter_confidence`, `funnel_observation`, `ad_status`,
`ad_status_checked`, `email1_approved` on `candidates.csv`, save as `enriched.csv`, then:

`python formd_pipeline.py arms --enriched out/enriched.csv --out out --seed 2026`

Arms are assigned only to rows with `email1_approved = yes` and segment ≠ C, stratified by segment,
fixed seed — the same file always gets the same arms. Import `enriched_with_arms.csv` to GHL using
the `ghl_import.csv` column mapping.

## Outputs

| File | What |
|---|---|
| `candidates.csv` | Passed every filter and the hold gate. Sorted by score, then remaining |
| `held.csv` | Matched `hold_list.csv` (accession → CIK → name stem). Never soften |
| `screened_out.csv` | Dropped, with `screen_reason` |
| `hunter_upload.csv` | Candidates with a named related person from the filing, in Hunter's bulk shape |
| `ghl_import.csv` | Candidates in the GHL import shape (spec §5.1 fields, `src_cold_email` + `tier_*` tags) |
| `run_log.txt` | Counts per stage — this is the audit trail |

## Screen reasons

Structural: `unparseable_date`, `not_real_estate`, `not_506c`, `under_10m_or_indefinite`, `fully_sold`.
Second screen: `platform_filer` (60+ prior new filings by CIK or name stem), `placement_agent`
(`SALESCOMM_DOLLARAMOUNT > 0`), `institutional_check` (avg check > $3M), `institutional_brand`,
`offshore_feeder`, `min_inv_1m`, `non_us`.

## Score (0–100)

avg check $75K–$500K +30 (near-retail +15) · prior new filings 3–59 +25 (1–2 +10) ·
%-open × min(investors, 50)/50 × 25 · investors ≥ 25 +10 · filed within 90 days of `--asof` +10.
Tier A ≥ 70, B ≥ 45, else C. Thresholds are constants at the top of the script.

## Known limits (same as the 6 Sept build record)

- A real estate fund that self-classifies as *Pooled Investment Fund* with no real-estate term in its
  name is invisible (`not_real_estate`). Check `screened_out.csv` for that reason before trusting a
  weekly run with few hits.
- `Indefinite` offering amounts are dropped by the ≥ $10M rule. Evergreen vehicles sometimes file this
  way; review that slice of `screened_out.csv` by hand once a quarter.
- Prior-filing counts only see the quarters loaded in `raw/`. Load everything back to 2021 Q1.

## Test

```
python tests/make_fixture.py
python formd_pipeline.py build --raw tests/fixture_raw --out out \
    --hold hold_list.csv --brands institutional_brands.txt
```

`make_fixture.py` builds a synthetic two-quarter data set with one issuer per branch. Expected:
**3 candidates** (A=1, B=1, C=1), **1 held** (Nitya, `distress`), **10 screened out**.
`tests/fixture_raw/` is generated and git-ignored.

`python fetch.py --selftest` parses an embedded copy of a real filing offline and asserts all 19
fields plus a namespaced variant — no network needed.
