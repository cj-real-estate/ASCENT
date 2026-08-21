import type { Metadata } from "next";
import general from "@content/verticals/general";
import { foundingSpotsRemaining } from "@content/verticals/fence";
import VerticalPage from "@/components/VerticalPage";
import { verticalMetadata } from "@/lib/metadata";

/*
 * The brand page. Broad and institutional: it exists so someone who already
 * heard the name believes Ascent is a real firm and books the audit.
 * Outbound traffic should go to /fence instead — a one-trade pitch converts
 * better than a trade-agnostic one.
 */
export const metadata: Metadata = verticalMetadata(general);

export default function Home() {
  return (
    <VerticalPage vertical={general} spotsRemaining={foundingSpotsRemaining} />
  );
}
