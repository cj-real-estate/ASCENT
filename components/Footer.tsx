import Link from "next/link";
import type { Vertical } from "@/content/verticals/types";
import { Container } from "./Container";
import { Lockup } from "./Lockup";

export function Footer({ vertical }: { vertical: Vertical }) {
  const { footer } = vertical;
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line-dark bg-ink">
      <Container className="py-12 sm:py-16">
        <Lockup withTagline />
        <div className="mt-8 flex flex-col gap-4 text-sm text-on-dark sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p>{footer.businessName}</p>
            <p className="mt-1 text-fog">{footer.location}</p>
          </div>
          <div className="space-y-1 font-mono text-xs font-medium uppercase tracking-[0.1em] text-fog sm:text-right">
            {/* [DECISION] — visible placeholders until the client supplies them. */}
            {footer.phone ? (
              <p>
                <a
                  href={`tel:${footer.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-on-dark"
                >
                  {footer.phone}
                </a>
              </p>
            ) : (
              <p>[Phone — pending]</p>
            )}
            {footer.email ? (
              <p>
                <a
                  href={`mailto:${footer.email}`}
                  className="normal-case hover:text-on-dark"
                >
                  {footer.email}
                </a>
              </p>
            ) : (
              <p>[Email — pending]</p>
            )}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-line-dark pt-6 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {footer.businessName}. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-on-dark sm:min-h-0"
          >
            Privacy
          </Link>
        </div>
      </Container>
    </footer>
  );
}
