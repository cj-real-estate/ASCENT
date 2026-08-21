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

## Booking form email

The fallback booking form posts to `/api/book`, which emails the lead via
Resend. Configure in Vercel (see `.env.example`):

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

**The mark geometry lives in three places and they must change together:**
`src/components/Logo.tsx`, `scripts/generate-assets.mjs`, and
`scripts/build-logo-svg.py`. After any change:

```bash
npm run generate:assets                 # favicons + OG image
python3 scripts/build-logo-svg.py       # brand/*.svg  (pip install fonttools brotli)
```

A transparent channel is knocked out of the outer chevron wherever the inner
one crosses it. Without it the all-white reverse merges into a single blob and
the inner chevron disappears — the failure the brand guide calls out in §2.

## Deploying and connecting the domain

See `DEPLOY.md` for the Vercel import + GoDaddy DNS runbook for
ascentcas.com, and `CONNECT-DOMAIN-CHROME.md` for a paste-ready browser-agent
version of the same steps.
