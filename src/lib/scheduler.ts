/*
 * The booking embed, whichever provider it comes from.
 *
 * A qualified lead is shown an inline calendar inside the gate — see
 * src/components/QualifyFlow.tsx. Which calendar is a content decision
 * (`booking.schedulingLink` on the vertical), but three mechanical details
 * follow from the provider rather than from the content, and this module
 * is the one place that knows them:
 *
 *   1. Prefill. Both providers take the lead's details as query params, so
 *      somebody who has already typed their name and email into the gate
 *      never types them again — they just pick a time. The param NAMES
 *      differ, which is the whole reason this is not a string concat at
 *      the call site.
 *   2. The resize script. LeadConnector's iframe has no intrinsic height
 *      and reports its own by postMessage; its form_embed.js is what
 *      listens and sets the height. Without it the calendar renders inside
 *      whatever box it is given and clips. Calendly needs no such script
 *      for an inline embed.
 *   3. The origin to trust for the booked-appointment message — see
 *      src/components/BookingConversion.tsx.
 *
 * Adding a provider means adding a case here, not touching the gate.
 */

import { telE164 } from "@/lib/business";

export type SchedulerProvider = "calendly" | "leadconnector" | "unknown";

/*
 * LeadConnector is the embed engine behind GoHighLevel. A location serves
 * its widgets from its own white-label host (ours is
 * links.ascentforsponsors.com) as well as the vendor's, so the provider is
 * recognised by the widget PATH, which is the same on every host, and the
 * origin is then taken from the URL itself rather than from a list of
 * hostnames that would need editing every time the white-label domain
 * changes.
 */
const LEADCONNECTOR_PATH = /\/widget\/(booking|bookings|appointment)\//;

function parse(url: string): URL | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

export function schedulerProvider(url: string): SchedulerProvider {
  const parsed = parse(url);
  if (!parsed) return "unknown";
  if (parsed.hostname === "calendly.com" || parsed.hostname.endsWith(".calendly.com")) {
    return "calendly";
  }
  if (LEADCONNECTOR_PATH.test(parsed.pathname)) return "leadconnector";
  return "unknown";
}

/** The origin a booked-appointment message must come from, or null. */
export function schedulerOrigin(url: string): string | null {
  return parse(url)?.origin ?? null;
}

/**
 * LeadConnector's resize script, served from the same host as the widget.
 * null for providers that do not need one.
 */
export function schedulerEmbedScript(url: string): string | null {
  if (schedulerProvider(url) !== "leadconnector") return null;
  const origin = schedulerOrigin(url);
  return origin ? `${origin}/js/form_embed.js` : null;
}

/**
 * The calendar's own id, which LeadConnector's script uses to match the
 * iframe it is resizing. Null for other providers.
 */
export function schedulerWidgetId(url: string): string | null {
  if (schedulerProvider(url) !== "leadconnector") return null;
  const last = parse(url)?.pathname.split("/").filter(Boolean).pop();
  return last ?? null;
}

/*
 * Prefill, appended client-side once the verdict comes back — the link
 * still only ever arrives in the /api/book response, never in page source.
 *
 * Calendly reads a single `name`; LeadConnector wants the parts separately
 * and will also take the phone, which Calendly's inline embed will not
 * prefill. Splitting a full name on the first space is imperfect for names
 * that do not work that way, but the field stays editable in the widget,
 * and the alternative is making the lead retype everything.
 */
export function withSchedulerPrefill(
  link: string,
  lead: { name: string; email: string; phone?: string },
): string {
  const name = lead.name.trim();
  const email = lead.email.trim();
  /* E.164, not the "(405) 555-0142" the gate displays — the widget's own
   * phone field is stricter about what it will accept as a prefill. */
  const phone = telE164(lead.phone ?? null) ?? "";
  const params = new URLSearchParams();

  if (schedulerProvider(link) === "leadconnector") {
    const [first, ...rest] = name.split(/\s+/).filter(Boolean);
    if (first) params.set("first_name", first);
    if (rest.length > 0) params.set("last_name", rest.join(" "));
    if (email) params.set("email", email);
    if (phone) params.set("phone", phone);
  } else {
    if (name) params.set("name", name);
    if (email) params.set("email", email);
  }

  const query = params.toString();
  if (!query) return link;
  return `${link}${link.includes("?") ? "&" : "?"}${query}`;
}
