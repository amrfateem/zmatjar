/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")("./i18n.js");
const nextConfig = {
  experimental: {
    esmExternals: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_DOMAIN,
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
