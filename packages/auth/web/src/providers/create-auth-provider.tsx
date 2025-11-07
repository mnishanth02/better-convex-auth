/**
 * Auth Provider Factory
 *
 * Factory function to create a combined Convex + Better Auth provider component.
 *
 * @module
 */

"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import type { createAuthClient } from "../client/create-auth-client.js";
import { AuthClientProvider } from "../context/index.js";

/**
 * Options for creating an auth provider
 */
export interface CreateAuthProviderOptions {
  /**
   * Convex deployment URL
   * @example process.env.NEXT_PUBLIC_CONVEX_URL
   */
  convexUrl: string;

  /**
   * Better Auth client instance
   */
  authClient: ReturnType<typeof createAuthClient>;

  /**
   * Whether to expect authenticated requests
   * Set to true for apps that require authentication on all pages
   * @default false
   */
  expectAuth?: boolean;
}

/**
 * Create a provider component that combines Convex and Better Auth.
 *
 * This factory creates a React component that:
 * - Provides Convex client to the app
 * - Integrates Better Auth with Convex
 * - Provides auth client to all child components
 *
 * @example Basic usage
 * ```tsx
 * import { createAuthClient } from "@auth/web";
 * import { createAuthProvider } from "@auth/web";
 *
 * const authClient = createAuthClient({
 *   baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
 * });
 *
 * export const AuthProvider = createAuthProvider({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 *   authClient,
 * });
 *
 * // In your root layout:
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>{children}</AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example With expectAuth enabled
 * ```tsx
 * export const AuthProvider = createAuthProvider({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 *   authClient,
 *   expectAuth: true, // Require auth on all pages
 * });
 * ```
 *
 * @param options - Configuration options
 * @returns Provider component
 * @public
 */
export function createAuthProvider(options: CreateAuthProviderOptions) {
  const { convexUrl, authClient, expectAuth = false } = options;

  // Create Convex client instance
  const convex = new ConvexReactClient(convexUrl, { expectAuth });

  /**
   * Combined Auth Provider component
   */
  return function AuthProvider({ children }: { children: ReactNode }) {
    return (
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <AuthClientProvider client={authClient}>{children}</AuthClientProvider>
      </ConvexBetterAuthProvider>
    );
  };
}
