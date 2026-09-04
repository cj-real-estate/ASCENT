import type { Vertical } from "@content/verticals/types";
import SectionIndex from "./SectionIndex";
import ServiceIcon from "./ServiceIcon";

/*
 * Transparency — how the firm reports: recorded and monitored setter calls,
 * cost per appointment held over cost per lead, plain-dollar reporting.
 *
 * Rendered as white cards nested inside a tinted panel (the reference sites'
 * signature device) so it reads differently from the services grid sitting
 * above it, which is plain cards on paper.
 *
 * Content rule, enforced in types.ts: practice claims only — things a client
 * can check. Performance numbers live in ProofSection, attributed.
 */
export function TransparencySection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { transparency } = vertical;
  if (transparency === null) return null;

  return (
    <section className="cv-auto bg-paper py-8 md:py-14">
      <div className="section-shell">
        <div className="panel bg-surface">
          <p className="eyebrow text-orange-deep">
            <SectionIndex n={index} />
            {transparency.eyebrow}
          </p>
          <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
            {transparency.h2}
          </h2>

          <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3">
            {transparency.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-line bg-paper p-6 md:p-7"
              >
                <span className="icon-tile">
                  <ServiceIcon name={item.icon} />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[16px] leading-relaxed text-slate">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default TransparencySection;
