/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    domains: ["grownet-front-images.s3.us-east-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
