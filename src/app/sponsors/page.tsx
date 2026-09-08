import type { Metadata } from "next";
import sponsors, { sponsorsPage } from "@content/verticals/sponsors";
import SponsorPage from "@/components/sponsor/SponsorPage";
import { verticalMetadata } from "@/lib/metadata";

/*
 * The sponsor page — investor acquisition for real estate syndicators and
 * private RE fund sponsors raising under Rule 506(c). It is the ROOT of
 * ascentforsponsors.com: next.config.ts rewrites that host's "/" here, and
 * the canonical points at that domain whichever host served the request.
 *
 * Rendered by the dark sponsor template, not VerticalPage — see
 * src/components/sponsor/SponsorPage.tsx for why.
 */
export const metadata: Metadata = verticalMetadata(sponsors);

export default function SponsorsPage() {
  return <SponsorPage vertical={sponsors} page={sponsorsPage} />;
}
