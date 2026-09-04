import type { Vertical } from "@content/verticals/types";
import ArrowRight from "@/components/ArrowRight";

/*
 * Hero — light, two columns on desktop: the claim on the left, the real
 * campaign report on the right as the page's hero object. Every number in
 * the card is one of the attributed Prestige Fence figures
 * (proof.reportCard) with the attribution line inside the card; the chips
 * floating around it are practice claims from content, never numbers.
 * Still the only <h1>. A vertical without a report card falls back to the
 * three-stat strip.
 */

// Chip positions on desktop — each straddles a card EDGE (never a tile, so
// no number is ever covered); below lg they flow in a row under the card.
const CHIP_POSITIONS = [
  "lg:-left-6 lg:-top-5",
  "lg:-right-6 lg:-top-5",
  "lg:-right-4 lg:-bottom-5",
];

export default function Hero({ vertical }: { vertical: Vertical }) {
  const { hero, proof } = vertical;
  const highlight = hero.h1Highlight;
  const card = proof.reportCard;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-paper pb-16 pt-14 md:pb-24 md:pt-20"
    >
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

      <div className="section-shell relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="eyebrow text-orange-deep">{hero.eyebrow}</p>
          <h1 className="display mt-6 max-w-[15ch] text-balance text-[36px] text-ink min-[380px]:text-[42px] md:text-[58px] xl:text-[64px]">
            {highlight && hero.h1.includes(highlight) ? (
              <>
                {hero.h1.slice(0, hero.h1.indexOf(highlight))}
                <span className="text-orange">{highlight}</span>
                {hero.h1.slice(hero.h1.indexOf(highlight) + highlight.length)}
              </>
            ) : (
              hero.h1
            )}
          </h1>
          <p className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-slate md:text-[19px]">
            {hero.sub}
          </p>
          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:items-start">
            <a
              href="#book"
              data-open-lead-modal
              className="btn-primary w-full px-9 text-[17px] sm:w-auto"
            >
              {hero.cta}
              <ArrowRight />
            </a>
            {hero.secondaryCta ? (
              <a
                href="#book"
                data-open-lead-modal
                data-intent="strategy-call"
                className="btn-secondary w-full px-8 text-[16px] sm:w-auto"
              >
                {hero.secondaryCta}
              </a>
            ) : null}
          </div>
          <p className="eyebrow mt-4 !text-[12px] text-slate">{hero.microcopy}</p>
        </div>

        {card ? (
          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            {/* Glow behind the card so it reads as lifted off the page. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22]"
              style={{
                background:
                  "radial-gradient(closest-side, var(--orange), transparent 70%)",
              }}
            />

            <div className="relative overflow-hidden rounded-2xl border border-ink bg-ink p-6 shadow-card motion-safe:animate-[hero-rise_700ms_cubic-bezier(0.2,0.7,0.2,1)_both] md:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-[280px] w-[280px] rounded-full opacity-[0.18]"
                style={{
                  background:
                    "radial-gradient(closest-side, var(--orange), transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-on-dark">
                    {card.title}
                  </p>
                  <span aria-hidden="true" className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                  </span>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
                  {card.rows.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-lg border border-white/10 bg-graphite p-4"
                    >
                      <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-fog">
                        {row.label}
                      </dt>
                      <dd className="readout mt-2 text-[24px] text-paper md:text-[28px]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 rounded-lg border border-orange/40 bg-graphite p-4">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-fog">
                    {card.footerLabel}
                  </p>
                  <p className="readout mt-2 text-[28px] leading-none text-orange md:text-[34px]">
                    {card.footerValue}
                  </p>
                </div>
                <p className="mt-4 font-mono text-[11px] tracking-[0.02em] text-fog">
                  {proof.attributionLine ??
                    "[NEEDS ATTRIBUTION LINE — whose results, which market, what period]"}
                </p>
              </div>
            </div>

            {hero.chips.length > 0 ? (
              <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:contents">
                {hero.chips.slice(0, CHIP_POSITIONS.length).map((chip, i) => (
                  <li
                    key={chip}
                    className={`inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-semibold text-ink shadow-card motion-safe:animate-[hero-rise_700ms_cubic-bezier(0.2,0.7,0.2,1)_both] lg:absolute ${CHIP_POSITIONS[i]}`}
                    style={{ animationDelay: `${250 + i * 120}ms` }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full bg-orange"
                    />
                    {chip}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <ul className="grid gap-6 border-t border-line pt-8 sm:grid-cols-3 sm:gap-8 lg:col-span-2">
            {proof.stats.map((stat) => (
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
        )}
      </div>
    </section>
  );
}
