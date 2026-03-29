const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Disable Next.js image proxy — browser fetches images directly.
    // This is necessary when the image source (e.g. http://127.0.0.1:8000) is
    // a private IP that the dev server proxy blocks.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.hy-florist.hk',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'hy-florist.hk',
        pathname: '/**',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
