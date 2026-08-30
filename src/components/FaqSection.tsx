import type { Vertical } from "@content/verticals/types";

/*
 * FAQ — light (bg-paper), accordion via native <details>/<summary>: correct
 * keyboard and screen-reader behavior with zero client JavaScript. Placed
 * right before the booking section so objections get answered at the moment
 * of the ask. Renders nothing when the vertical carries no FAQ.
 *
 * Content rule inherited from the module: answers restate facts already
 * published on the page — never new claims.
 */
export function FaqSection({ vertical }: { vertical: Vertical }) {
  const { faq } = vertical;
  if (faq === null) return null;

  return (
    <section className="cv-auto bg-paper py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange-deep">{faq.eyebrow}</p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-ink md:text-[46px]">
          {faq.h2}
        </h2>

        <div className="mt-10 max-w-[820px] md:mt-14">
          {faq.items.map((item) => (
            <details
              key={item.q}
              className="group border-t border-line last:border-b"
            >
              <summary className="flex min-h-[44px] cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-[17px] font-semibold text-ink [&::-webkit-details-marker]:hidden md:text-[20px]">
                {item.q}
                {/* Plus that becomes a minus — drawn with characters the
                    self-hosted latin subsets actually carry. */}
                <span
                  aria-hidden="true"
                  className="readout shrink-0 text-[20px] text-orange-deep group-open:hidden"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="readout hidden shrink-0 text-[20px] text-orange-deep group-open:inline"
                >
                  −
                </span>
              </summary>
              <p className="max-w-[68ch] pb-6 text-[17px] leading-relaxed text-slate">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
