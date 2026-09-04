import type { Vertical } from "@content/verticals/types";
import SectionIndex from "./SectionIndex";

/*
 * Transparency section — light (bg-paper). Server component.
 *
 * How the firm reports: recorded and monitored setter calls, cost per
 * appointment held over cost per lead, plain-dollar reporting. Content
 * rule (enforced in types.ts): practice claims only — things the firm
 * does that a client can check — never performance numbers, which live
 * attributed in the proof section. Renders nothing when the vertical
 * carries no transparency content.
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
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange-deep">
          <SectionIndex n={index} />
          {transparency.eyebrow}
        </p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {transparency.h2}
        </h2>

        <ul className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
          {transparency.items.map((item, i) => (
            <li key={item.title} className="border-t-2 border-orange pt-5">
              <p
                aria-hidden="true"
                className="readout text-[15px] text-slate"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-[20px] font-semibold leading-snug text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[17px] text-slate">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TransparencySection;
