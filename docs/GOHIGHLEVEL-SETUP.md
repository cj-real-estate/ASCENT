# Send website leads into GoHighLevel

Every form submission on the site can flow straight into GHL. There are two
independent ways to receive them; **Path A alone is enough**, and it needs no
workflow built first. Turn on Path B as well if you want the raw answers
mapped into your own custom fields.

Both are optional. With neither configured the site behaves exactly as it
does today, and if GHL is ever down or misconfigured **the lead still goes
through** — a prospect never sees an error because a CRM was unreachable.

---

## Path A — contacts land in GHL directly (recommended)

### 1. Create a Private Integration token

1. In GHL, go to **Settings → Private Integrations**.
2. **Create new integration**. Name it `Ascent Website`.
3. Enable these scopes:
   - **Contacts — Read**
   - **Contacts — Write**
4. Create it and copy the token. It starts with `pit-`. GHL shows it once.

### 2. Find your Location ID

**Settings → Business Profile** — it's listed as *Location ID* (it's also the
long ID in your GHL URL after `/location/`).

### 3. Add both to Vercel

Vercel → the **ASCENT** project → **Settings → Environment Variables**. Add:

| Name              | Value                     |
| ----------------- | ------------------------- |
| `GHL_API_TOKEN`   | the `pit-…` token         |
| `GHL_LOCATION_ID` | your Location ID          |

Apply to **Production** (and Preview if you want test submissions to land).
Then **Deployments → ⋯ → Redeploy** — env vars only take effect on a new build.

### 4. Test it

Submit the form on the live site with your own details. Within a few seconds
the contact appears in **Contacts**, tagged, with a note holding every answer.

---

## What arrives on the contact

**Fields:** first name, last name, email, phone, company, and
source `Website — ascentcas.com`.

**Tags** — these are how you drive automations:

| Tag                      | Meaning                                       |
| ------------------------ | --------------------------------------------- |
| `website lead`           | every submission                              |
| `qualified` / `below icp`| the ICP gate's verdict                        |
| `page: general` / `page: fence` | which page they came from              |
| `strategy call`          | the offer they asked for                      |

**A note** on the contact with the company, the offer, the page, and every
gate question with the answer they chose.

Because the site uses **upsert**, someone who submits twice updates the same
contact instead of creating a duplicate.

---

## Getting notified when a lead comes in

**This is how you find out about leads.** The site sends no email of its own —
there is no Resend, no SMTP, no transactional provider. A GHL workflow does
it, which means the notification links straight to the contact record and
there is no second service to pay for, key to rotate, or sending domain to
verify.

Build it once:

1. **Automation → Workflows → Create Workflow → Start from Scratch.**
2. Add trigger: **Contact Tag Added**. Set the tag to `website lead` — every
   submission carries it, qualified or not. (Filter on `qualified` instead if
   you only want to hear about the ones who passed the gate. Getting both and
   reading the tag is the better default early on: a below-ICP lead you keep
   seeing is market information.)
3. Add action: **Send Internal Notification**.
   - **Notification type:** Email (add SMS as a second action if you want it
     on your phone).
   - **To:** `Assigned User` won't work before anyone is assigned — pick
     **Custom Email** and enter your own address.
   - **Subject:** `New website lead — {{contact.first_name}} {{contact.last_name}}`
   - **Body:** include the fields the site actually sets, e.g.

     ```
     {{contact.first_name}} {{contact.last_name}} — {{contact.company_name}}
     {{contact.phone}} · {{contact.email}}
     Tags: {{contact.tags}}
     Source: {{contact.source}}

     Open the contact for the gate answers (attached as a note).
     ```

4. **Settings → Allow Multiple** — leave OFF unless you want a repeat
   submitter to re-notify you. Upsert means the same person re-submitting
   re-adds the tag, so ON is a duplicate-notification switch.
5. **Publish** the workflow (top right). A saved-but-draft workflow never
   fires — this is the single most common reason "the workflow didn't work".

Then submit a real lead through the site and confirm the email arrives.

### The rest of the automations

Same trigger, more actions. On `qualified`: assign the contact to a setter,
create a call task, start the follow-up sequence. On `below icp`: nurture
them differently, or just let them sit in the CRM. Because the verdict is a
tag, you never have to parse anything to branch on it.

### If GHL is down

Nothing is lost and nobody is blocked. The Google Sheet leg
(`GOOGLE-SHEET-SETUP.md`) records the lead independently, a qualified
prospect still reaches the calendar, and if neither sink takes the lead the
route logs it as `[LEAD_UNDELIVERED]` in Vercel with the full details so you
can recover it by hand.

---

## Path B — inbound webhook (optional)

Use this when you want each gate answer mapped into its own **custom field**,
or you'd rather drive everything from a workflow.

1. **Automation → Workflows → Create Workflow**.
2. Add the trigger **Inbound Webhook**. Copy the URL it gives you.
3. Add it in Vercel as `GHL_WEBHOOK_URL`, then redeploy.
4. Submit one test lead so GHL captures a sample payload.
5. Back in the workflow, add **Create/Update Contact** and map the fields —
   GHL will now offer every key below in its field mapper.

Keys sent (all flat, so all mappable):

```
first_name, last_name, full_name, email, phone, company,
source, page, interest, verdict, qualified, tags,
answers_summary,
answer_businessType, answer_estimatesPerMonth, answer_leadHistory,
answer_monthlyRevenue, answer_investment, answer_decisionMaker
```

`answer_businessType` is only present on the brand page; the `/fence` page
doesn't ask it.

---

## If leads aren't arriving

### Start here: the self-check

Open **https://ascentcas.com/api/book** in a browser. It reports what the
deployment currently serving your traffic can actually see:

```json
{ "ok": true, "commit": "285076f",
  "leadDelivery": { "ghlContacts": true, "ghlApiToken": true,
                    "ghlLocationId": true, "ghlWebhook": false,
                    "googleSheet": true },
  "ghlEnvNamesSeen": ["GHL_API_TOKEN", "GHL_LOCATION_ID"] }
```

- **404 or no `leadDelivery` key** → the deployment is older than the GHL
  work. Redeploy from the latest `main`.
- **`ghlApiToken: false` or `ghlLocationId: false`** → that variable isn't
  reaching the function. Check `ghlEnvNamesSeen` in the same response: it
  lists the GHL variable names this deployment can actually see, so a
  misspelling is visible immediately. Otherwise it wasn't saved for the
  **Production** environment, or it was added *after* the current deployment
  was built — env vars only apply to builds made after they're saved, so
  **Deployments → ⋯ → Redeploy**.
- **Names are case-sensitive.** `GHL_API_Token` is a different variable from
  `GHL_API_TOKEN`. The code accepts a case variant so leads keep flowing, and
  logs `ENV_CASE` once per variable asking for the rename — but use the exact
  upper-case names and there's nothing to think about. `ghlEnvNamesSeen`
  lists the names this deployment can actually see — and a name present there
  while its boolean reads `false` means the variable exists but is empty.
- **`ghlContacts: true` but contacts still don't appear** → the credentials
  are visible and the call is being rejected. The reason is in the logs
  below, verbatim from GHL.

Nothing here reveals a secret — it's true/false plus the deployed commit.

### Then: the logs

Vercel → your project → **Logs**, filter to `/api/book`. The integration logs
a labelled line with GHL's own reason on any failure:

| Log label            | Meaning                                                        |
| -------------------- | -------------------------------------------------------------- |
| `GHL_UPSERT_FAILED`  | contact not created — usually a bad token, missing scope, or wrong Location ID. The status and GHL's message are in the line. |
| `GHL_NOTE_FAILED`    | contact WAS created, only the answers note failed              |
| `GHL_WEBHOOK_FAILED` | Path B URL unreachable or rejected                             |

`GHL_UPSERT_OK` is the success line — if you see it, the contact was created
and the problem is elsewhere (wrong sub-account, or you're looking at a
different location than `GHL_LOCATION_ID` points to).

`GHL_SKIPPED` means the deployment can't see the credentials at all; it names
which of the three are missing. Fix that before reading anything else.

Pasted values are normalised before use — surrounding whitespace, a trailing
newline, and a leading `Bearer ` on the token are all tolerated, so a sloppy
copy/paste is not the cause.

Leads are never lost to a GHL problem: the Google Sheet leg
(`GOOGLE-SHEET-SETUP.md`) runs independently, `[LEAD_UNDELIVERED]` carries
the lead into the log if nothing takes it, and a qualified prospect still
reaches the calendar regardless.

> `GHL_API_BASE` also exists. It's a development-only override for testing
> against a mock server — leave it unset in production.
