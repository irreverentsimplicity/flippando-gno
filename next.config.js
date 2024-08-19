/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // Enable WebAssembly support
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true, // This may be required for certain wasm modules
    };

    return config;
  },
};