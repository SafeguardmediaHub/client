import HeroSection from "@/components/hero-section";
import CoreCapabilities from "@/components/landing-page/CoreCapabilities";
import Footer from "@/components/landing-page/Footer";
import HowItWorks from "@/components/landing-page/HowItWorks";
import SecuringChannels from "@/components/landing-page/SecuringChannels";
import TryCTA from "@/components/landing-page/TryCTA";
import V2FeaturesCarousel from "@/components/landing-page/V2FeaturesCarousel";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CoreCapabilities />
      <HowItWorks />
      <SecuringChannels />
      <V2FeaturesCarousel />
      <TryCTA />
      <Footer />
    </div>
  );
}
