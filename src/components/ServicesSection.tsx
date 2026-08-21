import type { Vertical } from "@content/verticals/types";

/*
 * Services — light (bg-paper). Server component.
 *
 * Everything the firm sells, in one grid. Paper rather than Surface,
 * following the precedent in HowItWorksSection: Orange Deep eyebrows
 * measure 4.43:1 on Surface, under the 4.5 floor, and 4.87:1 on Paper.
 *
 * Hairline rules rather than cards, matching the proof section — a service
 * list in seven boxes reads like a pricing table it isn't.
 *
 * The closing line carries the order argument (follow-up first, traffic
 * after). Keep it: a flat list of seven services otherwise implies we switch
 * all of them on in week one.
 */
export function ServicesSection({ vertical }: { vertical: Vertical }) {
  const { services } = vertical;
  if (services === null) return null;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange-deep">{services.eyebrow}</p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {services.h2}
        </h2>

        {/* Unnumbered on purpose — a menu, not a sequence */}
        <ul className="mt-10 grid gap-x-8 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item) => (
            <li key={item.title} className="border-t border-line py-6">
              <h3 className="text-[20px] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[46ch] text-[17px] text-slate">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[68ch] text-[17px] font-semibold text-ink">
          {services.closing}
        </p>

        {services.ownerCard && (
          <div
            data-dark=""
            className="mt-12 rounded-lg bg-ink p-7 md:mt-16 md:p-10"
          >
            <h3 className="display text-[26px] text-paper md:text-[34px]">
              {services.ownerCard.heading}
            </h3>
            <ol className="mt-8 grid gap-8 md:grid-cols-3">
              {services.ownerCard.steps.map((step, i) => (
                <li key={step.title}>
                  <p
                    className="readout text-[20px] text-orange"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-2 text-[17px] font-semibold text-paper">
                    {step.title}
                  </h4>
                  <p className="mt-1.5 text-[17px] text-on-dark">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-t border-white/15 pt-6 text-[17px] text-on-dark">
              {services.ownerCard.closing}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicesSection;
