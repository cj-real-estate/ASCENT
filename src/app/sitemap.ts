import type { MetadataRoute } from "next";
import { verticals } from "@content/verticals";
import { verticalUrl } from "@/lib/metadata";

/*
 * Sitemap for the primary host: every vertical that lives there, plus
 * "/privacy", "/terms" and the SMS opt-in page. "/thanks" is a post-submit confirmation page and is
 * deliberately excluded (noindexed). A vertical that is the root of its own
 * domain (canonicalUrl set) is listed by that domain's sitemap instead —
 * see src/app/sponsors/sitemap.xml/route.ts. New verticals appear here
 * automatically by registering in content/verticals/index.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = verticals[0].business.url;
  const lastModified = new Date();
  return [
    ...verticals
      .filter((v) => !v.canonicalUrl)
      .map((v) => ({
        url: verticalUrl(v),
        lastModified,
        changeFrequency: "weekly" as const,
        // The brand page is the canonical entry point; verticals just under.
        priority: v.path === "/" ? 1 : 0.9,
      })),
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    /* The SMS opt-in page. Listed because A2P 10DLC campaign review has to
     * be able to find it — see docs/A2P-10DLC.md. */
    {
      url: `${base}/sms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
