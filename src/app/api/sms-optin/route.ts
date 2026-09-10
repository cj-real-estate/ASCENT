import { NextResponse } from "next/server";
import { deliverLeadToGhl } from "@/lib/ghl";
import { postLeadWebhook } from "@/lib/leadSink";

/*
 * The standalone SMS opt-in endpoint, behind /sms.
 *
 * /api/book is the gate: it wants company, email and an answer to every ICP
 * question, and its whole job is deciding who sees a calendar. The opt-in
 * page has a different job — be the plain, public, single-screen form with a
 * visible phone field that A2P 10DLC campaign review asks for — so it posts
 * here instead of bending the gate's payload into a shape that fits.
 *
 * What it needs is small: a name, a mobile number, and whether the consent
 * box was ticked. Email is optional. The box itself is optional too, exactly
 * as it is everywhere else on the site: a submission without it is a contact
 * request, not an opt-in, and the CRM record says so.
 *
 * Delivery is the same pair of sinks as the gate, so an opt-in lands in the
 * same CRM with the same tags and the same timestamped proof of what wording
 * was shown. See docs/A2P-10DLC.md.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4_000;
const MAX_FIELD_LENGTH = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s()\-.]+$/;

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
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
  if (raw.length > MAX_BODY_BYTES) return bad("Request body is too large.", 413);

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

  const name = readString(body, "name");
  const phone = readString(body, "phone");
  const email = readString(body, "email");
  const honeypot = readString(body, "website");
  /* Optional, unvalidated, and only true when it is exactly true — see the
   * note in /api/book. */
  const smsConsent = body.smsConsent === true;
  const receivedAt = new Date().toISOString();

  // Honeypot filled: answer as though it worked, send nothing.
  if (honeypot) return NextResponse.json({ ok: true, smsConsent: false });

  for (const [label, value] of [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
  ] as const) {
    if (value.length > MAX_FIELD_LENGTH) {
      return bad(`${label} must be ${MAX_FIELD_LENGTH} characters or fewer.`);
    }
  }

  if (!name) return bad("Name is required.");
  if (!phone) return bad("Phone is required.");
  if (!PHONE_CHARS_RE.test(phone) || phone.replace(/\D/g, "").length < 10) {
    return bad("Enter a mobile number with at least 10 digits.");
  }
  // Email is optional here; if it is given it still has to be an address.
  if (email && !EMAIL_RE.test(email)) {
    return bad("Enter an email address like name@company.com.");
  }

  const results = await Promise.allSettled([
    deliverLeadToGhl({
      name,
      company: "",
      phone,
      email,
      page: "sms",
      interest: "SMS updates",
      verdict: "SMS OPT-IN",
      qualified: null,
      answers: {},
      answerLines: [],
      smsConsent,
      receivedAt,
    }),
    postLeadWebhook({
      verdict: "SMS OPT-IN",
      name,
      company: "",
      phone,
      email,
      page: "sms",
      interest: "SMS updates",
      answers: {},
      smsConsent,
      receivedAt,
    }),
  ]);
  const delivered = results.some(
    (result) => result.status === "fulfilled" && result.value,
  );

  if (!delivered) {
    /* Nothing took it, and unlike a gate submission there is no calendar to
     * fall through to — delivery IS the outcome here. Log it (the one
     * deliberate PII exception, same as the gate's) and say so honestly
     * rather than showing a confirmation for a consent nobody recorded. */
    console.error("[SMS_OPTIN_UNDELIVERED]", {
      name,
      phone,
      email,
      smsConsent,
      receivedAt,
    });
    return bad(
      "Sending failed on our end. Try again in a minute, or call or email us instead.",
      502,
    );
  }

  return NextResponse.json({ ok: true, smsConsent });
}
