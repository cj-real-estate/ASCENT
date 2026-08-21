import type { MetadataRoute } from "next";
import { verticals } from "@content/verticals";

/*
 * Every vertical plus "/privacy". "/thanks" is a post-submit confirmation
 * page and is deliberately excluded (noindexed). New verticals appear here
 * automatically by registering in content/verticals/index.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = verticals[0].business.url;
  const lastModified = new Date();
  return [
    ...verticals.map((v) => ({
      url: `${base}${v.path}`,
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
  ];
}
