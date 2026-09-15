# Form D prospect pipeline — script of record

**Preserved 15 September 2026.** The filter/score/format stage of the 506(c) sponsor outbound
system, implementing §3.1–§3.2 of `claude/sponsor-outbound-system-build-spec.md`. Until today this
script existed only inside one ephemeral session container and a zip in Caleb's Downloads.

The durable copy is now the code itself, in [`formd/`](../formd/):

| File | |
|---|---|
| [`formd/formd_pipeline.py`](../formd/formd_pipeline.py) | `build` and `arms` |
| [`formd/enrich.py`](../formd/enrich.py) | `worklist`, `merge` and `hunter` |
| [`formd/fetch.py`](../formd/fetch.py) | EDGAR ingestion — `--selftest`, and the live weekly pull |
| [`formd/tests/make_fixture.py`](../formd/tests/make_fixture.py) | synthetic two-quarter fixture for the documented test |
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
| SEC → disk | **Quarterly: no** — zips downloaded by hand. **Weekly: yes** — `fetch.py` pulls EDGAR full-text and parses each `primary_doc.xml`; the hand-typing step is gone |
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
python fetch.py --selftest
python fetch.py --days 7 --out weekly/2026-09-15.csv --user-agent "Ascent Client Acquisition Systems caleb@ascentforsponsors.com"
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

**15 Sept, handoff applied.** `tests/make_fixture.py` and `fetch.py` added, two weekly-path bugs
patched. The documented test now reproduces the original run **exactly** — 81 filings, universe 14,
structural 9 kept / 5 dropped, second screen 4 kept / 5 dropped, 1 held (Nitya, `distress`),
3 candidates (A=1, B=1, C=1), 10 screened out, 3 hunter rows. Also:

- `fetch.py --selftest` passes: all 19 fields against the embedded MHF filing, namespace-stripping
  verified, and `pick_contact` ranks Executive Officer (Minka Hull) above Promoter (Mark Hull).
- **The weekly contact bug, reproduced then fixed.** Before the patches a fetch.py-shaped weekly row
  produced 1 candidate and **0** hunter rows with all three contact fields blank; after, **1**
  hunter row carrying `Minka,Hull,MHF Real Estate Income Fund LLC`. The quarterly path is
  byte-identical across the patch — `candidates.csv`, `held.csv`, `screened_out.csv`,
  `hunter_upload.csv` and `ghl_import.csv` all compare equal.
- **Live EDGAR run, this session** (it turned out to have SEC egress): 217 filings matched `"06c"`
  for 2026-09-08..09-15 — the same 217 the handoff saw — **213 rows written, all 213 carrying a
  named related person**. The 4 shortfall is duplicate accession numbers in the search results, not
  parse failures; none were logged.
- **Weekly build over those 213 real filings**: 42 past the structural filter, 26 past the second
  screen (16 `placement_agent`), 0 held, **26 candidates and 26 hunter rows** — the contact fix
  holding on real data, not just the synthetic row.
- **`not_real_estate` checked for over-dropping**, per the handoff's instruction not to add a SIC
  lookup without evidence. 134 of 213 dropped, but **zero** of them carry a real-estate name term,
  so the name sweep is not leaking. The 92 `Pooled Investment Fund` drops — the README's documented
  blind spot — are Equitybee startup-equity series funds, medical co-invests and hospitality on
  inspection. No evidence of over-dropping; no SIC lookup warranted. Note that if it ever is, Form D
  carries no SIC at all, so the fix would be a CIK→SIC lookup against EDGAR's submissions API,
  not a field in the filing.

## Gaps

- `enrich.py hunter --domain-search-only` **miscounts its own skip line**: it reports the
  nameless rows as "skipped ... with no named contact" in the same breath as emitting them as
  `domain_search` rows, so the summary contradicts the line above it and the file it just wrote.
  The CSV is correct — only the message is wrong. It matters a little because that summary exists
  to be read before spending Hunter credits. The condition needs to consider `--domain-search-only`
  as well as `--include-nameless`. Left as found; not changed unasked.
- `prospect_route` emits only `A_priority` and `B_standard` — tier C candidates route
  `B_standard` while tagged `tier_c`, and the field's `C_under_floor` option is never written.
  Left alone deliberately: enrichment already routes segment C to phone-first and `arms` excludes
  it, so the tag does the work. Worth revisiting only if `prospect_route` starts driving a
  workflow branch.

## After the script: still by hand

- Pipeline "Ascent New Business": New Inquiry · Contacted · Audit Booked · Audit Held ·
  Proposal Sent · Verbal / Negotiating · Closed Won · Nurture / Not Now · Disqualified.
- Workflows W1–W4 per spec §5.3 (W1 drip mode 20/day week 1 → 30/day; 08:00–16:00 CT; Mon–Thu).

**15 Sept, zip reconciled.** The handoff zip arrived and was diffed file by file rather than
unpacked over the tree. `formd_pipeline.py`, `fetch.py`, `tests/make_fixture.py`, `hold_list.csv`,
`institutional_brands.txt` and `weekly_hits_TEMPLATE.csv` were **byte-identical** to the repo —
including the two weekly-path patches, which had been applied identically on both sides. The zip's
`README.md` was **older** than the repo's (it predates the `fetch.py` weekly step and the expanded
Test section) and was deliberately not taken. Only `enrich.py` was adopted, a purely additive
change: `cmd_hunter` plus its subparser, nothing else in the file touched.

`hunter` verified in all three modes against a fixture covering every branch — named + domain,
domain with no usable name, and no domain:

| mode | emitted | skipped |
|---|---|---|
| default | 2 `email_finder` | 2 nameless, 1 no-domain |
| `--include-nameless` | 2 `email_finder` + 2 `domain_search` | 1 no-domain |
| `--domain-search-only` | 2 `domain_search` | 2 named, 1 no-domain |

A row with a first name but no surname routes to `domain_search`, which is right — Email Finder
needs both. And the subcommand's premise checks out on real data: `build`'s `hunter_upload.csv`
from the live 213-filing run holds 26 rows with **0** domains, unusable by Hunter, while `hunter`
over the same rows emits nothing and reports ~0 credits until enrichment supplies them.
