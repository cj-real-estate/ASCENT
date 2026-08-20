import { NextResponse } from "next/server";

/*
 * Fallback booking route: validates, drops honeypot hits silently, and
 * forwards the lead by email via Resend's REST API. Configuration is three
 * env vars (see .env.example); until they're set, leads are logged loudly to
 * the function log instead of silently vanishing — set them before launch.
 */

export const runtime = "nodejs";

const clean = (value: unknown, max = 500): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  // Honeypot filled → bot. Pretend success and drop it.
  if (clean(data.fax)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(data.name, 200);
  const phone = clean(data.phone, 40);
  const email = clean(data.email, 200);
  const estimates = clean(data.estimates, 40);
  const trade = clean(data.trade, 200);
  const vertical = clean(data.vertical, 40) || "unknown";

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "Name and phone are required." },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email doesn’t look right." },
      { status: 400 },
    );
  }

  const lines = [
    "New pipeline audit request",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || "—"}`,
    `Estimates/month: ${estimates || "—"}`,
    ...(trade ? [`Trade: ${trade}`] : []),
    `Page: ${vertical}`,
    `Received: ${new Date().toISOString()}`,
  ];

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  const from =
    process.env.BOOKING_FROM_EMAIL ?? "Ascent Website <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error(
      "[BOOKING_ROUTE_UNCONFIGURED] Lead received but RESEND_API_KEY / BOOKING_TO_EMAIL are not set. Lead:",
      lines.join(" | "),
    );
    // Still land the visitor on /thanks — a config gap is ours to fix, not
    // a reason to bounce a real prospect.
    return NextResponse.json({ ok: true });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Pipeline audit request — ${name}`,
      text: lines.join("\n"),
      ...(email ? { reply_to: email } : {}),
    }),
  });

  if (!response.ok) {
    console.error(
      "[BOOKING_EMAIL_FAILED]",
      response.status,
      await response.text().catch(() => ""),
    );
    return NextResponse.json(
      { ok: false, error: "Could not send right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
