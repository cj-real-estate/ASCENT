import { NextResponse } from "next/server";
import fence from "@content/verticals/fence";

/*
 * Booking form endpoint. Validates the five known fields (same rules as the
 * client), drops honeypot submissions silently, and forwards the lead as a
 * plain-text email via the Resend HTTP API — no SDK, no persistence, no
 * cookies. In production, PII is never logged; it only travels in the email.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 10_000;
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
  const honeypot = readString(body, "website");

  // Honeypot filled: pretend success, send nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  for (const [label, value] of [
    ["Name", name],
    ["Company", company],
    ["Phone", phone],
    ["Email", email],
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
  const knownOptions = fence.booking.form.estimatesSelectOptions;
  if (!knownOptions.includes(estimates)) {
    return bad("Choose one of the estimate-volume options.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BOOKING_TO_EMAIL;
  const fromEmail = process.env.BOOKING_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[/api/book] email not configured — payload:", {
        name,
        company,
        phone,
        email,
        estimates,
      });
      return NextResponse.json({ ok: true });
    }
    return bad("Booking isn't wired up yet — call or email us instead.", 503);
  }

  const text = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `${fence.booking.form.estimatesSelectLabel}: ${estimates}`,
  ].join("\n");

  let sendResponse: Response;
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
        subject: `Pipeline audit request — ${name}, ${company}`,
        text,
      }),
    });
  } catch {
    return bad(
      "Sending failed on our end. Try again in a minute, or call or email us instead.",
      502,
    );
  }

  if (!sendResponse.ok) {
    return bad(
      "Sending failed on our end. Try again in a minute, or call or email us instead.",
      502,
    );
  }

  return NextResponse.json({ ok: true });
}
