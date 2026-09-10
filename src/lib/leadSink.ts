import { readEnv } from "./env";

/*
 * Second, independent lead sink: a Google Apps Script web app that appends
 * the lead to the "Ascent Leads" sheet and sends the owner a Gmail
 * notification (see docs/GOOGLE-SHEET-SETUP.md). Fire-and-forget with a
 * hard timeout — a slow or broken sheet must never block a prospect, so a
 * failure only logs. The shared secret is checked by the script; this is
 * routing, not authentication.
 */
export async function postLeadWebhook(record: {
  verdict: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  page: string;
  interest: string;
  answers: Record<string, string>;
  /** Whether the SMS consent box was ticked — a column in the sheet. */
  smsConsent: boolean;
  /** ISO receipt time, which is also the consent timestamp when consented. */
  receivedAt: string;
}): Promise<boolean> {
  const url = readEnv("LEADS_WEBHOOK_URL");
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.LEADS_WEBHOOK_SECRET ?? "",
        ...record,
      }),
      signal: AbortSignal.timeout(4000),
      // Apps Script answers through a redirect; follow it or the POST
      // reports failure even when the row landed.
      redirect: "follow",
    });
    if (!res.ok) {
      console.error("[LEAD_WEBHOOK_FAILED] status", res.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[LEAD_WEBHOOK_FAILED]", error);
    return false;
  }
}
