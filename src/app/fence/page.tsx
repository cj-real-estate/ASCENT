import type { Metadata } from "next";
import fence, { foundingSpotsRemaining } from "@content/verticals/fence";
import VerticalPage from "@/components/VerticalPage";
import { verticalMetadata } from "@/lib/metadata";

/*
 * The pitch. Every outbound email, call follow-up, DM, and ad should link
 * directly here, never to "/".
 */
export const metadata: Metadata = verticalMetadata(fence);

export default function FencePage() {
  return (
    <VerticalPage vertical={fence} spotsRemaining={foundingSpotsRemaining} />
  );
}
