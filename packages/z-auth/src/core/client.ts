/**
 * Core auth client factory
 *
 * This module provides the core functionality for creating Better Auth clients
 * that work with Convex backend.
 */

import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import type { ClientAuthConfig } from "./config";

/**
 * Type for the Better Auth client instance
 */
export type AuthClient = ReturnType<typeof createBetterAuthClient>;

/**
 * Create a Better Auth client configured for Convex
 *
 * This is the low-level client factory. Most apps should use the framework-specific
 * adapters (like createAuth from @workspace/auth/nextjs) instead.
 *
 * @param config - Auth configuration
 * @returns Better Auth client instance
 *
 * @example
 * ```typescript
 * import { createAuthClient } from "@workspace/auth/core";
 *
 * const authClient = createAuthClient({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 *   baseURL: "http://localhost:3000",
 * });
 * ```
 */
export function createAuthClient(config: ClientAuthConfig): AuthClient {
  const {
    convexUrl,
    baseURL = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    storagePrefix = "better-auth",
    storage,
  } = config;

  // Validate required configuration
  if (!convexUrl) {
    throw new Error(
      "Missing required configuration: convexUrl. " +
        "Please provide your Convex deployment URL (e.g., https://your-deployment.convex.cloud)",
    );
  }

  // Create Better Auth client with Convex plugins
  const client = createBetterAuthClient({
    baseURL,
    storage,
    storageType: storage ? "custom" : "localStorage",
    storagePrefix,
    plugins: [convexClient(), crossDomainClient()],
  });

  return client;
}
