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
4. **Cal.com vs Calendly + scheduling link** (`booking.schedulingLink`).
5. **Current founding-spots count** (`foundingSpotsRemaining`).
6. Whether founding pricing stays published at launch (currently: yes).

## Logo note

Delivered brand assets were raster-only, so the chevron mark is recreated as
SVG in `src/components/Logo.tsx` and all icons/OG are generated from it. When
the client supplies the official `.svg` lockup, swap it into `Logo.tsx` and
the `d`-paths in `scripts/generate-assets.mjs`, then `npm run generate:assets`.

## Deploying and connecting the domain

See `DEPLOY.md` for the Vercel import + GoDaddy DNS runbook for
ascentcas.com, and `CONNECT-DOMAIN-CHROME.md` for a paste-ready browser-agent
version of the same steps.
