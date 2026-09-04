import { Fragment } from "react";
import type { Vertical } from "@content/verticals/types";
import ArrowRight from "@/components/ArrowRight";

/*
 * Hero — light, two columns on desktop: the claim on the left, and on the
 * right the thing the setter actually produces — a week of appointments
 * landing on the owner's calendar. The calendar is illustrative and says
 * so through its labels: generic blocks ("Booked", "Setter call"), no
 * names, no dollar figures, no counts presented as results. Real numbers
 * live in ProofSection, attributed. The chips around the card are practice
 * claims from content. Still the only <h1>. A vertical without calendar
 * content falls back to the three-stat strip.
 */

// Chip positions on desktop — each straddles a card EDGE (never the grid,
// so nothing is covered); below lg they flow in a row under the card.
const CHIP_POSITIONS = [
  "lg:-left-6 lg:-top-5",
  "lg:-right-6 lg:-top-5",
  "lg:-right-4 lg:-bottom-5",
];

const RISE = "motion-safe:animate-[hero-rise_600ms_cubic-bezier(0.2,0.7,0.2,1)_both]";

function PhoneGlyph() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M5.2 4h3l1.5 3.8-1.9 1.5a12.5 12.5 0 0 0 5.9 5.9l1.5-1.9L19 14.8v3a1.8 1.8 0 0 1-2 1.8C10 18.9 5.1 14 4.4 7a1.8 1.8 0 0 1 .8-3Z" />
    </svg>
  );
}

export default function Hero({ vertical }: { vertical: Vertical }) {
  const { hero, proof } = vertical;
  const highlight = hero.h1Highlight;
  const cal = hero.calendar;

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
          {hero.closingLine ? (
            <p className="mt-5 max-w-[40ch] text-[18px] font-semibold leading-snug text-ink md:text-[20px]">
              {hero.closingLine}
            </p>
          ) : null}
          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:items-start">
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

        {cal ? (
          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            {/* Glow behind the card so it reads as lifted off the page. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.2]"
              style={{
                background:
                  "radial-gradient(closest-side, var(--orange), transparent 70%)",
              }}
            />

            <div
              className={`relative rounded-2xl border border-line bg-paper p-5 shadow-card md:p-6 ${RISE}`}
            >
              <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate">
                  {cal.title}
                </p>
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                </span>
              </div>

              {/* Illustrative week: labels only, never data. Below sm the
                  card is too narrow for four day columns, so the fourth
                  hides and the grid drops to three. */}
              <div
                aria-hidden="true"
                className="mt-4 grid [grid-template-columns:44px_repeat(var(--days),minmax(0,1fr))] max-sm:[grid-template-columns:34px_repeat(3,minmax(0,1fr))]"
                style={{ "--days": cal.days.length } as React.CSSProperties}
              >
                <div />
                {cal.days.map((day, col) => (
                  <div
                    key={day}
                    className={`pb-2 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-slate ${
                      col >= 3 ? "max-sm:hidden" : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
                {cal.times.map((time, row) => (
                  <Fragment key={time}>
                    <div className="border-t border-line pr-2 pt-1.5 text-right font-mono text-[10px] text-fog">
                      {time}
                    </div>
                    {cal.days.map((day, col) => {
                      const block = cal.blocks.find(
                        (b) => b.day === col && b.row === row,
                      );
                      const order = block ? cal.blocks.indexOf(block) : 0;
                      return (
                        <div
                          key={`${day}-${time}`}
                          className={`min-h-[54px] border-l border-t border-line p-1 ${
                            col >= 3 ? "max-sm:hidden" : ""
                          }`}
                        >
                          {block ? (
                            <div
                              className={`h-full rounded-md px-2 py-1.5 max-sm:px-1.5 ${RISE} ${
                                block.kind === "call"
                                  ? "bg-ink text-paper"
                                  : "border-l-2 border-orange bg-orange-tint text-ink"
                              }`}
                              style={{ animationDelay: `${350 + order * 110}ms` }}
                            >
                              <p className="flex items-center gap-1 text-[11px] font-semibold leading-tight tracking-tight max-sm:text-[10px]">
                                {block.kind === "call" ? <PhoneGlyph /> : null}
                                {block.label}
                              </p>
                              <p
                                className={`mt-0.5 font-mono text-[10px] ${
                                  block.kind === "call" ? "text-on-dark" : "text-slate"
                                }`}
                              >
                                {block.time}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>

              {/* Key for the two block colors, so the graphic explains
                  itself instead of relying on the caption. */}
              <ul
                aria-hidden="true"
                className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3"
              >
                {cal.legend.map((entry) => (
                  <li
                    key={entry.label}
                    className="flex items-center gap-2 font-mono text-[11px] text-slate"
                  >
                    <span
                      className={
                        entry.kind === "call"
                          ? "h-3 w-3 shrink-0 rounded-[3px] bg-ink"
                          : "h-3 w-3 shrink-0 rounded-[3px] border-l-2 border-orange bg-orange-tint"
                      }
                    />
                    {entry.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-[0.02em] text-slate">
                {cal.caption}
              </p>
            </div>

            {hero.chips.length > 0 ? (
              <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:contents">
                {hero.chips.slice(0, CHIP_POSITIONS.length).map((chip, i) => (
                  <li
                    key={chip}
                    className={`inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-semibold text-ink shadow-card ${RISE} lg:absolute ${CHIP_POSITIONS[i]}`}
                    style={{ animationDelay: `${200 + i * 120}ms` }}
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
