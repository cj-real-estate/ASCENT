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
| `GHL_API_TOKEN` | GoHighLevel → Settings → Private Integrations (starts `pit-`) |
| `GHL_LOCATION_ID` | GoHighLevel → Settings → Business Profile |

`docs/GOHIGHLEVEL-SETUP.md` has the full walkthrough, including the workflow
that emails you when a lead arrives.

Optionally also `LEADS_WEBHOOK_URL` / `LEADS_WEBHOOK_SECRET` for the Google
Sheet backstop (`docs/GOOGLE-SHEET-SETUP.md`).

> ⚠️ **Do this before you send anyone to the site.** Until GoHighLevel is
> configured, the form still says thank-you and a qualified prospect still
> reaches the calendar, but the lead only reaches the Vercel function log
> (`[LEAD_UNDELIVERED]`, carrying the lead itself). Nothing notifies you.

Redeploy after adding them (*Deployments* → ⋯ → *Redeploy*) — env vars only
apply to builds made after they are saved.

### One trap worth knowing

**Names are case-sensitive.** `GHL_API_Token` is a different variable from
`GHL_API_TOKEN` and reads as unset — nothing errors, the lead simply never
reaches the CRM. The code accepts a case variant so leads keep flowing and
logs `ENV_CASE` once asking for the rename, but type the exact upper-case
name and there's nothing to think about.

### Checking it

Open **https://ascentcas.com/api/book**. It reports what the deployment
serving your traffic can actually see — booleans and the deployed commit, no
secrets:

```json
{ "ok": true, "commit": "354bec1",
  "leadDelivery": { "ghlContacts": true, "ghlApiToken": true,
                    "ghlLocationId": true, "ghlWebhook": false,
                    "googleSheet": true },
  "ghlEnvNamesSeen": ["GHL_API_TOKEN", "GHL_LOCATION_ID"] }
```

`ghlEnvNamesSeen` is the fast diagnosis: it lists the GHL variable names this
deployment can see. If one reads `false` but you know you saved it, the name
in that list is why — and a name that is present while the boolean is `false`
means the variable exists with an empty value.

If `ghlContacts` is `true` and leads still don't arrive, Vercel → **Logs** →
filter `/api/book`:

| Log label           | Meaning                                                     |
| ------------------- | ----------------------------------------------------------- |
| `GHL_UPSERT_OK`     | the contact was created — the problem is downstream (workflow, or you're looking at a different sub-account) |
| `GHL_UPSERT_FAILED` | GHL rejected it; its status and reason are quoted verbatim   |
| `GHL_SKIPPED`       | no credentials visible — names which are missing             |
| `LEAD_UNDELIVERED`  | nothing took the lead; the line carries the lead itself      |

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
