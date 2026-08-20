import type { Vertical } from "@/content/verticals/types";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ProblemSection } from "./ProblemSection";
import { InstallSection } from "./InstallSection";
import { ProofSection } from "./ProofSection";
import { OfferSection } from "./OfferSection";
import { BookingSection } from "./BookingSection";
import { Footer } from "./Footer";

/*
 * One assembler for every vertical. The section order is fixed by the
 * handoff; everything a section renders comes from the `Vertical` content
 * module it's handed.
 */
export function VerticalPage({ vertical }: { vertical: Vertical }) {
  return (
    <>
      <Header vertical={vertical} />
      <main>
        <Hero vertical={vertical} />
        <ProblemSection vertical={vertical} />
        <InstallSection vertical={vertical} />
        <ProofSection vertical={vertical} />
        <OfferSection vertical={vertical} />
        <BookingSection vertical={vertical} />
      </main>
      <Footer vertical={vertical} />
    </>
  );
}
