import Script from "next/script";

/*
 * GoHighLevel external tracking script (Settings → External Tracking).
 *
 * This is what fills the Activity timeline on a GHL contact: the page views
 * that led up to the lead, the form submission itself, and the visit's
 * referrer and UTM parameters. Leads are still created server-side by
 * /api/book (lib/ghl.ts) — that stays the source of truth for tags, notes
 * and consent records. The script matches its session to that same contact
 * by email when the gate's <form> is submitted, which is why the contact
 * inputs in QualifyFlow must keep their `name` attributes (name, company,
 * email, phone).
 *
 * One GHL location tracks both domains; the script is served from the
 * sponsor brand's white-label link domain.
 *
 * Limits worth knowing: it records page views on full page loads only (it
 * does not hook client-side route changes), and it cannot see forms inside
 * iframes such as the booking calendar.
 *
 * Skipped in local development so test traffic never lands in the CRM.
 * This script stores an identifier in the visitor's browser, which is why
 * both /privacy pages disclose it. If it is ever removed, correct them too.
 */

export const GHL_TRACKING_SRC =
  "https://links.ascentforsponsors.com/js/external-tracking.js";
export const GHL_TRACKING_ID = "tk_714df471909340ae900c619ed99008c3";

export default function GhlTracking() {
  if (process.env.NODE_ENV === "development") return null;
  return (
    <Script
      id="ghl-external-tracking"
      src={GHL_TRACKING_SRC}
      data-tracking-id={GHL_TRACKING_ID}
      strategy="afterInteractive"
    />
  );
}
