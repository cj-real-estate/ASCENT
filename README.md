# Ascent — ascentcas.com

Marketing site for **Ascent Client Acquisition Systems** (Oklahoma City, OK).
Two landing pages built from one set of components:

| Route | Job | Traffic |
|---|---|---|
| `/` | The **firm** — brand-level page for service businesses generally | People who Google the name, get a card, click the domain in a signature |
| `/fence` | The **pitch** — trade-specific page built to convert fence-company owners | Every outbound email, call follow-up, DM, and ad links **directly here**, never to `/` |

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 (brand tokens as CSS custom
properties in `app/globals.css`) · self-hosted Archivo + IBM Plex (woff2 in
`app/fonts/`) · Vercel Web Analytics · static prerender + one serverless
route (`/api/book`).

## Local dev

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages prerender static)
npm run start      # serve the production build
npm run typecheck
```

Copy `.env.example` to `.env.local` for the booking-form email route. Without
`RESEND_API_KEY` + `BOOKING_TO_EMAIL`, form submissions still land the
visitor on `/thanks` but are only **logged** to the server/function log under
`[BOOKING_ROUTE_UNCONFIGURED]` — set these before launch.

## Content architecture — how the verticals work

Every trade-specific string on a page — headlines, calculator labels, proof,
vocabulary — lives in one content module typed against the `Vertical`
interface:

```
content/verticals/
  types.ts      ← the Vertical interface (the contract)
  general.ts    ← the brand page at /
  fence.ts      ← the fence page at /fence
  index.ts      ← registry (sitemap derives from this)
```

Components (`components/`) render whatever they're handed and contain **zero
trade names**. `components/VerticalPage.tsx` assembles the fixed section
order: Header → Hero + calculator → Problem → What gets installed → Proof →
Where to start → Booking → Footer.

### Adding a third vertical (e.g. roofing)

1. `cp content/verticals/fence.ts content/verticals/roofing.ts`, rewrite the
   strings for the trade, set `path: "/roofing"`, `slug: "roofing"`.
2. Register it in `content/verticals/index.ts` (adds it to the sitemap).
3. Create the route — three lines of glue, same as `app/fence/page.tsx`:

   ```tsx
   // app/roofing/page.tsx
   import { roofing } from "@/content/verticals";
   import { VerticalPage } from "@/components/VerticalPage";
   import { verticalMetadata } from "@/lib/seo";

   export const metadata = verticalMetadata(roofing);
   export default function RoofingPage() {
     return <VerticalPage vertical={roofing} />;
   }
   ```

If a new page genuinely needs a field the interface doesn't have, **widen
`types.ts` and update every existing content file to match — never fork the
components.**

## The calculator

`components/Calculator.tsx` + `lib/calculator.ts`, shared by every vertical
(only labels differ). Math is implemented exactly as specified:

```
quotesWritten    = estimatesPerMonth × months
valueQuoted      = quotesWritten × averageTicket
valueUnclosed    = valueQuoted × (1 − closeRate)
recoveryRate     = closeRate ÷ 2
recoverableValue = valueUnclosed × recoveryRate
```

Live on load (defaults render server-side), ~500ms count-up on change,
`prefers-reduced-motion` jumps instantly, sliders are keyboard-operable with
visible focus, output announced via a debounced `aria-live` region. The
conservative-assumption line is permanent — never put it behind a toggle.

## Booking

`booking.calLink` in a content module switches the booking section between
the Cal.com inline embed (when set, e.g. `"ascent/pipeline-audit"`) and the
fallback form (when `null`, the current state). The form posts to
`/api/book` (honeypot, no CAPTCHA), which emails the lead via Resend and
routes the visitor to `/thanks`. The general page's form has a **free-text
trade field** on purpose — what people type is market research; don't turn it
into a dropdown.

## Brand tokens

Defined in `app/globals.css` `@theme` — Ink `#1F1F1F`, Paper `#FFFFFF`,
Surface `#F4F4F4`, orange `#F05E23` as accent only. Contrast rules baked into
the tokens: full-strength orange is fine on Ink at any size but only as
**large text** on light backgrounds — small text on Paper/Surface uses
`accent-deep` (`#B8430C`); muted text is `fog` on dark, `slate` on light.
`ascent-brand-style-guide.md` is authoritative — if any value here disagrees
with it, the style guide wins.

## Assets

- The lockup is currently **typographic** (`components/Lockup.tsx`) with a
  placeholder triangle mark, and `app/icon.svg` / `public/og-image.png` are
  generated placeholders. Request the `.svg` lockup and mark from the client
  and swap them in when they arrive.
- Proof-section ad-account screenshots: once approved, drop files in
  `public/` and fill `proof.screenshots` in the content module.

## Verified against the quality floor

Production build, Chromium, this commit: Lighthouse **mobile perf 96 / a11y
100 / SEO 100** on both `/` and `/fence` (median of runs; local best-practices
dings one 404 for the Vercel Analytics script, which only exists once deployed
on Vercel) · CLS 0 (metric-adjusted font fallbacks) · no horizontal scroll at
320px · full keyboard pass with visible orange focus ring · calculator math
property-checked · form → `/thanks` end-to-end · honeypot drops silently.

## Outstanding [DECISION] items (the client owes these)

Rendered as **visible placeholders** until supplied — do not fill them with
plausible copy:

1. **Proof attribution line** — whose results, which market, what period →
   `proof.attributionLine` (currently renders `[NEEDS ATTRIBUTION LINE]`).
2. **Ad-account screenshots** — publishable? → `proof.screenshots`.
3. **Phone + email** → `footer.phone` / `footer.email` (currently
   `[Phone — pending]` / `[Email — pending]`, also referenced on `/privacy`).
4. **Scheduler** — Cal.com vs Calendly and the link → `booking.calLink`.
5. **Founding-spots line** on `/` — yes/no, and the live count →
   `offer.foundingSpotsRemaining` (hand-maintained; `null`/`0` omits the
   line; never a timer, never auto-decrementing).
6. **Stated service area** on `/` — "Oklahoma" vs "Oklahoma City metro"
   (currently "Oklahoma" per the hero eyebrow and JSON-LD `areaServed`).

## ⚠️ fence.ts is provisional

This repository was empty when the general page was built, so there was no
existing fence build to move to `/fence`. `content/verticals/fence.ts` is a
faithful adaptation of the final general-page copy with fence vocabulary and
the real fence-client numbers — nothing invented — but the authoritative
fence copy lives in `ascent-website-handoff.md` (including its full four-tier
price grid, represented here by the two-card offer until those tiers are
supplied). **Reconcile `fence.ts` against that document before `/fence` takes
outbound traffic.** If an old deployment served the fence pitch at any other
path, add a permanent redirect to `/fence` in `next.config.ts` (a commented
example is there).

## Deploy

Vercel. Static pages + one function (`/api/book`). Set the env vars from
`.env.example` in the Vercel project. `robots.txt`, `sitemap.xml`,
canonicals, OpenGraph/Twitter cards, and `LocalBusiness` JSON-LD (no
`aggregateRating` — there are no reviews, and fabricating structured data is
a Google violation) are all wired.
