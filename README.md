# Ascent — ascentcas.com

Marketing site for **Ascent Client Acquisition Systems**. One page, one job:
make a skeptical contractor who just got a cold email believe this is a real
firm, and get him to book the free pipeline audit.

Static Next.js (App Router) + TypeScript + Tailwind v4. No database, no auth,
no server state. Deployed on Vercel.

## Local dev

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (static)
npm run generate:assets  # regenerate favicons / og-image from the SVG mark
```

Node 20+. Fonts are self-hosted in `src/fonts/` (Archivo 800, IBM Plex Sans
400/600, IBM Plex Mono 500 — latin subsets) via `next/font/local`; nothing is
fetched from Google at runtime.

## Where things live

| Path | What |
|---|---|
| `content/verticals/fence.ts` | **Every vertical-specific string on the site.** Copy, stats, pricing, labels — components read from it and hard-code nothing. |
| `content/verticals/types.ts` | The `Vertical` interface the content module is typed against. |
| `docs/ascent-brand-style-guide.md` | Authoritative palette / type / logo rules. `globals.css` implements it. |
| `docs/BUILD-NOTES.md` | Design-system conventions the components follow. |
| `src/components/` | Presentational components; all take content via props. |
| `src/lib/calculator.ts` | The pipeline-calculator math, in one place, exactly as specified. |
| `scripts/generate-assets.mjs` | Regenerates `public/` icons and the OG image from the vector mark. |

## Adding a second vertical

The brand is trade-agnostic on purpose; the vertical lives in the content
layer. To add, say, roofing:

1. Copy `content/verticals/fence.ts` → `content/verticals/roofing.ts` and
   rewrite the strings (it's typed — the compiler tells you what's required).
2. Add a route (e.g. `src/app/roofing/page.tsx`) that imports the new module
   and renders the same components `src/app/page.tsx` does.

No component changes. If a component ever needs a vertical string, it goes in
the `Vertical` interface, not in the component.

## The founding-spots counter — manually maintained

`foundingSpotsRemaining` in `content/verticals/fence.ts` is a hand-edited
constant. **Edit it when a client signs. Nothing decrements it for you** — no
timer, no randomization, by design. If it reads `0`, the Founding Five section
and the booking headline switch to the "filled / waitlist" framing.

> ⚠️ It currently reads `5` pending the client's confirmed count (decision #5
> below). If that's wrong, fix it before launch — an inaccurate scarcity
> counter torches the site's credibility.

## The qualification gate and /apply

Nobody reaches the Calendly scheduler without answering the ICP questions
first. `QualifyFlow` (the client island inside every booking section, and the
whole of `/apply` — the bare landing page for social/paid CTAs) posts contact
info + answers to `/api/book`. The lead is emailed in BOTH cases — subject
"Qualified lead — …" or "Lead (below ICP) — …" — and only a qualifying
verdict gets the calendar.

Two things are deliberate about the wiring:

- **Which answers qualify lives in `content/verticals/*.ts`** (the
  `qualifies` flag per option). Tune thresholds there; a prospect passes only
  if every chosen option qualifies.
- **The flags and the Calendly URL never reach the browser.** Client props
  are serialized into view-source, so `src/lib/qualify.ts` strips both, and
  `/api/book` recomputes the verdict server-side and returns the scheduling
  link only on a pass. Don't hand a client component the whole `Vertical` —
  that's how they'd leak.

## Booking email

`/api/book` emails leads via Resend. Configure in Vercel (see `.env.example`):

- `RESEND_API_KEY`
- `BOOKING_TO_EMAIL` — where leads land
- `BOOKING_FROM_EMAIL` — verified sender

Without these, the route logs in dev and returns an honest 503 in production.
Set them before launch or wire the Cal.com link (`booking.schedulingLink` in
the content module) so the page always has a live path to `/thanks`.

## Deploying on Vercel

This app lives in the `ascent-site/` subdirectory — set **Root Directory** to
`ascent-site` in the Vercel project settings, connect the repo, add the env
vars above, point `ascentcas.com` at the project, and enable **Web
Analytics** (cookieless — no consent banner needed).

## Decisions still owed by the client

Rendered as visible placeholders on the site until supplied — search the
content module for `DECISION`:

1. **Proof attribution line** — whose results, which market, what period
   (`proof.attributionLine`). The site shows `[NEEDS ATTRIBUTION LINE]` until then.
2. **Ad-account screenshots** — cleared for publication? (`proof.screenshots`)
3. **Phone + email** (`business.phone` / `business.email`) — footer, privacy
   page, and JSON-LD pick them up automatically.
   *(Supplied 2026-08-21: 580-304-8470 / caleb@ascentcas.com.)*
4. **Cal.com vs Calendly + scheduling link** (`booking.schedulingLink`).
   *(Resolved: Calendly, wired 2026-08-22 — now revealed only after
   qualification.)*
5. **Current founding-spots count** (`foundingSpotsRemaining`).
6. Whether founding pricing stays published at launch (currently: yes).

## Logo and brand files

The delivered brand assets were raster-only, so the mark is drawn as vector
geometry and everything else is generated from it. Downloadable files live in
`brand/`:

| File | Use |
|---|---|
| `ascent-lockup.svg` | Primary lockup, orange + ink — on Paper or Surface |
| `ascent-lockup-white.svg` | Reverse lockup, all white — on Ink, Graphite, or a photo |
| `ascent-mark.svg` | Chevron only, orange + ink |
| `ascent-mark-white.svg` | Chevron only, white |

The wordmark in these files is **outlined, not live text**, so a print shop,
Illustrator, or a shirt vendor renders them correctly with no font installed.

### Where the mark comes from

The delivered artwork is raster only — even the Canva `.svg` export wraps a
308×297 PNG in a luminance mask rather than carrying real paths. So the vector
mark is **traced from the raster**, not redrawn by eye:

```bash
python3 scripts/trace-mark.py      # brand/source/*.png -> brand/mark-paths.json
npm run generate:assets            # favicons + OG image
python3 scripts/build-logo-svg.py  # brand/*.svg
# both python scripts need: pip install numpy pillow fonttools brotli
```

`scripts/trace-mark.py` classifies the orange and ink pixels, traces each
region's boundary, least-squares fits a line to every straight edge, intersects
consecutive lines for the ideal corners, fits a circle at each rounded corner
for its true fillet radius, and emits lines plus exact circular arcs. The
result matches the source raster to within antialiasing.

**`brand/mark-paths.json` is the single source of truth.** `Logo.tsx`,
`generate-assets.mjs`, and `build-logo-svg.py` all read it — never hand-edit
path data, re-run the tracer.

Two things about the artwork worth knowing, because both look like bugs:
the orange chevron's **right arm stops short** by design, handing the diagonal
off to the ink chevron; and the gap between the chevrons is **part of the
outline**, not a mask, which is what keeps the all-white reverse legible
instead of merging into one blob.

## Analytics and the Google Ads tag

`src/components/GoogleTag.tsx` loads the Google Ads global site tag
(`AW-18403357820`) via `next/script` with `afterInteractive`, so it stays off
the critical path the hero calculator and LCP depend on. It is skipped when
`NODE_ENV === "development"`, so `npm run dev` never fires conversions.

**It does load on Vercel preview deployments.** If you would rather it fired
only on ascentcas.com, change the guard to
`process.env.VERCEL_ENV !== "production"` — at the cost that the tag then
silently stops firing anywhere that variable isn't set.

### Conversion tracking

One conversion action is reported: "Submit lead form"
(`AW-18403357820/CG1nCJmW2eUcEPzos8dE`), defined in `src/lib/conversion.ts`.
There are two booking paths and they need different handling:

| Path | Signal |
|---|---|
| Fallback form | routes to `/thanks`, so `LeadConversion` fires on page load there |
| Calendly embed | books inside an iframe and never navigates the page, so `CalendlyConversion` listens for Calendly's `calendly.event_scheduled` message |

Google's setup screen only offers page-load or click tracking. Page load alone
would miss **every** calendar booking, which is the primary path — hence the
message listener. The two paths are mutually exclusive, and each reports at
most once per session, so a refreshed `/thanks` does not inflate the count.

The tag sets advertising cookies, which is why `/privacy` names Google Ads and
links to Google's opt-out. **If the tag is ever removed, correct that page
too** — it currently states that these cookies exist.

Vercel Web Analytics is described on `/privacy` but the `@vercel/analytics`
package is not installed, so it is not actually collecting anything. Either
install it or drop that paragraph.

## Deploying and connecting the domain

See `DEPLOY.md` for the Vercel import + GoDaddy DNS runbook for
ascentcas.com, and `CONNECT-DOMAIN-CHROME.md` for a paste-ready browser-agent
version of the same steps.
