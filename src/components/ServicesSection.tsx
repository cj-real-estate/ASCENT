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

        <ul className="mt-10 grid gap-4 md:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-line bg-paper p-5 motion-safe:transition-[transform,box-shadow] motion-safe:hover:-translate-y-1 hover:shadow-card md:p-6"
            >
              {/* Icon sits beside the text on a phone and above it from md
                  up — eight stacked cards cost four screens otherwise. */}
              <div className="flex gap-4 md:block">
                <span className="icon-tile shrink-0 max-md:h-10 max-md:w-10 max-md:rounded-xl">
                  <ServiceIcon name={item.icon} />
                </span>
                <div className="min-w-0 md:mt-5">
                  <h3 className="text-[17px] font-semibold leading-snug text-ink md:text-[18px]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate md:mt-2 md:text-[16px]">
                    {item.body}
                  </p>
                </div>
              </div>
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
