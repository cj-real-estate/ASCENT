import Link from "next/link";
import type { Vertical } from "@content/verticals/types";
import { AscentLockup } from "@/components/Logo";

/*
 * Sticky site header. Sits over the light hero: translucent paper with a
 * blur and a hairline rule, lockup in its ink variant. No nav — one CTA.
 */
export default function Header({ vertical }: { vertical: Vertical }) {
  const name = vertical.business.name;
  const tagline = name.split(" ").slice(1).join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="section-shell flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href="/" aria-label={name} className="shrink-0">
          <AscentLockup variant="onLight" name={name} tagline={tagline} responsive />
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
