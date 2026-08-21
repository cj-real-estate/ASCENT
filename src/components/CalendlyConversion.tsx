"use client";

import { useEffect } from "react";
import { trackLeadConversion } from "@/lib/conversion";

/*
 * Reports the audit-request conversion when someone books in the Calendly
 * embed. The booking happens inside an iframe and never navigates this page,
 * so there is no page load for Google to measure — Calendly posts a message
 * up to the parent instead, and that is the only signal available.
 */
export default function CalendlyConversion() {
  useEffect(() => {
    let cancelConversion = () => {};

    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://calendly.com") return;
      const data = event.data as { event?: unknown } | null;
      if (data && data.event === "calendly.event_scheduled") {
        cancelConversion = trackLeadConversion("calendly");
      }
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      cancelConversion();
    };
  }, []);

  return null;
}
