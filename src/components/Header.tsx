import Link from "next/link";
import type { Vertical } from "@content/verticals/types";
import { BrandLockup } from "@/components/Logo";

/*
 * Sticky site header. Sits over the light hero: translucent paper with a
 * blur and a hairline rule, the v3 lockup on its light ground. No nav —
 * one CTA.
 */
export default function Header({ vertical }: { vertical: Vertical }) {
  const name = vertical.business.name;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="section-shell flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href="/" aria-label={name} className="shrink-0">
          {/* Two widths rather than one responsive component: under the
              230px lockup minimum BrandLockup drops the tagline itself,
              so the small screen gets the wordmark and md up gets the
              full lockup. */}
          <BrandLockup variant="onLight" width={168} name={name} priority className="md:hidden" />
          <BrandLockup
            variant="onLight"
            width={236}
            name={name}
            priority
            className="hidden md:block"
          />
        </Link>
        <a
          href="#book"
          data-open-lead-modal
          className="btn-primary shrink-0 !min-h-[44px] !px-5 text-[14px]"
        >
          {vertical.header.cta}
        </a>
      </div>
    </header>
  );
}
