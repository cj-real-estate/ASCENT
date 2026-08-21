/*
 * Ascent mark + lockup.
 *
 * The mark geometry is GENERATED from the delivered raster artwork by
 * scripts/trace-mark.py and lives in brand/mark-paths.json — the single
 * source of truth shared with scripts/generate-assets.mjs and
 * scripts/build-logo-svg.py. Never hand-edit the path data; re-run the
 * tracer instead.
 *
 * The transparent channel between the two chevrons is part of the traced
 * outline, so two plain filled paths reproduce the artwork exactly and the
 * all-white reverse keeps both chevrons legible with no mask involved.
 *
 * variant "onLight" → orange + ink (use on Paper or Surface only)
 * variant "onDark"  → all white reverse (use on Ink or Graphite)
 */

import markPaths from "@/../brand/mark-paths.json";

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
  return (
    <svg
      viewBox={`0 0 ${markPaths.width} ${markPaths.height}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* outer chevron — orange; its right arm stops short by design */}
      <path d={markPaths.outer} fill={outer} />
      {/* inner chevron — ink, offset down-right and dropping below */}
      <path d={markPaths.inner} fill={inner} />
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
