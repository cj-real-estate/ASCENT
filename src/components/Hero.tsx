import type { Vertical } from "@content/verticals/types";
import ArrowRight from "@/components/ArrowRight";

/*
 * Hero — the one dark opening section and the only <h1> on the page.
 *
 * A centered brand statement, reference-site style: eyebrow, headline with
 * one phrase in orange, a single line on what Ascent installs, one CTA, and
 * the real-numbers strip. The calculator deliberately does NOT live here —
 * the hero sells the firm and the system; CalculatorSection quantifies the
 * problem right after ProblemSection describes it.
 */
export default function Hero({ vertical }: { vertical: Vertical }) {
  const stats = vertical.proof.stats;
  const highlight = vertical.hero.h1Highlight;
  return (
    <section id="top" data-dark className="relative overflow-hidden bg-ink py-20 md:py-28">
      {/* One quiet orange glow. Decorative, brand palette only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-260px] h-[620px] w-[620px] -translate-x-1/2 rounded-full opacity-[0.13]"
        style={{
          background:
            "radial-gradient(closest-side, var(--orange), transparent 70%)",
        }}
      />

      <div className="section-shell relative flex flex-col items-center text-center">
        <p className="eyebrow text-orange">{vertical.hero.eyebrow}</p>
        <h1 className="display mt-6 max-w-[17ch] text-[36px] text-paper min-[380px]:text-[42px] md:text-[58px] xl:text-[66px]">
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
        <p className="mt-7 max-w-[62ch] text-[17px] leading-relaxed text-on-dark md:text-[19px]">
          {vertical.hero.sub}
        </p>
        <a href="#book" className="btn-primary mt-9 w-full px-9 text-[17px] sm:w-auto">
          {vertical.hero.cta}
          <ArrowRight />
        </a>
        <p className="eyebrow mt-4 !text-[12px] text-fog">
          {vertical.hero.microcopy}
        </p>
      </div>

      {/* Real numbers above the fold; full framing + attribution stays in
          ProofSection. */}
      <div className="section-shell relative mt-14 md:mt-20">
        <ul className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <li key={stat.number} className="sm:text-center">
              <p className="readout text-[22px] text-orange md:text-[26px]">
                {stat.number}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-fog sm:mx-auto sm:max-w-[30ch]">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
