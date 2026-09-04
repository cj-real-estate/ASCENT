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
    <section className="cv-auto bg-paper py-8 md:py-14">
      <div className="section-shell">
        {/* Tinted panel with the calculator's cards nested white inside it —
            the reference sites' panel/card device. */}
        <div className="panel relative overflow-hidden bg-surface">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-[300px] w-[300px] rounded-full opacity-[0.5]"
            style={{
              background:
                "radial-gradient(closest-side, var(--orange-tint), transparent 70%)",
            }}
          />
          <div className="relative">
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
            <div className="mt-10 md:mt-12">
              <Calculator
                calculator={vertical.calculator}
                ctaLabel={vertical.hero.cta}
                ctaMicrocopy={vertical.hero.microcopy}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CalculatorSection;
