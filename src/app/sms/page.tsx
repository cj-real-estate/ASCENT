import type { Metadata } from "next";
import Link from "next/link";
import general from "@content/verticals/general";
import { LEGAL_ENTITY, SMS_PROGRAM_NAME } from "@content/compliance";
import { toSmsConsentProps } from "@/lib/consent";
import { formatAddress } from "@/lib/business";
import { BrandLockup } from "@/components/Logo";
import SmsOptInForm from "@/components/SmsOptInForm";

/*
 * /sms — the opt-in page whose URL goes on the A2P 10DLC campaign
 * registration.
 *
 * Every form on the site carries the same consent box, but they all sit
 * behind the ICP gate's question cards, so a reviewer cannot see the phone
 * field or the consent language without clicking through a wizard. That
 * reads as "no visible opt-in form" and is a rejection. This page is the
 * fix: one screen, the phone field and the unchecked consent box visible on
 * arrival, the legal entity named, and both required links (privacy policy
 * with the mobile-data clause, and the SMS program terms) one click away.
 *
 * Indexed on purpose — unlike /apply, a reviewer has to be able to reach it,
 * and it must not look like a placeholder when they do. Keep the copy plain
 * and the business name spelled as registered.
 *
 * See docs/A2P-10DLC.md.
 */

const url = `${general.business.url}/sms`;

export const metadata: Metadata = {
  title: "Text message updates",
  description: `Join text message updates from ${general.business.name}. Optional, and you can reply STOP at any time.`,
  alternates: { canonical: url },
};

const h2Class = "display mt-10 text-[20px] text-ink md:text-[24px]";
const pClass = "mt-4 max-w-[68ch] text-[17px] leading-relaxed text-slate";

export default function SmsOptInPage() {
  const { business } = general;
  const consent = toSmsConsentProps(general);
  const address = formatAddress(business);

  return (
    <main className="bg-paper py-12 md:py-20">
      <div className="section-shell">
        <Link href="/" aria-label={business.name} className="inline-flex min-h-[44px] items-center">
          <BrandLockup variant="onLight" width={236} name={business.name} priority />
        </Link>

        <div className="mt-12 max-w-[68ch]">
          <p className="eyebrow text-orange-deep">TEXT MESSAGE UPDATES</p>
          <h1 className="display mt-5 text-[34px] text-ink md:text-[46px]">
            Get text updates from {business.name}.
          </h1>
          <p className="mt-6 text-[18px] leading-relaxed text-slate">
            {SMS_PROGRAM_NAME} is how {LEGAL_ENTITY} texts you about the call you asked for.
            There are two boxes, because they are two different permissions: one for
            non-marketing messages — confirming your call, reminding you of it, telling you if the
            time changes — and one for marketing messages. Tick either, both, or neither.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-slate">
            Both are optional and start unchecked. Leave them alone and we will still have your
            details, and we will reach you by phone or email instead — nothing is texted to a
            number that did not opt in, and we only ever send the kind of message you agreed to.
          </p>
        </div>

        <div className="mt-12 rounded-xl border border-slate/25 bg-surface p-6 md:mt-14 md:p-8">
          <SmsOptInForm
            consent={consent}
            labels={{
              name: "Name",
              phone: "Mobile number",
              email: "Email",
              emailNote: "Optional.",
              submit: "Submit",
              submitting: "Sending…",
              doneConsented:
                "You're subscribed to what you ticked. You'll get a confirmation text shortly. Reply STOP to any message to opt out, or HELP for help.",
              doneNotConsented:
                "Thanks — we have your details. You left both SMS boxes unchecked, so we won't text you; we'll reach you by phone or email instead.",
            }}
          />
        </div>

        <div className="mt-14 max-w-[68ch]">
          <h2 className={h2Class}>The short version</h2>
          <p className={pClass}>
            {SMS_PROGRAM_NAME}, operated by {LEGAL_ENTITY}
            {address ? `, ${address}` : null}. Two consents, collected separately: non-marketing
            (call confirmations, reminders and scheduling updates) and marketing. Message
            frequency varies. Message and data rates may apply. Reply HELP for help or STOP to opt
            out at any time. Neither consent is a condition of any purchase.
          </p>
          <p className={pClass}>
            The full program terms — frequency, cost, how to stop, supported carriers and how to
            reach a human — are on the{" "}
            <Link href="/terms" className="text-orange-deep underline underline-offset-4">
              terms page
            </Link>
            , and what we do with your number is in the{" "}
            <Link href="/privacy" className="text-orange-deep underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
          {business.phone || business.email ? (
            <p className={pClass}>
              Questions, or want to be removed by hand? Call{" "}
              {business.phone ? (
                <a
                  href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
                  className="text-orange-deep underline underline-offset-4"
                >
                  {business.phone}
                </a>
              ) : null}
              {business.phone && business.email ? " or email " : null}
              {business.email ? (
                <a
                  href={`mailto:${business.email}`}
                  className="text-orange-deep underline underline-offset-4"
                >
                  {business.email}
                </a>
              ) : null}
              .
            </p>
          ) : null}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 border-t border-line pt-4 text-[14px] text-slate">
          <p>
            © {new Date().getFullYear()} {business.legalName ?? business.name}
          </p>
          {address ? <address className="not-italic">{address}</address> : null}
          <Link
            href="/privacy"
            className="inline-flex min-h-[44px] items-center underline underline-offset-4 hover:text-ink"
          >
            {general.footer.privacyLabel}
          </Link>
          <Link
            href="/terms"
            className="inline-flex min-h-[44px] items-center underline underline-offset-4 hover:text-ink"
          >
            {general.footer.termsLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
