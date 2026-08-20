import Image from "next/image";
import type { Vertical } from "@content/verticals/types";

/*
 * Proof section — light (bg-paper). Server component.
 * Three stats on hairline rules (instrument panel, not cards), an
 * attribution line beneath, and — once supplied — ad-account screenshots.
 * attributionLine === null renders a VISIBLE placeholder on purpose
 * (BUILD-NOTES copy discipline): never substitute vague filler.
 */
export function ProofSection({ vertical }: { vertical: Vertical }) {
  const { proof } = vertical;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <h2 className="sr-only">{proof.srHeading}</h2>

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
