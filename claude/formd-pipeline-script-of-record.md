# Form D prospect pipeline — script of record

**Preserved 15 September 2026.** The filter/score/format stage of the 506(c) sponsor outbound
system, implementing §3.1–§3.2 of `claude/sponsor-outbound-system-build-spec.md`. Until today this
script existed only inside one ephemeral session container and a zip in Caleb's Downloads.

The durable copy is now the code itself, in [`formd/`](../formd/):

| File | |
|---|---|
| [`formd/formd_pipeline.py`](../formd/formd_pipeline.py) | `build` and `arms` |
| [`formd/enrich.py`](../formd/enrich.py) | `worklist` and `merge` |
| [`formd/hold_list.csv`](../formd/hold_list.csv) | 9 named holds from the 6 Sept build |
| [`formd/institutional_brands.txt`](../formd/institutional_brands.txt) | 28 substrings |
| [`formd/weekly_hits_TEMPLATE.csv`](../formd/weekly_hits_TEMPLATE.csv) | 16-column shape for the Monday EDGAR rows |
| [`formd/README.md`](../formd/README.md) | operating instructions |

This file keeps the narrative — what is and isn't automated, and why enrichment is split around the
agent. The code is not duplicated here on purpose: a pasted copy drifts from the file next to it
within a week, and then neither is trustworthy. Read the files.

## What it does and does not do

Deterministic: **no network calls, no LLM**. Same inputs → same CSVs. Python 3.10+ and pandas.

| Stage | Automated? |
|---|---|
| SEC → disk | **No.** Quarterly zips downloaded by hand; weekly EDGAR hits hand-typed into `weekly/<date>.csv` (16 fields per filing) |
| Filter, screen, hold gate, score, tier | **Yes** — `build` |
| Hunter enrichment | **No.** Emits `hunter_upload.csv`; results pasted back into `enriched.csv` |
| Domain resolution | **Yes** — `enrich.py worklist` → agent web search → `merge`. Form D carries no domain; the agent resolves it, including the common case where the investor funnel lives on a second domain |
| `funnel_observation` | **Yes** — agent fetches the investor page and writes the sentence. Validated on real sponsors 15 Sept: reproduced the blank-counter and missing-accreditation-gate findings from the 6 Sept manual research |
| `ad_status` | **Partly** — agent checks Meta Ad Library; `merge` refuses any asserted status without a check date |
| `email1_approved` | **No** — the one deliberate human gate |
| Split-test arm assignment | **Yes** — `arms`, stratified, fixed seed |
| GHL load | **No.** Emits `ghl_import.csv` (23 columns) for GHL's CSV importer |

## Why enrichment is agent-driven, not a self-contained script

The container has **no open-web egress** — `midloch.com`, `api.hunter.io` and search engines all
return 403 at the proxy, same as sec.gov. The agent driving the pipeline *does* have web access.
So enrichment splits into two offline, deterministic commands with the agent in the middle:

```
build → enrich.py worklist → [agent: resolve domain, read investor page, write observation] → enrich.py merge → arms
```

Both commands are pure CSV/JSON I/O and testable with no network. `merge` is the trust boundary: it
normalises domains, caps observation length, refuses an `ad_status` asserted without a check date,
and writes nothing at all if any finding fails validation.

## Environment note

The SEC fetch leg, when built, needs `sec.gov` and `*.sec.gov` allowed. Caleb's **Ascent - SEC**
environment has exactly that plus the `GHL Ascent Outbound` credential on
`services.leadconnectorhq.com`. A session must be *started in that environment* to reach SEC —
the cloud-default environment returns 403 on CONNECT.

## Commands

```
python tests/make_fixture.py
python formd_pipeline.py build --raw raw --out out --hold hold_list.csv --brands institutional_brands.txt
python formd_pipeline.py build --raw raw --weekly weekly/2026-09-15.csv --out out_week --hold hold_list.csv --brands institutional_brands.txt
python formd_pipeline.py arms --enriched out/enriched.csv --out out --seed 2026
```

## Verified

**15 Sept, original run.** Against the synthetic fixture: 81 filings loaded → universe 14 →
structural filter 9 kept / 5 dropped → second screen 4 kept / 5 dropped → hold gate 1 held,
**3 candidates** (A=1, B=1, C=1), 3 hunter rows.

**15 Sept, re-verified on preservation** against an independently written fixture (12 issuers, one
per branch, plus 4 history filings for the prior-filing band). The stage counts differ because the
fixture differs; the outcomes match: second screen **4 kept**, hold gate **1 held** (Nitya →
`distress`, matched on name stem, no CIK or accession in the hold list), **3 candidates**
(A=1, B=1, C=1), **3 hunter rows**. Also checked:

- 36 unit assertions over the pure logic — date parsing (`22-JAN-2026`, ISO, `M/D/YYYY`, and the
  rejects), `to_num` on `Indefinite`, name-stem normalisation, tier boundaries at 70/45, every
  structural and second-screen branch, the score formula, and hold-gate stem matching.
- `enrich.py` end to end: `worklist` skips already-enriched rows; `merge` normalises
  `https://WWW.AlphaMF.com/invest/?utm=x` → `alphamf.com`, collapses whitespace in the
  observation, derives B1/B2 from `ad_status`. All **8 refusal paths** reject and write **nothing**
  — ad_status with no check date, non-ISO date, bad domain, unknown accession, bad segment, bad
  `ir_contact_type`, missing accession, 241-char observation.
- `arms` stratifies 2/2 per segment, is byte-identical across runs at the same seed, assigns no arm
  to segment C, and leaves no non-C row unassigned.
- `ghl_import.csv` against the live Outbound location: all **17** `prospect_*` columns and all
  **4** emitted tags (`src_cold_email`, `tier_a/b/c`) resolve against the schema built 14 Sept, and
  `cold_email` / `production` / `A_priority` / `B_standard` are valid members of their option lists.

Run on pandas 3.0.5 / Python 3.11.

## Gaps

- **`tests/make_fixture.py` was never preserved.** It is the first command under *Commands* and the
  whole of the README's *Test* section, and the original verification rests on it — but no copy of
  it exists here, in `formd/`, or anywhere in the repo. The re-verification above used a
  throwaway fixture written from scratch, which is why the stage counts differ from the original
  run. Until the generator is recovered or rewritten, the documented test is not reproducible.
- `prospect_route` emits only `A_priority` and `B_standard` — tier C candidates are routed
  `B_standard` while tagged `tier_c`, and the field's `C_under_floor` option is never written by
  this script.

## After the script: still by hand

- Pipeline "Ascent New Business": New Inquiry · Contacted · Audit Booked · Audit Held ·
  Proposal Sent · Verbal / Negotiating · Closed Won · Nurture / Not Now · Disqualified.
- Workflows W1–W4 per spec §5.3 (W1 drip mode 20/day week 1 → 30/day; 08:00–16:00 CT; Mon–Thu).
