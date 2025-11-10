import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security proxy for additional runtime protection
 * Next.js 16 - Uses the new proxy API (renamed from middleware)
 * This runs before Next.js routing and can add extra security layers
 *
 * Learn more: https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

// Rate limiting store (in production, use Redis or external service)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting (requests per minute)
  RATE_LIMITS: {
    "/api/auth/signin": 5, // Login attempts
    "/api/auth/signup": 3, // Account creation
    "/api/auth/reset": 3, // Password reset
    "/api/": 100, // General API
    "/": 1000, // Public pages
  },

  // Blocked user agents (basic bot protection)
  BLOCKED_USER_AGENTS: [
    "python-requests",
    "curl",
    "wget",
    // Add more suspicious patterns
  ],

  // Allowed origins for API requests
  ALLOWED_ORIGINS: [process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000", "http://127.0.0.1:3000"],

  // Security headers (applied in addition to next.config.mjs)
  SECURITY_HEADERS: {
    "X-Robots-Tag": "noindex, nofollow",
    "X-DNS-Prefetch-Control": "off",
    "X-Download-Options": "noopen",
    "X-Permitted-Cross-Domain-Policies": "none",
  },
};

/**
 * Simple rate limiting implementation
 */
function checkRateLimit(ip: string, path: string): boolean {
  const now = Date.now();
  const minute = 60 * 1000;

  // Find applicable rate limit
  let limit = SECURITY_CONFIG.RATE_LIMITS["/"] || 1000;

  for (const [pattern, rateLimit] of Object.entries(SECURITY_CONFIG.RATE_LIMITS)) {
    if (path.startsWith(pattern)) {
      limit = rateLimit;
      break;
    }
  }

  const key = `${ip}:${path}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, { count: 1, resetTime: now + minute });
    return true;
  }

  if (current.count >= limit) {
    return false; // Rate limit exceeded
  }

  // Increment counter
  rateLimitStore.set(key, { ...current, count: current.count + 1 });
  return true;
}

/**
 * Check if request is from a blocked user agent
 */
function isBlockedUserAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return SECURITY_CONFIG.BLOCKED_USER_AGENTS.some((blocked) => ua.includes(blocked.toLowerCase()));
}

/**
 * Validate origin for API requests
 */
function isValidOrigin(origin: string | null, referer: string | null): boolean {
  if (!origin && !referer) {
    return false; // No origin or referer (suspicious)
  }

  const sourceUrl = origin || referer;
  if (!sourceUrl) return false;

  try {
    const url = new URL(sourceUrl);
    const baseUrl = `${url.protocol}//${url.host}`;
    return SECURITY_CONFIG.ALLOWED_ORIGINS.includes(baseUrl);
  } catch {
    return false;
  }
}

/**
 * Main proxy function (renamed from middleware in Next.js 16)
 * This runs for every request matched by the config below
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Extract IP from headers (Next.js 16 compatible)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  // Use userAgent helper for better device detection (Next.js 16)
  const { device, browser } = userAgent(request);
  const userAgentString = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer");
  const requestOrigin = request.headers.get("origin");

  // 1. Rate limiting check
  if (!checkRateLimit(ip, pathname)) {
    console.warn(`[Security] Rate limit exceeded for ${ip} on ${pathname}`);
    return new NextResponse("Rate limit exceeded", {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 60),
      },
    });
  }

  // 2. User agent filtering (only for API routes) - Enhanced with device detection
  if (pathname.startsWith("/api/") && isBlockedUserAgent(userAgentString)) {
    console.warn(`[Security] Blocked user agent ${userAgentString} for ${ip}`);
    // Log additional device info for security analysis
    console.warn(`[Security] Device: ${device.type}, Browser: ${browser.name}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. Origin validation for API requests
  if (pathname.startsWith("/api/") && request.method !== "GET") {
    if (!isValidOrigin(requestOrigin, referer)) {
      console.warn(`[Security] Invalid origin ${requestOrigin} for ${ip} on ${pathname}`);
      return new NextResponse("Invalid origin", { status: 403 });
    }
  }

  // 4. Enhanced security logging for auth endpoints with device context
  if (pathname.startsWith("/api/auth/")) {
    console.log(`[Security] Auth request: ${request.method} ${pathname} from ${ip}`);
    console.log(`[Security] Device: ${device.type || "unknown"}, Browser: ${browser.name || "unknown"}`);
  }

  // 5. Add security headers to response
  const response = NextResponse.next();

  // Add additional security headers
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add rate limit headers for API routes
  if (pathname.startsWith("/api/")) {
    const key = `${ip}:${pathname}`;
    const current = rateLimitStore.get(key);
    const limit =
      SECURITY_CONFIG.RATE_LIMITS[pathname] || SECURITY_CONFIG.RATE_LIMITS["/api/"] || SECURITY_CONFIG.RATE_LIMITS["/"];

    response.headers.set("X-RateLimit-Limit", String(limit));
    response.headers.set("X-RateLimit-Remaining", String(limit - (current?.count || 0)));
    response.headers.set("X-RateLimit-Reset", String(Math.floor(Date.now() / 1000) + 60));
  }

  // Add security telemetry
  response.headers.set("X-Security-Processed", "true");

  return response;
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
