import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import general from "@content/verticals/general";
import calebFree from "@content/people/caleb-free";
import { formatAddress } from "@/lib/business";
import { personProfileGraph } from "@/lib/schema";
import { JsonLdData } from "@/components/JsonLd";
import { AscentLockup } from "@/components/Logo";

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
 * Indexed, in the sitemap, and linked from the brand footer, because an
 * orphan page cannot do this job. Light ground, like /privacy and /terms.
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

const h2Class = "display mt-14 text-[22px] text-ink md:text-[30px]";
const pClass = "mt-4 max-w-[68ch] text-[17px] leading-relaxed text-ink";

export default function CalebFreePage() {
  const person = calebFree;
  const { business } = general;
  const address = formatAddress(business);
  const lockupTagline = business.name.split(" ").slice(1).join(" ");

  return (
    <main className="bg-paper py-12 md:py-20">
      <JsonLdData data={personProfileGraph(general, person)} />
      <div className="section-shell">
        <Link href="/" aria-label={business.name} className="inline-flex min-h-[44px] items-center">
          <AscentLockup variant="onLight" name={business.name} tagline={lockupTagline} />
        </Link>

        <nav aria-label="Breadcrumb" className="mt-10 font-mono text-[12px] uppercase tracking-[0.14em] text-slate">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
              <span aria-hidden="true" className="ml-2">/</span>
            </li>
            <li aria-current="page">{person.name}</li>
          </ol>
        </nav>

        <header className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          <div className="max-w-[68ch]">
            <p className="eyebrow text-orange-deep">{person.eyebrow}</p>
            <h1 className="display mt-4 text-[38px] text-ink md:text-[54px]">{person.name}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-slate md:text-[18px]">
              {person.tagline}
            </p>
          </div>
          {person.image ? (
            <Image
              src={person.image.page.src}
              alt={person.image.alt}
              width={person.image.page.width}
              height={person.image.page.height}
              priority
              sizes="(min-width: 768px) 240px, 200px"
              className="w-[200px] shrink-0 rounded-xl md:w-[240px]"
            />
          ) : null}
        </header>

        {/* The definitive paragraph — first substantive text on the page,
            written to be quoted whole. */}
        <div className="mt-10 max-w-[80ch] rounded-xl border border-slate/25 bg-surface p-6 md:p-8">
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-orange-deep">
            In short
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-ink md:text-[18px]">{person.summary}</p>
        </div>

        <section aria-labelledby="facts" className="mt-12 max-w-[80ch]">
          <h2 id="facts" className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-slate">
            At a glance
          </h2>
          <dl className="mt-4 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {person.facts.map((fact) => (
              <div key={fact.label} className="border-t border-line pt-4">
                <dt className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-slate">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-[16px] leading-relaxed text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {person.bio.map((section) => (
          <section key={section.h2} aria-labelledby={section.h2.replace(/\s+/g, "-").toLowerCase()}>
            <h2 id={section.h2.replace(/\s+/g, "-").toLowerCase()} className={h2Class}>
              {section.h2}
            </h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className={pClass}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {person.trackRecord ? (
          <section aria-labelledby="track-record">
            <h2 id="track-record" className={h2Class}>
              {person.trackRecord.h2}
            </h2>
            <p className={pClass}>{person.trackRecord.intro}</p>
            <dl className="mt-8 grid gap-6 md:grid-cols-3">
              {person.trackRecord.stats.map((stat) => (
                <div key={stat.label} className="border-t-2 border-orange pt-4">
                  <dt className="readout text-[24px] leading-none text-ink md:text-[28px]">
                    {stat.number}
                  </dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-slate">{stat.label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-[80ch] text-[13px] leading-relaxed text-slate">
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
              <li key={item.name} className="rounded-xl border border-slate/25 bg-surface p-5 md:p-6">
                <p className="text-[17px] font-semibold text-ink">
                  {item.url ? (
                    <a href={item.url} className="text-orange-deep underline underline-offset-4">
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </p>
                <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-slate">
                  {item.role}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">{item.body}</p>
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
                <li key={item.url} className="border-t border-line pt-5">
                  <a
                    href={item.url}
                    rel="noopener noreferrer"
                    className="text-[17px] font-semibold leading-snug text-orange-deep underline underline-offset-4"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-slate">
                    {item.publisher} ·{" "}
                    <time dateTime={item.date}>
                      {new Date(`${item.date}T12:00:00Z`).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </time>
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate">{item.note}</p>
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
                    className="inline-flex min-h-[44px] items-center text-[16px] text-orange-deep underline underline-offset-4"
                  >
                    {link.label}
                    {link.handle ? (
                      <span className="ml-2 font-mono text-[13px] text-slate">{link.handle}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="contact">
          <h2 id="contact" className={h2Class}>
            Contact
          </h2>
          <p className={pClass}>
            {business.legalName ?? business.name}
            {address ? (
              <>
                <br />
                {address}
              </>
            ) : null}
          </p>
          <p className={pClass}>
            {business.email ? (
              <a
                href={`mailto:${business.email}`}
                className="text-orange-deep underline underline-offset-4"
              >
                {business.email}
              </a>
            ) : null}
            {business.email && business.phone ? " · " : null}
            {business.phone ? (
              <a
                href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
                className="text-orange-deep underline underline-offset-4"
              >
                {business.phone}
              </a>
            ) : null}
          </p>
          <p className="mt-8 text-[13px] text-slate">
            Page last updated{" "}
            <time dateTime={person.updated}>
              {new Date(`${person.updated}T12:00:00Z`).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
            .
          </p>
        </section>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 border-t border-line pt-4 text-[14px] text-slate">
          <p>
            © {new Date().getFullYear()} {business.legalName ?? business.name}
          </p>
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
