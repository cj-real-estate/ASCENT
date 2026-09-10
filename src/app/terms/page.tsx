import type { Metadata } from "next";
import Link from "next/link";
import general from "@content/verticals/general";
import { LEGAL_ENTITY, smsProgramTerms } from "@content/compliance";

/*
 * /terms — site terms, and the SMS program terms the consent language on
 * every form links to.
 *
 * The SMS half is not optional decoration: A2P 10DLC campaign review reads
 * this page for the program's name, message frequency, cost, HELP and STOP
 * instructions and a support contact, and a campaign whose terms page is
 * missing any of them is rejected. The wording comes from
 * content/compliance.ts so it cannot drift from the sentence on the box.
 *
 * The sponsor domain has its own copy of this page in the dark chrome
 * (src/app/sponsors/terms) — the same program, described in the same words.
 */

const url = `${general.business.url}/terms`;

export const metadata: Metadata = {
  title: "Terms",
  description: `Website terms and the text message program terms for ${general.business.name}.`,
  alternates: { canonical: url },
};

const h2Class = "display mt-12 text-[20px] text-ink md:text-[26px]";
const h3Class = "mt-6 text-[17px] font-semibold text-ink";
const pClass = "mt-4 text-[17px] leading-relaxed text-ink";

export default function TermsPage() {
  const { business } = general;
  const sms = smsProgramTerms({ email: business.email, phone: business.phone });

  return (
    <main className="bg-paper py-16 md:py-28">
      <div className="section-shell">
        <div className="max-w-[68ch]">
          <h1 className="display text-[34px] text-ink md:text-[46px]">Terms</h1>
          <p className="mt-4 text-[14px] text-slate">
            {LEGAL_ENTITY} · {business.city}, {business.region} · Effective September 10, 2026
          </p>

          <p className={pClass}>
            These terms cover this website and the text message program described below. The
            website is a marketing site: it describes services offered by {LEGAL_ENTITY} and lets
            you ask for a call. Nothing on it is an offer, a contract, or professional advice, and
            the scope, fee and terms of any engagement are set in a written agreement signed by
            both sides.
          </p>

          <h2 className={h2Class}>Text message program</h2>
          <p className={pClass}>
            Every form on this site carries an optional checkbox for text messages. The program it
            opts you into is described here in full.
          </p>

          <dl className="mt-8">
            {sms.items.map((item) => (
              <div key={item.term} className="mt-6 border-t border-line pt-5 first:mt-0 first:border-0 first:pt-0">
                <dt className={h3Class}>{item.term}</dt>
                <dd className="mt-2 text-[17px] leading-relaxed text-slate">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <p className={pClass}>
            You can opt in from{" "}
            <Link href="/sms" className="text-orange-deep underline underline-offset-4">
              our text updates page
            </Link>{" "}
            or any form on this site, and out again by replying STOP to any message. What we do
            with the number is set out in our{" "}
            <Link href="/privacy" className="text-orange-deep underline underline-offset-4">
              privacy policy
            </Link>
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
            for loss arising from using it. Any figures shown as benchmarks are published
            third-party figures, are labelled as such, and are not a promise of a result.
          </p>

          <h2 className={h2Class}>Changes and contact</h2>
          <p className={pClass}>
            If these terms change we will update this page and the effective date above. Questions
            about them, or about the text program:{" "}
            {business.email ? (
              <a
                href={`mailto:${business.email}`}
                className="text-orange-deep underline underline-offset-4"
              >
                {business.email}
              </a>
            ) : null}
            {business.email && business.phone ? " or " : null}
            {business.phone ? (
              <a
                href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
                className="text-orange-deep underline underline-offset-4"
              >
                {business.phone}
              </a>
            ) : null}
            .
          </p>
        </div>
      </div>
    </main>
  );
}
