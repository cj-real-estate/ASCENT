import type { Metadata } from "next";
import { notFound } from "next/navigation";
import sponsors, { sponsorsPage } from "@content/verticals/sponsors";
import { guideBySlug, guides } from "@content/guides";
import { JsonLdData } from "@/components/JsonLd";
import { guideGraph } from "@/lib/schema";
import GuideArticle from "@/components/sponsor/GuideArticle";
import { SponsorFooter, SponsorHeader, sponsorHref } from "@/components/sponsor/SponsorChrome";

/*
 * One guide — ascentforsponsors.com/guides/<slug> (via the host rewrite in
 * next.config.ts). Statically generated for every slug in content/guides;
 * anything else is a 404. Canonical is absolute on the sponsor domain, so
 * the /sponsors/guides/… path on ascentcas.com canonicalises here.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  const url = `${sponsors.business.url}/guides/${guide.slug}`;
  // The guide's own photo as the social card (1200×630 beside the 960×540).
  const image = `${sponsors.business.url}${guide.image.src.replace(/\.jpg$/, "-og.jpg")}`;
  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: { canonical: url },
    authors: sponsors.business.founder ? [{ name: sponsors.business.founder.name, url: sponsors.business.url }] : undefined,
    openGraph: {
      title: `${guide.seoTitle} | ${sponsors.business.shortName}`,
      description: guide.description,
      url,
      siteName: sponsors.business.name,
      type: "article",
      locale: "en_US",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: sponsors.business.founder ? [sponsors.business.founder.name] : undefined,
      section: guide.eyebrow,
      images: [{ url: image, width: 1200, height: 630, alt: guide.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.seoTitle} | ${sponsors.business.shortName}`,
      description: guide.description,
      images: [image],
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();
  const related = guide.related.map(guideBySlug).filter((g): g is NonNullable<typeof g> => Boolean(g));
  const page = sponsorsPage;
  return (
    <div data-dark data-theme="dark" className="min-h-dvh bg-night text-paper">
      <JsonLdData data={guideGraph(sponsors, page, guide)} />
      <SponsorHeader
        vertical={sponsors}
        cta={page.nav.cta}
        home={sponsorHref(sponsors, "/")}
        ctaHref={sponsorHref(sponsors, "/#book")}
        openModal={false}
      />
      <main>
        <GuideArticle vertical={sponsors} page={page} guide={guide} related={related} />
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
