/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@basmatech/design-system', '@basmatech/content'],
  experimental: {
    optimizePackageImports: ['framer-motion', '@gsap/react'],
  },
  async headers() {
    // In dev, never cache asset folders so regenerated photos/frames pick up
    // immediately on reload. Production cache headers are set in vercel.json.
    if (process.env.NODE_ENV !== 'production') {
      const noCache = { key: 'Cache-Control', value: 'no-store, must-revalidate' };
      return [
        { source: '/frames/:path*', headers: [noCache] },
        { source: '/rooms/:path*', headers: [noCache] },
        { source: '/showcase/:path*', headers: [noCache] },
        { source: '/corridor/:path*', headers: [noCache] },
      ];
    }
    return [
      {
        source: '/frames/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/corridor/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/showcase/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/rooms/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
