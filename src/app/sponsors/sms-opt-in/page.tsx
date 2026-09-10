import type { Metadata } from "next";
import sponsors, { sponsorsPage } from "@content/verticals/sponsors";
import { guides } from "@content/guides";
import { LEGAL_ENTITY, SMS_AGE_REQUIREMENT, SMS_PROGRAM_NAME } from "@content/compliance";
import { toSmsConsentProps } from "@/lib/consent";
import { formatAddress } from "@/lib/business";
import SmsConsentFields from "@/components/SmsConsentFields";
import {
  SponsorFooter,
  SponsorHeader,
  card,
  shell,
  sponsorHref,
} from "@/components/sponsor/SponsorChrome";

/*
 * /sms-opt-in on ascentforsponsors.com — the opt-in page for A2P 10DLC
 * campaign review, served at that path by the host rewrite in
 * next.config.ts.
 *
 * NO CLIENT JAVASCRIPT, deliberately. The qualification gate collects a
 * number too, but behind six question cards; and /sms on the brand domain
 * renders its fields server-side yet needs JavaScript to submit them. A
 * review scraper that does not run scripts sees neither a submittable form
 * nor, on the gate, any phone field at all — and "no visible opt-in form"
 * is a rejection. So this page is a plain <form method="post">: every
 * field, both consent checkboxes, the note and the links are in the initial
 * HTML, and it submits natively to /api/book, which answers a form-encoded
 * body with a 303 back to this page.
 *
 * Because there is no JavaScript there is no client-side validation either.
 * The result comes back in the query string and is rendered here.
 *
 * Keep it boring. Do not add a client component, do not add steps, and do
 * not make either checkbox required. See docs/A2P-10DLC.md.
 */

const url = `${sponsors.business.url}/sms-opt-in`;

export const metadata: Metadata = {
  title: "Text updates",
  description: `Get text message updates from ${LEGAL_ENTITY} about your scoping call. Optional, and you can reply STOP at any time.`,
  alternates: { canonical: url },
};

/* Keyed to the codes /api/book redirects back with. */
const ERRORS: Record<string, string> = {
  name: "Enter your name and submit again.",
  phone: "Enter a phone number with at least 10 digits and submit again.",
  email: "Enter an email address like name@company.com, or leave it blank.",
  undelivered:
    "Sending failed on our end. Try again in a minute, or call or email us instead.",
};

const label = "eyebrow block text-[12px] text-ash";
const input =
  "mt-2 w-full min-h-[48px] rounded-md border border-seam bg-coal px-4 py-2 text-[17px] text-paper placeholder:text-ash/60";

export default async function SmsOptInPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { business } = sponsors;
  const page = sponsorsPage;
  const consent = toSmsConsentProps(sponsors);
  const address = formatAddress(business);
  const errorMessage = error ? (ERRORS[error] ?? ERRORS.undelivered) : null;

  return (
    <div data-dark data-theme="dark" className="min-h-dvh bg-night text-paper">
      <SponsorHeader
        vertical={sponsors}
        cta={page.nav.cta}
        home={sponsorHref(sponsors, "/")}
        ctaHref={sponsorHref(sponsors, "/#book")}
        openModal={false}
      />
      <main className="py-14 md:py-20">
        <div className={shell}>
          <div className="max-w-[68ch]">
            <p className="eyebrow text-orange">TEXT MESSAGE UPDATES</p>
            <h1 className="display mt-5 text-[30px] text-paper md:text-[42px]">
              Get text updates from {LEGAL_ENTITY}
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-ash md:text-[18px]">
              {SMS_PROGRAM_NAME} is how {LEGAL_ENTITY} texts you about the scoping call you asked
              for. There are two boxes, because they are two separate permissions: one for
              non-marketing messages — confirming your call, reminding you of it, telling you if
              the time changes — and one for marketing messages. Tick either, both, or neither.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ash">
              {SMS_AGE_REQUIREMENT} Nothing is texted to a number that did not opt in, and we only
              ever send the kind of message you agreed to.
            </p>
          </div>

          {ok ? (
            <div
              role="status"
              className={`${card} mt-10 max-w-[60ch] border-l-2 border-l-orange p-6 md:p-8`}
            >
              <p className="text-[17px] leading-relaxed text-on-dark">
                Thanks — we have your details. If you ticked a box you&apos;ll get a confirmation
                text shortly; reply STOP to any message to opt out, or HELP for help. If you ticked
                neither, we won&apos;t text you and will reach you by phone or email instead.
              </p>
            </div>
          ) : null}

          <div className={`${card} mt-10 max-w-[620px] p-6 md:mt-12 md:p-8`}>
            {errorMessage ? (
              <p role="alert" className="mb-6 text-[15px] text-orange">
                {errorMessage}
              </p>
            ) : null}

            {/* A real form post — no onSubmit, no client component. */}
            <form method="post" action="/api/book" className="grid gap-5">
              {/* Where /api/book sends the browser back to, and which
                  vertical's call the consent sentence named. */}
              <input type="hidden" name="returnTo" value="/sms-opt-in" />
              <input type="hidden" name="vertical" value={sponsors.slug} />

              {/* Honeypot — off-screen rather than display:none, and
                  labelled, so a real visitor never meets it. */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
              >
                <label htmlFor="opt-in-website">Website</label>
                <input
                  id="opt-in-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="opt-in-name" className={label}>
                  Name
                </label>
                <input
                  id="opt-in-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="opt-in-company" className={label}>
                  Company
                </label>
                <input
                  id="opt-in-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="opt-in-email" className={label}>
                  Email
                </label>
                <input
                  id="opt-in-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  className={input}
                />
              </div>
              {/* Phone last, so both consent boxes sit directly below it. */}
              <div>
                <label htmlFor="opt-in-phone" className={label}>
                  Phone
                </label>
                <input
                  id="opt-in-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(405) 555-0123"
                  required
                  className={input}
                />
              </div>

              {/* Uncontrolled: no `onChange`, so these are plain checkboxes
                  that post natively. Both unchecked, neither required. */}
              <div className="border-t border-seam pt-5">
                <SmsConsentFields idPrefix="opt-in" consent={consent} tone="dark" />
              </div>

              <div>
                <button type="submit" className="btn-primary px-8 text-[17px]">
                  Sign up for text updates
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12 max-w-[68ch]">
            <h2 className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
              The short version
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ash">
              {SMS_PROGRAM_NAME}, operated by {LEGAL_ENTITY}
              {address ? `, ${address}` : null}. Two consents, collected separately:
              non-marketing (call confirmations, reminders and scheduling updates) and marketing.
              Message frequency varies. Message and data rates may apply. Reply HELP for help or
              STOP to opt out at any time. Neither consent is a condition of any purchase.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ash">
              The full program terms are on the{" "}
              <a
                href={sponsorHref(sponsors, "/terms")}
                className="text-paper underline underline-offset-4"
              >
                terms page
              </a>
              , and what we do with your number is in the{" "}
              <a
                href={sponsorHref(sponsors, "/privacy")}
                className="text-paper underline underline-offset-4"
              >
                privacy policy
              </a>
              . Questions, or want to be removed by hand?{" "}
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
