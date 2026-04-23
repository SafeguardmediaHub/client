import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { headers } from "next/headers";
import "cal-sans/index.css";
import "./globals.css";
import { Toaster } from "sonner";
import ConsentAwareAdsense from "@/components/privacy/ConsentAwareAdsense";
import ConsentAwareAnalytics from "@/components/privacy/ConsentAwareAnalytics";
import CookieConsentManager from "@/components/privacy/CookieConsentManager";
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
    title:
      "Safeguardmedia Technologies - Media Authenticity & Verification Platform",
    description:
      "Safeguardmedia is a media authenticity and verification platform designed to help teams assess content credibility and reduce the risk of manipulation before they publish, escalate, or act.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        type: "image/svg+xml",
        alt: "Safeguardmedia Technologies - Media Authenticity & Verification Platform",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title:
      "Safeguardmedia Technologies - Media Authenticity & Verification Platform",
    description:
      "Safeguardmedia is a media authenticity and verification platform designed to help teams assess content credibility and reduce the risk of manipulation.",
    images: ["/og-image.svg"],
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/SGM.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html lang="en">
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
        <CookieConsentManager />
        <ConsentAwareAdsense nonce={nonce} />
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
