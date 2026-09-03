import type { Vertical } from "@content/verticals/types";
import Calculator from "@/components/Calculator";
import SectionIndex from "@/components/SectionIndex";

/*
 * The calculator's own section — directly after the problem section, so
 * "your quotes quietly stop existing" is immediately followed by "here's
 * what that costs you". On the bright page the dark surface survives as a
 * rounded inset panel (reference-site style) rather than a full-bleed band;
 * everything inside keeps the on-ink styling the Calculator is built for.
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
        <div
          data-dark
          className="relative overflow-hidden rounded-2xl bg-ink p-7 shadow-card md:p-12"
        >
          {/* One quiet orange glow in the panel's top corner. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-40 h-[420px] w-[420px] rounded-full opacity-[0.14]"
            style={{
              background:
                "radial-gradient(closest-side, var(--orange), transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="eyebrow text-orange">
              <SectionIndex n={index} dark />
              {calculatorSection.eyebrow}
            </p>
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
        </div>
      </div>
    </section>
  );
}

export default CalculatorSection;
