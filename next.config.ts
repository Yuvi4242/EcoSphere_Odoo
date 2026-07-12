import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  async redirects() {
    return [
      {
        source: '/overview',
        destination: '/admin/overview',
        permanent: false,
      },
      {
        source: '/environmental/:path*',
        destination: '/admin/environmental/:path*',
        permanent: false,
      },
      {
        source: '/social/:path*',
        destination: '/admin/social/:path*',
        permanent: false,
      },
      {
        source: '/governance/:path*',
        destination: '/admin/governance/:path*',
        permanent: false,
      },
      {
        source: '/gamification/:path*',
        destination: '/admin/gamification/:path*',
        permanent: false,
      },
      {
        source: '/reports/:path*',
        destination: '/admin/reports/:path*',
        permanent: false,
      },
      {
        source: '/settings/:path*',
        destination: '/admin/settings/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;