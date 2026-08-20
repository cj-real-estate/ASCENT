import Link from "next/link";
import type { Vertical } from "@/content/verticals/types";
import { Container } from "./Container";
import { Lockup } from "./Lockup";
import { ctaButtonCompactClasses } from "./CtaButton";

export function Header({ vertical }: { vertical: Vertical }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line-dark bg-ink">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Ascent Client Acquisition Systems — home"
          className="inline-flex min-h-11 items-center"
        >
          <Lockup />
        </Link>
        <a href="#book" className={ctaButtonCompactClasses}>
          {vertical.header.ctaLabel}
        </a>
      </Container>
    </header>
  );
}
