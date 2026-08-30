import type { Vertical } from "@content/verticals/types";
import Calculator from "@/components/Calculator";
import ArrowRight from "@/components/ArrowRight";

/*
 * Hero — the one dark opening section and the only <h1> on the page.
 * Mobile order: eyebrow → h1 → sub → calculator → CTA → microcopy.
 * Desktop: 12-col grid, copy left (~5 cols), calculator card right (~7 cols).
 */
export default function Hero({ vertical }: { vertical: Vertical }) {
  const stats = vertical.proof.stats;
  const highlight = vertical.hero.h1Highlight;
  return (
    <section id="top" data-dark className="relative overflow-hidden bg-ink py-16 md:py-24">
      {/* One quiet orange glow behind the calculator card. Decorative,
          brand-palette only, and cheap — a radial gradient, no images. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-[0.14]"
        style={{
          background:
            "radial-gradient(closest-side, var(--orange), transparent 70%)",
        }}
      />
      <div className="section-shell relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <p className="eyebrow text-orange">{vertical.hero.eyebrow}</p>
          <h1 className="display mt-5 text-[34px] text-paper min-[380px]:text-[40px] md:text-[54px] xl:text-[62px]">
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
          <p className="mt-6 text-[17px] text-on-dark">{vertical.hero.sub}</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <Calculator
            calculator={vertical.calculator}
            ctaLabel={vertical.hero.cta}
            ctaMicrocopy={vertical.hero.microcopy}
          />
        </div>

        {/* Standalone CTA lives in the left column on desktop only — on
            mobile the calculator card's own CTA is directly above this
            spot, and two identical stacked buttons read as a bug. */}
        <div className="hidden lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:block lg:self-start">
          <a href="#book" className="btn-primary w-full sm:w-auto">
            {vertical.hero.cta}
            <ArrowRight />
          </a>
          <p className="eyebrow mt-4 !text-[12px] text-fog">{vertical.hero.microcopy}</p>
        </div>
      </div>

      {/* Numbers strip — the proof section's own stats, compressed to a
          single row so there's a real result above the fold. The full
          presentation (framing + attribution) still lives in ProofSection. */}
      <div className="section-shell relative mt-12 md:mt-16">
        <ul className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <li key={stat.number}>
              <p className="readout text-[22px] text-orange md:text-[26px]">
                {stat.number}
              </p>
              <p className="mt-1 max-w-[30ch] text-[13px] leading-snug text-fog">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
