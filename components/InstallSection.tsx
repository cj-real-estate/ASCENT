import type { Vertical } from "@/content/verticals/types";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export function InstallSection({ vertical }: { vertical: Vertical }) {
  const { install } = vertical;
  return (
    <section className="bg-surface">
      <Container className="py-16 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-x-16">
        <div>
          <Eyebrow tone="deep">{install.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl leading-[1.06] tracking-[-0.01em] text-ink sm:text-4xl">
            {install.heading}
          </h2>
          {/* Deliberately unnumbered — these run in parallel, not sequence. */}
          <ul className="mt-10 border-y border-[#d9d9d9]">
            {install.items.map((item) => (
              <li
                key={item.title}
                className="border-t border-[#d9d9d9] py-6 first:border-t-0"
              >
                <h3 className="text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-slate">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 lg:mt-0">
          <div className="bg-ink p-7 sm:p-9 lg:sticky lg:top-24">
            <h3 className="font-display text-2xl leading-tight text-white sm:text-[1.75rem]">
              {install.ownerCard.heading}
            </h3>
            <ol className="mt-8 list-none space-y-7">
              {install.ownerCard.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[auto_1fr] gap-x-4"
                >
                  <span
                    aria-hidden="true"
                    className="pt-0.5 font-mono text-sm font-semibold text-accent"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-on-dark">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-t border-line-dark pt-6 text-[0.9375rem] text-on-dark">
              {install.ownerCard.closingLine}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
