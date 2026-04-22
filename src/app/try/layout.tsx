import { AnonymousSessionProvider } from '@/components/try/AnonymousSessionContext';
import { SignupModal } from '@/components/try/SignupModal';
import { TryHeader } from '@/components/try/TryHeader';
import { UpgradeModal } from '@/components/try/UpgradeModal';

export const metadata = {
  title: 'Try Safeguardmedia. 3 free analyses, no account needed',
  description:
    'Try deepfake detection, authenticity checks, claim research, fact checks, geolocation verification, and reverse lookup — no login required.',
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnonymousSessionProvider>
      <div className="min-h-svh bg-white">
        <TryHeader />
        <main>{children}</main>
        <SignupModal />
        <UpgradeModal />
      </div>
    </AnonymousSessionProvider>
  );
}
