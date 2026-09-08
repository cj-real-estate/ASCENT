import Link from "next/link";
import type { SponsorPageContent, Vertical } from "@content/verticals/types";
import { toQualifyFlowProps } from "@/lib/qualify";
import Image from "next/image";
import ArrowRight from "@/components/ArrowRight";
import ServiceIcon from "@/components/ServiceIcon";
import EyebrowText from "@/components/EyebrowText";
import Calculator from "@/components/Calculator";
import QualifyFlow from "@/components/QualifyFlow";
import LeadModal from "@/components/LeadModal";
import TrustBanner from "@/components/TrustBanner";
import JsonLd from "@/components/JsonLd";

/*
 * The dark sponsor template — ascentforsponsors.com.
 *
 * A second page template beside VerticalPage, not a fork of it: the light
 * template is built for a contractor reading on a phone; this one is built
 * for a sponsor and their counsel comparing vendors, and follows the
 * sector-page convention that category uses — near-black ground, cards on
 * a hairline seam, one accent, a stats row under the hero, a problem
 * triptych, a numbered process, a feature grid with a CTA card, a fit
 * check, an FAQ, and a long-form disclosure in the footer.
 *
 * Everything rendered comes from content: the `Vertical` (gate, booking,
 * benchmarks, boundaries, fit, FAQ, footer, JSON-LD) and the
 * `SponsorPageContent` beside it. No copy lives here.
 *
 * The whole page is `data-dark` + `data-theme="dark"`: the focus ring, the
 * secondary button and the calculator's range track all key off that.
 */

const shell = "section-shell";
const h2 = "display max-w-[22ch] text-[30px] text-paper md:text-[46px]";
const sub = "mt-5 max-w-[68ch] text-[17px] leading-relaxed text-ash md:text-[18px]";
const card = "rounded-xl border border-seam bg-coal";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="eyebrow text-orange">
      <EyebrowText text={children} />
    </p>
  );
}

function Check() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[3px] shrink-0 text-orange"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[3px] shrink-0 text-ash"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
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

function Logo({ name, width, className = "" }: { name: string; width: number; className?: string }) {
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

function Header({ vertical, page }: { vertical: Vertical; page: SponsorPageContent }) {
  const name = `${vertical.business.name} — Investor Acquisition`;
  return (
    <header className="sticky top-0 z-50 border-b border-seam bg-night/85 backdrop-blur">
      <div className={`${shell} flex min-h-16 items-center justify-between gap-4 py-2`}>
        <Link href="/" aria-label={name} className="shrink-0">
          <Logo name={name} width={168} className="md:hidden" />
          <Logo name={name} width={236} className="hidden md:block" />
        </Link>
        <a
          href="#book"
          data-open-lead-modal
          className="btn-primary shrink-0 !min-h-[44px] !px-5 text-[14px]"
        >
          {page.nav.cta}
        </a>
      </div>
    </header>
  );
}

function Hero({ page }: { page: SponsorPageContent }) {
  const { hero } = page;
  const hl = hero.h1Highlight;
  return (
    <section className="relative overflow-hidden pb-16 pt-16 md:pb-24 md:pt-24">
      {/* One orange wash off the top edge, faint on near-black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgb(240 94 35 / 0.14), transparent 70%)",
        }}
      />
      <div className={`${shell} relative`}>
        <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
          <EyebrowText text={hero.kicker} />
        </p>
        <h1 className="display mt-5 max-w-[20ch] text-balance text-[38px] text-paper min-[380px]:text-[44px] md:text-[58px] xl:text-[64px]">
          {hl && hero.h1.includes(hl) ? (
            <>
              {hero.h1.slice(0, hero.h1.indexOf(hl))}
              <span className="text-orange">{hl}</span>
              {hero.h1.slice(hero.h1.indexOf(hl) + hl.length)}
            </>
          ) : (
            hero.h1
          )}
        </h1>
        <p className="mt-7 max-w-[64ch] text-[17px] leading-relaxed text-ash md:text-[19px]">
          {hero.sub}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#book"
            data-open-lead-modal
            className="btn-primary px-8 text-[17px]"
          >
            {hero.primaryCta}
            <ArrowRight />
          </a>
          <a href={hero.secondaryCta.href} className="btn-secondary px-8 text-[16px]">
            {hero.secondaryCta.label}
          </a>
        </div>

        {/* Commitment cards — what Ascent does and signs, never a result. */}
        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {hero.cards.map((item) => (
            <li
              key={item.label}
              className={`${card} flex flex-col p-6 motion-safe:transition-[transform,border-color] motion-safe:hover:-translate-y-1 hover:border-ash/40 md:p-7`}
            >
              <span className="icon-tile !h-10 !w-10 !rounded-xl">
                <ServiceIcon name={item.icon} />
              </span>
              <p className="readout mt-5 text-[26px] leading-none text-orange md:text-[28px]">
                {item.label}
              </p>
              <h2 className="mt-3 text-[18px] font-semibold leading-snug text-paper">
                {item.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ash">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[90ch] text-[12px] leading-relaxed text-ash/80">
          {hero.disclosure}
        </p>
      </div>
    </section>
  );
}

/* The category's published numbers — `proof` on the vertical. */
function Benchmarks({ vertical }: { vertical: Vertical }) {
  const { proof } = vertical;
  return (
    <section className="border-y border-seam bg-coal/40 py-16 md:py-20">
      <div className={shell}>
        <h2 className="sr-only">{proof.srHeading}</h2>
        {proof.framingLine ? (
          <p className="max-w-[60ch] text-[20px] font-semibold leading-snug text-paper md:text-[26px]">
            {proof.framingLine}
          </p>
        ) : null}
        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {proof.stats.map((stat) => (
            <div key={stat.number} className="border-t border-seam pt-6">
              <p className="readout text-[40px] leading-none text-orange md:text-[54px]">
                {stat.number}
              </p>
              <p className="mt-3 max-w-[36ch] text-[15px] text-ash">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[90ch] font-mono text-[12px] leading-relaxed text-ash">
          {proof.attributionLine ??
            "[NEEDS ATTRIBUTION LINE — whose numbers, which source, what period]"}
        </p>
      </div>
    </section>
  );
}

function Problems({ page }: { page: SponsorPageContent }) {
  const { problems } = page;
  return (
    <section className="py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{problems.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{problems.h2}</h2>
        <p className={sub}>{problems.sub}</p>
        <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
          {problems.cards.map((item) => (
            <li key={item.title} className={`${card} p-6 md:p-7`}>
              <span className="icon-tile">
                <ServiceIcon name={item.icon} />
              </span>
              <h3 className="mt-5 text-[20px] font-semibold leading-snug text-paper">
                {item.title}
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ash">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CalculatorBlock({ vertical }: { vertical: Vertical }) {
  const { calculatorSection } = vertical;
  return (
    <section id="calculator" className="py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{calculatorSection.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{calculatorSection.h2}</h2>
        <p className={sub}>{calculatorSection.sub}</p>
        <div className="mt-10 md:mt-12">
          <Calculator
            calculator={vertical.calculator}
            ctaLabel={vertical.hero.cta}
            ctaMicrocopy={vertical.hero.microcopy}
            tone="dark"
          />
        </div>
      </div>
    </section>
  );
}

function Process({ page }: { page: SponsorPageContent }) {
  const { process } = page;
  return (
    <section id="process" className="scroll-mt-16 border-t border-seam py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{process.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{process.h2}</h2>
        <p className={sub}>{process.sub}</p>
        <ol className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {process.steps.map((step, i) => (
            <li key={step.title} className={`${card} p-6 md:p-7`}>
              <p className="readout text-[28px] leading-none text-orange" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-[19px] font-semibold leading-snug text-paper">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ash">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <a href="#book" data-open-lead-modal className="btn-primary px-8 text-[17px]">
            {process.cta}
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

function Included({ page }: { page: SponsorPageContent }) {
  const { included } = page;
  return (
    <section id="included" className="scroll-mt-16 border-t border-seam py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{included.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{included.h2}</h2>
        <p className={sub}>{included.sub}</p>
        <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {included.cards.map((item) => (
            <li key={item.title} className={`${card} p-6 md:p-7`}>
              <span className="icon-tile">
                <ServiceIcon name={item.icon} />
              </span>
              <h3 className="mt-5 text-[19px] font-semibold leading-snug text-paper">
                {item.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[15px] leading-relaxed text-ash">
                    <Check />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="flex flex-col justify-between rounded-xl bg-orange p-6 text-ink md:p-7">
            <div>
              <h3 className="display text-[26px] leading-tight md:text-[30px]">
                {included.ctaCard.title}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink/85">
                {included.ctaCard.body}
              </p>
            </div>
            <a
              href="#book"
              data-open-lead-modal
              className="btn-dark mt-8 w-fit px-7 text-[16px]"
            >
              {included.ctaCard.cta}
              <ArrowRight />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Boundaries({ vertical }: { vertical: Vertical }) {
  const { boundaries } = vertical;
  if (boundaries === null) return null;
  return (
    <section className="border-t border-seam bg-coal/40 py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{boundaries.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{boundaries.h2}</h2>
        <p className={sub}>{boundaries.intro}</p>
        <ul className="mt-10 grid gap-x-10 gap-y-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {boundaries.items.map((item) => (
            <li key={item.title} className="border-t border-seam pt-5">
              <h3 className="text-[17px] font-semibold leading-snug text-orange">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ash">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-[80ch] border-l-2 border-orange pl-4 text-[15px] leading-relaxed text-ash">
          {boundaries.closing}
        </p>
      </div>
    </section>
  );
}

function Fit({ vertical }: { vertical: Vertical }) {
  const { fit } = vertical;
  if (fit === null) return null;
  return (
    <section className="border-t border-seam py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{fit.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{fit.h2}</h2>
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          <div className={`${card} p-6 md:p-8`}>
            <h3 className="text-[20px] font-semibold text-paper">{fit.forYouHeading}</h3>
            <ul className="mt-5 space-y-3">
              {fit.forYou.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ash">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${card} p-6 md:p-8`}>
            <h3 className="text-[20px] font-semibold text-paper">{fit.notForYouHeading}</h3>
            <ul className="mt-5 space-y-3">
              {fit.notForYou.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ash">
                  <Cross />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {fit.note ? <p className="mt-6 max-w-[68ch] text-[15px] text-ash">{fit.note}</p> : null}
      </div>
    </section>
  );
}

function CtaBand({ page }: { page: SponsorPageContent }) {
  const { ctaBand } = page;
  return (
    <section className="py-8 md:py-12">
      <div className={shell}>
        <div className={`${card} relative overflow-hidden p-8 text-center md:p-14`}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 80% at 50% 100%, rgb(240 94 35 / 0.18), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[60ch]">
            <h2 className="display text-[30px] text-paper md:text-[44px]">{ctaBand.h2}</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ash">{ctaBand.body}</p>
            <a
              href="#book"
              data-open-lead-modal
              className="btn-primary mt-8 px-8 text-[17px]"
            >
              {ctaBand.cta}
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq({ vertical }: { vertical: Vertical }) {
  const { faq } = vertical;
  if (faq === null) return null;
  return (
    <section id="faq" className="scroll-mt-16 py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{faq.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{faq.h2}</h2>
        <div className="mt-10 max-w-[860px] md:mt-12">
          {faq.items.map((item) => (
            <details key={item.q} className="group border-t border-seam last:border-b">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-[17px] font-semibold text-paper [&::-webkit-details-marker]:hidden md:text-[19px]">
                {item.q}
                <span aria-hidden="true" className="readout shrink-0 text-[20px] text-orange group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="readout hidden shrink-0 text-[20px] text-orange group-open:inline">
                  −
                </span>
              </summary>
              <p className="max-w-[70ch] pb-6 text-[16px] leading-relaxed text-ash">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking({ vertical }: { vertical: Vertical }) {
  const { booking } = vertical;
  return (
    <section id="book" className="scroll-mt-16 border-t border-seam bg-coal/40 py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{booking.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{booking.h2}</h2>
        <p className="mt-6 max-w-[68ch] text-[17px] leading-relaxed text-on-dark">{booking.body}</p>
        <div className="mt-10">
          <QualifyFlow flow={toQualifyFlowProps(vertical)} />
        </div>
        <TrustBanner items={vertical.qualification.trustItems} />
      </div>
    </section>
  );
}

function Footer({ vertical, page }: { vertical: Vertical; page: SponsorPageContent }) {
  const { business, footer } = vertical;
  return (
    <footer className="border-t border-seam py-14 md:py-20">
      <div className={shell}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Logo name={`${business.name} — Investor Acquisition`} width={260} />
            <p className="mt-6 max-w-[48ch] text-[16px] text-on-dark">{footer.tagline}</p>
            <p className="mt-1 text-[15px] text-ash">{footer.locationLine}</p>
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
              href="/privacy"
              className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 hover:text-paper"
            >
              {footer.privacyLabel}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-seam pt-8">
          <h2 className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
            {page.legal.heading}
          </h2>
          <div className="mt-4 max-w-[100ch] space-y-3">
            {page.legal.paragraphs.map((p, i) => (
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
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function SponsorPage({
  vertical,
  page,
}: {
  vertical: Vertical;
  page: SponsorPageContent;
}) {
  return (
    <div data-dark data-theme="dark" className="min-h-dvh bg-night text-paper">
      <JsonLd vertical={vertical} />
      <Header vertical={vertical} page={page} />
      <main>
        <Hero page={page} />
        <Benchmarks vertical={vertical} />
        <Problems page={page} />
        <CalculatorBlock vertical={vertical} />
        <Process page={page} />
        <Included page={page} />
        <Boundaries vertical={vertical} />
        <Fit vertical={vertical} />
        <CtaBand page={page} />
        <Faq vertical={vertical} />
        <Booking vertical={vertical} />
        <LeadModal flow={toQualifyFlowProps(vertical)} />
      </main>
      <Footer vertical={vertical} page={page} />
    </div>
  );
}

export default SponsorPage;
