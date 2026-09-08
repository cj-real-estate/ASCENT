import type { Vertical } from "@content/verticals/types";
import SectionIndex from "./SectionIndex";

/*
 * Boundaries — "what we never do". Dark (bg-ink, data-dark), because this
 * is the section the compliance buyer reads and it should carry the same
 * weight as the guarantees section it stands in for. Orange titles pass
 * contrast on ink at any size; body copy in on-dark. Renders nothing when
 * the vertical carries no boundaries.
 */
export function BoundariesSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { boundaries } = vertical;
  if (boundaries === null) return null;

  return (
    <section data-dark="" className="cv-auto bg-ink py-16 md:py-28">
      <div className="section-shell">
        <div className="md:grid md:grid-cols-[1fr_1.1fr] md:gap-16">
          <div>
            <p className="eyebrow text-orange">
              <SectionIndex n={index} dark />
              {boundaries.eyebrow}
            </p>
            <h2 className="display mt-4 max-w-[16ch] text-[26px] text-paper md:text-[46px]">
              {boundaries.h2}
            </h2>
          </div>
          <p className="mt-6 max-w-[60ch] text-[17px] text-on-dark md:mt-1">
            {boundaries.intro}
          </p>
        </div>

        <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {boundaries.items.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-white/10 bg-graphite p-6"
            >
              <h3 className="text-[18px] font-semibold leading-snug text-orange">
                {item.title}
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-on-dark">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-[80ch] border-l-2 border-orange pl-4 text-[16px] text-on-dark md:mt-14">
          {boundaries.closing}
        </p>
      </div>
    </section>
  );
}

export default BoundariesSection;
