import HeroSection from '@/components/hero-section';
import CoreCapabilities from '@/components/landing-page/CoreCapabilities';
import Footer from '@/components/landing-page/Footer';
import HowItWorks from '@/components/landing-page/HowItWorks';
import SecuringChannels from '@/components/landing-page/SecuringChannels';
import V2FeaturesCarousel from '@/components/landing-page/V2FeaturesCarousel';
import WaitlistForm from '@/components/landing-page/WaitlistForm';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <CoreCapabilities />
      <SecuringChannels />
      <V2FeaturesCarousel />
      <WaitlistForm />
      <Footer />
    </div>
  );
}
