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
    ],
  },
};

export default nextConfig;
