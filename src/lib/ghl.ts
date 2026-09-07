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
 * See docs/GOHIGHLEVEL-SETUP.md.
 */

/* Overridable only so the integration can be exercised against a mock in
 * development. Leave GHL_API_BASE unset everywhere else — production
 * must talk to GoHighLevel. */
const GHL_API_BASE =
  process.env.GHL_API_BASE ?? "https://services.leadconnectorhq.com";
/* GHL pins its v2 API by date header rather than URL path. */
const GHL_API_VERSION = "2021-07-28";
const TIMEOUT_MS = 4000;

/*
 * Environment values get pasted by hand into a dashboard, so they arrive with
 * stray whitespace or a newline more often than not — and a token with a
 * trailing "\n" fails auth in a way that looks exactly like a wrong token.
 * A pasted "Bearer pit-…" is the other common slip; strip the prefix rather
 * than sending "Bearer Bearer …".
 */
function readEnv(name: string): string {
  const exact = (process.env[name] ?? "").trim();
  if (exact) return exact;
  /*
   * Fall back to a case-insensitive match. Environment names are
   * case-sensitive, so a variable saved as "GHL_API_Token" is a DIFFERENT
   * variable from GHL_API_TOKEN and silently reads as unset — a trap with
   * no feedback and a real cost (leads that never reach the CRM). Accept it
   * so the integration works, and say so loudly enough that it gets renamed.
   */
  const match = Object.keys(process.env).find(
    (key) => key.toLowerCase() === name.toLowerCase(),
  );
  if (!match) return "";
  const value = (process.env[match] ?? "").trim();
  if (value) {
    console.warn(
      `[GHL_ENV_CASE] using "${match}" — rename it to "${name}" (names are case-sensitive)`,
    );
  }
  return value;
}

/* Names only, never values: which GHL-ish variables this deployment can
 * actually see. A casing or spelling slip is invisible in a boolean and
 * obvious the moment the real name is printed back. */
export function ghlEnvNamesSeen(): string[] {
  return Object.keys(process.env)
    .filter((key) => /^ghl[_-]/i.test(key))
    .sort();
}

function readToken(name: string): string {
  return readEnv(name).replace(/^Bearer\s+/i, "");
}

/** True when either GHL path has enough configuration to attempt a call. */
export function ghlConfigured(): {
  contactApi: boolean;
  token: boolean;
  location: boolean;
  webhook: boolean;
} {
  const token = Boolean(readToken("GHL_API_TOKEN"));
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
  verdict: "QUALIFIED" | "BELOW ICP" | "LEGACY FORM";
  /** null on the legacy form, which has no gate */
  qualified: boolean | null;
  /** question key → chosen option label */
  answers: Record<string, string>;
  /** "Question: Answer" lines, in the order the gate asked them */
  answerLines: string[];
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
  return tags;
}

function noteBody(lead: LeadRecord): string {
  return [
    `Website lead — ${lead.verdict}`,
    `Company: ${lead.company}`,
    `Wants: ${lead.interest}`,
    `Page: ${lead.page}`,
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

async function upsertContact(lead: LeadRecord): Promise<void> {
  const token = readToken("GHL_API_TOKEN");
  const locationId = readEnv("GHL_LOCATION_ID");
  if (!token || !locationId) return;

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
      return;
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
    return;
  }

  // The gate answers, attached to the contact the setter will actually open.
  // Best-effort: the contact already exists and is tagged, so a failed note
  // costs context, not the lead.
  if (!contactId) return;
  try {
    const res = await ghlFetch(`/contacts/${contactId}/notes`, token, {
      body: noteBody(lead),
    });
    if (!res.ok) await logFailure("GHL_NOTE_FAILED", res);
  } catch (error) {
    console.error("[GHL_NOTE_FAILED]", error);
  }
}

async function postInboundWebhook(lead: LeadRecord): Promise<void> {
  const url = readEnv("GHL_WEBHOOK_URL");
  if (!url) return;

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
        answers_summary: lead.answerLines.join("\n"),
        ...flatAnswers,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) await logFailure("GHL_WEBHOOK_FAILED", res);
  } catch (error) {
    console.error("[GHL_WEBHOOK_FAILED]", error);
  }
}

/*
 * Deliver one lead to whichever GHL paths are configured. Runs them
 * concurrently and never rejects — the caller awaits this only so the
 * serverless runtime can't freeze the request mid-flight.
 */
export async function deliverLeadToGhl(lead: LeadRecord): Promise<void> {
  const config = ghlConfigured();
  if (!config.contactApi && !config.webhook) {
    // Say so out loud: silence here used to be indistinguishable from a
    // deploy that never picked the code up.
    console.warn(
      "[GHL_SKIPPED] no GoHighLevel configuration visible to this deployment" +
        ` (token: ${config.token}, location: ${config.location}, webhook: ${config.webhook})`,
    );
    return;
  }
  if (!config.contactApi && (config.token || config.location)) {
    console.warn(
      "[GHL_SKIPPED] contact API needs BOTH GHL_API_TOKEN and GHL_LOCATION_ID" +
        ` (token: ${config.token}, location: ${config.location})`,
    );
  }
  await Promise.allSettled([upsertContact(lead), postInboundWebhook(lead)]);
}
