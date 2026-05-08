import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' maps.googleapis.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' blob: data: maps.gstatic.com *.googleapis.com;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' maps.googleapis.com api.anthropic.com;
    worker-src 'self' blob:;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  output: 'standalone',
};

export default nextConfig;
