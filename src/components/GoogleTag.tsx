import Script from "next/script";

import { GOOGLE_ADS_ID } from "@/lib/conversion";

/*
 * Google Ads global site tag (gtag.js).
 *
 * Loaded through next/script with `afterInteractive` rather than a raw
 * <script> in the document head: the tag is not needed to render the page,
 * and deferring it keeps it off the critical path that the hero calculator
 * and LCP depend on.
 *
 * Skipped in local development so `npm run dev` never fires conversions.
 * It DOES load on Vercel preview deployments — see the note in README.md if
 * you would rather it fired only on ascentcas.com.
 *
 * Note this tag sets advertising cookies, which is why /privacy discloses
 * Google Ads by name. If the tag is ever removed, correct that page too.
 */


export default function GoogleTag() {
  if (process.env.NODE_ENV === "development") return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  );
}
