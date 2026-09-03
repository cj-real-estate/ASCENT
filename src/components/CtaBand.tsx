import type { Vertical } from "@content/verticals/types";
import ArrowRight from "./ArrowRight";

/*
 * Full-bleed orange re-ask between sections, reference-site style: the one
 * loud moment on the page. Ink on orange rests at 4.97:1; the button is the
 * ink pill because orange-on-orange can't work. Reuses the booking headline
 * and the hero CTA/microcopy verbatim; no new strings.
 */
export function CtaBand({ vertical }: { vertical: Vertical }) {
  return (
    <section className="cv-auto bg-orange py-14 md:py-20">
      <div className="section-shell flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
        <h2 className="display max-w-[18ch] text-[30px] text-ink md:text-[46px]">
          {vertical.booking.h2}
        </h2>
        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          <a href="#book" data-open-lead-modal className="btn-dark px-8 text-[17px]">
            {vertical.hero.cta}
            <ArrowRight />
          </a>
          <p className="eyebrow !text-[12px] text-ink">{vertical.hero.microcopy}</p>
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
