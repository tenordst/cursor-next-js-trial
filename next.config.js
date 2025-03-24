/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use middlewareConfig instead of config in middleware.ts
  experimental: {
    middleware: true,
  },
};

module.exports = nextConfig; 