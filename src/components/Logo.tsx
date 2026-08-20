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
      viewBox="0 0 108 112"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* outer chevron — orange */}
      <path d="M50 0 L100 62 H72 L50 34.7 L28 62 H0 Z" fill={outer} />
      {/* inner chevron — ink, offset down-right, apex tucked into the notch */}
      <path d="M58 50 L108 112 H80 L58 84.7 L36 112 H8 Z" fill={inner} />
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
