import type { Vertical } from "@content/verticals/types";
import { AscentLockup } from "@/components/Logo";

/*
 * Footer — dark (bg-ink, data-dark). Server component.
 * Lockup, tagline, location, contact, privacy link, copyright. Nothing
 * else — no social icons, no nav. Phone/email are null until the client
 * supplies them (DECISION #3) and render VISIBLE placeholders.
 */
export function Footer({ vertical }: { vertical: Vertical }) {
  const { business, footer } = vertical;
  const lockupTagline = business.name.split(" ").slice(1).join(" ");

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

        <p className="mt-8">
          <a
            href="/privacy"
            className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 transition-colors hover:text-paper"
          >
            {footer.privacyLabel}
          </a>
        </p>

        <p className="mt-6 text-[14px] text-fog">
          © {new Date().getFullYear()} {business.name}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
