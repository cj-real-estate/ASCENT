"use client";

import { useEffect } from "react";

import { captureAttribution } from "@/lib/attributionClient";

/*
 * Mounted once in the root layout, so it runs on every full page load —
 * exactly when a visitor arrives from somewhere else. Client-side
 * navigation between our own pages doesn't remount it, which is right:
 * those aren't new arrivals. Renders nothing.
 */
export default function AttributionCapture() {
  useEffect(() => {
    try {
      captureAttribution();
    } catch {
      // Attribution is context; it must never break the page.
    }
  }, []);
  return null;
}
