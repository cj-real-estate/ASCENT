import type { SponsorPageContent, Vertical } from "@content/verticals/types";
import { guides } from "@content/guides";
import { SPONSOR_PAGE_UPDATED } from "@content/verticals/sponsors";
import { toQualifyFlowProps } from "@/lib/qualify";
import { sponsorPageGraph } from "@/lib/schema";
import ArrowRight from "@/components/ArrowRight";
import ServiceIcon from "@/components/ServiceIcon";
import EyebrowText from "@/components/EyebrowText";
import Calculator from "@/components/Calculator";
import QualifyFlow from "@/components/QualifyFlow";
import LeadModal from "@/components/LeadModal";
import TrustBanner from "@/components/TrustBanner";
import { JsonLdData } from "@/components/JsonLd";
import {
  Eyebrow,
  SponsorFooter,
  SponsorHeader,
  card,
  guidePath,
  h2,
  shell,
  sponsorHref,
  sub,
} from "./SponsorChrome";

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
 * boundaries, fit, FAQ, footer, JSON-LD) and the `SponsorPageContent`
 * beside it. No copy lives here. The header, footer and logo are shared
 * with the guide and privacy pages — see SponsorChrome.tsx.
 *
 * The whole page is `data-dark` + `data-theme="dark"`: the focus ring, the
 * secondary button and the calculator's range track all key off that.
 */

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
 * A small US flag, drawn rather than the 🇺🇸 emoji — like ArrowRight and
 * Check/Cross above, this avoids handing rendering to whatever emoji font
 * the visitor's OS supplies (the self-hosted latin subsets carry no color
 * glyphs either way). Simplified for small sizes: seven stripes, a solid
 * canton with a sparse dot grid standing in for stars.
 */
const FLAG_STRIPE_H = 16 / 7;

function FlagIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 30 16"
      className={`shrink-0 ${className}`}
    >
      {/* Ground is white; lay a red stripe over every other band (0, 2, 4, 6 of 7). */}
      <rect width="30" height="16" fill="#FFFFFF" />
      {[0, 2, 4, 6].map((i) => (
        <rect key={i} x="0" y={i * FLAG_STRIPE_H} width="30" height={FLAG_STRIPE_H} fill="#B22234" />
      ))}
      <rect width="13" height={FLAG_STRIPE_H * 4} fill="#3C3B6E" />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2, 3].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={2 + col * 3}
            cy={1.6 + row * 2.7}
            r="0.65"
            fill="#FFFFFF"
          />
        )),
      )}
    </svg>
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

        {hero.patrioticLine ? (
          <p className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-ash">
            <FlagIcon className="h-[13px] w-auto" />
            {hero.patrioticLine}
          </p>
        ) : null}

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

/*
 * The alternatives, compared. Rows read name + cost on the left and the
 * substance on the right, so the fee column scans down the page; the Ascent
 * row is the one lit card in the stack.
 */
function Comparison({ page }: { page: SponsorPageContent }) {
  const { comparison } = page;
  return (
    <section className="border-t border-seam py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{comparison.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-4`}>{comparison.h2}</h2>
        <p className={sub}>{comparison.sub}</p>

        <ul className="mt-10 overflow-hidden rounded-xl border border-seam md:mt-12">
          {comparison.rows.map((row, i) => (
            <li
              key={row.name}
              className={`grid gap-x-8 gap-y-2 p-6 md:grid-cols-[15rem_1fr] md:p-7 ${
                i > 0 ? "border-t border-seam" : ""
              } ${row.highlight ? "bg-coal" : ""}`}
            >
              <div className={row.highlight ? "border-l-2 border-orange pl-4 md:-ml-4" : ""}>
                <h3
                  className={`text-[18px] font-semibold leading-snug ${
                    row.highlight ? "text-paper" : "text-on-dark"
                  }`}
                >
                  {row.name}
                </h3>
                <p
                  className={`readout mt-1 text-[15px] ${
                    row.highlight ? "text-orange" : "text-ash"
                  }`}
                >
                  {row.cost}
                </p>
              </div>
              <p
                className={`max-w-[62ch] text-[15px] leading-relaxed ${
                  row.highlight ? "text-on-dark" : "text-ash"
                }`}
              >
                {row.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[90ch] text-[13px] leading-relaxed text-ash/80">
          {comparison.note}
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
        {problems.note ? (
          <p className="mt-8 max-w-[90ch] text-[13px] leading-relaxed text-ash/80">
            {problems.note}
          </p>
        ) : null}
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

/*
 * The entity block: one definition sentence set as a quote, then the
 * facts as a description list. Written to be lifted whole by an answer
 * engine, which is why it sits beside the FAQ rather than in the hero.
 */
function Glance({ vertical, page }: { vertical: Vertical; page: SponsorPageContent }) {
  const { glance } = page;
  return (
    <section id="about" aria-labelledby="about-h" className="scroll-mt-16 border-t border-seam py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{glance.eyebrow}</Eyebrow>
        <h2 id="about-h" className={`${h2} mt-4`}>
          {glance.h2}
        </h2>
        <p className="mt-6 max-w-[80ch] border-l-2 border-orange pl-5 text-[17px] leading-relaxed text-on-dark md:text-[19px]">
          {glance.definition}
        </p>
        <dl className="mt-10 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {glance.facts.map((f) => (
            <div key={f.label} className="border-t border-seam pt-4">
              <dt className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">{f.label}</dt>
              <dd className="mt-1 text-[16px] leading-relaxed text-paper">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-[14px] text-ash">
          {vertical.business.legalName ?? vertical.business.name} · {vertical.footer.locationLine}
        </p>
      </div>
    </section>
  );
}

/*
 * The guides strip. Every guide registered in content/guides, linked
 * absolutely on the sponsor domain (the guides do not exist under
 * /sponsors on ascentcas.com).
 */
function Guides({ vertical, page }: { vertical: Vertical; page: SponsorPageContent }) {
  const g = page.guides;
  return (
    <section id="guides" aria-labelledby="guides-h" className="scroll-mt-16 border-t border-seam bg-coal/40 py-16 md:py-24">
      <div className={shell}>
        <Eyebrow>{g.eyebrow}</Eyebrow>
        <h2 id="guides-h" className={`${h2} mt-4`}>
          {g.h2}
        </h2>
        <p className={sub}>{g.sub}</p>
        <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <a
                href={sponsorHref(vertical, guidePath(guide))}
                className={`${card} flex h-full flex-col p-6 motion-safe:transition-[transform,border-color] motion-safe:hover:-translate-y-1 hover:border-ash/40`}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
                  <EyebrowText text={guide.eyebrow} />
                </span>
                <span className="mt-3 text-[17px] font-semibold leading-snug text-paper">{guide.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <a href={sponsorHref(vertical, "/guides")} className="btn-secondary px-7 text-[15px]">
            {g.indexLabel}
            <ArrowRight />
          </a>
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

export function SponsorPage({
  vertical,
  page,
}: {
  vertical: Vertical;
  page: SponsorPageContent;
}) {
  return (
    <div data-dark data-theme="dark" className="min-h-dvh bg-night text-paper">
      <JsonLdData data={sponsorPageGraph(vertical, page, SPONSOR_PAGE_UPDATED)} />
      <SponsorHeader vertical={vertical} cta={page.nav.cta} />
      <main>
        <Hero page={page} />
        <Problems page={page} />
        <CalculatorBlock vertical={vertical} />
        <Process page={page} />
        <Included page={page} />
        <Boundaries vertical={vertical} />
        <Comparison page={page} />
        <Fit vertical={vertical} />
        <CtaBand page={page} />
        <Glance vertical={vertical} page={page} />
        <Faq vertical={vertical} />
        <Guides vertical={vertical} page={page} />
        <Booking vertical={vertical} />
        <LeadModal flow={toQualifyFlowProps(vertical)} />
      </main>
      <SponsorFooter vertical={vertical} legal={page.legal} guides={guides} guidesLabel={page.guides.eyebrow} />
    </div>
  );
}

export default SponsorPage;
