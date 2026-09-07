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

### Making something happen automatically

In GHL: **Automation → Workflows → Create Workflow → Contact Tag Added**, tag
`qualified`. From there assign the contact to a setter, start a call task, or
send yourself a notification. Build a second one on `below icp` if you want
those nurtured differently.

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

Vercel → your project → **Logs**, filter to `/api/book`. The integration logs
a labelled line with GHL's own reason on any failure:

| Log label            | Meaning                                                        |
| -------------------- | -------------------------------------------------------------- |
| `GHL_UPSERT_FAILED`  | contact not created — usually a bad token, missing scope, or wrong Location ID. The status and GHL's message are in the line. |
| `GHL_NOTE_FAILED`    | contact WAS created, only the answers note failed              |
| `GHL_WEBHOOK_FAILED` | Path B URL unreachable or rejected                             |

No GHL lines at all means the env vars aren't set on the deployment that's
serving traffic — check you redeployed after adding them.

Leads are never lost to a GHL problem: the email leg and the Google Sheet leg
(`docs/GOOGLE-SHEET-SETUP.md`) run independently, and a qualified prospect
still reaches the calendar regardless.

> `GHL_API_BASE` also exists. It's a development-only override for testing
> against a mock server — leave it unset in production.
