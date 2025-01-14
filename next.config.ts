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
        source: '/Login',
        destination: '/',
        permanent: true,
      },
      {
        source: "/errorPage",
        destination: "/",
        permanent: true
      }
    ]
  }
}

export default nextConfig;
