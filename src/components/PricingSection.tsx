import type { Vertical } from "@content/verticals/types";

/*
 * Pricing / "where to start" section. Server component.
 *
 * Card count comes from the content module — four tiers on the vertical
 * page, two on the brand page — so the grid tracks `cards.length` rather
 * than assuming four.
 *
 * Background is content-driven, and `surface` requires `eyebrow: null`:
 * Orange Deep measures 4.43:1 on Surface, under the 4.5 floor, but 4.87:1
 * on Paper. The single dark card (the Sprint) is the section's only
 * emphasis device.
 */
export function PricingSection({
  vertical,
  spotsRemaining,
}: {
  vertical: Vertical;
  spotsRemaining: number;
}) {
  const { pricing } = vertical;
  const wide = pricing.cards.length > 2;
  const showSpots = pricing.showFoundingSpots && spotsRemaining > 0;

  return (
    <section
      className={`cv-auto py-16 md:py-28 ${
        pricing.background === "surface" ? "bg-surface" : "bg-paper"
      }`}
    >
      <div className="section-shell">
        {pricing.eyebrow && (
          <p className="eyebrow text-orange-deep">{pricing.eyebrow}</p>
        )}
        <h2
          className={`display max-w-[20ch] text-[26px] text-ink md:text-[46px] ${
            pricing.eyebrow ? "mt-4" : ""
          }`}
        >
          {pricing.h2}
        </h2>

        <ul
          className={`mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6 ${
            wide ? "xl:grid-cols-4" : "lg:items-start"
          }`}
        >
          {pricing.cards.map((card) => {
            const dark = card.dark === true;
            return (
              <li
                key={card.name}
                className={
                  dark
                    ? "rounded-lg border border-ink bg-ink p-6 motion-safe:transition-transform motion-safe:hover:-translate-y-1"
                    : "rounded-lg border border-line bg-paper p-6 motion-safe:transition-[transform,border-color] motion-safe:hover:-translate-y-1 hover:border-slate"
                }
              >
                <h3
                  className={`text-[20px] font-semibold ${
                    dark ? "text-paper" : "text-ink"
                  }`}
                >
                  {card.name}
                </h3>
                <p
                  className={`readout mt-4 text-[26px] md:text-[34px] ${
                    dark ? "text-orange" : "text-ink"
                  }`}
                >
                  {card.price}
                </p>
                {card.priceNote && (
                  <p
                    className={`mt-1 font-mono text-[12px] ${
                      dark ? "text-on-dark" : "text-slate"
                    }`}
                  >
                    {card.priceNote}
                  </p>
                )}
                <p
                  className={`mt-4 text-[16px] ${
                    dark ? "text-on-dark" : "text-slate"
                  }`}
                >
                  {card.line}
                </p>
              </li>
            );
          })}
        </ul>

        {pricing.guaranteeLine && (
          <p className="readout mt-8 max-w-[68ch] text-[17px] text-orange-deep">
            {pricing.guaranteeLine}
          </p>
        )}

        {/* Manually maintained count. No timer, no auto-decrement; omitted
            entirely at 0 rather than showing a stale or fake number. */}
        {showSpots && (
          <p className="mt-8 flex items-baseline gap-3">
            <span className="readout text-[26px] text-orange-deep">
              {spotsRemaining}
            </span>
            <span className="font-mono text-[14px] font-medium uppercase tracking-[0.12em] text-slate">
              {pricing.foundingSpotsSuffix}
            </span>
          </p>
        )}

        <p className="mt-8 max-w-[68ch] text-[14px] text-slate">{pricing.note}</p>
      </div>
    </section>
  );
}

export default PricingSection;
