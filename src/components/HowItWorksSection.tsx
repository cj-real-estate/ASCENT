import type { Vertical } from "@content/verticals/types";

/*
 * How-it-works section — light (bg-paper). Server component.
 * (Paper rather than the brief's Surface: Orange Deep eyebrows measure
 * 4.42:1 on Surface — under the 4.5 floor — so the gray band moved to
 * the pricing section, which has no eyebrow.)
 * Three numbered steps; the numbering echoes the chevron/step idea but
 * stays typographic (mono numerals, no decoration).
 */
export function HowItWorksSection({ vertical }: { vertical: Vertical }) {
  const { howItWorks } = vertical;
  // Verticals that fold these steps into the install owner-card omit it.
  if (howItWorks === null) return null;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange-deep">{howItWorks.eyebrow}</p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {howItWorks.h2}
        </h2>

        <ol className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {howItWorks.steps.map((step, i) => (
            <li key={step.title}>
              {/* ≥24px, so plain orange passes contrast on light */}
              <p className="readout text-[26px] text-orange" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-[20px] font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[17px] text-ink">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-[68ch] text-[17px] font-semibold text-ink md:mt-14">
          {howItWorks.closing}
        </p>
      </div>
    </section>
  );
}

export default HowItWorksSection;
