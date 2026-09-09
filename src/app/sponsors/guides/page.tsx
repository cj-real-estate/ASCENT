import type { Metadata } from "next";
import sponsors, { sponsorsPage, SPONSOR_PAGE_UPDATED } from "@content/verticals/sponsors";
import { guides, guidesUpdated } from "@content/guides";
import { JsonLdData } from "@/components/JsonLd";
import { guidesIndexGraph } from "@/lib/schema";
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
} from "@/components/sponsor/SponsorChrome";

/*
 * The guides index — ascentforsponsors.com/guides (via the host rewrite in
 * next.config.ts). Lists every guide registered in content/guides.
 */
const url = `${sponsors.business.url}/guides`;

export const metadata: Metadata = {
  title: "Guides for 506(c) Real Estate Sponsors",
  description: sponsorsPage.guides.sub,
  alternates: { canonical: url },
  openGraph: {
    title: `Guides for 506(c) Real Estate Sponsors | ${sponsors.business.shortName}`,
    description: sponsorsPage.guides.sub,
    url,
    siteName: sponsors.business.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${sponsors.business.url}${sponsors.seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: sponsors.business.name,
      },
    ],
  },
};

export default function GuidesIndexPage() {
  const page = sponsorsPage;
  return (
    <div data-dark data-theme="dark" className="min-h-dvh bg-night text-paper">
      <JsonLdData
        data={guidesIndexGraph(sponsors, page, guides, [guidesUpdated, SPONSOR_PAGE_UPDATED].sort().at(-1)!)}
      />
      <SponsorHeader
        vertical={sponsors}
        cta={page.nav.cta}
        home={sponsorHref(sponsors, "/")}
        ctaHref={sponsorHref(sponsors, "/#book")}
        openModal={false}
      />
      <main className="py-14 md:py-24">
        <div className={shell}>
          <Eyebrow>{page.guides.eyebrow}</Eyebrow>
          <h1 className={`${h2} mt-4`}>{page.guides.h2}</h1>
          <p className={sub}>{page.guides.sub}</p>
          <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
            {guides.map((g) => (
              <li key={g.slug}>
                <a
                  href={sponsorHref(sponsors, guidePath(g))}
                  className={`${card} flex h-full flex-col p-6 motion-safe:transition-[transform,border-color] motion-safe:hover:-translate-y-1 hover:border-ash/40 md:p-7`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">{g.eyebrow}</span>
                  <span className="mt-3 text-[20px] font-semibold leading-snug text-paper">{g.title}</span>
                  <span className="mt-3 text-[15px] leading-relaxed text-ash">{g.description}</span>
                </a>
              </li>
            ))}
          </ul>
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
