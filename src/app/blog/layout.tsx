import { HeroHeader } from '@/components/header';
import Footer from '@/components/landing-page/Footer';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHeader />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </div>
  );
}
