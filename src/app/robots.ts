import type { MetadataRoute } from "next";
import vertical from "@content/verticals/general";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${vertical.business.url}/sitemap.xml`,
  };
}
