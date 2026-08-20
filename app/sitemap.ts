import type { MetadataRoute } from "next";
import { verticals } from "@/content/verticals";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const verticalEntries = verticals.map((vertical) => ({
    url: vertical.path === "/" ? SITE_URL : `${SITE_URL}${vertical.path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: vertical.path === "/" ? 1 : 0.9,
  }));
  return [
    ...verticalEntries,
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
