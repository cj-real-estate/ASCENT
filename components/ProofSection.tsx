import Image from "next/image";
import type { Vertical } from "@/content/verticals/types";
import { Container } from "./Container";

export function ProofSection({ vertical }: { vertical: Vertical }) {
  const { proof } = vertical;
  return (
    <section className="bg-paper">
      <Container className="py-16 sm:py-24">
        <p className="max-w-2xl text-lg font-semibold leading-snug text-ink sm:text-xl">
          {proof.framingLine}
        </p>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-3">
          {proof.stats.map((stat) => (
            <div key={stat.label} className="border-t-2 border-ink pt-5">
              {/* Large text — full-strength orange holds 3:1 on Paper at this size. */}
              <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums text-accent sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 max-w-[16rem] text-sm leading-snug text-slate">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        {proof.screenshots && proof.screenshots.length > 0 && (
          <div className="mt-12 space-y-8">
            {proof.screenshots.map((shot) => (
              <figure key={shot.src} className="border border-line-light">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  className="h-auto w-full"
                  sizes="(min-width: 1152px) 1088px, 100vw"
                />
              </figure>
            ))}
          </div>
        )}
        {/*
         * Attribution is the client's sentence, not ours — the placeholder
         * stays visible until he supplies it. Slate rather than fog here:
         * fog fails contrast on Paper.
         */}
        <p className="mt-10 font-mono text-[0.8125rem] font-medium text-slate">
          {proof.attributionLine ?? "[NEEDS ATTRIBUTION LINE]"}
        </p>
      </Container>
    </section>
  );
}
