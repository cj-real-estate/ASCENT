import type { Vertical } from "@content/verticals/types";
import SectionIndex from "./SectionIndex";

/*
 * Expectations — how an engagement runs, numbered because it reads as a
 * sequence. This is what a page carries INSTEAD of the price grid when
 * pricing is quoted after a call rather than published. Light (bg-paper).
 * Renders nothing when the vertical carries no expectations.
 */
export function ExpectationsSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { expectations } = vertical;
  if (expectations === null) return null;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange-deep">
          <SectionIndex n={index} />
          {expectations.eyebrow}
        </p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {expectations.h2}
        </h2>
        {expectations.intro ? (
          <p className="mt-6 max-w-[68ch] text-[17px] text-slate">
            {expectations.intro}
          </p>
        ) : null}

        <ol className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6">
          {expectations.items.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[auto_1fr] gap-x-5 rounded-xl border border-line bg-paper p-6 motion-safe:transition-[transform,border-color] motion-safe:hover:-translate-y-1 hover:border-slate md:p-8"
            >
              {/* ≥24px, so plain orange passes contrast on light */}
              <p className="readout text-[26px] leading-none text-orange" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h3 className="text-[20px] font-semibold leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-slate">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ExpectationsSection;
