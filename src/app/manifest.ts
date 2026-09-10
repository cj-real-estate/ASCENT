import type { MetadataRoute } from "next";
import vertical from "@content/verticals/fence";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // `name` is the installed app's full label, `short_name` the one that
    // fits under a home-screen icon. The brand name is short enough to be
    // both, so the long form uses the registered name — the only place on
    // the site where the two differ for length rather than for law.
    name: vertical.business.legalName ?? vertical.business.name,
    short_name: vertical.business.name,
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
