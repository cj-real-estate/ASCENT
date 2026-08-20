import vertical, { foundingSpotsRemaining } from "@content/verticals/fence";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ProofSection from "@/components/ProofSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import GuaranteesSection from "@/components/GuaranteesSection";
import FoundingFiveSection from "@/components/FoundingFiveSection";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd vertical={vertical} />
      <Header vertical={vertical} />
      <main>
        <Hero vertical={vertical} />
        <ProblemSection vertical={vertical} />
        <ProofSection vertical={vertical} />
        <HowItWorksSection vertical={vertical} />
        <PricingSection vertical={vertical} />
        <GuaranteesSection vertical={vertical} />
        <FoundingFiveSection
          vertical={vertical}
          spotsRemaining={foundingSpotsRemaining}
        />
        <BookingSection
          vertical={vertical}
          spotsRemaining={foundingSpotsRemaining}
        />
      </main>
      <Footer vertical={vertical} />
    </>
  );
}
