/*
 * Google Ads identifiers, and the single conversion this site reports.
 *
 * There are two ways to book an audit and they need different handling:
 *
 *   form     — the fallback form routes to /thanks, so a page-load
 *              conversion on that route is exactly right.
 *   calendly — the calendar is an iframe. Booking inside it never navigates
 *              the parent page, so a page-load tag would never see it.
 *              Calendly posts a `calendly.event_scheduled` message instead,
 *              which is what src/components/CalendlyConversion.tsx listens for.
 *
 * The two paths are mutually exclusive, so a visitor cannot fire both.
 */

export const GOOGLE_ADS_ID = "AW-18403357820";

/** The "Submit lead form" conversion action, from Google Ads. */
export const LEAD_CONVERSION_SEND_TO = "AW-18403357820/CG1nCJmW2eUcEPzos8dE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * gtag.js loads with `afterInteractive`, so window.gtag may not exist yet when
 * a conversion needs reporting. Poll briefly rather than dropping it.
 */
function whenGtagReady(run: () => void, timeoutMs = 10_000): () => void {
  if (typeof window.gtag === "function") {
    run();
    return () => {};
  }
  const started = Date.now();
  const id = window.setInterval(() => {
    if (typeof window.gtag === "function") {
      window.clearInterval(id);
      run();
    } else if (Date.now() - started > timeoutMs) {
      window.clearInterval(id);
    }
  }, 200);
  return () => window.clearInterval(id);
}

/**
 * Report one booked audit. No-ops when the tag is absent (development, or a
 * blocked script), and reports at most once per session per path so a
 * refreshed /thanks does not inflate the count.
 */
export function trackLeadConversion(source: "form" | "calendly"): () => void {
  if (typeof window === "undefined") return () => {};

  const key = `ascent:conversion:${source}`;
  try {
    if (window.sessionStorage.getItem(key)) return () => {};
    window.sessionStorage.setItem(key, "1");
  } catch {
    // Private mode or blocked storage: fall through and report once per load.
  }

  return whenGtagReady(() => {
    window.gtag?.("event", "conversion", {
      send_to: LEAD_CONVERSION_SEND_TO,
      value: 1.0,
      currency: "USD",
    });
  });
}
