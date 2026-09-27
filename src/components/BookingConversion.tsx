"use client";

import { useEffect } from "react";
import { trackLeadConversion } from "@/lib/conversion";
import { schedulerOrigin, schedulerProvider } from "@/lib/scheduler";

/*
 * Reports the conversion when someone books inside the calendar embed.
 *
 * The booking happens in an iframe and never navigates this page, so there
 * is no page load for Google to measure. Both providers post a message up
 * to the parent instead, and that message is the only signal available.
 *
 * Calendly's is documented and exact: `calendly.event_scheduled`.
 *
 * LeadConnector (GoHighLevel) is not documented, and its widget posts a
 * steady stream of resize messages on the same channel, so this cannot
 * simply fire on anything from that origin. It matches instead on a
 * message whose type or event NAMES an appointment being booked, which
 * covers the spellings LeadConnector is known to use without matching
 * `REQUEST_HEIGHT` and its neighbours. Every match is still bounded by the
 * widget's own origin, and trackLeadConversion reports once per session,
 * so a repeated message cannot inflate the count.
 *
 * VERIFY THIS with one real test booking before trusting the number: open
 * the console on the pass screen, book, and confirm a conversion fires. If
 * LeadConnector uses a name this does not match, add it to `BOOKED` — the
 * failure mode is a missing conversion, never a false one.
 */
const BOOKED = /appointment.*(book|schedul|confirm)|(book|schedul).*appointment|event_scheduled/i;

function isBooked(data: unknown): boolean {
  if (typeof data === "string") return BOOKED.test(data);
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  return [record.type, record.event, record.action, record.page].some(
    (value) => typeof value === "string" && BOOKED.test(value),
  );
}

export default function BookingConversion({ schedulingLink }: { schedulingLink: string }) {
  useEffect(() => {
    const origin = schedulerOrigin(schedulingLink);
    if (!origin || schedulerProvider(schedulingLink) === "unknown") return;

    let cancelConversion = () => {};

    function onMessage(event: MessageEvent) {
      if (event.origin !== origin) return;
      if (isBooked(event.data)) cancelConversion = trackLeadConversion("calendar");
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      cancelConversion();
    };
  }, [schedulingLink]);

  return null;
}
