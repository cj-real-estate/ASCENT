# Leads → Google Sheet + email, in ~5 minutes

Every form submission (qualified or not) can flow into the **Ascent Leads**
Google Sheet and trigger an email to you — no third-party service, just a
small script attached to the sheet, running as your own Google account.

The sheet already exists in your Drive (calebjfree@gmail.com):
**Ascent Leads** →
https://docs.google.com/spreadsheets/d/1UI0fPH1ePR5hLGCco24o5AaS0_y0CgNcS8MQEFkkB5c/edit

## 1. Attach the script

1. Open the sheet → **Extensions → Apps Script**.
2. In the sheet itself, add **Interest** as the header of the next empty
   column (N1) — the script writes which CTA the lead clicked (pipeline
   audit vs strategy call) there.
3. Delete whatever is in the editor and paste the script below.
3. Replace `PASTE-A-LONG-RANDOM-STRING-HERE` with a random string
   (e.g. run `openssl rand -hex 24` or mash the keyboard — just make it long).
   Keep a copy; Vercel needs the same value in step 3.

```javascript
// Appends each lead to the sheet and emails the owner. Runs as your
// Google account; the secret keeps strangers from posting junk rows.
const SECRET = "PASTE-A-LONG-RANDOM-STRING-HERE";
const NOTIFY_EMAIL = "caleb@ascentcas.com";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.secret !== SECRET) {
    return ContentService.createTextOutput("nope");
  }
  const a = data.answers || {};
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
    new Date(),
    data.verdict || "",
    data.name || "",
    data.company || "",
    data.phone || "",
    data.email || "",
    data.page || "",
    a.businessType || "",
    a.estimatesPerMonth || "",
    a.leadHistory || "",
    a.monthlyRevenue || "",
    a.investment || "",
    a.decisionMaker || "",
    data.interest || "",
  ]);
  const subject =
    (data.verdict === "QUALIFIED"
      ? "Qualified lead — "
      : data.verdict === "BELOW ICP"
        ? "Lead (below ICP) — "
        : "Lead — ") + (data.name || "unknown");
  const lines = [
    "Name: " + (data.name || ""),
    "Company: " + (data.company || ""),
    "Phone: " + (data.phone || ""),
    "Email: " + (data.email || ""),
    "Page: " + (data.page || ""),
    "Wants: " + (data.interest || ""),
    "",
  ];
  for (const k in a) lines.push(k + ": " + a[k]);
  lines.push("", "Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join("\n"));
  return ContentService.createTextOutput("ok");
}
```

## 2. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Gear icon → type **Web app**.
3. *Execute as*: **Me**. *Who has access*: **Anyone**. (Required so the
   website's server can POST to it; the secret is what keeps it private.)
4. **Deploy**, authorize when Google asks, and **copy the Web app URL**
   (ends in `/exec`).

> Changing the script later? You must **Deploy → Manage deployments →
> edit → New version**, or the live URL keeps running the old code.

## 3. Point the site at it

Vercel → the ascent project → **Settings → Environment Variables**, all
environments:

| Key | Value |
|---|---|
| `LEADS_WEBHOOK_URL` | the `/exec` URL from step 2 |
| `LEADS_WEBHOOK_SECRET` | the same random string from step 1 |

Then **redeploy** (Deployments → ⋯ → Redeploy).

## 4. Test it

Submit the form on ascentcas.com/apply with your own info. Within a few
seconds: a new row in the sheet, and an email at caleb@ascentcas.com. Or
test the script directly:

```bash
curl -L -X POST 'YOUR-EXEC-URL' \
  -H 'Content-Type: application/json' \
  -d '{"secret":"YOUR-SECRET","verdict":"QUALIFIED","name":"Test","company":"Test Co","phone":"(405) 555-0123","email":"t@t.co","page":"general","answers":{"estimatesPerMonth":"25–50"}}'
```

## Notes

- **The site never waits on the sheet.** The webhook has a 4-second cap and
  failures only log (`[LEAD_WEBHOOK_FAILED]` in Vercel function logs) — a
  broken sheet can't block a prospect from booking.
- Gmail's consumer quota is ~100 script emails/day — far above form volume.
- This runs alongside the Resend email leg (`RESEND_API_KEY` etc.). With
  both configured you'd get two emails per lead; if you set up the sheet
  script, you can leave Resend unset and still get notified.
