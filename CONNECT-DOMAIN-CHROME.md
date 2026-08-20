# Connecting ascentcas.com with Claude for Chrome

## Before you start

Open two tabs and make sure you're **already logged in** to both — a browser
agent can't get through a login or 2FA prompt:

1. **Vercel** — `vercel.com/dashboard`
2. **GoDaddy DNS for ascentcas.com** — `dcc.godaddy.com/control/ascentcas.com/dns`

**Skip the environment variables.** They include your Resend API key, and you
shouldn't paste a live secret into a chat with any agent. Add those yourself in
Vercel → Settings → Environment Variables (they're listed in `DEPLOY.md`
step 2) — before you send anyone to the site, or the booking form silently
drops leads.

Then paste everything below the line into Claude for Chrome.

---

You are connecting an already-owned domain to a Vercel project using the two
tabs I have open. Work in the open tabs; don't open new accounts or new
services.

## Facts — use these, don't go looking for them

- GitHub repo: `cj-real-estate/ASCENT`
- Vercel project name: `ascent` (may or may not exist yet)
- Production branch: **`main`**
- Domain: **`ascentcas.com`** — I already own it, registered at GoDaddy
- The **apex** (`ascentcas.com`) is canonical. `www` redirects to the apex,
  not the other way around.

## Hard rules

1. **Never type a DNS value from memory or general knowledge.** The only valid
   source for the A record's IP address and the CNAME target is what the
   Vercel Domains tab displays for *this project*. Read it there, copy it
   verbatim, then use it. If you catch yourself recalling a Vercel IP address,
   stop — that's the failure mode this rule exists to prevent.
2. **Never touch MX records, or TXT records for SPF, DKIM, or DMARC.** Email
   runs on those, and breaking them fails silently. The only records you may
   change are the `@` **A** record and the `www` **CNAME**.
3. **Buy nothing.** Don't purchase a domain, upgrade a plan, or enable a paid
   add-on on either site. Decline every upsell. I already own this domain — if
   any flow offers to register or transfer it, you're in the wrong place.
4. **Stop and hand back to me** if you hit a login screen, 2FA prompt, CAPTCHA,
   or payment wall.
5. **Before any irreversible click** — Delete, Remove, Transfer, Disconnect —
   say what you're about to do and wait for me to confirm.
6. If the interface doesn't match what I describe below, don't improvise your
   way around it. Tell me what you actually see and ask.

## Phase 1 — Vercel project

1. In the Vercel tab, look for an existing project named `ascent` (or any
   project linked to `cj-real-estate/ASCENT`).
2. **If it exists**, open it and go to Phase 2.
3. **If it doesn't exist**, create it: *Add New* → *Project* → import
   `cj-real-estate/ASCENT` from GitHub. If Vercel can't see the repo, use
   *Adjust GitHub App Permissions* to grant access to it. Leave the framework
   preset (it should detect **Next.js**), build command, output directory, and
   root directory at their defaults. Deploy, and wait for the build to finish.
4. Report the deployment result. If the build **fails**, stop and paste me the
   error — do not try to fix the code.

## Phase 2 — Production branch

GitHub's default branch for this repo is `claude/ascent-general-landing-gal982`,
which is not what production should build from.

1. Go to the project's *Settings* → *Git*.
2. Set **Production Branch** to `main`. Save.
3. Tell me what it was set to before you changed it.

## Phase 3 — Add the domain in Vercel

1. Go to the project's *Settings* → *Domains*.
2. Add **`ascentcas.com`**.
3. Add **`www.ascentcas.com`**, configured to **redirect to `ascentcas.com`**.
   Vercel may offer to add the `www` variant automatically when you add the
   apex, and may ask which one is primary — the **apex is primary**.
4. Vercel will now show the DNS records it wants, and mark the domain
   *Invalid Configuration*. That's expected at this stage.
5. **This is the important step:** read the records off the screen and report
   them to me exactly as displayed, before you change anything at GoDaddy:
   - the **A** record value for the apex (an IP address)
   - the **CNAME** target for `www`
   If Vercel shows something other than an A record for the apex — nameserver
   instructions, for example — stop and tell me instead of proceeding.

## Phase 4 — GoDaddy DNS

Switch to the GoDaddy tab, on the DNS records page for `ascentcas.com`.

1. **First, check Forwarding.** If domain forwarding is on, turn it off.
   GoDaddy's forwarding injects its own records and will fight Vercel.
2. **Edit the existing `@` A record — don't add a second one.** A parked
   GoDaddy domain ships with an `@` A record pointing at GoDaddy's parking IP.
   Change its **value** to the IP Vercel showed you in Phase 3. Set TTL to
   600 seconds (10 minutes) if it's editable. Save.
   - If there are *multiple* `@` A records, stop and list them for me.
3. **Point `www` at Vercel.** GoDaddy usually pre-creates `www` as a CNAME to
   `@`. Edit it so its value is the CNAME target from Phase 3. TTL 600. Save.
   If no `www` record exists, add one: type CNAME, name `www`.
4. **Leave everything else alone.** Don't delete an `_domainconnect` CNAME if
   you see one — it's harmless. And re-read rule 2 before you touch anything
   that isn't `@` A or `www` CNAME.
5. Report back the final state of just those two records.

## Phase 5 — Verify

1. Back in the Vercel *Domains* tab, use the refresh / re-check control.
2. Wait for both entries to show **Valid Configuration**. This usually takes a
   few minutes but can take longer on GoDaddy's default TTL. If it hasn't
   flipped after about 10 minutes of re-checking, stop and tell me the exact
   status text and any error Vercel shows — don't start changing records again.
3. SSL certificates provision automatically once DNS resolves. Don't click
   anything to force it.
4. Once valid, open a new tab and check all four:
   - `https://ascentcas.com` — loads, headline reads "You don't have a lead
     problem. You have a lead-handling problem."
   - `https://www.ascentcas.com` — redirects to the apex
   - `https://ascentcas.com/fence` — loads a fence-specific version
   - The calculator on the homepage shows a dollar figure and updates when you
     drag a slider
5. Give me a final summary: the two DNS records as they now stand, the domain
   status in Vercel, and the result of each of the four checks.

## Don't do these

- Don't set env vars or handle any API key — I'm doing that separately.
- Don't change nameservers. The apex A + www CNAME approach keeps my email
  working; nameserver delegation would move all DNS to Vercel and break it.
- Don't submit anything to Google, set up analytics, or "optimize" anything.
- Don't edit repository code or push commits.
