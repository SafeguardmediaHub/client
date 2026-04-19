import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { headers } from "next/headers";
import "cal-sans/index.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import { AssistantProvider } from "@/context/AssistantContext";
import { AuthProvider } from "@/context/AuthContext";
import { WebSocketProvider } from "@/context/WebSocketContext";

export const metadata: Metadata = {
  title: {
    default:
      "Safeguardmedia Technologies - Media Authenticity & Verification Platform",
    template: "%s | Safeguardmedia Technologies",
  },
  description:
    "Safeguardmedia is a media authenticity and verification platform designed to help teams assess content credibility and reduce the risk of manipulation before they publish, escalate, or act.",
  keywords: [
    "AI-generated media detection",
    "fact checking",
    "media authenticity",
    "content verification",
    "media verification",
    "content credibility",
    "manipulated media detection",
    "social media tracing",
    "forensic analysis",
    "C2PA verification",
    "content authenticity",
    "media forensics",
    "digital verification",
    "verification workflows",
  ],
  authors: [{ name: "Safeguardmedia Technologies Team" }],
  creator: "Safeguardmedia Technologies",
  publisher: "Safeguardmedia Technologies",
  applicationName: "Safeguardmedia Technologies",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),

  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Safeguardmedia Technologies",
    title: "Safeguardmedia Technologies - Media Authenticity & Verification Platform",
    description:
      "Safeguardmedia is a media authenticity and verification platform designed to help teams assess content credibility and reduce the risk of manipulation before they publish, escalate, or act.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Safeguardmedia Technologies - Media Authenticity & Verification Platform",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Safeguardmedia Technologies - Media Authenticity & Verification Platform",
    description:
      "Safeguardmedia is a media authenticity and verification platform designed to help teams assess content credibility and reduce the risk of manipulation.",
    images: ["/og-image.png"],
    creator: "@safeguardmedia",
  },

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Verification (add your verification codes when available)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },

  // Category
  category: "technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html lang="en">
      <head>
        <script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3526860570408649"
          async
          crossOrigin="anonymous"
          nonce={nonce}
        />
      </head>
      <body
        className={`${GeistSans.variable} font-sans antialiased`}
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
