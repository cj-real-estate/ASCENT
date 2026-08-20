"use client";

import { useEffect, useRef } from "react";

/*
 * Inline Cal.com embed via the official loader snippet. Renders only when a
 * vertical's `booking.calLink` is set; until then the fallback form is used.
 */

type CalApi = {
  (...args: unknown[]): void;
  q?: unknown[];
  ns?: Record<string, unknown>;
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

function loadCal() {
  if (window.Cal?.loaded) return;
  const script = "https://app.cal.com/embed/embed.js";
  const push = (api: CalApi, args: IArguments) => {
    api.q = api.q ?? [];
    api.q.push(args);
  };
  const cal: CalApi = function (this: unknown) {
    const existing = window.Cal as CalApi;
    if (!existing.loaded) {
      existing.ns = {};
      existing.q = existing.q ?? [];
      const el = document.createElement("script");
      el.src = script;
      document.head.appendChild(el);
      existing.loaded = true;
    }
    // eslint-disable-next-line prefer-rest-params
    push(existing, arguments);
  };
  if (!window.Cal) window.Cal = cal;
}

export function CalEmbed({ calLink }: { calLink: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCal();
    const Cal = window.Cal;
    if (!Cal || !containerRef.current) return;
    Cal("init", { origin: "https://cal.com" });
    Cal("inline", {
      elementOrSelector: containerRef.current,
      calLink,
      config: { theme: "dark" },
    });
    Cal("ui", {
      styles: { branding: { brandColor: "#F05E23" } },
      hideEventTypeDetails: false,
    });
  }, [calLink]);

  return (
    <div
      ref={containerRef}
      className="min-h-[34rem] border border-line-dark bg-panel"
    />
  );
}
