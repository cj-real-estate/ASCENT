import type { Metadata } from "next";
import sponsors, { sponsorsPage } from "@content/verticals/sponsors";
import { guides } from "@content/guides";
import { SponsorFooter, SponsorHeader, shell, sponsorHref } from "@/components/sponsor/SponsorChrome";

/*
 * Privacy for ascentforsponsors.com — served at /privacy on that host via
 * the rewrite in next.config.ts, so the sponsor domain has a policy that
 * describes the sponsor site (the qualification gate, the Calendly embed,
 * the sponsor mailbox) rather than the brand site's strategy-call form.
 * Same plain-English scope as the brand policy: it lists everything the
 * site collects and nothing it doesn't.
 */
const url = `${sponsors.business.url}/privacy`;

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${sponsors.business.name} handles visitor data on ${sponsors.business.url.replace("https://", "")}.`,
  alternates: { canonical: url },
  robots: { index: true, follow: true },
};

const h2Class = "display mt-10 text-[20px] text-paper md:text-[26px]";
const pClass = "mt-4 max-w-[68ch] text-[17px] leading-relaxed text-ash";

export default function SponsorPrivacyPage() {
  const { business } = sponsors;
  const page = sponsorsPage;
  return (
    <div data-dark data-theme="dark" className="min-h-dvh bg-night text-paper">
      <SponsorHeader
        vertical={sponsors}
        cta={page.nav.cta}
        home={sponsorHref(sponsors, "/")}
        ctaHref={sponsorHref(sponsors, "/#book")}
        openModal={false}
      />
      <main className="py-16 md:py-24">
        <div className={shell}>
          <h1 className="display text-[34px] text-paper md:text-[46px]">Privacy</h1>
          <p className="mt-4 text-[14px] text-ash">
            {business.legalName ?? business.name} · {business.city}, {business.region} · Effective September 9, 2026
          </p>

          <p className={pClass}>
            This is a marketing site. It has no accounts or logins, and this page describes everything it
            collects.
          </p>

          <h2 className={h2Class}>Visit analytics</h2>
          <p className={pClass}>
            The site uses Vercel Web Analytics, which collects anonymized, cookieless visit metrics — page
            views, referrers, country. It does not identify you and does not follow you across other sites.
          </p>

          <h2 className={h2Class}>Advertising</h2>
          <p className={pClass}>
            {business.shortName} advertises on Google. The site loads Google&apos;s advertising tag (gtag.js),
            which sets cookies so Google can tell whether someone who clicked an ad went on to request a
            call. You can opt out of personalized Google advertising at{" "}
            <a href="https://myadcenter.google.com" rel="noreferrer" className="text-paper underline underline-offset-4">
              myadcenter.google.com
            </a>
            , and most browsers let you block or clear these cookies.
          </p>

          <h2 className={h2Class}>The qualification questions and booking</h2>
          <p className={pClass}>
            If you ask to see whether an engagement fits, the site collects your name, sponsor or fund,
            phone number, email address, and your answers to six short questions about the offering — the
            exemption, its size, whether securities counsel is engaged, the media budget, your track record,
            and your role. That information is sent to our customer relationship manager, GoHighLevel, and
            to a private spreadsheet as a backup, and is used solely to prepare for and schedule a scoping
            call. The site itself stores nothing.
          </p>
          <p className={pClass}>
            If the engagement fits, the site shows a Calendly scheduler. Calendly&apos;s own privacy policy
            governs what you enter there.
          </p>

          <h2 className={h2Class}>What we don&apos;t do</h2>
          <p className={pClass}>
            We don&apos;t sell your data. We never ask about, collect or assess accredited-investor status on
            this site. Beyond the Google advertising tag described above, we set no tracking cookies, and
            nothing on this site follows you around the web on our behalf.
          </p>

          <h2 className={h2Class}>Contact</h2>
          <p className={pClass}>
            Questions about this policy, or a request to delete what you submitted:{" "}
            {business.email ? (
              <a href={`mailto:${business.email}`} className="text-paper underline underline-offset-4">
                {business.email}
              </a>
            ) : null}
            .
          </p>
        </div>
      </main>
      <SponsorFooter
        vertical={sponsors}
        legal={page.legal}
        guides={guides}
        guidesLabel={page.guides.eyebrow}
        absolute
      />
    </div>
  );
}
