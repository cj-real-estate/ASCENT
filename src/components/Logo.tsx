import { useId } from "react";

/*
 * Ascent mark + lockup, rebuilt as vector.
 *
 * The delivered brand assets are raster-only (see docs/ascent-brand-style-guide.md
 * §2 — "Still needed: vector"). The mark here is an SVG recreation of the two
 * stacked chevrons: outer orange, inner ink, offset and rising. When the client
 * supplies the official .svg lockup, swap it in here and regenerate the icons
 * (npm run generate:assets).
 *
 * variant "onLight" → orange + ink (use on Paper or Surface only)
 * variant "onDark"  → all white reverse (use on Ink or Graphite)
 */

/** Mark geometry — mirrored in scripts/generate-assets.mjs and
 *  scripts/build-logo-svg.py. Change all three together. */
const OUTER = "M138.5,0 L277,205 L200,205 L138.5,114 L77,205 L0,205 Z";
const INNER = "M169.5,108 L272,260 L215,260 L169.5,192.5 L124,260 L67,260 Z";

export function AscentMark({
  variant = "onLight",
  className,
  title,
}: {
  variant?: "onLight" | "onDark";
  className?: string;
  title?: string;
}) {
  const outer = variant === "onDark" ? "#FFFFFF" : "var(--orange, #F05E23)";
  const inner = variant === "onDark" ? "#FFFFFF" : "var(--ink, #1F1F1F)";
  const maskId = useId();
  return (
    <svg
      viewBox="0 0 277 260"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* A transparent channel is knocked out of the outer chevron wherever
          the inner one crosses it. Without it the all-white reverse merges
          into a single blob — the exact failure the brand guide calls out
          ("the inner chevron disappears"). Transparent, not painted, so it
          works on Ink, Graphite, or a photo alike. */}
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="277" height="260">
        <rect x="0" y="0" width="277" height="260" fill="#fff" />
        <path d={INNER} fill="#000" stroke="#000" strokeWidth="16" strokeLinejoin="round" />
      </mask>
      {/* outer chevron — orange, upper-left */}
      <path d={OUTER} fill={outer} mask={`url(#${maskId})`} />
      {/* inner chevron — ink, ~0.74x, offset down-right, apex tucked into
          the orange notch and dropping below its baseline */}
      <path d={INNER} fill={inner} />
    </svg>
  );
}

export function AscentLockup({
  variant = "onLight",
  name,
  tagline,
  className,
  responsive = false,
}: {
  variant?: "onLight" | "onDark";
  name: string;
  tagline: string;
  className?: string;
  /**
   * When space is tight (the sticky header), collapse per the brand
   * guide's minimum-size rule: mark alone on the smallest screens,
   * wordmark from 380px, full lockup with tagline from 500px.
   */
  responsive?: boolean;
}) {
  const wordColor = variant === "onDark" ? "text-paper" : "text-ink";
  const tagColor = variant === "onDark" ? "text-paper" : "text-orange-deep";
  const textVisibility = responsive ? "hidden min-[380px]:flex" : "flex";
  const tagVisibility = responsive ? "hidden min-[500px]:block" : "block";
  return (
    <span className={`flex items-center gap-3 ${className ?? ""}`}>
      <AscentMark variant={variant} className="h-9 w-auto shrink-0" />
      <span className={`${textVisibility} flex-col leading-none`}>
        <span
          className={`display text-[22px] uppercase ${wordColor}`}
          aria-label={name}
        >
          {name.split(" ")[0]}
        </span>
        <span
          className={`eyebrow mt-1 !text-[8.5px] !tracking-[0.28em] ${tagColor} ${tagVisibility}`}
        >
          {tagline}
        </span>
      </span>
    </span>
  );
}
