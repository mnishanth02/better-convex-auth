/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],

  // Server external packages (moved from experimental in Next.js 16)
  serverExternalPackages: [],

  // Compress responses
  compress: true,

  // Powered by header removal (already secure)
  poweredByHeader: false,

  // Security-focused headers
  async headers() {
    return [
      {
        // Apply comprehensive security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: Allow self, inline (Next.js), and specific trusted sources
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
              // Styles: Allow self, inline (Tailwind CSS), and trusted sources
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images: Allow self, data URIs, HTTPS, and trusted CDNs
              "img-src 'self' data: https: blob:",
              // Fonts: Allow self, data URIs, and Google Fonts
              "font-src 'self' data: https://fonts.gstatic.com",
              // Connect: Allow self and Convex backend
              "connect-src 'self' https://*.convex.cloud https://*.convex.site wss://*.convex.cloud wss://*.convex.site https://vitals.vercel-insights.com",
              // Media: Restrict to self only
              "media-src 'self'",
              // Workers: Allow self for service workers
              "worker-src 'self' blob:",
              // Child: Restrict frame sources
              "child-src 'self'",
              // Frame ancestors: Prevent embedding (clickjacking protection)
              "frame-ancestors 'none'",
              // Object: Block all object/embed elements
              "object-src 'none'",
              // Base URI: Restrict base tag
              "base-uri 'self'",
              // Form actions: Only allow self
              "form-action 'self'",
              // Manifest: Allow self
              "manifest-src 'self'",
              // Upgrade insecure requests to HTTPS
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            // Prevent page from being embedded in frames (clickjacking protection)
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Prevent MIME type sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Control referrer information
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // XSS protection (legacy but still useful)
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            // Restrict dangerous browser features
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "autoplay=()",
              "camera=()",
              "cross-origin-isolated=()",
              "display-capture=()",
              "encrypted-media=()",
              "fullscreen=(self)",
              "geolocation=()",
              "gyroscope=()",
              "keyboard-map=()",
              "magnetometer=()",
              "microphone=()",
              "midi=()",
              "payment=()",
              "picture-in-picture=()",
              "publickey-credentials-get=(self)",
              "screen-wake-lock=()",
              "sync-xhr=()",
              "usb=()",
              "web-share=()",
              "xr-spatial-tracking=()",
            ].join(", "),
          },
          {
            // Strict Transport Security (HTTPS enforcement)
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // Cross-Origin Embedder Policy
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            // Cross-Origin Opener Policy
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            // Cross-Origin Resource Policy
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            // Expect-CT header for Certificate Transparency
            key: "Expect-CT",
            value: "max-age=86400, enforce",
          },
          {
            // Server identification (remove sensitive info)
            key: "Server",
            value: "",
          },
        ],
      },
      {
        // Additional headers for API routes
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
      {
        // Security headers for auth endpoints
        source: "/api/auth/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
    ];
  },

  // Environment-specific security adjustments
  ...(process.env.NODE_ENV === "production" && {
    // Production-only security enhancements
    trailingSlash: false,

    // Disable x-powered-by header
    poweredByHeader: false,

    // Enable etag generation
    generateEtags: true,
  }),
};

export default nextConfig;
