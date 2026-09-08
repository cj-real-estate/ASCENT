import type { Metadata } from "next";
import sponsors from "@content/verticals/sponsors";
import VerticalPage from "@/components/VerticalPage";
import { verticalMetadata } from "@/lib/metadata";

/*
 * The sponsor page — investor acquisition for real estate syndicators and
 * private RE fund sponsors raising under Rule 506(c). It is the ROOT of
 * ascentforsponsors.com: next.config.ts rewrites that host's "/" here, and
 * the canonical points at that domain whichever host served the request.
 */
export const metadata: Metadata = verticalMetadata(sponsors);

export default function SponsorsPage() {
  return <VerticalPage vertical={sponsors} />;
}
