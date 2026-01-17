import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import QueryProvider from '@/components/providers/QueryProvider';
import { AssistantProvider } from '@/context/AssistantContext';
import { AuthProvider } from '@/context/AuthContext';
import { WebSocketProvider } from '@/context/WebSocketContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SafeguardMedia - AI-Powered Misinformation Detection',
    template: '%s | SafeguardMedia',
  },
  description:
    'Advanced AI-powered platform for detecting misinformation, AI-generated media, and manipulated content. Features include fact-checking, social media tracing, forensic analysis, and C2PA verification.',
  keywords: [
    'misinformation detection',
    'fact checking',
    'AI-generated media detection',
    'media verification',
    'AI fact checker',
    'social media tracing',
    'forensic analysis',
    'C2PA verification',
    'content authenticity',
    'fake news detection',
    'media forensics',
    'digital verification',
  ],
  authors: [{ name: 'SafeguardMedia Team' }],
  creator: 'SafeguardMedia',
  publisher: 'SafeguardMedia',
  applicationName: 'SafeguardMedia',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'SafeguardMedia',
    title: 'SafeguardMedia - AI-Powered Misinformation Detection',
    description:
      'Advanced AI-powered platform for detecting misinformation, AI-generated media, and manipulated content. Features include fact-checking, social media tracing, forensic analysis, and C2PA verification.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SafeguardMedia - AI-Powered Misinformation Detection Platform',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'SafeguardMedia - AI-Powered Misinformation Detection',
    description:
      'Advanced AI-powered platform for detecting misinformation, AI-generated media, and manipulated content.',
    images: ['/og-image.png'],
    creator: '@safeguardmedia',
  },

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // Verification (add your verification codes when available)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },

  // Category
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <WebSocketProvider>
              <AssistantProvider>{children}</AssistantProvider>
            </WebSocketProvider>
          </AuthProvider>
        </QueryProvider>

        <Toaster richColors expand={true} duration={5000} />
        <Analytics />
      </body>
    </html>
  );
}
