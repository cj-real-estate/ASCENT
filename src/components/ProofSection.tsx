import Image from "next/image";
import type { Vertical } from "@content/verticals/types";

/*
 * Proof section — light. Server component.
 *
 * Background is Surface here: this section has no eyebrow, so it is the one
 * light section where the gray band costs no contrast (Orange Deep is
 * 4.43:1 on Surface). Stat numbers are ≥34px, where plain Orange clears the
 * 3:1 large-text floor on Surface.
 * Three stats on hairline rules (instrument panel, not cards), an
 * attribution line beneath, and — once supplied — ad-account screenshots.
 * attributionLine === null renders a VISIBLE placeholder on purpose
 * (BUILD-NOTES copy discipline): never substitute vague filler.
 */
export function ProofSection({ vertical }: { vertical: Vertical }) {
  const { proof } = vertical;

  return (
    <section className="cv-auto bg-surface py-16 md:py-28">
      <div className="section-shell">
        <h2 className="sr-only">{proof.srHeading}</h2>

        {/* Names the trade the case came from, on pages whose reader is in
            some other trade. Never genericised into "a client". */}
        {proof.framingLine && (
          <p className="mb-10 max-w-[60ch] text-[20px] font-semibold text-ink md:text-[26px]">
            {proof.framingLine}
          </p>
        )}

        <div className="grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {proof.stats.map((stat) => (
            <div key={stat.number} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="readout text-[34px] text-orange md:text-[46px]">
                {stat.number}
              </p>
              <p className="mt-2 max-w-[40ch] text-[15px] text-slate">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {proof.reportCard ? (
          /* Dashboard-styled, but every value is an attributed number from
             the stats above — presentation, not new data. */
          <div className="mt-12 max-w-[720px] rounded-xl border border-ink bg-ink p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-on-dark">
                {proof.reportCard.title}
              </p>
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {proof.reportCard.rows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-white/10 bg-graphite p-4"
                >
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-fog">
                    {row.label}
                  </dt>
                  <dd className="readout mt-2 text-[24px] text-orange md:text-[28px]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-white/10 bg-graphite p-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-fog">
                {proof.reportCard.footerLabel}
              </p>
              <p className="readout text-[22px] text-paper md:text-[26px]">
                {proof.reportCard.footerValue}
              </p>
            </div>
          </div>
        ) : null}

        <p className="mt-6 font-mono text-[12px] tracking-[0.02em] text-slate">
          {proof.attributionLine ??
            "[NEEDS ATTRIBUTION LINE — whose results, which market, what period]"}
        </p>

        {proof.screenshots.length > 0 && (
          <div className="mt-10 space-y-6">
            {proof.screenshots.map((shot) => (
              <div
                key={shot.src}
                className="overflow-hidden rounded-md border border-line"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProofSection;
