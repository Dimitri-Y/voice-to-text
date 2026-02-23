/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  transpilePackages: ["geist"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
