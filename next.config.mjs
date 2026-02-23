/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  transpilePackages: ["geist"],
};

export default nextConfig;
