# SEO + GEO playbook — ascentforsponsors.com

How the sponsor domain is set up to rank in Google and to be cited by
answer engines (Google AI Overviews / Gemini, ChatGPT search, Perplexity,
Claude, Copilot), what is already built into the site, and the work that
only the owner can do. Read top to bottom once; then use the checklist at
the end.

**Niche.** Investor acquisition for real estate syndicators and private
real estate fund sponsors raising under Rule 506(c). The queries that
matter, roughly in the order a sponsor asks them:

| Intent | Example queries | Page that answers it |
|---|---|---|
| Category | investor acquisition for real estate sponsors · 506(c) investor marketing agency · accredited investor lead generation real estate · capital raising marketing for syndicators | `/` |
| Rules | 506(b) vs 506(c) marketing · can I advertise a 506(b) offering · general solicitation real estate syndication | `/guides/506b-vs-506c-real-estate-marketing` |
| How-to | how to find accredited investors for real estate syndication · where do syndicators find investors | `/guides/how-to-find-accredited-investors-real-estate-syndication` |
| Economics | cost per investor lead · how much to budget to market a 506(c) raise · investor lead conversion rate | `/guides/cost-per-investor-lead-506c-benchmarks` |
| Response | speed to lead investor · investor appointment setting · set-to-held rate | `/guides/speed-to-lead-investor-acquisition` |
| Verification | 506(c) accredited investor verification 2025 · reasonable steps to verify · $200,000 minimum investment no-action letter | `/guides/accredited-investor-verification-506c` |
| Fee models | placement agent fees real estate · can a marketing agency be paid on capital raised · finder's fee 506(c) | `/guides/placement-agent-vs-flat-fee-investor-acquisition` |
| Definitions | what is cost per appointment held · what is an investor lead | `/guides/investor-acquisition-glossary` |

Answer engines cite pages that (a) answer a question directly in the first
paragraph, (b) carry specific, attributed facts, (c) are internally
consistent about who the entity is, and (d) are corroborated elsewhere on
the web. The site now does (a)–(c). (d) is the owner's work, below.

---

## What is built into the site

Everything here ships with the code and needs no action.

**Structured data** (`src/lib/schema.ts`, rendered by `JsonLdData`). One
`@graph` per page with stable `@id`s so every page describes the same
entity:

- `Organization` + `ProfessionalService` — legal name, founder (`Person`),
  address, contact point, `knowsAbout`, logo, and `sameAs` (empty until you
  add profile URLs — see below).
- `WebSite`, `WebPage` / `CollectionPage`, `BreadcrumbList`.
- `Service` with an `OfferCatalog` of what is included. No prices, no
  ratings, no reviews — none are published, and inventing them is a policy
  violation.
- `FAQPage` on the sponsor page (11 questions) and on every guide, using
  the visible answers verbatim.
- `Article` on every guide — author, publisher, dates, word count,
  citations. `DefinedTermSet` on the glossary.

**Answer-first content.** Every guide opens with a one-paragraph direct
answer, then numbered takeaways, then the sections, then an open FAQ (the
answers are in the HTML, not behind a click), then sources with links. The
sponsor page has an "at a glance" block — one definition sentence and a
facts list — next to the FAQ.

**Crawl and index surface** (all served on the sponsor host by the rewrites
in `next.config.ts`):

| URL | What |
|---|---|
| `/robots.txt` | Allows everything public; names and allows every major AI crawler explicitly (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, meta-externalagent, CCBot, …). Keeps `/api/`, `/thanks`, `/apply`, `/fence`, `/sponsors` and `/indexnow/` out. |
| `/sitemap.xml` | Sponsor page, guides index, every guide, privacy — with content dates as `lastmod`, not build dates. |
| `/llms.txt` | Markdown summary of the whole site for language-model crawlers: definition, key facts, page list, what is included, process, boundaries, fit, every FAQ, every guide's answer and takeaways, legal. Generated from the content modules so it never drifts. |
| `/guides`, `/guides/<slug>` | The seven guides. |
| `/privacy` | A sponsor-domain privacy page (the brand site's one described the wrong form). |
| `/indexnow/<key>.txt` | IndexNow key file, served only when `INDEXNOW_KEY` is set (below). |

**Meta.** `max-snippet:-1`, `max-image-preview:large` site-wide so engines
can quote answers in full. Absolute canonicals on the sponsor domain from
every host. `<title>` leads with "real estate syndicators" and "506(c)
sponsors". Open Graph `article` with dates and author on guides.

**Internal linking.** The sponsor page links every guide (a section plus
the footer); every guide links three related guides, the sponsor page's
process, calculator and booking sections, and the guides index; the footer
on every page lists all guides. All links are absolute on
`https://ascentforsponsors.com`.

---

## Owner work — in priority order

### 1. Verify the property in Google Search Console and Bing Webmaster Tools (30 min)

Search Console is how Google tells you what it indexed and which queries
you show for. Bing's index is what Copilot uses and what ChatGPT search
draws on, so Bing matters more here than usual.

1. Google Search Console → Add property → **Domain** type →
   `ascentforsponsors.com`. Choose the DNS TXT record method and add the
   record at GoDaddy (Domain → DNS → Add → TXT, host `@`). Verification is
   then permanent and covers www and http/https.
   - Alternative without DNS: choose **URL prefix**, pick the HTML tag
     method, copy the `content="…"` value, and set it as the Vercel
     environment variable `GOOGLE_SITE_VERIFICATION`. Redeploy. Two
     domains? Comma-separate: `token-for-ascentcas,token-for-sponsors`.
2. In Search Console → Sitemaps → submit `https://ascentforsponsors.com/sitemap.xml`.
3. Use URL Inspection → "Request indexing" on `/` and each `/guides/…` URL
   once. (Ten URLs; one-time.)
4. Bing Webmaster Tools → Add site → import from Search Console (one
   click, reuses the verification), or use the meta-tag method and set
   `BING_SITE_VERIFICATION` on Vercel the same way. Submit the sitemap
   there too.

### 2. Turn on IndexNow (10 min)

Instant indexing on Bing and the engines that share its index.

1. Generate a key: any 8–128 characters of letters, digits and dashes
   (e.g. `openssl rand -hex 16`).
2. Vercel → Project → Settings → Environment Variables →
   `INDEXNOW_KEY=<key>` → redeploy.
3. Confirm `https://ascentforsponsors.com/indexnow/<key>.txt` returns the key.
4. Run `INDEXNOW_KEY=<key> npm run indexnow` after every deploy that
   changes a page. It reads the live sitemap and submits every URL.

### 3. Create the entity everywhere the engines look (2–3 hours, once)

Answer engines corroborate an entity across independent sources before
they cite it. Use the **same** name, description, address and phone on
each — copy them from the "at a glance" block on the site. Then add every
profile URL to the right place in content so the structured data points at
them:

- **Company** profiles → `business.sameAs` in
  `content/verticals/sponsors.ts` (and `general.ts`).
- **Caleb's personal** profiles → `profiles.links` in
  `content/people/caleb-free.ts`. That array is empty on purpose; filling
  it renders the Profiles section on
  [ascentcas.com/caleb-free](https://ascentcas.com/caleb-free) and emits
  `sameAs` on the Person. **Paste the LinkedIn personal profile first.**

`ascentcas.com/caleb-free` is the authoritative page about the founder:
ProfilePage + Person structured data, with a Person `@id` that the
Organization node on both domains and every guide byline point at, so the
mentions merge into one entity rather than competing. It is linked from
both footers and listed in the brand sitemap. If a fact about him changes,
change it there first.

Independent coverage counts double here, because it is not self-published.
The page already cites Oklahoma City Community College's March 2025 profile
of him (`press` in the content module, emitted as `subjectOf` on the
Person). Add any podcast appearance or trade article the same way — and
where the publisher will do it, ask them to link back to
ascentcas.com/caleb-free so the reference is mutual.

- **LinkedIn personal profile** — the single most valuable `sameAs` for a
  person entity. Job title "Founder, Ascent Client Acquisition Systems",
  and link ascentcas.com/caleb-free from it so the reference is mutual.
- **LinkedIn company page** for Ascent Client Acquisition Systems —
  the business plan already names LinkedIn as the only social channel.
  Website `https://ascentforsponsors.com`, specialty "Investor acquisition
  for 506(c) real estate sponsors". Then the founder's LinkedIn profile
  lists this as current role.
- **Google Business Profile** — Oklahoma City, category "Marketing agency"
  (or "Marketing consultant"), service area = United States, website
  = the sponsor domain, phone 580-304-8470. Even for a remote firm this is
  the single strongest local-entity signal Google has, and it feeds
  Gemini. Add the description from the at-a-glance block.
- **Bing Places** — same details (imports from Google Business Profile).
- **Crunchbase** organization profile; **Clutch** and **G2** agency
  listings; **Apple Business Connect** if you want Siri/Apple Maps.
- **Oklahoma Secretary of State** already lists the LLC — make sure the
  registered name matches `legalName` exactly (it does:
  "Ascent Client Acquisition Systems LLC").

### 4. Get mentioned where sponsors already are (ongoing — the real lever)

Google's AI Overviews and every answer engine draw heavily on the sources
that already have authority in a niche. For this one they are: GowerCrowd,
BiggerPockets, the syndication podcasts, LinkedIn, and a handful of
Reddit threads. A mention there is worth more than anything else on this
list. The business plan already names the moves:

- **The case study.** One named sponsor, real cost-per-appointment-held
  numbers, agreed reference calls. Publish it as a guide (the guide type
  supports it) and pitch it to GowerCrowd and to podcasts. Nothing else
  compounds like this.
- **Founder-authored LinkedIn**, weekly: the four numbers, the arithmetic
  in the cost guide, the verification letter. Link the guides, not the
  home page.
- **Guest pieces and podcasts** on the three topics the plan named: speed
  to lead in investor acquisition, verification after March 2025, and
  what the 2% costs. The guides are the drafts.
- **Answer questions** on BiggerPockets and r/realestateinvesting /
  r/CommercialRealEstate where sponsors ask about 506(c) marketing — a
  real answer with a link to the relevant guide.
- **Securities attorneys.** Every firm that writes syndication PPMs has a
  resources page. The 506(b)/506(c) and verification guides are the kind
  of thing they link to; ask.

### 5. Keep the content moving (monthly, 1–2 hours)

- Update a guide when the facts change (a new SEC letter, a new
  benchmark), bump its `updated` date — that is the sitemap `lastmod` — and
  run `npm run indexnow`.
- Add a guide whenever a scoping call surfaces a question the site does
  not answer. Register it in `content/guides/index.ts` and it appears in
  the sitemap, llms.txt, the guides section, the footer and the schema
  automatically.
- Candidates already on the list: the case study; "how to brief securities
  counsel on a 506(c) ad campaign" (the nine-condition gate, written up);
  "what a good weekly investor-acquisition report looks like"; a
  multifamily-specific version of the how-to guide.

### 6. Measure (monthly, 15 min)

- Search Console → Performance → filter by page. Watch impressions for the
  query groups above; clicks follow.
- Search for the head queries in Google, ChatGPT, Perplexity and Gemini
  and note which sources they cite. If a competitor's page is cited for a
  query one of the guides answers better, the gap is usually (a) an
  external mention or (b) a more direct first paragraph. Fix (b) yourself;
  (a) is step 4.
- Vercel Web Analytics → referrers. Traffic from `chatgpt.com`,
  `perplexity.ai`, `copilot.microsoft.com` and `gemini.google.com` shows
  up there.

---

## Environment variables

| Variable | Where | What |
|---|---|---|
| `GOOGLE_SITE_VERIFICATION` | Vercel | Search Console HTML-tag token(s), comma-separated. Optional if you verified by DNS. |
| `BING_SITE_VERIFICATION` | Vercel | Bing Webmaster `msvalidate.01` token(s), comma-separated. Optional if you imported from Search Console. |
| `INDEXNOW_KEY` | Vercel **and** locally when running `npm run indexnow` | The IndexNow key. Serves `/indexnow/<key>.txt`. |

## Checklist

- [ ] Search Console verified (DNS TXT) · sitemap submitted · 10 URLs requested
- [ ] Bing Webmaster imported · sitemap submitted
- [ ] `INDEXNOW_KEY` set on Vercel · `npm run indexnow` run once
- [ ] LinkedIn company page · founder profile updated
- [ ] Google Business Profile · Bing Places
- [ ] Crunchbase · Clutch · G2
- [ ] Company profile URLs added to `business.sameAs`
- [ ] Personal profile URLs added to `profiles.links` in `content/people/caleb-free.ts`
- [x] A photograph of Caleb in `/public/people`, wired to `image` in that same file
- [ ] Ask OCCC to link ascentcas.com/caleb-free from their March 2025 article about him
- [ ] Case study published as a guide
- [ ] First three guest pieces / podcast pitches sent
- [ ] Monthly: Search Console review · cite check in four engines
