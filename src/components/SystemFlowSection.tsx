import type { Vertical } from "@content/verticals/types";
import SectionIndex from "./SectionIndex";
import ServiceIcon from "./ServiceIcon";
import ArrowRight from "./ArrowRight";
import { AscentMark } from "./Logo";

/*
 * The mechanism, drawn — the page's one real diagram, and the reason the
 * word "system" is believable anywhere else on the page. Four stage cards
 * on a dark panel, connected by arrows that sit in the grid gutters (and
 * rotate to point down when the grid stacks).
 *
 * Content rule, enforced in types.ts: stage copy says what the system DOES.
 * No counts, no rates, no dollars — performance claims live in ProofSection,
 * attributed. Renders nothing when the vertical carries no systemFlow.
 */
export function SystemFlowSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { systemFlow } = vertical;
  if (systemFlow === null) return null;
  const last = systemFlow.stages.length - 1;

  return (
    <section className="cv-auto bg-paper py-8 md:py-14">
      <div className="section-shell">
        <div
          data-dark
          className="panel grid-texture relative overflow-hidden bg-ink shadow-card"
        >
          {/* Our own mark as watermark, not a soft gradient orb — brand
              geometry reads as a decision; a floating blur reads as filler. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-16 opacity-[0.05]"
          >
            <AscentMark variant="onDark" className="h-[420px] w-auto" />
          </div>
          <div className="relative">
            <p className="eyebrow text-orange">
              <SectionIndex n={index} dark />
              {systemFlow.eyebrow}
            </p>
            <h2 className="display mt-4 max-w-[20ch] text-[26px] text-paper md:text-[46px]">
              {systemFlow.h2}
            </h2>
            <p className="mt-6 max-w-[68ch] text-[17px] text-on-dark">
              {systemFlow.sub}
            </p>

            <ol className="relative mt-12 grid gap-x-8 gap-y-12 md:mt-14 lg:grid-cols-4 lg:gap-y-0">
              {/* The track the stages sit on. Only visible in the gutters —
                  the cards are opaque and paint over it. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-white/10 lg:block"
              />
              {systemFlow.stages.map((stage, i) => (
                <li
                  key={stage.title}
                  className="relative rounded-xl border border-white/10 bg-graphite p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="icon-tile">
                      <ServiceIcon name={stage.icon} />
                    </span>
                    <span
                      aria-hidden="true"
                      className="readout text-[13px] text-fog"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[18px] font-semibold leading-snug text-paper">
                    {stage.title}
                  </h3>
                  {stage.badge ? (
                    <p className="mt-3 inline-flex w-fit items-center rounded-full bg-orange px-3 py-1 font-mono text-[12px] font-medium tracking-[0.04em] text-ink">
                      {stage.badge}
                    </p>
                  ) : null}
                  <p className="mt-3 text-[15px] leading-relaxed text-on-dark">
                    {stage.body}
                  </p>

                  {/* Flow arrow, drawn in the gutter after every card but
                      the last. Points right across columns, down when the
                      grid stacks. */}
                  {i < last ? (
                    <span
                      aria-hidden="true"
                      className="absolute text-orange max-lg:bottom-[-30px] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:rotate-90 lg:right-[-26px] lg:top-1/2 lg:-translate-y-1/2"
                    >
                      <ArrowRight />
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            <p className="mt-12 border-t border-white/15 pt-6 text-[17px] font-semibold text-paper md:mt-14">
              {systemFlow.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SystemFlowSection;
