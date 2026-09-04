import type { Vertical } from "@content/verticals/types";
import ArrowRight from "@/components/ArrowRight";

const systemStages = [
  { index: "01", label: "Lead captured", state: "Fast response" },
  { index: "02", label: "Text + email", state: "Follow-up running" },
  { index: "03", label: "Reply received", state: "Routed to your team" },
  { index: "04", label: "Outcome logged", state: "Revenue attributed" },
];

export default function Hero({ vertical }: { vertical: Vertical }) {
  const stats = vertical.proof.stats;
  const highlight = vertical.hero.h1Highlight;

  return (
    <section
      id="top"
      data-dark=""
      className="hero-grid relative overflow-hidden bg-ink pb-12 pt-14 md:pb-16 md:pt-20"
    >
      <div className="hero-orbit" aria-hidden="true" />

      <div className="section-shell relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div>
          <p className="eyebrow text-orange">{vertical.hero.eyebrow}</p>
          <h1 className="display mt-6 max-w-[15ch] text-[40px] text-paper min-[380px]:text-[46px] md:text-[64px] xl:text-[72px]">
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
          <p className="mt-7 max-w-[58ch] text-[17px] leading-relaxed text-on-dark md:text-[19px]">
            {vertical.hero.sub}
          </p>
          <div className="mt-9 flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#book"
              data-open-lead-modal
              className="btn-primary w-full px-8 text-[16px] sm:w-auto"
            >
              {vertical.hero.cta}
              <ArrowRight />
            </a>
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-fog">
              {vertical.hero.microcopy}
            </p>
          </div>
        </div>

        <div className="system-panel relative rounded-2xl border border-white/15 bg-graphite/85 p-5 shadow-2xl md:p-7">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                Acquisition operating system
              </p>
              <p className="mt-1 text-[16px] font-semibold text-paper">
                One connected revenue loop
              </p>
            </div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-on-dark">
              <span className="status-dot" /> Live
            </span>
          </div>

          <ol className="mt-2">
            {systemStages.map((stage, i) => (
              <li
                key={stage.index}
                className="system-stage relative grid grid-cols-[34px_1fr] gap-3 border-b border-white/10 py-4 last:border-0"
              >
                <span className="readout text-[12px] text-orange">
                  {stage.index}
                </span>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="text-[15px] font-semibold text-paper">
                    {stage.label}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-on-dark">
                    {stage.state}
                  </span>
                </div>
                {i < systemStages.length - 1 ? (
                  <span className="system-connector" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>

          <p className="mt-3 rounded-lg bg-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-on-dark">
            Your name. Your number. Your pipeline.
          </p>
        </div>
      </div>

      <div className="section-shell relative mt-14 md:mt-20">
        <ul className="grid gap-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:grid-cols-3">
          {stats.map((stat) => (
            <li
              key={stat.number}
              className="border-b border-white/10 p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:p-7"
            >
              <p className="readout text-[24px] text-orange md:text-[28px]">
                {stat.number}
              </p>
              <p className="mt-1 max-w-[34ch] text-[13px] leading-snug text-on-dark">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
