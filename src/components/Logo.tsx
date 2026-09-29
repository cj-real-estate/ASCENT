import Image from "next/image";

/*
 * The Ascent logo, v3.
 *
 * v3 (brand/v3/README.txt) RETIRED the "Client Acquisition Systems"
 * lockup: the tagline is now INVESTOR ACQUISITION, and v3.0.1 also
 * corrected the chevron geometry, whose inner edges were built at the
 * wrong offset. Both live in the delivered SVG masters, which are outlined
 * type — so the lockup is served as an image rather than assembled from a
 * traced path plus live text the way the retired one was. Do not rebuild
 * it in markup; there is no font involved and nothing to align.
 *
 * The old traced mark (brand/mark-paths.json, scripts/trace-mark.py) is
 * the pre-v3 artwork with the wrong chevron. It is no longer rendered
 * anywhere. Do not reintroduce it, and do not run
 * `npm run generate:assets`, which regenerates the favicons from it —
 * scripts/build-v3-assets.mjs is the current one.
 *
 * "onLight" / "onDark" name the GROUND the logo sits on, not its own
 * colour, which is the brand system's convention.
 *
 * ascentcas.com uses the WORDMARK — chevron plus "ASCENT", no tagline — at
 * every size. The owner chose it over the tagline lockup (September 2026):
 * the "INVESTOR ACQUISITION" line doesn't describe this site's offer, and
 * the wordmark is the logo he hands out. The sponsor host keeps its own
 * lockup in components/sponsor/SponsorChrome.tsx; that is deliberate.
 * Callers pass a width and a ground; nothing else.
 */

const ASSETS = {
  onDark: { src: "/brand/ascent-wordmark-on-dark.svg", w: 762.917, h: 144.779 },
  onLight: { src: "/brand/ascent-wordmark-on-light.svg", w: 762.917, h: 144.779 },
} as const;

/** The brand guide's full-lockup minimum. No longer used on this host, where
 *  the wordmark is shown at every size; kept for anything that imports it. */
export const LOCKUP_MIN_WIDTH = 230;

export function BrandLockup({
  variant = "onLight",
  width,
  name,
  className = "",
  priority = false,
}: {
  variant?: "onLight" | "onDark";
  /** Rendered width in px. */
  width: number;
  /** Accessible name — the business, not the file. */
  name: string;
  className?: string;
  priority?: boolean;
}) {
  const asset = ASSETS[variant];
  return (
    <Image
      src={asset.src}
      alt={name}
      width={width}
      height={Math.round((width * asset.h) / asset.w)}
      priority={priority}
      className={className}
    />
  );
}

/*
 * The chevron alone, from the v3 masters. Used large and decorative — the
 * low-opacity watermark behind several sections — and anywhere the full
 * lockup will not fit.
 *
 * Two delivered variants, not a recolour: the two-colour icon on light
 * grounds, and the official one-colour WHITE icon on dark ones. The
 * two-colour version keeps its charcoal chevron on any ground (that is how
 * the on-dark lockup is drawn too), and charcoal at 5–13% opacity over ink
 * is invisible — which is exactly what the white variant exists for.
 * Never recolour either file.
 */
const ICONS = {
  onLight: "/brand/ascent-icon-color.svg",
  onDark: "/brand/ascent-icon-white.svg",
} as const;

export function AscentMark({
  variant = "onLight",
  className,
  title,
}: {
  variant?: "onLight" | "onDark";
  className?: string;
  title?: string;
}) {
  return (
    <Image
      src={ICONS[variant]}
      alt={title ?? ""}
      width={101}
      height={100}
      aria-hidden={title ? undefined : true}
      className={className}
    />
  );
}

export default BrandLockup;
