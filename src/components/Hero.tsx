import type { Vertical } from "@content/verticals/types";
import ArrowRight from "@/components/ArrowRight";

/*
 * Hero — light now, reference-site style: paper ground with two soft warm
 * glows, ink display with one phrase in orange, one primary CTA and the
 * outline second path, then the real-numbers strip. Still the only <h1>.
 * The calculator deliberately does NOT live here — the hero sells the firm
 * and the system; CalculatorSection quantifies the problem right after
 * ProblemSection describes it.
 */
export default function Hero({ vertical }: { vertical: Vertical }) {
  const stats = vertical.proof.stats;
  const highlight = vertical.hero.h1Highlight;
  return (
    <section id="top" className="relative overflow-hidden bg-paper pb-16 pt-16 md:pb-24 md:pt-24">
      {/* Two quiet warm glows, brand palette only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-220px] h-[560px] w-[560px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, var(--orange-tint), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[-140px] h-[480px] w-[480px] rounded-full opacity-[0.16]"
        style={{
          background:
            "radial-gradient(closest-side, var(--orange), transparent 70%)",
        }}
      />

      <div className="section-shell relative flex flex-col items-center text-center">
        <p className="eyebrow text-orange-deep">{vertical.hero.eyebrow}</p>
        <h1 className="display mt-6 max-w-[17ch] text-[36px] text-ink min-[380px]:text-[42px] md:text-[58px] xl:text-[66px]">
          {highlight && vertical.hero.h1.includes(highlight) ? (
            <>
              {vertical.hero.h1.slice(0, vertical.hero.h1.indexOf(highlight))}
              <span className="text-orange">{highlight}</span>
              {vertical.hero.h1.slice(
                vertical.hero.h1.indexOf(highlight) + highlight.length,
              )}
            </>
          ) : (
            vertical.hero.h1
          )}
        </h1>
        <p className="mt-7 max-w-[62ch] text-[17px] leading-relaxed text-slate md:text-[19px]">
          {vertical.hero.sub}
        </p>
        <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a
            href="#book"
            data-open-lead-modal
            className="btn-primary w-full px-9 text-[17px] sm:w-auto"
          >
            {vertical.hero.cta}
            <ArrowRight />
          </a>
          {vertical.hero.secondaryCta ? (
            <a
              href="#book"
              data-open-lead-modal
              data-intent="strategy-call"
              className="btn-secondary w-full px-8 text-[16px] sm:w-auto"
            >
              {vertical.hero.secondaryCta}
            </a>
          ) : null}
        </div>
        <p className="eyebrow mt-4 !text-[12px] text-slate">
          {vertical.hero.microcopy}
        </p>
      </div>

      {/* Real numbers above the fold; full framing + attribution stays in
          ProofSection. Numbers stay ≥24px so plain orange clears the
          large-text floor on paper. */}
      <div className="section-shell relative mt-14 md:mt-20">
        <ul className="grid gap-6 border-t border-line pt-8 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <li key={stat.number} className="sm:text-center">
              <p className="readout text-[24px] text-orange md:text-[28px]">
                {stat.number}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-slate sm:mx-auto sm:max-w-[30ch]">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
