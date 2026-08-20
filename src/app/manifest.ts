import type { MetadataRoute } from "next";
import vertical from "@content/verticals/fence";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: vertical.business.name,
    short_name: vertical.business.shortName,
    start_url: "/",
    display: "minimal-ui",
    background_color: "#FFFFFF",
    theme_color: "#1F1F1F",
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
