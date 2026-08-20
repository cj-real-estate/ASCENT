import Link from "next/link";
import type { Vertical } from "@content/verticals/types";
import { AscentLockup } from "@/components/Logo";

/*
 * Sticky site header. Sits over the ink hero, so the background is solid
 * Ink and the lockup runs in its white reverse variant. No nav — one CTA.
 */
export default function Header({ vertical }: { vertical: Vertical }) {
  const name = vertical.business.name;
  const tagline = name.split(" ").slice(1).join(" ");

  return (
    <header className="sticky top-0 z-50 bg-ink" data-dark>
      <div className="section-shell flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href="/" aria-label={name} className="shrink-0">
          <AscentLockup variant="onDark" name={name} tagline={tagline} responsive />
        </Link>
        <a
          href="#book"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-orange px-5 text-[14px] font-semibold text-ink hover:bg-orange-deep hover:text-paper"
        >
          {vertical.header.cta}
        </a>
      </div>
    </header>
  );
}
