/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig; 