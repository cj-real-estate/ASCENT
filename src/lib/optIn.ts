import { deliverLeadToGhl } from "./ghl";
import { postLeadWebhook } from "./leadSink";

/*
 * Delivering a standalone SMS opt-in.
 *
 * Two pages collect one, and they arrive by different routes: /sms posts
 * JSON to /api/sms-optin, and /sms-opt-in on the sponsor domain posts a
 * native form to /api/book because it has to work with JavaScript off.
 * Both end here, so the CRM record, the tags and the proof of consent are
 * identical whichever page the person used — which is the point: a carrier
 * asking how a number opted in should get the same answer either way.
 *
 * Both sinks are bounded and swallow their own failures; this returns
 * whether at least one accepted the opt-in. Unlike a gate submission there
 * is no calendar to fall through to, so the caller must tell the visitor
 * honestly when nothing took it.
 */
export interface OptInRecord {
  name: string;
  company: string;
  phone: string;
  email: string;
  /** Which page collected it — "sms" | "sms-opt-in". */
  page: string;
  smsConsentTransactional: boolean;
  smsConsentMarketing: boolean;
  /** The vertical's `smsCallName`, for quoting the sentence that was shown. */
  smsCallName: string;
  receivedAt: string;
}

const INTEREST = "SMS updates";
const VERDICT = "SMS OPT-IN" as const;

export async function deliverOptIn(record: OptInRecord): Promise<boolean> {
  const results = await Promise.allSettled([
    deliverLeadToGhl({
      name: record.name,
      company: record.company,
      phone: record.phone,
      email: record.email,
      page: record.page,
      interest: INTEREST,
      verdict: VERDICT,
      qualified: null,
      answers: {},
      answerLines: [],
      smsConsentTransactional: record.smsConsentTransactional,
      smsConsentMarketing: record.smsConsentMarketing,
      smsCallName: record.smsCallName,
      receivedAt: record.receivedAt,
    }),
    postLeadWebhook({
      verdict: VERDICT,
      name: record.name,
      company: record.company,
      phone: record.phone,
      email: record.email,
      page: record.page,
      interest: INTEREST,
      answers: {},
      smsConsentTransactional: record.smsConsentTransactional,
      smsConsentMarketing: record.smsConsentMarketing,
      receivedAt: record.receivedAt,
    }),
  ]);
  return results.some((result) => result.status === "fulfilled" && result.value);
}
