/*
 * GoHighLevel lead delivery.
 *
 * Two independent, optional paths — configure either or both:
 *
 *   1. Contact upsert (GHL_API_TOKEN + GHL_LOCATION_ID). Creates or updates
 *      the contact directly, tagged, with no workflow to build first. Upsert
 *      dedupes on email/phone inside the location, so a prospect who submits
 *      twice is one contact, not two. The gate answers ride along as a note.
 *
 *   2. Inbound webhook (GHL_WEBHOOK_URL). POSTs a FLAT payload to a workflow's
 *      Inbound Webhook trigger. Flat because GHL's field mapper only sees
 *      top-level keys — nested objects can't be mapped to custom fields.
 *
 * Neither may ever block a prospect. Every leg is bounded by a timeout and
 * every failure only logs: a CRM outage must not stop someone reaching the
 * calendar. Failures log status + response body so a misconfigured token or
 * location is diagnosable from the function log without guessing.
 *
 * This is also the notification path. There is no transactional email
 * service any more — a GHL workflow triggered on the "website lead" tag is
 * what tells the owner a lead came in, which is why delivery reports back
 * whether it succeeded.
 *
 * See docs/GOHIGHLEVEL-SETUP.md.
 */

import { SMS_CONSENT_LABEL } from "@content/compliance";
import { envNamesMatching, readEnv, readSecret } from "./env";

/* Overridable only so the integration can be exercised against a mock in
 * development. Leave GHL_API_BASE unset everywhere else — production
 * must talk to GoHighLevel. */
const GHL_API_BASE =
  process.env.GHL_API_BASE ?? "https://services.leadconnectorhq.com";
/* GHL pins its v2 API by date header rather than URL path. */
const GHL_API_VERSION = "2021-07-28";
const TIMEOUT_MS = 4000;

/* Names only, never values: which GHL-ish variables this deployment can
 * actually see. A casing or spelling slip is invisible in a boolean and
 * obvious the moment the real name is printed back. */
export function ghlEnvNamesSeen(): string[] {
  return envNamesMatching(/^ghl[_-]/i);
}

/** True when either GHL path has enough configuration to attempt a call. */
export function ghlConfigured(): {
  contactApi: boolean;
  token: boolean;
  location: boolean;
  webhook: boolean;
} {
  const token = Boolean(readSecret("GHL_API_TOKEN"));
  const location = Boolean(readEnv("GHL_LOCATION_ID"));
  return {
    contactApi: token && location,
    token,
    location,
    webhook: Boolean(readEnv("GHL_WEBHOOK_URL")),
  };
}

export interface LeadRecord {
  name: string;
  company: string;
  phone: string;
  email: string;
  /** Vertical slug the lead came from — "general" | "fence" */
  page: string;
  interest: string;
  verdict: "QUALIFIED" | "BELOW ICP" | "LEGACY FORM" | "SMS OPT-IN";
  /** null on the legacy form, which has no gate */
  qualified: boolean | null;
  /** question key → chosen option label */
  answers: Record<string, string>;
  /** "Question: Answer" lines, in the order the gate asked them */
  answerLines: string[];
  /**
   * Whether the visitor ticked the SMS consent box. The box is optional, so
   * false is the common, expected case — it means "do not text this number",
   * not "unknown". A2P 10DLC review can ask for proof of consent for any
   * number that was messaged, which is why the exact wording shown and the
   * time it was accepted go into the CRM note below rather than living only
   * in a boolean.
   */
  smsConsent: boolean;
  /** ISO timestamp the lead was received — the consent timestamp when consented. */
  receivedAt: string;
}

/* GHL stores first and last separately. One word means no last name — never
 * invent one, and never split on more than the first space (compound
 * surnames must stay whole). */
function splitName(full: string): { firstName: string; lastName: string } {
  const trimmed = full.trim().replace(/\s+/g, " ");
  const cut = trimmed.indexOf(" ");
  if (cut === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.slice(0, cut),
    lastName: trimmed.slice(cut + 1),
  };
}

/* Tags are how the CRM segments and how "Contact Tag Added" workflows fire,
 * so they carry the verdict — that is the whole point of the gate reaching
 * GHL at all. Lowercase and stable: GHL tags are case-insensitive but
 * display as first written, and drifting case makes filters miss. */
function leadTags(lead: LeadRecord): string[] {
  const tags = ["website lead", `page: ${lead.page}`];
  if (lead.qualified === true) tags.push("qualified");
  if (lead.qualified === false) tags.push("below icp");
  if (lead.interest) tags.push(lead.interest.toLowerCase());
  /* The tag an SMS workflow must filter on. Only a ticked box earns it, so
   * a workflow gated on "sms consent" can never text a number that did not
   * opt in — which is the whole point of collecting it. */
  if (lead.smsConsent) tags.push("sms consent");
  return tags;
}

/* Proof of consent, in the contact's own record: what was shown, that it
 * was accepted, and when. A boolean alone is not evidence if a carrier ever
 * asks how the number opted in. */
function consentLines(lead: LeadRecord): string[] {
  if (!lead.smsConsent) {
    return ["SMS consent: NOT GIVEN — do not send marketing texts."];
  }
  return [
    `SMS consent: GIVEN ${lead.receivedAt}`,
    `Consent shown: "${SMS_CONSENT_LABEL}"`,
  ];
}

function noteBody(lead: LeadRecord): string {
  return [
    `Website lead — ${lead.verdict}`,
    `Company: ${lead.company}`,
    `Wants: ${lead.interest}`,
    `Page: ${lead.page}`,
    "",
    ...consentLines(lead),
    ...(lead.answerLines.length ? ["", ...lead.answerLines] : []),
  ].join("\n");
}

async function ghlFetch(path: string, token: string, body: unknown) {
  return fetch(`${GHL_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

/* Log the response body, truncated — GHL puts the actual reason (bad
 * location, expired token, missing scope) in there, and without it a failure
 * is undebuggable from the log alone. */
async function logFailure(label: string, res: Response): Promise<void> {
  let detail = "";
  try {
    detail = (await res.text()).slice(0, 300);
  } catch {
    detail = "(body unreadable)";
  }
  console.error(`[${label}] status ${res.status}: ${detail}`);
}

async function upsertContact(lead: LeadRecord): Promise<boolean> {
  const token = readSecret("GHL_API_TOKEN");
  const locationId = readEnv("GHL_LOCATION_ID");
  if (!token || !locationId) return false;

  const { firstName, lastName } = splitName(lead.name);
  let contactId: string | null = null;

  try {
    const res = await ghlFetch("/contacts/upsert", token, {
      locationId,
      firstName,
      lastName,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      companyName: lead.company,
      source: "Website — ascentcas.com",
      tags: leadTags(lead),
    });
    if (!res.ok) {
      await logFailure("GHL_UPSERT_FAILED", res);
      return false;
    }
    const data: unknown = await res.json();
    const contact =
      data && typeof data === "object"
        ? (data as { contact?: { id?: unknown } }).contact
        : undefined;
    if (contact && typeof contact.id === "string") contactId = contact.id;
    // Positive confirmation. Without it a working integration and an
    // unconfigured one look identical in the log — which is exactly the
    // ambiguity that makes "no contact arrived" hard to diagnose.
    console.log(`[GHL_UPSERT_OK] contact ${contactId ?? "(id missing)"}`);
  } catch (error) {
    console.error("[GHL_UPSERT_FAILED]", error);
    return false;
  }

  // The gate answers, attached to the contact the setter will actually open.
  // Best-effort: the contact already exists and is tagged, so a failed note
  // costs context, not the lead.
  if (!contactId) return true;
  try {
    const res = await ghlFetch(`/contacts/${contactId}/notes`, token, {
      body: noteBody(lead),
    });
    if (!res.ok) await logFailure("GHL_NOTE_FAILED", res);
  } catch (error) {
    console.error("[GHL_NOTE_FAILED]", error);
  }
  return true;
}

async function postInboundWebhook(lead: LeadRecord): Promise<boolean> {
  const url = readEnv("GHL_WEBHOOK_URL");
  if (!url) return false;

  const { firstName, lastName } = splitName(lead.name);
  // Answers flattened to `answer_<key>` so each one is mappable to its own
  // custom field in the workflow's field mapper.
  const flatAnswers = Object.fromEntries(
    Object.entries(lead.answers).map(([key, value]) => [
      `answer_${key}`,
      value,
    ]),
  );

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        full_name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: "Website — ascentcas.com",
        page: lead.page,
        interest: lead.interest,
        verdict: lead.verdict,
        qualified: lead.qualified,
        tags: leadTags(lead).join(", "),
        sms_consent: lead.smsConsent,
        sms_consent_at: lead.smsConsent ? lead.receivedAt : "",
        sms_consent_text: lead.smsConsent ? SMS_CONSENT_LABEL : "",
        answers_summary: lead.answerLines.join("\n"),
        ...flatAnswers,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      await logFailure("GHL_WEBHOOK_FAILED", res);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[GHL_WEBHOOK_FAILED]", error);
    return false;
  }
}

/*
 * Deliver one lead to whichever GHL paths are configured. Runs them
 * concurrently and never rejects — the caller awaits this only so the
 * serverless runtime can't freeze the request mid-flight.
 *
 * Returns true when at least one path accepted the lead. GHL is now the
 * primary record AND what notifies the owner (a workflow on the "website
 * lead" tag), so the caller needs to know whether the lead actually landed
 * somewhere — a lead nobody hears about is the failure worth logging.
 */
export async function deliverLeadToGhl(lead: LeadRecord): Promise<boolean> {
  const config = ghlConfigured();
  if (!config.contactApi && !config.webhook) {
    // Say so out loud: silence here used to be indistinguishable from a
    // deploy that never picked the code up.
    console.warn(
      "[GHL_SKIPPED] no GoHighLevel configuration visible to this deployment" +
        ` (token: ${config.token}, location: ${config.location}, webhook: ${config.webhook})`,
    );
    return false;
  }
  if (!config.contactApi && (config.token || config.location)) {
    console.warn(
      "[GHL_SKIPPED] contact API needs BOTH GHL_API_TOKEN and GHL_LOCATION_ID" +
        ` (token: ${config.token}, location: ${config.location})`,
    );
  }
  const results = await Promise.allSettled([
    upsertContact(lead),
    postInboundWebhook(lead),
  ]);
  return results.some(
    (result) => result.status === "fulfilled" && result.value,
  );
}
