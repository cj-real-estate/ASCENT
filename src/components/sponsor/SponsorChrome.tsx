import Link from "next/link";
import Image from "next/image";
import type { Vertical } from "@content/verticals/types";
import type { Guide } from "@content/guides/types";
import EyebrowText from "@/components/EyebrowText";
import { formatAddress } from "@/lib/business";

/*
 * The chrome the dark sponsor template shares with its guide pages and its
 * privacy page: the header, the footer, the logo and the shared style
 * strings. SponsorPage.tsx renders the page body; anything that has to
 * look like ascentforsponsors.com without being the sponsor page imports
 * from here.
 *
 * Links off these pages are ABSOLUTE (`vertical.business.url`), because
 * the sponsor pages are also reachable under /sponsors on ascentcas.com,
 * where "/guides/…" does not exist. An absolute link lands on the sponsor
 * domain from either host, and matches the canonical.
 */

export const shell = "section-shell";
export const h2 = "display max-w-[22ch] text-[30px] text-paper md:text-[46px]";
export const sub = "mt-5 max-w-[68ch] text-[17px] leading-relaxed text-ash md:text-[18px]";
export const card = "rounded-xl border border-seam bg-coal";

/** Absolute URL on the sponsor domain for a path like "/guides/x" or "/#book". */
export function sponsorHref(vertical: Vertical, path: string): string {
  return `${vertical.business.url}${path}`;
}

export function guidePath(guide: Pick<Guide, "slug">): string {
  return `/guides/${guide.slug}`;
}

export function Eyebrow({ children }: { children: string }) {
  return (
    <p className="eyebrow text-orange">
      <EyebrowText text={children} />
    </p>
  );
}

/*
 * The v3 logo system (brand/v3/README.txt): the primary-on-dark lockup is
 * the default on any dark ground and has a 230px minimum; below that the
 * wordmark (no tagline) is used. So: full lockup from md up, wordmark on a
 * phone. Both are the outlined SVG masters, so no font is involved.
 */
const LOCKUP = { src: "/brand/ascent-lockup-primary-on-dark.svg", w: 807.027, h: 186.375 };
const WORDMARK = { src: "/brand/ascent-wordmark-on-dark.svg", w: 762.917, h: 144.779 };

export function Logo({ name, width, className = "" }: { name: string; width: number; className?: string }) {
  const src = width >= 230 ? LOCKUP : WORDMARK;
  return (
    <Image
      src={src.src}
      alt={name}
      width={width}
      height={Math.round((width * src.h) / src.w)}
      priority
      className={className}
    />
  );
}

export function logoName(vertical: Vertical): string {
  return `${vertical.business.name} — Investor Acquisition`;
}

/*
 * `home` and `ctaHref` default to the in-page forms the sponsor page uses
 * ("/" and "#book" with the modal hook); the guide pages pass absolute
 * URLs back to the sponsor page instead.
 */
export function SponsorHeader({
  vertical,
  cta,
  home = "/",
  ctaHref = "#book",
  openModal = true,
}: {
  vertical: Vertical;
  cta: string;
  home?: string;
  ctaHref?: string;
  openModal?: boolean;
}) {
  const name = logoName(vertical);
  return (
    <header className="sticky top-0 z-50 border-b border-seam bg-night/85 backdrop-blur">
      <div className={`${shell} flex min-h-16 items-center justify-between gap-4 py-2`}>
        <Link href={home} aria-label={name} className="shrink-0">
          <Logo name={name} width={168} className="md:hidden" />
          <Logo name={name} width={236} className="hidden md:block" />
        </Link>
        <a
          href={ctaHref}
          {...(openModal ? { "data-open-lead-modal": true } : {})}
          className="btn-primary shrink-0 !min-h-[44px] !px-5 text-[14px]"
        >
          {cta}
        </a>
      </div>
    </header>
  );
}

export function SponsorFooter({
  vertical,
  legal,
  guides,
  guidesLabel,
  absolute = false,
}: {
  vertical: Vertical;
  legal: { heading: string; paragraphs: string[] };
  guides: Guide[];
  guidesLabel: string;
  /** true on pages that are not the sponsor page — links go absolute. */
  absolute?: boolean;
}) {
  const { business, footer } = vertical;
  const href = (path: string) => (absolute ? sponsorHref(vertical, path) : path);
  /* The registered postal address — see the note in src/components/Footer.tsx. */
  const address = formatAddress(business);
  return (
    <footer className="border-t border-seam py-14 md:py-20">
      <div className={shell}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Logo name={logoName(vertical)} width={260} />
            <p className="mt-6 max-w-[48ch] text-[16px] text-on-dark">{footer.tagline}</p>
            <p className="mt-1 text-[15px] text-ash">{footer.locationLine}</p>
            {address ? (
              <address className="mt-1 text-[15px] not-italic text-ash">{address}</address>
            ) : null}
            {business.founder ? (
              <p className="mt-1 text-[15px] text-ash">
                {business.founder.name}, {business.founder.title}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1 md:items-end">
            {business.phone ? (
              <a
                href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark hover:text-paper"
              >
                {business.phone}
              </a>
            ) : null}
            {business.email ? (
              <a
                href={`mailto:${business.email}`}
                className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark hover:text-paper"
              >
                {business.email}
              </a>
            ) : null}
            <a
              href={href("/privacy")}
              className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 hover:text-paper"
            >
              {footer.privacyLabel}
            </a>
            {/* The SMS consent boxes on this site's forms link to both. */}
            <a
              href={href("/terms")}
              className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 hover:text-paper"
            >
              {footer.termsLabel}
            </a>
            {/* The no-JavaScript opt-in page, reachable from every page. */}
            <a
              href={href("/sms-opt-in")}
              className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 hover:text-paper"
            >
              {footer.textUpdatesLabel}
            </a>
          </div>
        </div>

        <nav aria-label={guidesLabel} className="mt-12 border-t border-seam pt-8">
          <h2 className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
            {guidesLabel}
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 md:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <a
                  href={href(guidePath(g))}
                  className="inline-flex min-h-[36px] items-center text-[14px] leading-snug text-on-dark underline-offset-4 hover:text-paper hover:underline"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 border-t border-seam pt-8">
          <h2 className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
            {legal.heading}
          </h2>
          <div className="mt-4 max-w-[100ch] space-y-3">
            {legal.paragraphs.map((p, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-ash/85">
                {p}
              </p>
            ))}
          </div>
          {footer.complianceLine ? (
            <p className="mt-4 max-w-[100ch] text-[13px] leading-relaxed text-ash/85">
              {footer.complianceLine}
            </p>
          ) : null}
        </div>

        <p className="mt-8 text-[14px] text-ash">
          © {new Date().getFullYear()} {business.legalName ?? business.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
