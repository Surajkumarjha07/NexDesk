import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "" }
    ]
  }
};

module.exports = {
  output: 'export',
};

module.exports = {
  async redirects() {
    return [
      {
        source: '/pages/Login',
        destination: '/',
        permanent: true,
      },
      {
        source: "/pages/errorPage",
        destination: "/",
        permanent: true
      }
    ]
  }
}

export default nextConfig;
