const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove PWA-related env vars that might be causing issues
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
