import type { Vertical } from "@/content/verticals/types";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Calculator } from "./Calculator";
import { ctaButtonClasses } from "./CtaButton";

export function Hero({ vertical }: { vertical: Vertical }) {
  const { hero, calculator } = vertical;
  return (
    <section className="bg-ink">
      <Container className="pb-16 pt-10 sm:pb-24 sm:pt-16 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-6">
          <Eyebrow tone="accent">{hero.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-[2.125rem] leading-[1.04] tracking-[-0.01em] text-white sm:text-5xl xl:text-[3.4rem]">
            {hero.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-dark sm:text-lg">
            {hero.sub}
          </p>
        </div>
        <div className="mt-10 lg:col-span-6 lg:row-span-2 lg:mt-0">
          <Calculator content={calculator} />
        </div>
        <div className="mt-8 lg:col-span-6 lg:mt-0 lg:self-end lg:pb-1">
          <a href="#book" className={`${ctaButtonClasses} w-full sm:w-auto`}>
            {hero.ctaLabel}
          </a>
          <p className="mt-4 font-mono text-xs font-medium uppercase tracking-[0.12em] text-fog">
            {hero.microcopy}
          </p>
        </div>
      </Container>
    </section>
  );
}
