/*
 * The one button style. Orange fill, ink text, mono. Orange buttons only
 * appear on Ink backgrounds, so the focus ring is white for contrast against
 * both the fill and the ground. min-height keeps the 44px tap target.
 *
 * Size lives in the variants, not the base — never stack a second padding
 * or text-size utility on top of these (conflicting utilities resolve by
 * stylesheet order, not class order).
 */
const base =
  "inline-flex min-h-11 items-center justify-center bg-accent py-3 " +
  "font-mono font-semibold uppercase text-ink " +
  "transition-[background-color] hover:bg-[#ff7a3d] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Default CTA — hero, booking submit. Wraps if it must at very narrow widths. */
export const ctaButtonClasses = `${base} px-6 text-sm tracking-[0.08em]`;

/** Header CTA — compact and single-line so it fits beside the lockup at 320px. */
export const ctaButtonCompactClasses = `${base} whitespace-nowrap px-3 text-[0.6875rem] tracking-[0.06em] sm:px-5 sm:text-[0.8125rem] sm:tracking-[0.08em]`;
