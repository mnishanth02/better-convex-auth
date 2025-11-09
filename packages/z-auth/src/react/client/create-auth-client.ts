/**
 * Auth Client Factory
 *
 * Factory function to create a configured Better Auth client with Convex plugins.
 *
 * @module
 */

"use client";

import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import type { AuthClient } from "../context/index";

/**
 * Options for creating an auth client
 */
export interface CreateAuthClientOptions {
  /**
   * Base URL for authentication API
   * @example "http://localhost:3000" or "https://myapp.com"
   */
  baseURL: string;

  /**
   * Storage key prefix for persisting auth state
   * @default "better-auth"
   */
  storagePrefix?: string;

  /**
   * Custom storage implementation (defaults to localStorage)
   */
  storage?: Storage;

  /**
   * Additional Better Auth plugins
   * @default []
   */
  // biome-ignore lint/suspicious/noExplicitAny: Better Auth plugins can be any type
  plugins?: any[];
}

/**
 * Create a configured Better Auth client with Convex integration.
 *
 * This factory creates a Better Auth client pre-configured with:
 * - Convex client plugin for real-time sync
 * - Cross-domain client plugin for multi-domain auth
 * - Custom storage and prefix options
 *
 * @example Basic usage
 * ```tsx
 * import { createAuthClient } from "../react";
 *
 * export const authClient = createAuthClient({
 *   baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
 * });
 * ```
 *
 * @example With custom storage
 * ```tsx
 * import { createAuthClient } from "../react";
 *
 * export const authClient = createAuthClient({
 *   baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
 *   storagePrefix: "myapp-auth",
 *   storage: customStorage, // Custom storage implementation
 * });
 * ```
 *
 * @example With additional plugins
 * ```tsx
 * import { createAuthClient } from "../react";
 * import { somePlugin } from "some-plugin";
 *
 * export const authClient = createAuthClient({
 *   baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
 *   plugins: [somePlugin()],
 * });
 * ```
 *
 * @param options - Configuration options
 * @returns Configured Better Auth client with Convex integration
 * @public
 */
export function createAuthClient(options: CreateAuthClientOptions): AuthClient {
  const { baseURL, storagePrefix = "better-auth", storage, plugins = [] } = options;

  return createBetterAuthClient({
    baseURL,
    storage,
    storagePrefix,
    plugins: [
      // Convex integration plugins
      convexClient(),
      crossDomainClient(),
      // User-provided plugins
      ...plugins,
    ],
  }) as AuthClient;
}
