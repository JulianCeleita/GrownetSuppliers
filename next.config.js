/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grownet-front-images.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
