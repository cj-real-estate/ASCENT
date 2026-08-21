import type { Vertical } from "@content/verticals/types";

/*
 * Founding Five section — light (bg-paper). Server component.
 * Short and high-emphasis. The count is manually maintained in the content
 * module (see fence.ts) — no timers, no animation, no decoration, on
 * purpose. At 0 the filled line replaces the counter.
 */
export function FoundingFiveSection({
  vertical,
  spotsRemaining,
}: {
  vertical: Vertical;
  spotsRemaining: number;
}) {
  const { foundingFive } = vertical;
  if (foundingFive === null) return null;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <h2 className="display max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {foundingFive.h2}
        </h2>
        <p className="mt-6 max-w-[68ch] text-[17px] text-ink">
          {foundingFive.body}
        </p>

        {/* Counter reads naturally as "5 of 5 spots remaining" — no ARIA */}
        {spotsRemaining > 0 ? (
          <p className="mt-10 flex items-baseline gap-4">
            <span className="readout text-[46px] text-orange md:text-[62px]">
              {spotsRemaining}
            </span>
            <span className="font-mono text-[14px] font-medium uppercase tracking-[0.12em] text-slate">
              {foundingFive.counterSuffix}
            </span>
          </p>
        ) : (
          <p className="display mt-10 text-[26px] text-ink md:text-[34px]">
            {foundingFive.filledLine}
          </p>
        )}
      </div>
    </section>
  );
}

export default FoundingFiveSection;
