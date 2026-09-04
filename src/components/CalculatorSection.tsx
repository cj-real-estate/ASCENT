import type { Vertical } from "@content/verticals/types";
import Calculator from "@/components/Calculator";
import SectionIndex from "@/components/SectionIndex";

/*
 * The ROI calculator's own section — light, reference-site style: heading
 * block, then the inputs card beside the four output tiles. Sits directly
 * after the problem section so "the quote quietly stops existing" is
 * immediately followed by "here's what working appointments returns".
 */
export function CalculatorSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { calculatorSection } = vertical;
  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange-deep">
          <SectionIndex n={index} />
          {calculatorSection.eyebrow}
        </p>
        <h2 className="display mt-4 max-w-[22ch] text-[26px] text-ink md:text-[46px]">
          {calculatorSection.h2}
        </h2>
        <p className="mt-6 max-w-[68ch] text-[17px] text-slate">
          {calculatorSection.sub}
        </p>
        <div className="mt-10 md:mt-14">
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
