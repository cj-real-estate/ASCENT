# Connecting ascentforsponsors.com

The sponsor landing page is served by the **same Vercel project as
ascentcas.com** — `ascent`, under the team "CJ's projects". Connecting the
domain is two dashboard tasks (Vercel, then GoDaddy) plus one prerequisite:
the sponsor page has to be on `main`, because the domain serves whatever
production builds.

## Before you start

1. **The sponsor page must be on `main`** (merged 2026-09-08). Check:
   `https://ascentcas.com/sponsors` should load the sponsor page (headline
   "Investor meetings held, not just investor leads."). If it doesn't,
   production hasn't redeployed yet — wait for the Vercel build.
2. **Create the Calendly event the page embeds.** A qualified sponsor is
   shown a Calendly embed for a dedicated event that does not exist until
   you create it — until then they see Calendly's not-found page instead of
   a calendar. In Calendly (account `caleb-ascentcas`) → *Event Types* →
   *New event type* → one-on-one:
   - Name: **Scoping call** · Duration: **30 min**
   - URL slug: **`scoping-call`** — exactly, so the link is
     `calendly.com/caleb-ascentcas/scoping-call`. This is what
     `booking.schedulingLink` in `content/verticals/sponsors.ts` points at;
     if you pick a different slug, change it there too.
   - Description (optional): "Thirty minutes on your last raise's numbers,
     in dollars. Bring counsel if you like."
   Then open `https://calendly.com/caleb-ascentcas/scoping-call` in a
   private window and confirm it shows a calendar.
3. **Make sure `info@ascentforsponsors.com` exists and is monitored.** It is
   the contact address in the sponsor page's footer, privacy page and
   structured data. The site never sends to it, but sponsors will.
4. Open two tabs, **already logged in** — a browser agent can't get through
   a login or 2FA prompt:
   - **Vercel** — `vercel.com/dashboard`
   - **GoDaddy DNS for ascentforsponsors.com** —
     `dcc.godaddy.com/control/ascentforsponsors.com/dns`

No environment variables are involved. Nothing on the sponsor page needs a
secret that ascentcas.com doesn't already have.

Doing it by hand? Follow **Phase 3 → Phase 5** below yourself; they read the
same. Driving it with Claude for Chrome? Paste everything below the line.

---

You are adding a second, already-owned domain to an existing Vercel project
using the two tabs I have open. Work in the open tabs; don't open new
accounts or new services.

## Facts — use these, don't go looking for them

- Vercel team: **CJ's projects** · project: **`ascent`** (linked to GitHub
  `cj-real-estate/ASCENT`, production branch `main`). It already exists and
  already serves `ascentcas.com` — do not create a new project.
- Domain: **`ascentforsponsors.com`** — I already own it, registered at
  GoDaddy. It is currently parked there with domain forwarding on.
- The **apex** (`ascentforsponsors.com`) is canonical. `www` redirects to the
  apex, not the other way around.
- The domain should end up on the **same project as ascentcas.com**. The
  site's code decides what each host shows; nothing in Vercel needs to map
  the domain to a path.

## Hard rules

1. **Never type a DNS value from memory or general knowledge.** The only valid
   source for the A record's IP address and the CNAME target is what the
   Vercel Domains tab displays for *this project*. Read it there, copy it
   verbatim, then use it. Do not reuse a value you remember from
   ascentcas.com — read it fresh.
2. **Never touch MX records, or TXT records for SPF, DKIM, or DMARC.** The
   only records you may change are the `@` **A** record(s) and the `www`
   **CNAME**.
3. **Buy nothing.** Don't purchase a domain, upgrade a plan, or enable a paid
   add-on on either site. Decline every upsell. I already own this domain —
   if any flow offers to register or transfer it, you're in the wrong place.
4. **Do not touch `ascentcas.com`** — not its Vercel domain entry, not its
   DNS. You are adding a second domain, not changing the first.
5. **Stop and hand back to me** if you hit a login screen, 2FA prompt,
   CAPTCHA, or payment wall.
6. **Before any irreversible click** — Delete, Remove, Transfer, Disconnect —
   say what you're about to do and wait for me to confirm.
7. If the interface doesn't match what I describe below, don't improvise
   your way around it. Tell me what you actually see and ask.

## Phase 1 — Confirm the project

1. In the Vercel tab, open the project **`ascent`** under the team "CJ's
   projects". Confirm *Settings → Domains* already lists `ascentcas.com`.
   If it doesn't, stop and tell me — you may be in the wrong project.
2. Confirm the latest production deployment is green. If it is red, stop and
   paste me the error — do not try to fix the code.

## Phase 2 — Confirm the sponsor page is live on production

Open a new tab and load `https://ascentcas.com/sponsors`. It should show the
headline "Investor meetings held, not just investor leads." If it 404s or
shows the brand page instead, **stop**: production hasn't picked up the
sponsor page yet, and adding the domain now would put the wrong page on it.
Tell me.

## Phase 3 — Add the domain in Vercel

1. Project → *Settings* → *Domains*.
2. Add **`ascentforsponsors.com`**.
3. Add **`www.ascentforsponsors.com`**, configured to **redirect to
   `ascentforsponsors.com`**. Vercel may offer to add the `www` variant when
   you add the apex and ask which is primary — the **apex is primary**.
4. Vercel will now show the DNS records it wants, and mark the domain
   *Invalid Configuration*. That's expected at this stage.
5. **This is the important step:** read the records off the screen and report
   them to me exactly as displayed, before you change anything at GoDaddy:
   - the **A** record value for the apex (an IP address)
   - the **CNAME** target for `www`
   If Vercel shows something other than an A record for the apex —
   nameserver instructions, for example — stop and tell me.

## Phase 4 — GoDaddy DNS

Switch to the GoDaddy tab, on the DNS records page for
`ascentforsponsors.com`.

1. **First, turn off Forwarding.** This domain currently forwards to
   GoDaddy's parking page. Find the *Forwarding* section and remove or
   disable the forward. Forwarding injects its own records and will fight
   Vercel.
2. **Fix the `@` A record(s).** A parked GoDaddy domain ships with `@`
   pointing at GoDaddy's parking IPs — this one currently has **two** A
   records on `@`. You want exactly **one** `@` A record whose value is the
   IP Vercel showed you in Phase 3. Edit one to that value and delete the
   other (say what you're deleting first, per rule 6). TTL 600 seconds if it
   is editable. Save.
3. **Point `www` at Vercel.** `www` is currently a CNAME to the apex. Edit it
   so its value is the CNAME target from Phase 3. TTL 600. Save.
4. **Leave everything else alone.** Don't delete an `_domainconnect` CNAME if
   you see one — it's harmless. Re-read rule 2 before you touch anything
   that isn't `@` A or `www` CNAME.
5. Report back the final state of just those records.

## Phase 5 — Verify

1. Back in the Vercel *Domains* tab, use the refresh / re-check control.
2. Wait for both entries to show **Valid Configuration**. Usually a few
   minutes; can be longer on GoDaddy's default TTL. If it hasn't flipped
   after about 10 minutes of re-checking, stop and tell me the exact status
   text — don't start changing records again.
3. SSL certificates provision automatically once DNS resolves. Don't click
   anything to force it.
4. Once valid, open a new tab and check all five:
   - `https://ascentforsponsors.com` — loads, headline reads "Investor
     meetings held, not just investor leads."
   - `https://www.ascentforsponsors.com` — redirects to the apex
   - `https://ascentforsponsors.com/robots.txt` — the `Sitemap:` line names
     `https://ascentforsponsors.com/sitemap.xml`
   - `https://ascentforsponsors.com/privacy` — loads the privacy page
   - `https://ascentcas.com` — still loads the brand page, unchanged
5. Give me a final summary: the DNS records as they now stand, the domain
   status in Vercel, and the result of each of the five checks.
6. (For me, not the agent.) Run the gate end to end once: answer the six
   questions with qualifying answers and confirm the Calendly calendar
   appears — that proves the `scoping-call` event exists and the embed
   domain is right.

## Don't do these

- Don't change nameservers. The apex A + www CNAME approach keeps everything
  else on the domain intact; nameserver delegation would move all DNS to
  Vercel.
- Don't set env vars or handle any API key — none are needed for this.
- Don't submit anything to Google, set up analytics, or "optimize" anything.
- Don't edit repository code or push commits.
