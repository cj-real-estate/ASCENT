import { NextResponse } from "next/server";
import { fence, general, verticals } from "@content/verticals";
import { deliverLeadToGhl, ghlConfigured, ghlEnvNamesSeen } from "@/lib/ghl";
import { postLeadWebhook } from "@/lib/leadSink";
import { deliverOptIn } from "@/lib/optIn";
import { CONSENT_FIELD_NAMES } from "@/components/SmsConsentFields";
import { readEnv } from "@/lib/env";

/*
 * Booking endpoint. Validates the contact fields (same rules as the client),
 * drops honeypot submissions silently, and hands the lead to GoHighLevel and
 * the Google Sheet — no SDK, no persistence, no cookies. The owner is
 * notified by a GHL workflow on the "website lead" tag, not by this route;
 * there is no transactional email service in the path any more. In
 * production, PII reaches the function log only in one case: no sink accepted
 * the lead, and logging it is the only way not to lose it (LEAD_UNDELIVERED).
 *
 * Two payload shapes arrive here:
 *
 *   current — { name, company, phone, email, vertical, answers } from the
 *   qualification gate. Every question the named vertical asks must be
 *   answered with one of the option labels that vertical actually offers,
 *   and the ICP verdict is recomputed here from the content module's
 *   `qualifies` flags. The client never sends a verdict and would not be
 *   believed if it did — the flags are the thresholds, and they live in
 *   content.
 *
 * Either shape may carry `smsConsentTransactional` and
 * `smsConsentMarketing` from the two optional consent boxes below the phone
 * field. They are separate permissions — confirmations and reminders for the
 * booked call, versus promotional messages — and neither is required or
 * validated. Each decides only whether the CRM contact gets that consent's
 * own tag and a timestamped record of the sentence that was shown
 * (src/lib/ghl.ts), so a texting workflow gated on one tag can never reach a
 * number that only agreed to the other. See docs/A2P-10DLC.md.
 *
 *   legacy — { name, company, phone, email, trade, estimates } from the old
 *   booking form, still posted by cached copies of pages that shipped before
 *   the gate. Validated and delivered exactly as it always was — but since
 *   delivery is its only outcome, it still fails honestly when nothing takes
 *   it, where a gate submission proceeds to the calendar regardless.
 *
 *   form-encoded — a NATIVE form post from /sms-opt-in, which is fully
 *   server-rendered and must work with JavaScript off, so it cannot send
 *   JSON. Handled first and separately below: it is an SMS opt-in, not a
 *   gate submission, and it answers with a 303 redirect back to the page
 *   rather than JSON, because the browser is navigating.
 */

export const runtime = "nodejs";
/* Never let this be evaluated at build time: the diagnostic below reads
 * environment variables, and a statically-rendered answer would report the
 * BUILD's view of them rather than the running deployment's. */
export const dynamic = "force-dynamic";

/*
 * Diagnostic — GET /api/book.
 *
 * "The lead never arrived" always reduces to two questions: is the
 * deployment serving traffic actually running the delivery code, and can
 * that code see its credentials? This answers both without a log dive.
 * Booleans and a short commit sha only — never a secret's value.
 */
export async function GET() {
  const ghl = ghlConfigured();
  return NextResponse.json({
    ok: true,
    commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7),
    leadDelivery: {
      /* The primary sink, and what fires the owner's notification workflow.
       * If this is false, nobody hears about a lead. */
      ghlContacts: ghl.contactApi,
      ghlApiToken: ghl.token,
      ghlLocationId: ghl.location,
      ghlWebhook: ghl.webhook,
      /* The independent backstop (docs/GOOGLE-SHEET-SETUP.md). */
      googleSheet: Boolean(readEnv("LEADS_WEBHOOK_URL")),
    },
    /* The exact variable names this deployment can see. A boolean can only
     * say "missing"; this says "you named it GHL_API_Token". */
    ghlEnvNamesSeen: ghlEnvNamesSeen(),
  });
}

const MAX_BODY_BYTES = 10_000;
const MAX_FIELD_LENGTH = 200;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s()\-.]+$/;

/* One message for every way the answer set can come back unusable — missing,
 * blank, or not a label this vertical offers. It says the one thing the
 * person can act on and nothing about which question failed. */
const INCOMPLETE_ANSWERS = "Answer every question.";

/* Slug → vertical, built from the registry so a vertical added later is
 * gated by its own questions without this route being edited. An unknown or
 * missing slug falls back to the brand page's question set. */
const VERTICALS_BY_SLUG = new Map(
  verticals.map((entry) => [entry.slug, entry]),
);

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

/*
 * A native <form> post from /sms-opt-in.
 *
 * That page is server-rendered with no client JavaScript — the whole point,
 * so A2P 10DLC review can see the fields and submit them with scripting off
 * — which means the body arrives form-encoded and the response has to be a
 * redirect the browser can follow, not JSON.
 *
 * Outcome rides back in the query string and the page renders it: `?ok=1`
 * on success, `?error=<code>` otherwise. `returnTo` says which page to go
 * back to and is checked to be a same-origin path, so this can never be
 * turned into an open redirect.
 */
const OPT_IN_ERRORS = {
  name: "name",
  phone: "phone",
  email: "email",
  undelivered: "undelivered",
} as const;

const SAFE_RETURN_TO = /^\/[A-Za-z0-9\-._~/]*$/;

function seeOther(path: string, query: string) {
  /* A relative Location, so the redirect lands on whichever host served
   * the request — the same route answers ascentcas.com and
   * ascentforsponsors.com. */
  return new Response(null, {
    status: 303,
    headers: { Location: `${path}?${query}`, "Cache-Control": "no-store" },
  });
}

async function handleFormPost(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Couldn't read the form.");
  }
  const read = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
  };

  const requested = read("returnTo");
  const returnTo =
    requested && SAFE_RETURN_TO.test(requested) && !requested.startsWith("//")
      ? requested
      : "/";
  const slug = read("vertical");
  const config = VERTICALS_BY_SLUG.get(slug) ?? general;

  // Honeypot filled: answer as though it worked, deliver nothing.
  if (read("website")) return seeOther(returnTo, "ok=1");

  const name = read("name");
  const company = read("company");
  const phone = read("phone");
  const email = read("email");
  /* Presence is consent: an unticked checkbox posts nothing at all. Neither
   * is required, so neither can fail this submission. */
  const smsConsentTransactional = form.get(CONSENT_FIELD_NAMES.transactional) !== null;
  const smsConsentMarketing = form.get(CONSENT_FIELD_NAMES.marketing) !== null;

  if (!name) return seeOther(returnTo, `error=${OPT_IN_ERRORS.name}`);
  if (!phone || !PHONE_CHARS_RE.test(phone) || phone.replace(/\D/g, "").length < 10) {
    return seeOther(returnTo, `error=${OPT_IN_ERRORS.phone}`);
  }
  if (email && !EMAIL_RE.test(email)) {
    return seeOther(returnTo, `error=${OPT_IN_ERRORS.email}`);
  }

  const receivedAt = new Date().toISOString();
  const delivered = await deliverOptIn({
    name,
    company,
    phone,
    email,
    page: slug ? `sms-opt-in:${slug}` : "sms-opt-in",
    smsConsentTransactional,
    smsConsentMarketing,
    smsCallName: config.smsCallName,
    receivedAt,
  });

  if (!delivered) {
    /* Delivery IS the outcome here, so a failure is told to the visitor
     * rather than swallowed. Logging the opt-in is the same deliberate PII
     * exception the gate makes: it is the only remaining copy. */
    console.error("[OPT_IN_UNDELIVERED]", {
      name,
      phone,
      email,
      smsConsentTransactional,
      smsConsentMarketing,
      receivedAt,
    });
    return seeOther(returnTo, `error=${OPT_IN_ERRORS.undelivered}`);
  }
  return seeOther(returnTo, "ok=1");
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  /* The no-JavaScript opt-in form. Checked before the JSON gate because a
   * native post can only be form-encoded. */
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    return handleFormPost(request);
  }
  if (!contentType.includes("application/json")) {
    return bad("Requests must be JSON.");
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return bad("Couldn't read the request body.");
  }
  if (raw.length > MAX_BODY_BYTES) {
    return bad("Request body is too large.", 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return bad("Requests must be JSON.");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return bad("Requests must be a JSON object.");
  }
  const body = parsed as Record<string, unknown>;

  // Only the known fields are ever read; anything extra is ignored.
  const name = readString(body, "name");
  const company = readString(body, "company");
  const phone = readString(body, "phone");
  const email = readString(body, "email");
  const estimates = readString(body, "estimates");
  const trade = readString(body, "trade");
  const verticalSlug = readString(body, "vertical");
  const honeypot = readString(body, "website");
  /* The two SMS opt-ins, read independently. Optional by design and never
   * validated: a missing or non-boolean value is simply "not consented",
   * which is the safe reading — the CRM tag that lets a texting workflow
   * run is only added when its own field is exactly true.
   *
   * `smsConsent` is the pre-split field name. A page cached from before the
   * two boxes shipped still posts it, and it was the MARKETING consent, so
   * that is where it lands. Remove the fallback once no deployment serves
   * the old bundle. */
  const smsConsentTransactional = body.smsConsentTransactional === true;
  const smsConsentMarketing =
    body.smsConsentMarketing === true || body.smsConsent === true;
  const receivedAt = new Date().toISOString();
  // Which CTA the visitor clicked. Unknown values collapse to the default
  // rather than erroring — it's routing metadata, not a gate input.
  // One offer today: everything is a strategy call. Old deployed pages may
  // still send interest: "audit" mid-deploy — same call, same label. The
  // field stays in the payload so a second offer can be tagged later.
  const interest = "Strategy call";

  // Honeypot filled: pretend success, send nothing. The fake verdict is
  // "below ICP" so a bot never sees a scheduling link.
  if (honeypot) {
    return NextResponse.json({ ok: true, qualified: false });
  }

  for (const [label, value] of [
    ["Name", name],
    ["Company", company],
    ["Phone", phone],
    ["Email", email],
    ["Trade", trade],
  ] as const) {
    if (value.length > MAX_FIELD_LENGTH) {
      return bad(`${label} must be ${MAX_FIELD_LENGTH} characters or fewer.`);
    }
  }

  if (!name) return bad("Name is required.");
  if (!company) return bad("Company is required.");
  if (!phone) return bad("Phone is required.");
  if (!PHONE_CHARS_RE.test(phone) || phone.replace(/\D/g, "").length < 10) {
    return bad("Enter a phone number with at least 10 digits.");
  }
  if (!email) return bad("Email is required.");
  if (!EMAIL_RE.test(email)) {
    return bad("Enter an email address like name@company.com.");
  }

  // `answers` present at all means the qualification payload. A malformed
  // value there is a failed submission, never a reason to fall back to the
  // legacy shape.
  const isQualification = "answers" in body;

  /* The vertical this submission came from, resolved once: the gate branch
   * scores answers against its questions, and both delivery legs need its
   * `smsCallName` to record which transactional consent sentence was on
   * screen. An unknown or missing slug falls back to the brand page. */
  const config = VERTICALS_BY_SLUG.get(verticalSlug) ?? general;

  let subject: string;
  let text: string;
  /* Echoed to the client so the gate can branch without ever holding the
   * `qualifies` flags. The scheduling link rides along ONLY on a qualifying
   * verdict — a declined response never contains it, so a declined visitor's
   * page never does either. */
  let gate: { qualified: boolean; schedulingLink?: string } | null = null;
  let gateAnswers: Record<string, string> = {};
  /* Readable "Question: Answer" lines, hoisted so the CRM leg below can
   * attach them to the contact. */
  let gateAnswerLines: string[] = [];

  if (isQualification) {
    const answers = body.answers;
    if (
      typeof answers !== "object" ||
      answers === null ||
      Array.isArray(answers)
    ) {
      return bad(INCOMPLETE_ANSWERS);
    }
    const submitted = answers as Record<string, unknown>;

    const answerLines: string[] = [];
    const answersByKey: Record<string, string> = {};
    let qualified = true;

    for (const question of config.qualification.questions) {
      const value = readString(submitted, question.key);
      // Exact match against a label this vertical actually offers. Anything
      // else — missing, blank, hand-edited, or copied from another vertical
      // — fails the submission rather than being scored as a miss.
      const option = question.options.find((item) => item.label === value);
      if (!option) return bad(INCOMPLETE_ANSWERS);
      answerLines.push(`${question.label}: ${option.label}`);
      answersByKey[question.key] = option.label;
      // AND across every question: one false flag is below ICP.
      if (!option.qualifies) qualified = false;
    }

    gateAnswers = answersByKey;
    gateAnswerLines = answerLines;
    gate = qualified
      ? {
          qualified,
          ...(config.booking.schedulingLink
            ? { schedulingLink: config.booking.schedulingLink }
            : {}),
        }
      : { qualified };

    subject = qualified
      ? `Qualified lead — ${name}`
      : `Lead (below ICP) — ${name}`;
    text = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Wants: ${interest}`,
      `SMS consent — reminders: ${smsConsentTransactional ? "yes" : "no"}, marketing: ${
        smsConsentMarketing ? "yes" : "no"
      }${smsConsentTransactional || smsConsentMarketing ? ` (${receivedAt})` : ""}`,
      "",
      ...answerLines,
      "",
      qualified
        ? "Verdict: QUALIFIED — send the calendar"
        : "Verdict: BELOW ICP — no call booked",
    ].join("\n");
  } else {
    // Accept the options offered by any vertical, so a page added later
    // doesn't start silently rejecting its own form.
    const knownOptions = new Set(
      verticals.flatMap((entry) => entry.booking.form.estimatesSelectOptions),
    );
    if (!knownOptions.has(estimates)) {
      return bad("Choose one of the estimate-volume options.");
    }

    subject = `Call request — ${name}, ${company}`;
    text = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      // Only present on trade-agnostic pages; useful market research.
      ...(trade ? [`Trade: ${trade}`] : []),
      `${fence.booking.form.estimatesSelectLabel}: ${estimates}`,
    ].join("\n");
  }

  const verdict: "QUALIFIED" | "BELOW ICP" | "LEGACY FORM" = gate
    ? gate.qualified
      ? "QUALIFIED"
      : "BELOW ICP"
    : "LEGACY FORM";
  const page = verticalSlug || "general";

  /* Every lead sink, awaited so the serverless runtime cannot freeze them
   * mid-flight and run together because neither depends on the other. Each
   * is bounded and swallows its own failures — they are where the lead is
   * KEPT, never a gate on the prospect reaching the calendar.
   *
   * GoHighLevel is the primary record and, via a workflow on the "website
   * lead" tag, what notifies the owner. The Google Sheet is the independent
   * backstop. There is no transactional email leg: a second service with its
   * own API key and domain verification bought nothing the CRM doesn't
   * already do. */
  const results = await Promise.allSettled([
    deliverLeadToGhl({
      name,
      company,
      phone,
      email,
      page,
      interest,
      verdict,
      qualified: gate ? gate.qualified : null,
      answers: gateAnswers,
      answerLines: gateAnswerLines,
      smsConsentTransactional,
      smsConsentMarketing,
      smsCallName: config.smsCallName,
      receivedAt,
    }),
    postLeadWebhook({
      verdict,
      name,
      company,
      phone,
      email,
      page,
      interest,
      answers: gateAnswers,
      smsConsentTransactional,
      smsConsentMarketing,
      receivedAt,
    }),
  ]);
  const delivered = results.some(
    (result) => result.status === "fulfilled" && result.value,
  );

  if (!delivered) {
    /* Nothing took the lead — no CRM contact, no sheet row, and so no
     * notification either. Writing it to the function log is the one
     * deliberate exception to the no-PII-in-logs rule: losing the lead is
     * worse than logging it, and this is the only remaining copy. */
    console.error("[LEAD_UNDELIVERED] no sink accepted this lead:", {
      subject,
      text,
    });
    /* A gate submission still proceeds on the server's verdict — a qualified
     * prospect must never be held back by our plumbing, and one who books is
     * caught by the calendar's own booking notification. A legacy form post
     * has no such second chance: delivery IS its only outcome, so failing
     * quietly would drop the lead with the visitor none the wiser. */
    if (!isQualification) {
      return bad(
        "Sending failed on our end. Try again in a minute, or call or email us instead.",
        502,
      );
    }
  }

  return NextResponse.json({ ok: true, ...gate });
}
