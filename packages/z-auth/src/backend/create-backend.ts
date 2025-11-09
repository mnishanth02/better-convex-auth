/**
 * Backend Factory for Better Convex Auth
 *
 * Factory function to create a Better Auth backend configured for Convex.
 * This simplifies the server-side setup in your Convex backend.
 */

import { convexAdapter } from "@convex-dev/better-auth";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";

/**
 * Configuration options for creating a Convex backend
 */
export interface ConvexBackendConfig {
  /**
   * Convex components (from _generated/api)
   * Must include betterAuth component
   */
  components: {
    betterAuth: unknown;
  };

  /**
   * Base URL of your application
   * Used for OAuth redirects and email links
   * @example "https://myapp.com" or "http://localhost:3000"
   */
  baseURL?: string;

  /**
   * Secret for signing tokens (required in production)
   * Should be at least 32 characters
   * @example process.env.BETTER_AUTH_SECRET
   */
  secret?: string;

  /**
   * Email and password authentication configuration
   */
  emailAndPassword?: {
    enabled?: boolean;
    requireEmailVerification?: boolean;
  };

  /**
   * Social OAuth provider configuration
   */
  socialProviders?: {
    google?: {
      clientId: string;
      clientSecret: string;
      enabled?: boolean;
    };
    github?: {
      clientId: string;
      clientSecret: string;
      enabled?: boolean;
    };
    apple?: {
      clientId: string;
      clientSecret: string;
      enabled?: boolean;
    };
  };

  /**
   * Session configuration
   */
  session?: {
    /** Session expiration in seconds (default: 7 days) */
    expiresIn?: number;
    /** How often to update session expiry in seconds (default: 1 day) */
    updateAge?: number;
  };

  /**
   * Additional Better Auth options
   * Use this to configure advanced features like 2FA, passkeys, etc.
   */
  plugins?: BetterAuthOptions["plugins"];
}

/**
 * Create a Better Auth backend configured for Convex
 *
 * This factory creates a fully configured Better Auth instance that works
 * with your Convex backend. It handles database adapter setup and applies
 * sensible defaults.
 *
 * @param config - Backend configuration
 * @returns Configured Better Auth instance
 *
 * @example Basic usage
 * ```typescript
 * // convex/auth.ts
 * import { createConvexBackend } from "@workspace/z-auth/backend";
 * import { components } from "./_generated/api";
 *
 * export const auth = createConvexBackend({
 *   components,
 *   baseURL: process.env.SITE_URL!,
 *   secret: process.env.BETTER_AUTH_SECRET,
 *   emailAndPassword: { enabled: true },
 * });
 * ```
 *
 * @example With OAuth providers
 * ```typescript
 * export const auth = createConvexBackend({
 *   components,
 *   baseURL: process.env.SITE_URL!,
 *   secret: process.env.BETTER_AUTH_SECRET,
 *   emailAndPassword: {
 *     enabled: true,
 *     requireEmailVerification: true,
 *   },
 *   socialProviders: {
 *     google: {
 *       clientId: process.env.GOOGLE_CLIENT_ID!,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
 *     },
 *     github: {
 *       clientId: process.env.GITHUB_CLIENT_ID!,
 *       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
 *     },
 *   },
 * });
 * ```
 *
 * @example With custom session config
 * ```typescript
 * export const auth = createConvexBackend({
 *   components,
 *   baseURL: process.env.SITE_URL!,
 *   emailAndPassword: { enabled: true },
 *   session: {
 *     expiresIn: 60 * 60 * 24 * 30, // 30 days
 *     updateAge: 60 * 60 * 24 * 7,  // 7 days
 *   },
 * });
 * ```
 */
export function createConvexBackend(config: ConvexBackendConfig) {
  const {
    components,
    baseURL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    secret = process.env.BETTER_AUTH_SECRET,
    emailAndPassword = { enabled: true, requireEmailVerification: false },
    socialProviders = {},
    session = {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    plugins,
  } = config;

  // Validate required configuration
  if (!components.betterAuth) {
    throw new Error(
      "Missing betterAuth component in configuration.\n" +
        "Make sure you have added @convex-dev/better-auth to your convex.config.ts:\n\n" +
        "  import betterAuth from '@convex-dev/better-auth/convex.config';\n" +
        "  app.use(betterAuth);",
    );
  }

  // Build social providers config
  const enabledSocialProviders: Record<string, unknown> = {};

  if (socialProviders.google?.clientId && socialProviders.google?.clientSecret) {
    enabledSocialProviders.google = {
      clientId: socialProviders.google.clientId,
      clientSecret: socialProviders.google.clientSecret,
      enabled: socialProviders.google.enabled ?? true,
    };
  }

  if (socialProviders.github?.clientId && socialProviders.github?.clientSecret) {
    enabledSocialProviders.github = {
      clientId: socialProviders.github.clientId,
      clientSecret: socialProviders.github.clientSecret,
      enabled: socialProviders.github.enabled ?? true,
    };
  }

  if (socialProviders.apple?.clientId && socialProviders.apple?.clientSecret) {
    enabledSocialProviders.apple = {
      clientId: socialProviders.apple.clientId,
      clientSecret: socialProviders.apple.clientSecret,
      enabled: socialProviders.apple.enabled ?? true,
    };
  }

  // Create Better Auth instance
  return betterAuth({
    // @ts-expect-error - convexAdapter types from @convex-dev/better-auth are not fully compatible
    database: convexAdapter(components.betterAuth),
    baseURL,
    secret,
    emailAndPassword: {
      enabled: emailAndPassword.enabled ?? true,
      requireEmailVerification: emailAndPassword.requireEmailVerification ?? false,
    },
    socialProviders: enabledSocialProviders,
    session,
    plugins,
  });
}

/**
 * Type helper to get the auth instance type
 */
export type ConvexAuth = ReturnType<typeof createConvexBackend>;
