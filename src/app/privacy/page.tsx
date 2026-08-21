import type { Metadata } from "next";
import general from "@content/verticals/general";

/*
 * Privacy policy — short, plain-English, and scoped to exactly what the site
 * actually does: cookieless Vercel Web Analytics plus one booking form that
 * turns into an email. No boilerplate for things that don't happen here.
 * The contact email is DECISION #3 (null today) and renders as a visible
 * placeholder per build-notes convention.
 */

export const metadata: Metadata = {
  title: `Privacy | ${general.business.name}`,
};

const h2Class = "display mt-10 text-[20px] text-ink md:text-[26px]";
const pClass = "mt-4 text-[17px] text-ink";

export default function PrivacyPage() {
  const { business } = general;
  const contact = business.email ?? null;

  return (
    <main className="bg-paper py-16 md:py-28">
      <div className="section-shell">
        <div className="max-w-[68ch]">
          <h1 className="display text-[34px] text-ink md:text-[46px]">
            Privacy
          </h1>
          <p className="mt-4 text-[14px] text-slate">
            {business.name} · {business.city}, {business.region} · Effective
            August 20, 2026
          </p>

          <p className={pClass}>
            This is a static marketing site. It doesn&apos;t use accounts,
            logins, or tracking cookies, and this page describes everything it
            collects.
          </p>

          <h2 className={h2Class}>Visit analytics</h2>
          <p className={pClass}>
            The site uses Vercel Web Analytics, which collects anonymized,
            cookieless visit metrics — things like page views, referrers, and
            country. It doesn&apos;t identify you, and it doesn&apos;t follow
            you across other sites.
          </p>

          <h2 className={h2Class}>The booking form</h2>
          <p className={pClass}>
            If you request the free pipeline audit, the form collects five
            things: your name, company, phone number, email address, and
            roughly how many estimates you write a month. That information is
            sent to {business.shortName} by email and used solely to schedule
            and run your audit. Because it travels by email, it lives in the
            recipient&apos;s email provider once it&apos;s sent — the site
            itself stores nothing.
          </p>

          <h2 className={h2Class}>What we don&apos;t do</h2>
          <p className={pClass}>
            We don&apos;t sell your data. We don&apos;t use advertising
            cookies. We don&apos;t use tracking cookies of any kind.
          </p>

          <h2 className={h2Class}>Questions or deletion</h2>
          <p className={pClass}>
            To ask a question about this policy or have your information
            deleted, email{" "}
            {contact ? (
              <a
                href={`mailto:${contact}`}
                className="text-orange-deep underline"
              >
                {contact}
              </a>
            ) : (
              <span className="font-mono text-[14px] text-fog">
                [EMAIL — TBD]
              </span>
            )}
            .
          </p>
        </div>
      </div>
    </main>
  );
}
