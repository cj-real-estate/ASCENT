# Connecting ascentcas.com

The site is built and pushed. What remains is account-level work in Vercel and
GoDaddy that has to be done from your logged-in accounts. Roughly 15 minutes,
plus DNS propagation.

Repo: `cj-real-estate/ASCENT` · production branch: `main`

> Driving this with Claude for Chrome instead of by hand? Use
> [`CONNECT-DOMAIN-CHROME.md`](CONNECT-DOMAIN-CHROME.md) — the same steps as a
> paste-ready prompt, with the guardrails a browser agent needs.

---

## 1. Import the repo into Vercel

1. Go to **vercel.com/new** → **Import Git Repository** → pick
   `cj-real-estate/ASCENT`. (If Vercel can't see it, click *Adjust GitHub App
   Permissions* and grant access to the repo.)
2. Framework preset auto-detects as **Next.js**. Leave the build command, output
   directory, and root directory at their defaults.
3. Deploy.

**Then set the production branch.** GitHub still has
`claude/ascent-general-landing-gal982` as the repo default, because it was the
first branch pushed to an empty repo. `main` now exists with identical code.
Do one of these:

- **Vercel** → project → *Settings* → *Git* → **Production Branch** → `main`, or
- **GitHub** → repo → *Settings* → *General* → *Default branch* → switch to `main`
  (then Vercel follows automatically).

Either way, production should build from `main`.

## 2. Environment variables

Vercel → project → *Settings* → *Environment Variables*. Add for **all**
environments (Production, Preview, Development):

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ascentcas.com` |
| `RESEND_API_KEY` | from resend.com → API Keys |
| `BOOKING_TO_EMAIL` | the inbox that should receive leads |
| `BOOKING_FROM_EMAIL` | a sender on a domain verified in Resend, e.g. `Ascent Website <hello@ascentcas.com>` |

> ⚠️ **Do this before you send anyone to the site.** Until `RESEND_API_KEY` and
> `BOOKING_TO_EMAIL` exist, the booking form still says thank-you to the
> visitor, but the lead is only written to the Vercel function log
> (`[BOOKING_ROUTE_UNCONFIGURED]`). Nothing reaches your inbox.

Redeploy after adding them (*Deployments* → ⋯ → *Redeploy*) — env vars are
baked in at build time.

## 3. Add the domain in Vercel

Vercel → project → *Settings* → *Domains*:

1. Add **`ascentcas.com`** (the apex — this is the canonical one; every
   canonical URL, the sitemap, and the JSON-LD point at the apex).
2. Add **`www.ascentcas.com`** and set it to **redirect to `ascentcas.com`**
   (Vercel offers this as a checkbox when you add it).

Vercel will immediately show the **exact DNS records** it wants, and mark the
domain *Invalid Configuration* until they exist. **Use the values Vercel shows
you** — they're authoritative and Vercel has changed its published apex IP
before. They'll look like:

- apex `ascentcas.com` → an **A** record pointing at a Vercel IP
- `www` → a **CNAME** pointing at `cname.vercel-dns.com`

Keep that tab open for step 4.

## 4. Point GoDaddy at Vercel

GoDaddy → **My Products** → `ascentcas.com` → **DNS** → *Manage DNS*
(direct: `dcc.godaddy.com/control/ascentcas.com/dns`).

1. **Turn off domain forwarding first** if it's on (*Forwarding* section).
   GoDaddy's forwarding injects its own records and will fight Vercel.
2. **Edit the existing `@` A record** — don't add a second one. A parked GoDaddy
   domain ships with an A record on `@` pointing at GoDaddy's parking IP.
   Change its value to the IP Vercel showed you. TTL: 600 seconds / 10 minutes.
3. **Edit or add the `www` CNAME** → value `cname.vercel-dns.com`, TTL 600.
   GoDaddy often pre-creates `www` as a CNAME to `@` — repoint it.
4. Delete any leftover parking records for `@` or `www` (GoDaddy sometimes adds
   an `_domainconnect` CNAME — that one is harmless, leave it).

> ⚠️ **Do not touch the MX records** or any `TXT` records for SPF/DKIM/DMARC.
> If you receive email at `@ascentcas.com`, deleting those silently breaks your
> email. Only `@` (A) and `www` (CNAME) should change.

**Alternative — full nameserver delegation.** You *can* instead point GoDaddy's
nameservers at `ns1.vercel-dns.com` / `ns2.vercel-dns.com`, which lets Vercel
configure everything automatically. Only do this if no email or other service
runs on the domain, because it moves **all** DNS — MX included — to Vercel, and
you'd have to recreate those records there.

## 5. Verify

- Vercel's *Domains* tab flips to **Valid Configuration** — usually a few
  minutes, up to a couple of hours on GoDaddy's default TTL.
- SSL provisions automatically once the records resolve. No action needed.
- Check all four: `ascentcas.com`, `www.ascentcas.com` (should 308 to the apex),
  `ascentcas.com/privacy`, and a form submission landing on `/thanks`.
- Send yourself a test lead and confirm it hits the inbox from step 2.

## 6. After it's live

- **Enable Web Analytics**: project → *Analytics* → *Enable*. The
  `@vercel/analytics` component is already in the app; it does nothing until the
  project-level toggle is on.
- **Outbound traffic goes to the apex, `ascentcas.com`.** This build is a
  single page: the fence pitch *is* `/`, driven by
  `content/verticals/fence.ts`. There is no `/fence` route — an earlier
  two-route build had one, and links to it will 404.
- **The `[DECISION]` placeholders are publicly visible** the moment the domain
  resolves. Phone and email are now filled in; what remains visible is
  `[NEEDS ATTRIBUTION LINE]` under the proof stats and the scheduling-embed
  placeholder in the booking section. That's deliberate — they're honest gaps
  rather than invented filler — but they're the first thing to fill in. The
  open items are listed at the bottom of README.md.
