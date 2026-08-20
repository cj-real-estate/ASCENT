import type { Vertical } from "@content/verticals/types";

/*
 * Pricing section — light (bg-surface; see HowItWorksSection note). Server component.
 * Four cards; the one card flagged `dark` in the content module (the Sprint)
 * is the single dark card of the section — bg-ink, orange price — and reads
 * as the recommended starting point. No other emphasis devices.
 */
export function PricingSection({ vertical }: { vertical: Vertical }) {
  const { pricing } = vertical;

  return (
    <section className="cv-auto bg-surface py-16 md:py-28">
      <div className="section-shell">
        <h2 className="display max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {pricing.h2}
        </h2>

        <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {pricing.cards.map((card) => {
            const dark = card.dark === true;
            return (
              <li
                key={card.name}
                className={
                  dark
                    ? "rounded-lg border border-ink bg-ink p-6"
                    : "rounded-lg border border-line bg-paper p-6"
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

        <p className="mt-8 max-w-[68ch] text-[14px] text-slate">{pricing.note}</p>
      </div>
    </section>
  );
}

export default PricingSection;
