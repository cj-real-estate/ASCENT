import type { Vertical } from "@content/verticals/types";
import { AscentMark } from "./Logo";
import SectionIndex from "./SectionIndex";

/*
 * Problem section — light (bg-paper). Server component, no interactivity.
 * Reference-site split: heading column left, argument column right, so the
 * section reads as a spread rather than a stack. All copy from the vertical
 * content module, verbatim. The final paragraph is the pivot to Ascent and
 * gets a quiet left rule.
 */
export function ProblemSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { problem } = vertical;
  const lastIndex = problem.paragraphs.length - 1;

  return (
    <section className="relative overflow-hidden cv-auto bg-paper py-16 md:py-28">
      {/* The brand mark as quiet texture — ours, not stock. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-8 opacity-[0.05]"
      >
        <AscentMark variant="onLight" className="h-[340px] w-auto" />
      </div>
      <div className="section-shell md:grid md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <p className="eyebrow text-orange-deep">
            <SectionIndex n={index} />
            {problem.eyebrow}
          </p>
          <h2 className="display mt-4 max-w-[16ch] text-[26px] text-ink md:text-[46px]">
            {problem.h2}
          </h2>
        </div>
        <div className="mt-8 max-w-[60ch] space-y-6 md:mt-1">
          {problem.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === lastIndex
                  ? "border-l-2 border-orange pl-4 text-[17px] font-semibold text-ink"
                  : "text-[17px] text-ink"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
