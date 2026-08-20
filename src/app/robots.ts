import type { MetadataRoute } from "next";
import vertical from "@content/verticals/fence";

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
