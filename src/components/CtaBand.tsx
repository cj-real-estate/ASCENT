import type { Vertical } from "@content/verticals/types";
import ArrowRight from "./ArrowRight";

/*
 * The mid-page re-ask: an orange panel, not a full-bleed band, so it reads
 * as a designed object on the page like every other panel. The one loud
 * moment. Ink on orange rests at 4.97:1; the button is the ink pill because
 * orange-on-orange can't work, and .bg-orange overrides the global focus
 * ring to ink (globals.css). Reuses the booking headline and the hero
 * CTA/microcopy verbatim; no new strings.
 */
export function CtaBand({ vertical }: { vertical: Vertical }) {
  return (
    <section className="cv-auto bg-paper py-8 md:py-14">
      <div className="section-shell">
        <div className="panel relative overflow-hidden bg-orange">
          {/* Deepened corner wash so the flat orange has some depth. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(closest-side, var(--orange-deep), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
            <h2 className="display max-w-[18ch] text-[30px] text-ink md:text-[46px]">
              {vertical.booking.h2}
            </h2>
            <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
              <a
                href="#book"
                data-open-lead-modal
                className="btn-dark px-8 text-[17px]"
              >
                {vertical.hero.cta}
                <ArrowRight />
              </a>
              <p className="eyebrow !text-[12px] text-ink">
                {vertical.hero.microcopy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
