import type { MetadataRoute } from "next";
import vertical from "@content/verticals/fence";

/*
 * Only "/" and "/privacy" are listed. "/thanks" is a post-submit
 * confirmation page and is deliberately excluded (noindexed).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = vertical.business.url;
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
