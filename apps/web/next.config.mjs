/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Allow scripts from self, inline scripts (for Next.js), and eval in development
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Allow styles from self and inline styles (for Tailwind CSS)
              "style-src 'self' 'unsafe-inline'",
              // Allow images from self, data URIs, and HTTPS sources (for external avatars)
              "img-src 'self' data: https:",
              // Allow fonts from self and data URIs
              "font-src 'self' data:",
              // Allow connections to self and Convex Cloud
              "connect-src 'self' https://*.convex.cloud https://*.convex.site wss://*.convex.cloud",
              // Prevent embedding in iframes (clickjacking protection)
              "frame-ancestors 'none'",
              // Restrict object/embed elements
              "object-src 'none'",
              // Upgrade insecure requests to HTTPS
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
