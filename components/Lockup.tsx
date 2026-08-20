/*
 * Typographic lockup. The triangle is a placeholder mark — swap in the
 * client's .svg lockup and mark when they arrive (see README).
 */
export function Lockup({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <span className="inline-flex flex-col">
      <span className="inline-flex items-center gap-2">
        <span className="font-display text-lg uppercase leading-none tracking-[0.04em] text-white sm:text-xl">
          Ascent
        </span>
        <svg
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 0 12 12 0 12Z" fill="#F05E23" />
        </svg>
      </span>
      {withTagline && (
        <span className="mt-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-fog">
          Client Acquisition Systems
        </span>
      )}
    </span>
  );
}
