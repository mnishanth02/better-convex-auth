/**
 * @workspace/z-auth - Unified Better Convex Auth
 *
 * One package to rule them all - everything you need for authentication
 * in your Next.js turborepo application.
 *
 * @example Quick Start
 * ```typescript
 * // lib/auth.ts
 * import { createAuth } from "@workspace/z-auth/nextjs";
 *
 * export const auth = createAuth({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 * });
 *
 * export const { AuthProvider, useAuth, useUser } = auth;
 * ```
 *
 * @packageDocumentation
 */

// Core exports
export * from "./core";

// Re-export all types (selective to avoid conflicts)
export type * from "./types";
export * from "./utils/env";
// Utilities (selective to avoid conflicts)
export {
  createAuthError,
  ERROR_MESSAGES,
  formatZodError,
  getErrorMessage,
  isAuthError,
} from "./utils/errors";
export * from "./utils/tokens";
export * from "./utils/validators";

// Note: Framework-specific adapters are exported via subpaths:
// - import { createAuth } from "@workspace/z-auth/nextjs"
// - import { GET, POST } from "@workspace/z-auth/nextjs/handler"
// - import { useAuth, useSession } from "@workspace/z-auth/react"
// - import { SignInForm, UserAvatar } from "@workspace/z-auth/react"
