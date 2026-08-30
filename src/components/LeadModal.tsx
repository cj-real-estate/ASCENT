"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { QualifyFlowProps } from "@/lib/qualify";
import QualifyFlow from "./QualifyFlow";

/*
 * The qualification flow in a native <dialog>, opened by any element
 * carrying data-open-lead-modal (server components just render the
 * attribute — no handler plumbing). data-intent="strategy-call" tags the
 * lead's interest; default is the audit. Triggers keep href="#book" so a
 * no-JS visitor still lands on the inline form at the bottom of the page.
 *
 * <dialog> gives focus containment, Esc-to-close, and ::backdrop for free.
 * The flow instance is remounted per open so a half-finished wizard from a
 * closed modal doesn't reappear stale minutes later.
 */
export function LeadModal({ flow }: { flow: QualifyFlowProps }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [intent, setIntent] = useState<"audit" | "strategy-call">("audit");
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest(
        "[data-open-lead-modal]",
      );
      if (!target) return;
      event.preventDefault();
      const wanted =
        target.getAttribute("data-intent") === "strategy-call"
          ? "strategy-call"
          : "audit";
      setIntent(wanted);
      setOpenCount((n) => n + 1);
      dialogRef.current?.showModal();
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Book a call"
      className="lead-modal m-auto w-[min(680px,calc(100vw-2rem))] rounded-xl border border-white/15 bg-ink p-0 text-paper backdrop:bg-black/70"
      onClick={(event) => {
        // Click on the backdrop (the dialog element itself) closes.
        if (event.target === dialogRef.current) close();
      }}
    >
      <div data-dark className="max-h-[85dvh] overflow-y-auto p-6 md:p-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[20px] text-on-dark hover:border-white/45 hover:text-paper"
          >
            ×
          </button>
        </div>
        <div className="mt-2">
          {/* remount per open; keep instance while open */}
          <QualifyFlow key={openCount} flow={flow} intent={intent} />
        </div>
      </div>
    </dialog>
  );
}

export default LeadModal;
