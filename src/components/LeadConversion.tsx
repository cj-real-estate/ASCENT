"use client";

import { useEffect } from "react";
import { trackLeadConversion } from "@/lib/conversion";

/*
 * Reports the audit-request conversion on mount. Rendered on /thanks, which
 * the booking form routes to on success — the page-load conversion Google
 * asks for, expressed the way a client-side router needs it.
 */
export default function LeadConversion() {
  useEffect(() => trackLeadConversion("form"), []);
  return null;
}
