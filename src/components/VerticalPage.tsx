import type { Vertical } from "@content/verticals/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import ProofSection from "@/components/ProofSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import GuaranteesSection from "@/components/GuaranteesSection";
import FoundingFiveSection from "@/components/FoundingFiveSection";
import CtaBand from "@/components/CtaBand";
import FaqSection from "@/components/FaqSection";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

/*
 * One assembler for every vertical. Section order is fixed; which sections
 * appear is decided entirely by the content module — each optional section
 * renders nothing when its content is null. Adding a vertical is a content
 * file plus a route, never a new page component.
 */
export function VerticalPage({
  vertical,
  spotsRemaining,
}: {
  vertical: Vertical;
  spotsRemaining: number;
}) {
  return (
    <>
      <JsonLd vertical={vertical} />
      <Header vertical={vertical} />
      <main>
        <Hero vertical={vertical} />
        <ProblemSection vertical={vertical} />
        {/* Everything we sell; carries the owner card where the page
            has no standalone three-step section */}
        <ServicesSection vertical={vertical} />
        <ProofSection vertical={vertical} />
        {/* Re-ask right after the proof beat, reference-site style */}
        <CtaBand vertical={vertical} />
        {/* Vertical page: the standalone three-step section */}
        <HowItWorksSection vertical={vertical} />
        <PricingSection vertical={vertical} spotsRemaining={spotsRemaining} />
        <GuaranteesSection vertical={vertical} />
        <FoundingFiveSection
          vertical={vertical}
          spotsRemaining={spotsRemaining}
        />
        {/* Objections answered right before the ask */}
        <FaqSection vertical={vertical} />
        <BookingSection vertical={vertical} spotsRemaining={spotsRemaining} />
      </main>
      <Footer vertical={vertical} />
    </>
  );
}

export default VerticalPage;
