import type { Metadata } from "next";
import sponsors, { sponsorsPage } from "@content/verticals/sponsors";
import { guides } from "@content/guides";
import { LEGAL_ENTITY, smsProgramTerms } from "@content/compliance";
import {
  SponsorFooter,
  SponsorHeader,
  shell,
  sponsorHref,
} from "@/components/sponsor/SponsorChrome";

/*
 * Terms for ascentforsponsors.com — served at /terms on that host via the
 * rewrite in next.config.ts.
 *
 * The sponsor domain needs its own copy because the consent box on its
 * forms links to /terms on the sponsor host, and A2P 10DLC campaign review
 * follows that link. Same program, same wording (content/compliance.ts),
 * the sponsor domain's own support mailbox, and the page's standing
 * compliance disclosures in the footer.
 */
const url = `${sponsors.business.url}/terms`;

export const metadata: Metadata = {
  title: "Terms",
  description: `Website terms and the text message program terms for ${sponsors.business.name}.`,
  alternates: { canonical: url },
};

const h2Class = "display mt-12 text-[20px] text-paper md:text-[26px]";
const pClass = "mt-4 max-w-[68ch] text-[17px] leading-relaxed text-ash";

export default function SponsorTermsPage() {
  const { business } = sponsors;
  const page = sponsorsPage;
  const sms = smsProgramTerms({ email: business.email, phone: business.phone });

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
          <h1 className="display text-[34px] text-paper md:text-[46px]">Terms</h1>
          <p className="mt-4 text-[14px] text-ash">
            {LEGAL_ENTITY} · {business.city}, {business.region} · Effective September 10, 2026
          </p>

          <p className={pClass}>
            These terms cover this website and the text message program described below. The
            website is a marketing site: it describes services offered by {LEGAL_ENTITY} and lets a
            sponsor ask for a scoping call. Nothing on it is an offer, a contract, or legal,
            investment or tax advice, and the scope, fee and terms of any engagement are set in a
            written agreement signed by both sides.
          </p>

          <h2 className={h2Class}>Text message program</h2>
          <p className={pClass}>
            Every form on this site carries an optional checkbox for text messages. The program it
            opts you into is described here in full. These are messages to you, the sponsor, about
            your own enquiry — they are unrelated to how Ascent contacts a sponsor&apos;s investor
            leads, which is governed by the sponsor&apos;s own counsel-approved scripts and by the
            standing limits published on the main page.
          </p>

          <dl className="mt-8 max-w-[80ch]">
            {sms.items.map((item) => (
              <div
                key={item.term}
                className="mt-6 border-t border-seam pt-5 first:mt-0 first:border-0 first:pt-0"
              >
                <dt className="text-[17px] font-semibold text-paper">{item.term}</dt>
                <dd className="mt-2 text-[17px] leading-relaxed text-ash">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <p className={pClass}>
            You can opt in from any form on this site, and out again by replying STOP to any
            message. What we do with the number is set out in our{" "}
            <a
              href={sponsorHref(sponsors, "/privacy")}
              className="text-paper underline underline-offset-4"
            >
              privacy policy
            </a>
            .
          </p>

          <h2 className={h2Class}>Using this site</h2>
          <p className={pClass}>
            Don&apos;t submit anyone else&apos;s contact details, don&apos;t try to break or
            overload the site, and don&apos;t scrape it. The text, images and marks on the site
            belong to {LEGAL_ENTITY}. Links to other sites are for convenience and we aren&apos;t
            responsible for what is on them.
          </p>
          <p className={pClass}>
            The site is provided as-is. We keep it accurate but don&apos;t warrant that it is free
            of errors or always available, and to the extent the law allows we aren&apos;t liable
            for loss arising from using it. Benchmark figures on this site are published
            third-party category figures, are labelled as such, are not Ascent results, and
            guarantee no outcome.
          </p>

          <h2 className={h2Class}>Changes and contact</h2>
          <p className={pClass}>
            If these terms change we will update this page and the effective date above. Questions
            about them, or about the text program:{" "}
            {business.email ? (
              <a
                href={`mailto:${business.email}`}
                className="text-paper underline underline-offset-4"
              >
                {business.email}
              </a>
            ) : null}
            {business.email && business.phone ? " or " : null}
            {business.phone ? (
              <a
                href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
                className="text-paper underline underline-offset-4"
              >
                {business.phone}
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
