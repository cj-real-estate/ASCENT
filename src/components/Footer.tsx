import type { Vertical } from "@content/verticals/types";
import { AscentLockup } from "@/components/Logo";
import { formatAddress } from "@/lib/business";

/*
 * Footer — dark (bg-ink, data-dark). Server component.
 * Lockup, tagline, location, contact, privacy link, copyright. Nothing
 * else — no social icons, no nav. Phone/email are null until the client
 * supplies them (DECISION #3) and render VISIBLE placeholders.
 */
export function Footer({ vertical }: { vertical: Vertical }) {
  const { business, footer } = vertical;
  const lockupTagline = business.name.split(" ").slice(1).join(" ");
  /* The registered postal address. A2P 10DLC brand registration and the
   * carriers expect the sending business's address to be findable on its
   * site, and a reviewer should find the same one that was registered. */
  const address = formatAddress(business);

  return (
    <footer data-dark="" className="cv-auto bg-ink py-16 md:py-28">
      <div className="section-shell">
        <AscentLockup
          variant="onDark"
          name={business.name}
          tagline={lockupTagline}
        />

        <p className="mt-6 text-[16px] text-on-dark">{footer.tagline}</p>
        <p className="mt-1 text-[16px] text-on-dark">{footer.locationLine}</p>
        {address ? (
          <address className="mt-1 text-[16px] not-italic text-on-dark">{address}</address>
        ) : null}

        <div className="mt-8 flex flex-col items-start gap-1">
          {business.phone ? (
            <a
              href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark transition-colors hover:text-paper"
            >
              {business.phone}
            </a>
          ) : (
            <p className="font-mono text-[14px] text-fog">[PHONE — TBD]</p>
          )}
          {business.email ? (
            <a
              href={`mailto:${business.email}`}
              className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark transition-colors hover:text-paper"
            >
              {business.email}
            </a>
          ) : (
            <p className="mt-2 font-mono text-[14px] text-fog">[EMAIL — TBD]</p>
          )}
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-6">
          <a
            href="/privacy"
            className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 transition-colors hover:text-paper"
          >
            {footer.privacyLabel}
          </a>
          {/* Terms carry the SMS program disclosures the consent box on
              every form links to — they are not optional on this site. */}
          <a
            href="/terms"
            className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 transition-colors hover:text-paper"
          >
            {footer.termsLabel}
          </a>
          {/* This domain's opt-in page. The sponsor domain's equivalent is
              /sms-opt-in — see src/components/sponsor/SponsorChrome.tsx. */}
          <a
            href="/sms"
            className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 transition-colors hover:text-paper"
          >
            {footer.textUpdatesLabel}
          </a>
        </p>

        {footer.complianceLine ? (
          <p className="mt-8 max-w-[80ch] border-t border-white/15 pt-6 text-[14px] leading-relaxed text-fog">
            {footer.complianceLine}
          </p>
        ) : null}

        <p className="mt-6 text-[14px] text-fog">
          © {new Date().getFullYear()} {business.legalName ?? business.name}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
