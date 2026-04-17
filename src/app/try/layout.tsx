import { AnonymousSessionProvider } from "@/components/try/AnonymousSessionContext";
import { SignupModal } from "@/components/try/SignupModal";
import { TryHeader } from "@/components/try/TryHeader";

export const metadata = {
  title: "Try SafeGuard — 3 free analyses, no account needed",
  description:
    "Try deepfake detection, authenticity checks, claim research, geolocation verification, and reverse lookup — no login required.",
};

export default function TryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnonymousSessionProvider>
      <div className="min-h-svh bg-white">
        <TryHeader />
        <main>{children}</main>
        <SignupModal />
      </div>
    </AnonymousSessionProvider>
  );
}
