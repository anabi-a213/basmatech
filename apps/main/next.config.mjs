/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow consuming TS source from workspace packages without a build step.
  transpilePackages: ['@basmatech/design-system', '@basmatech/content'],
  experimental: {
    optimizePackageImports: ['framer-motion', '@gsap/react'],
  },
  // Long-cache the public frames; they're versioned by path.
  async headers() {
    return [
      {
        source: '/frames/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/showcase/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
