import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'safeguardmedia-uploads-prod.s3.us-east-1.amazonaws.com',
      'images.unsplash.com',
      'images.pexels.com',
      'png.pngtree.com',
      'freesvg.org',
    ],
  },
};

export default nextConfig;
