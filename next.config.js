const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Disable optimization for local dev
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
