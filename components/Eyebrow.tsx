import type { ReactNode } from "react";

/*
 * Mono uppercase kicker. `accent` on Ink backgrounds; `deep` on Paper and
 * Surface, where full-strength orange fails contrast at this size.
 */
export function Eyebrow({
  tone,
  children,
}: {
  tone: "accent" | "deep";
  children: ReactNode;
}) {
  const color = tone === "accent" ? "text-accent" : "text-accent-deep";
  return (
    <p
      className={`font-mono text-[0.8125rem] font-medium uppercase tracking-[0.16em] ${color}`}
    >
      {children}
    </p>
  );
}
