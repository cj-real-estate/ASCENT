import type { Vertical } from "@content/verticals/types";

/*
 * "What gets installed" — light (bg-paper). Server component.
 *
 * Two halves: what we run on the left, and the dark card on the right
 * listing the three things the owner actually does. The dark card is this
 * section's single emphasis device.
 *
 * Paper rather than the brief's Surface, following the precedent set in
 * HowItWorksSection: Orange Deep eyebrows measure 4.43:1 on Surface, under
 * the 4.5 floor. The section's gray band moves to the proof section, which
 * has no eyebrow. Renders nothing on verticals that use `howItWorks`.
 */
export function InstallSection({ vertical }: { vertical: Vertical }) {
  const { install } = vertical;
  if (install === null) return null;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-orange-deep">{install.eyebrow}</p>
            <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
              {install.h2}
            </h2>

            {/* Unnumbered on purpose — these run in parallel, not in sequence */}
            <ul className="mt-10 md:mt-14">
              {install.items.map((item) => (
                <li
                  key={item.title}
                  className="border-t border-line py-6 first:border-t-0 first:pt-0"
                >
                  <h3 className="text-[20px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[60ch] text-[17px] text-slate">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div data-dark="" className="rounded-lg bg-ink p-7 md:p-10 lg:self-start">
            <h3 className="display text-[26px] text-paper md:text-[34px]">
              {install.ownerCard.heading}
            </h3>
            <ol className="mt-8 space-y-7">
              {install.ownerCard.steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-4">
                  <span className="readout text-[20px] text-orange" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-[17px] font-semibold text-paper">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 text-[17px] text-on-dark">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-t border-white/15 pt-6 text-[17px] text-on-dark">
              {install.ownerCard.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InstallSection;
