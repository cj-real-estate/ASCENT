/*
 * The trust strip under the qualification gate. Server component, dark
 * sections only. Three short claims the site can actually back — the no-cost
 * promise, the written guarantee, and an attributed result. Deliberately
 * typographic: no badge art, no logos, nothing invented.
 */
export function TrustBanner({ items }: { items: string[] }) {
  return (
    <ul className="mt-10 grid gap-6 border-t border-white/15 pt-8 md:grid-cols-3 md:gap-8">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          {/* Em dash, not a check glyph — the self-hosted latin subsets
              don't carry U+2713, and a fallback-font tick reads as a bug. */}
          <span aria-hidden="true" className="font-mono text-[13px] leading-[1.6] text-orange">
            —
          </span>
          <span className="font-mono text-[13px] leading-[1.6] text-on-dark">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default TrustBanner;
