import type { Vertical } from "@content/verticals/types";
import ArrowRight from "./ArrowRight";

/*
 * Slim repeated CTA between sections — the reference pages re-ask after
 * every proof beat instead of waiting for the footer. Reuses the hero's CTA
 * and microcopy verbatim; no new strings.
 */
export function CtaBand({ vertical }: { vertical: Vertical }) {
  return (
    <section data-dark className="cv-auto border-y border-white/10 bg-ink py-10 md:py-12">
      <div className="section-shell flex flex-col items-center gap-4 text-center">
        <a href="#book" className="btn-primary px-8 text-[17px]">
          {vertical.hero.cta}
          <ArrowRight />
        </a>
        <p className="eyebrow !text-[12px] text-fog">{vertical.hero.microcopy}</p>
      </div>
    </section>
  );
}

export default CtaBand;
