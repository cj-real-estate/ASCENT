import type { Vertical } from "@content/verticals/types";
import SectionIndex from "./SectionIndex";

/*
 * Fit — qualifiers and disqualifiers, side by side, on a tinted panel.
 * Light section, so the eyebrow is Orange Deep. The "+" / "−" markers are
 * characters the self-hosted latin subsets carry. Renders nothing when
 * the vertical carries no fit section.
 */
function Column({
  heading,
  items,
  marker,
}: {
  heading: string;
  items: string[];
  marker: "plus" | "minus";
}) {
  return (
    <div>
      <h3 className="eyebrow text-[13px] text-ink">{heading}</h3>
      <ul className="mt-5 border-t border-ink">
        {items.map((item) => (
          <li
            key={item}
            className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-line py-4 text-[16px] leading-relaxed text-ink"
          >
            <span
              aria-hidden="true"
              className={`readout text-[18px] ${
                marker === "plus" ? "text-orange-deep" : "text-slate"
              }`}
            >
              {marker === "plus" ? "+" : "−"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FitSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { fit } = vertical;
  if (fit === null) return null;

  return (
    <section className="cv-auto bg-paper py-8 md:py-14">
      <div className="section-shell">
        <div className="panel bg-surface">
          <p className="eyebrow text-orange-deep">
            <SectionIndex n={index} />
            {fit.eyebrow}
          </p>
          <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
            {fit.h2}
          </h2>

          <div className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-2 lg:gap-16">
            <Column heading={fit.forYouHeading} items={fit.forYou} marker="plus" />
            <Column
              heading={fit.notForYouHeading}
              items={fit.notForYou}
              marker="minus"
            />
          </div>

          {fit.note ? (
            <p className="mt-8 max-w-[68ch] text-[15px] text-slate">{fit.note}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default FitSection;
