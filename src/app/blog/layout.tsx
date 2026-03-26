import { HeroHeader } from "@/components/header";
import Footer from "@/components/landing-page/Footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHeader variant="compact" />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
