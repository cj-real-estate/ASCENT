import type { Vertical } from "@content/verticals/types";
import Calculator from "@/components/Calculator";

/*
 * The calculator's own section — dark, directly after the problem section,
 * so "your estimates quietly stop existing" is immediately followed by
 * "here's what that costs you". It moved out of the hero on purpose: the
 * hero sells the firm; this quantifies the problem.
 */
export function CalculatorSection({ vertical }: { vertical: Vertical }) {
  const { calculatorSection } = vertical;
  return (
    <section data-dark className="cv-auto bg-ink py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange">{calculatorSection.eyebrow}</p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-paper md:text-[46px]">
          {calculatorSection.h2}
        </h2>
        <p className="mt-6 max-w-[68ch] text-[17px] text-on-dark">
          {calculatorSection.sub}
        </p>
        <div className="mt-10 max-w-[760px] md:mt-12">
          <Calculator
            calculator={vertical.calculator}
            ctaLabel={vertical.hero.cta}
            ctaMicrocopy={vertical.hero.microcopy}
          />
        </div>
      </div>
    </section>
  );
}

export default CalculatorSection;
