/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "drive.google.com",
      "cdn.discordapp.com",
      "media.discordapp.net",
      "images.unsplash.com",
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
