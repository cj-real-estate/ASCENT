import { NextResponse } from "next/server";
import { fence, general, verticals } from "@content/verticals";

/*
 * Booking endpoint. Validates the contact fields (same rules as the client),
 * drops honeypot submissions silently, and forwards the lead as a plain-text
 * email via the Resend HTTP API — no SDK, no persistence, no cookies. In
 * production, PII reaches the function log only in one case: the email leg
 * failed on a gate submission, and logging the lead is the only way not to
 * lose it (see recoverLead below).
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
 *   legacy — { name, company, phone, email, trade, estimates } from the old
 *   booking form, still posted by cached copies of pages that shipped before
 *   the gate. Validated and emailed exactly as it always was.
 */

export const runtime = "nodejs";

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
const VERTICALS_BY_SLUG = new Map(verticals.map((entry) => [entry.slug, entry]));

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

/*
 * Second, independent lead sink: a Google Apps Script web app that appends
 * the lead to the "Ascent Leads" sheet and sends the owner a Gmail
 * notification (see docs/GOOGLE-SHEET-SETUP.md). Fire-and-forget with a
 * hard timeout — a slow or broken sheet must never block a prospect, so a
 * failure only logs. The shared secret is checked by the script; this is
 * routing, not authentication.
 */
async function postLeadWebhook(record: {
  verdict: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  page: string;
  answers: Record<string, string>;
}): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return;
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
    }
  } catch (error) {
    console.error("[LEAD_WEBHOOK_FAILED]", error);
  }
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
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

  let subject: string;
  let text: string;
  /* Echoed to the client so the gate can branch without ever holding the
   * `qualifies` flags. The scheduling link rides along ONLY on a qualifying
   * verdict — a declined response never contains it, so a declined visitor's
   * page never does either. */
  let gate: { qualified: boolean; schedulingLink?: string } | null = null;
  let gateAnswers: Record<string, string> = {};

  if (isQualification) {
    const config = VERTICALS_BY_SLUG.get(verticalSlug) ?? general;
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

    subject = `Pipeline audit request — ${name}, ${company}`;
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

  // Sheet + Gmail notification. Awaited so the serverless runtime cannot
  // freeze it mid-flight, but bounded and non-blocking on failure.
  await postLeadWebhook({
    verdict: gate ? (gate.qualified ? "QUALIFIED" : "BELOW ICP") : "LEGACY FORM",
    name,
    company,
    phone,
    email,
    page: verticalSlug || "general",
    answers: gateAnswers,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BOOKING_TO_EMAIL;
  const fromEmail = process.env.BOOKING_FROM_EMAIL ?? "onboarding@resend.dev";

  /* The email is the lead RECORD, not the product. For gate submissions a
   * failed email leg must never block a qualified prospect from the
   * calendar: the lead is written to the function log for recovery (the one
   * deliberate exception to the no-PII-in-logs rule — losing the lead is
   * worse), the visitor proceeds on the server's verdict, and a qualified
   * lead who books is caught by Calendly's own booking notification anyway.
   * Legacy form posts keep the honest failure: the email IS their only
   * outcome, so pretending success would silently drop the lead. */
  const recoverLead = () => {
    console.error("[LEAD_EMAIL_FAILED] recover from this log entry:", {
      subject,
      text,
    });
    return NextResponse.json({ ok: true, ...gate });
  };

  if (!apiKey || !toEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[/api/book] email not configured — payload:", {
        subject,
        text,
      });
      return NextResponse.json({ ok: true, ...gate });
    }
    if (isQualification) return recoverLead();
    return bad("Booking isn't wired up yet — call or email us instead.", 503);
  }

  let sendResponse: Response | null = null;
  try {
    sendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject,
        text,
      }),
    });
  } catch {
    sendResponse = null;
  }

  if (!sendResponse || !sendResponse.ok) {
    if (isQualification) return recoverLead();
    return bad(
      "Sending failed on our end. Try again in a minute, or call or email us instead.",
      502,
    );
  }

  return NextResponse.json({ ok: true, ...gate });
}
