import type { NextConfig } from 'next';

// CSP is handled per-request in middleware.ts (nonce-based)
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/try/deepfake', destination: '/try/ai-detection', permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { hostname: 'safeguardmedia-uploads-prod.s3.us-east-1.amazonaws.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'images.pexels.com' },
      { hostname: 'png.pngtree.com' },
      { hostname: 'freesvg.org' },
      { hostname: 'ik.imagekit.io' },
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' }, // Fallback for some local setups
    ],
  },
};

export default nextConfig;
