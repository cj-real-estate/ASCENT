import type { Vertical } from "@/content/verticals/types";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export function ProblemSection({ vertical }: { vertical: Vertical }) {
  const { problem } = vertical;
  return (
    <section className="bg-paper">
      <Container className="py-16 sm:py-24 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <Eyebrow tone="deep">{problem.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl leading-[1.06] tracking-[-0.01em] text-ink sm:text-4xl">
            {problem.heading}
          </h2>
        </div>
        <div className="mt-8 max-w-prose space-y-5 text-[1.0625rem] leading-relaxed text-ink lg:col-span-7 lg:mt-2">
          {problem.paragraphs.map((paragraph, index) =>
            index === problem.paragraphs.length - 1 ? (
              <p
                key={paragraph}
                className="border-l-2 border-accent pl-5 font-medium"
              >
                {paragraph}
              </p>
            ) : (
              <p key={paragraph}>{paragraph}</p>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}
