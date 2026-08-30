/*
 * Right arrow for CTAs, drawn inline — the self-hosted latin font subsets
 * carry no U+2192, and a fallback-font arrow reads as a glitch.
 */
export default function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
