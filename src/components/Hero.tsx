import type { Vertical } from "@content/verticals/types";
import Calculator from "@/components/Calculator";

/*
 * Hero — the one dark opening section and the only <h1> on the page.
 * Mobile order: eyebrow → h1 → sub → calculator → CTA → microcopy.
 * Desktop: 12-col grid, copy left (~5 cols), calculator card right (~7 cols).
 */
export default function Hero({ vertical }: { vertical: Vertical }) {
  return (
    <section id="top" data-dark className="bg-ink py-16 md:py-24">
      <div className="section-shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <p className="eyebrow text-orange">{vertical.hero.eyebrow}</p>
          <h1 className="display mt-5 text-[34px] text-paper min-[380px]:text-[40px] md:text-[54px] xl:text-[62px]">
            {vertical.hero.h1}
          </h1>
          <p className="mt-6 text-[17px] text-on-dark">{vertical.hero.sub}</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <Calculator
            calculator={vertical.calculator}
            ctaLabel={vertical.hero.cta}
            ctaMicrocopy={vertical.hero.microcopy}
          />
        </div>

        {/* Standalone CTA lives in the left column on desktop only — on
            mobile the calculator card's own CTA is directly above this
            spot, and two identical stacked buttons read as a bug. */}
        <div className="hidden lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:block lg:self-start">
          <a
            href="#book"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-orange px-6 font-semibold text-ink hover:bg-orange-deep hover:text-paper sm:w-auto"
          >
            {vertical.hero.cta}
          </a>
          <p className="eyebrow mt-4 !text-[12px] text-fog">{vertical.hero.microcopy}</p>
        </div>
      </div>
    </section>
  );
}
