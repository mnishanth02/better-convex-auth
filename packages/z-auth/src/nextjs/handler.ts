/**
 * Next.js API route handlers for Better Convex Auth
 *
 * This module provides pre-built GET and POST handlers for Next.js App Router
 * that work with @convex-dev/better-auth.
 */

import { nextJsHandler } from "@convex-dev/better-auth/nextjs";

/**
 * Pre-built GET and POST handlers for Next.js API routes
 *
 * Use these in your `app/api/auth/[...all]/route.ts` file:
 *
 * @example
 * ```typescript
 * // app/api/auth/[...all]/route.ts
 * export { GET, POST } from "@workspace/auth/nextjs/handler";
 * ```
 *
 * This automatically handles all authentication endpoints:
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-up/email
 * - POST /api/auth/sign-out
 * - GET /api/auth/session
 * - And more...
 */
export const { GET, POST } = nextJsHandler();

/**
 * For custom API paths, you can use this function directly:
 *
 * @example
 * ```typescript
 * // app/api/custom-auth/[...all]/route.ts
 * import { createHandlers } from "@workspace/auth/nextjs/handler";
 *
 * export const { GET, POST } = createHandlers();
 * ```
 */
export function createHandlers() {
  return nextJsHandler();
}
