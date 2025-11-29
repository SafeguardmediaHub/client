import HeroSection from '@/components/hero-section';
import CoreCapabilities from '@/components/landing-page/CoreCapabilities';
import FlagshipSolution from '@/components/landing-page/FlagshipSolution';
import Footer from '@/components/landing-page/Footer';
// import FutureSection from '@/components/landing-page/FutureSection';
import SecuringChannels from '@/components/landing-page/SecuringChannels';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FlagshipSolution />
      <CoreCapabilities />
      <SecuringChannels />
      {/* <FutureSection /> */}
      <Footer />
    </div>
  );
}
