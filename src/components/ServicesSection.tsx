import type { Vertical } from "@content/verticals/types";
import ServiceIcon from "./ServiceIcon";
import SectionIndex from "./SectionIndex";

/*
 * Services — light (bg-paper). Server component.
 *
 * Ledger rows, reference-site style: a mono index, the icon + title, and
 * the body in its own column, separated by hairline rules. The numerals are
 * list furniture (an index, like a table of contents), not a sequence — the
 * closing line still carries the real order argument (follow-up first,
 * traffic after). Keep it: a flat list of seven services otherwise implies
 * we switch all of them on in week one.
 */
export function ServicesSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { services } = vertical;
  if (services === null) return null;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange-deep">
          <SectionIndex n={index} />
          {services.eyebrow}
        </p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {services.h2}
        </h2>

        <ul className="mt-10 border-b border-line md:mt-14">
          {services.items.map((item, i) => (
            <li
              key={item.title}
              className="grid gap-2 border-t border-line py-6 md:grid-cols-[72px_1.1fr_1.3fr] md:gap-8 md:py-7"
            >
              <p
                aria-hidden="true"
                className="readout text-[15px] text-slate md:pt-1"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="flex items-start gap-3 text-[20px] font-semibold leading-snug text-ink">
                <span className="mt-0.5 shrink-0 text-orange-deep">
                  <ServiceIcon name={item.icon} />
                </span>
                {item.title}
              </h3>
              <p className="max-w-[56ch] text-[17px] text-slate">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[68ch] text-[17px] font-semibold text-ink">
          {services.closing}
        </p>

        {services.ownerCard && (
          <div
            data-dark=""
            className="mt-12 rounded-2xl bg-ink p-7 shadow-card md:mt-16 md:p-10"
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
