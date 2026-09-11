import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import general from "@content/verticals/general";
import calebFree from "@content/people/caleb-free";
import { personProfileGraph } from "@/lib/schema";
import { JsonLdData } from "@/components/JsonLd";
import { BrandLockup } from "@/components/Logo";
import ArrowRight from "@/components/ArrowRight";
import EyebrowText from "@/components/EyebrowText";
import { card, shell } from "@/components/sponsor/SponsorChrome";

/*
 * /caleb-free — the one authoritative page about the founder.
 *
 * It exists to disambiguate a person, not to sell: a single URL that a
 * reader, Google, or an answer engine can treat as the definitive answer
 * to "who is Caleb Free". Everything that follows from that:
 *
 *   - ProfilePage + Person structured data, with the Person carrying a
 *     stable cross-domain @id (src/lib/schema.ts `PERSON_ID`). The guide
 *     bylines on ascentforsponsors.com and the Organization `founder` on
 *     both domains point at that same id, so the three mentions merge into
 *     one entity instead of competing.
 *   - `sameAs` only when the content module holds real profile URLs. An
 *     empty list is no signal; a guessed one is a wrong signal, and a wrong
 *     one on the page whose whole job is identity is the worst outcome.
 *   - Copy that matches what the business plan says at its true weight —
 *     marketing and operations work, no securities background claimed.
 *
 * Indexed, in the sitemap, and linked from the footer of both domains,
 * because an orphan page cannot do this job.
 *
 * DARK, in the sponsor template's visual language — same night ground,
 * coal cards, seam hairlines, ash body copy and orange accent as
 * ascentforsponsors.com, and the same sticky lockup-plus-one-CTA header.
 * It shares the style tokens rather than copying them: `card` and `shell`
 * come from SponsorChrome, so a change there reaches this page too.
 *
 * What it does NOT share is that chrome's markup, because every link in
 * SponsorHeader/SponsorFooter is absolute onto ascentforsponsors.com and
 * its footer carries the securities legal block and the guide index. This
 * page is canonical on the brand domain and is reached from the
 * contractor side as often as the sponsor side, so its own header and
 * footer keep the reader on ascentcas.com.
 */

const url = `${general.business.url}${calebFree.path}`;

export const metadata: Metadata = {
  // `absolute` — seoTitle already reads "Caleb Free | Founder of Ascent",
  // and the layout's "%s | Ascent" template would say it twice.
  title: { absolute: calebFree.seoTitle },
  description: calebFree.seoDescription,
  alternates: { canonical: url },
  openGraph: {
    title: calebFree.seoTitle,
    description: calebFree.seoDescription,
    url,
    siteName: general.business.name,
    type: "profile",
    locale: "en_US",
    ...(calebFree.image
      ? {
          images: [
            {
              url: `${general.business.url}${calebFree.image.og}`,
              width: 1200,
              height: 630,
              alt: calebFree.image.alt,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: calebFree.seoTitle,
    description: calebFree.seoDescription,
    ...(calebFree.image
      ? { images: [`${general.business.url}${calebFree.image.og}`] }
      : {}),
  },
};

/* The sponsor template's type scale, so the two sites read as one brand. */
const h2Class = "display mt-14 max-w-[24ch] text-[26px] text-paper md:text-[34px]";
const pClass = "mt-5 max-w-[70ch] text-[17px] leading-relaxed text-ash";
const microHeading =
  "font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash";
const quietLink =
  "underline decoration-seam underline-offset-4 hover:text-paper hover:decoration-orange";

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function CalebFreePage() {
  const person = calebFree;
  const { business, footer, booking, header } = general;
  const name = business.name;

  return (
    <div data-dark data-theme="dark" className="min-h-dvh bg-night text-paper">
      <JsonLdData data={personProfileGraph(general, person)} />

      {/* Same header as the sponsor site: sticky, translucent, lockup on
          the left and one CTA on the right. The lockup drops to the
          wordmark under its 230px minimum on its own, so the phone gets
          the wordmark and md up gets the full lockup. No modal here —
          the booking form lives on the home page, so this is a plain
          link to its anchor. */}
      <header className="sticky top-0 z-50 border-b border-seam bg-night/85 backdrop-blur">
        <div className={`${shell} flex min-h-16 items-center justify-between gap-4 py-2`}>
          <Link href="/" aria-label={name} className="shrink-0">
            <BrandLockup variant="onDark" width={168} name={name} priority className="md:hidden" />
            <BrandLockup
              variant="onDark"
              width={236}
              name={name}
              priority
              className="hidden md:block"
            />
          </Link>
          <Link href="/#book" className="btn-primary shrink-0 !min-h-[44px] !px-5 text-[14px]">
            {header.cta}
          </Link>
        </div>
      </header>

      <main className="py-12 md:py-20">
        <div className={shell}>
          <nav
            aria-label="Breadcrumb"
            className="font-mono text-[12px] uppercase tracking-[0.14em] text-ash"
          >
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-paper">
                  Home
                </Link>
                <span aria-hidden="true" className="ml-2">/</span>
              </li>
              <li aria-current="page" className="text-on-dark">
                {person.name}
              </li>
            </ol>
          </nav>

          {/*
           * Two columns that interlock rather than sit side by side. The
           * name block and the summary card stack down column one; the
           * photograph occupies column two beside the name. A plain flex
           * row left the summary below BOTH, so the portrait's height
           * opened a hole of dead space next to a short name.
           *
           * The figure is placed explicitly at row 1 of column 2, so the
           * card auto-places into row 2 of column 1 underneath the name.
           * In source order it is name, photo, card — which is exactly the
           * order wanted when the grid collapses to one column on a phone.
           */}
          <header className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_240px] md:gap-x-12 md:gap-y-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <p className="eyebrow text-orange">
                <EyebrowText text={person.eyebrow} />
              </p>
              <h1 className="display mt-4 max-w-[18ch] text-balance text-[38px] text-paper md:text-[54px]">
                {person.name}
              </h1>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ash md:text-[18px]">
                {person.tagline}
              </p>
            </div>

            {/* Spans both rows, so row one is only as tall as the name and
                the card can sit directly under it. `self-start` keeps the
                frame the height of the photograph, not of the two rows. */}
            {person.image ? (
              <figure className="self-start justify-self-start overflow-hidden rounded-xl border border-seam md:col-start-2 md:row-span-2 md:row-start-1">
                <Image
                  src={person.image.page.src}
                  alt={person.image.alt}
                  width={person.image.page.width}
                  height={person.image.page.height}
                  priority
                  sizes="(min-width: 1024px) 280px, 240px"
                  /* Capped on a phone rather than full-column: a full-width
                     portrait is 450px tall there and pushes the summary,
                     which is the point of the page, off the first screen. */
                  className="block h-auto w-[240px] md:w-full"
                />
              </figure>
            ) : null}

            {/* The definitive paragraph — first substantive text on the
                page, written to be quoted whole. Same treatment as "The
                short answer" on a guide, because it does the same job. */}
            <div className={`${card} p-6 md:col-start-1 md:row-start-2 md:p-8`}>
              <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-orange">
                In short
              </p>
              <p className="mt-3 text-[17px] leading-relaxed text-on-dark md:text-[18px]">
                {person.summary}
              </p>
            </div>
          </header>

          <section aria-labelledby="facts" className="mt-12 max-w-[80ch]">
            <h2 id="facts" className={microHeading}>
              At a glance
            </h2>
            <dl className="mt-4 grid gap-x-10 gap-y-5 md:grid-cols-2">
              {person.facts.map((fact) => (
                <div key={fact.label} className="border-t border-seam pt-4">
                  <dt className={microHeading}>{fact.label}</dt>
                  <dd className="mt-1 text-[16px] leading-relaxed text-on-dark">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {person.bio.map((section) => {
            const id = section.h2.replace(/\s+/g, "-").toLowerCase();
            return (
              <section key={section.h2} aria-labelledby={id}>
                <h2 id={id} className={h2Class}>
                  {section.h2}
                </h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className={pClass}>
                    {paragraph}
                  </p>
                ))}
              </section>
            );
          })}

          {person.trackRecord ? (
            <section aria-labelledby="track-record">
              <h2 id="track-record" className={h2Class}>
                {person.trackRecord.h2}
              </h2>
              <p className={pClass}>{person.trackRecord.intro}</p>
              {/* Three across when there are three, two when there are
                  two — a fixed three-column grid leaves a visible hole. */}
              <dl
                className={`mt-8 grid gap-6 ${
                  person.trackRecord.stats.length >= 3 ? "md:grid-cols-3" : "sm:grid-cols-2"
                }`}
              >
                {person.trackRecord.stats.map((stat) => (
                  <div key={stat.label} className="border-t-2 border-orange pt-4">
                    {/* The arrow is the inline SVG, not U+2192 — the
                        self-hosted font subsets have no glyph for it. */}
                    <dt className="readout flex items-center gap-3 text-[24px] leading-none text-paper md:text-[28px]">
                      {stat.changeTo ? (
                        <>
                          <span className="text-ash">{stat.number}</span>
                          <span className="text-orange">
                            <ArrowRight />
                          </span>
                          <span>{stat.changeTo}</span>
                        </>
                      ) : (
                        stat.number
                      )}
                    </dt>
                    <dd className="mt-3 text-[15px] leading-relaxed text-ash">{stat.label}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 max-w-[80ch] text-[13px] leading-relaxed text-ash/80">
                {person.trackRecord.attribution}
              </p>
            </section>
          ) : null}

          <section aria-labelledby="ventures">
            <h2 id="ventures" className={h2Class}>
              {person.ventures.h2}
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {person.ventures.items.map((item) => (
                <li key={item.name} className={`${card} p-5 md:p-6`}>
                  <p className="text-[17px] font-semibold text-paper">
                    {item.url ? (
                      <a href={item.url} className={quietLink}>
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </p>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-ash">
                    {item.role}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-ash">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {person.press && person.press.items.length > 0 ? (
            <section aria-labelledby="press">
              <h2 id="press" className={h2Class}>
                {person.press.h2}
              </h2>
              <p className={pClass}>{person.press.intro}</p>
              <ul className="mt-6 max-w-[80ch] space-y-5">
                {person.press.items.map((item) => (
                  <li key={item.url} className="border-t border-seam pt-5">
                    <a
                      href={item.url}
                      rel="noopener noreferrer"
                      className={`text-[17px] font-semibold leading-snug text-paper ${quietLink}`}
                    >
                      {item.title}
                    </a>
                    <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-ash">
                      {item.publisher} · <time dateTime={item.date}>{formatDate(item.date)}</time>
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ash">{item.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Renders only once real profile URLs are in the content module —
              see the note there. */}
          {person.profiles.links.length > 0 ? (
            <section aria-labelledby="profiles">
              <h2 id="profiles" className={h2Class}>
                {person.profiles.h2}
              </h2>
              <p className={pClass}>{person.profiles.intro}</p>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {person.profiles.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      rel="me noopener noreferrer"
                      className={`inline-flex min-h-[44px] items-center text-[16px] text-on-dark ${quietLink}`}
                    >
                      {link.label}
                      {link.handle ? (
                        <span className="ml-2 font-mono text-[13px] text-ash">{link.handle}</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="mt-14 border-t border-seam pt-6 text-[13px] text-ash">
            Page last updated{" "}
            <time dateTime={person.updated}>{formatDate(person.updated)}</time>.
          </p>

          {/* The sponsor template's closing CTA card, with the brand
              site's own booking copy. */}
          <div className={`${card} relative mt-10 overflow-hidden p-8 md:p-12`}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 80% at 50% 100%, rgb(240 94 35 / 0.18), transparent 70%)",
              }}
            />
            <div className="relative max-w-[60ch]">
              <h2 className="display text-[26px] text-paper md:text-[36px]">{booking.h2}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-ash">{booking.body}</p>
              <Link href="/#book" className="btn-primary mt-7 px-8 text-[16px]">
                {header.cta}
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* The sponsor site's footer shape — lockup and tagline on the left,
          contact and legal links on the right — with the brand domain's
          own links. Deliberately no postal address: it is published where
          A2P 10DLC brand registration actually needs it, on both domains'
          main footers and in /privacy and /terms, and the owner asked for
          it to stay off the page about him. The registered name appears
          once, in the copyright line. */}
      <footer className="border-t border-seam py-14 md:py-20">
        <div className={shell}>
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <BrandLockup variant="onDark" width={260} name={name} />
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
              <Link
                href="/privacy"
                className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 hover:text-paper"
              >
                {footer.privacyLabel}
              </Link>
              <Link
                href="/terms"
                className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 hover:text-paper"
              >
                {footer.termsLabel}
              </Link>
              <Link
                href="/sms"
                className="inline-flex min-h-[44px] items-center text-[16px] text-on-dark underline underline-offset-4 hover:text-paper"
              >
                {footer.textUpdatesLabel}
              </Link>
            </div>
          </div>

          <p className="mt-10 border-t border-seam pt-8 text-[14px] text-ash">
            © {new Date().getFullYear()} {business.legalName ?? business.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
