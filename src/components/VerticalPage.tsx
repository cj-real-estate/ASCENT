import type { Vertical } from "@content/verticals/types";
import { toQualifyFlowProps } from "@/lib/qualify";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import SystemFlowSection from "@/components/SystemFlowSection";
import ProofSection from "@/components/ProofSection";
import TransparencySection from "@/components/TransparencySection";
import BoundariesSection from "@/components/BoundariesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FitSection from "@/components/FitSection";
import PricingSection from "@/components/PricingSection";
import ExpectationsSection from "@/components/ExpectationsSection";
import GuaranteesSection from "@/components/GuaranteesSection";
import CalculatorSection from "@/components/CalculatorSection";
import CtaBand from "@/components/CtaBand";
import FaqSection from "@/components/FaqSection";
import LeadModal from "@/components/LeadModal";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

/*
 * One assembler for every vertical. Section order is fixed; which sections
 * appear is decided entirely by the content module — each optional section
 * renders nothing when its content is null. Adding a vertical is a content
 * file plus a route, never a new page component.
 */
export function VerticalPage({ vertical }: { vertical: Vertical }) {
  // Section indexes for the "(01) / EYEBROW" markers, assigned in render
  // order and only to sections that render an eyebrow on this vertical.
  // Explicit (not CSS counters): cv-auto's style containment scopes
  // counters per-section and breaks the sequence.
  let n = 0;
  const idx = {
    problem: ++n,
    systemFlow: vertical.systemFlow ? ++n : undefined,
    calculator: ++n,
    services: vertical.services ? ++n : undefined,
    transparency: vertical.transparency ? ++n : undefined,
    boundaries: vertical.boundaries ? ++n : undefined,
    howItWorks: vertical.howItWorks ? ++n : undefined,
    fit: vertical.fit ? ++n : undefined,
    pricing: vertical.pricing?.eyebrow ? ++n : undefined,
    expectations: vertical.expectations ? ++n : undefined,
    guarantees: vertical.guarantees ? ++n : undefined,
    faq: vertical.faq ? ++n : undefined,
    booking: ++n,
  };

  return (
    <>
      <JsonLd vertical={vertical} />
      <Header vertical={vertical} />
      <main>
        <Hero vertical={vertical} />
        <ProblemSection vertical={vertical} index={idx.problem} />
        {/* Answer "so how?" the moment the problem lands — the diagram is
            what makes "our system" concrete before anything is claimed */}
        <SystemFlowSection vertical={vertical} index={idx.systemFlow} />
        {/* Then quantify what the machine returns */}
        <CalculatorSection vertical={vertical} index={idx.calculator} />
        {/* Everything we sell; carries the owner card where the page
            has no standalone three-step section */}
        <ServicesSection vertical={vertical} index={idx.services} />
        <ProofSection vertical={vertical} />
        {/* The numbers, then how we report them */}
        <TransparencySection vertical={vertical} index={idx.transparency} />
        {/* What the firm will not do — the compliance buyer's section */}
        <BoundariesSection vertical={vertical} index={idx.boundaries} />
        {/* Re-ask right after the proof + transparency beat */}
        <CtaBand vertical={vertical} />
        {/* Vertical page: the standalone three-step section */}
        <HowItWorksSection vertical={vertical} index={idx.howItWorks} />
        {/* Qualify before the price (or the engagement terms) */}
        <FitSection vertical={vertical} index={idx.fit} />
        <PricingSection vertical={vertical} index={idx.pricing} />
        <ExpectationsSection vertical={vertical} index={idx.expectations} />
        <GuaranteesSection vertical={vertical} index={idx.guarantees} />
        {/* Objections answered right before the ask */}
        <FaqSection vertical={vertical} index={idx.faq} />
        <BookingSection vertical={vertical} index={idx.booking} />
        <LeadModal flow={toQualifyFlowProps(vertical)} />
      </main>
      <Footer vertical={vertical} />
    </>
  );
}

export default VerticalPage;
