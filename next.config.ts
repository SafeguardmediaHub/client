import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
