/**
 * Convex Backend Integration
 *
 * Factory functions and utilities for integrating Better Auth with Convex.
 */

import type { AuthConfig } from "@auth/types";
import type { createClient } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

/**
 * Options for creating a Convex auth instance
 */
export interface ConvexAuthOptions {
  /** Convex database adapter */
  adapter: ReturnType<ReturnType<typeof createClient>["adapter"]>;

  /** Base URL for the application */
  baseURL: string;

  /** Trusted origins for CORS */
  trustedOrigins?: string[];

  /** Email and password configuration */
  emailPassword?: AuthConfig["emailPassword"];

  /** Social OAuth providers */
  socialProviders?: AuthConfig["socialProviders"];

  /** Email verification configuration */
  emailVerification?: {
    sendVerificationEmail?: (params: { user: unknown; url: string }, request?: Request) => Promise<void>;
    sendOnSignUp?: boolean;
    autoSignInAfterVerification?: boolean;
    expiresIn?: number;
  };

  /** Session configuration */
  session?: AuthConfig["session"];

  /** Rate limiting configuration */
  rateLimit?: AuthConfig["rateLimit"];

  /** Security configuration */
  security?: AuthConfig["security"];

  /** Enable plugins (2FA, passkeys, organizations, etc.) */
  features?: AuthConfig["features"];

  /** Development mode */
  isDevelopment?: boolean;

  /** Custom Better Auth options */
  customOptions?: Partial<BetterAuthOptions>;
}

/**
 * Create a Better Auth instance configured for Convex
 *
 * @param ctx - Convex context (unused but required for signature compatibility)
 * @param options - Configuration options
 * @returns Better Auth instance
 *
 * @example
 * ```typescript
 * const auth = createConvexAuth(ctx, {
 *   adapter: authComponent.adapter(ctx),
 *   baseURL: process.env.SITE_URL || "http://localhost:3000",
 *   emailPassword: { enabled: true },
 *   socialProviders: {
 *     google: {
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     },
 *   },
 * });
 * ```
 */
export function createConvexAuth(_ctx: unknown, options: ConvexAuthOptions): ReturnType<typeof betterAuth> {
  const {
    adapter,
    baseURL,
    trustedOrigins = [baseURL],
    emailPassword,
    socialProviders,
    emailVerification,
    session,
    rateLimit,
    isDevelopment = false,
    customOptions = {},
  } = options;

  return betterAuth({
    ...customOptions,
    baseURL,
    trustedOrigins,
    database: adapter,

    // Email and password authentication
    emailAndPassword: emailPassword
      ? {
          enabled: emailPassword.enabled,
          requireEmailVerification: emailPassword.requireEmailVerification ?? !isDevelopment,
          minPasswordLength: emailPassword.minPasswordLength ?? 8,
          maxPasswordLength: emailPassword.maxPasswordLength ?? 128,
          autoSignIn: emailPassword.autoSignIn ?? false,
          disableSignUp: emailPassword.disableSignUp ?? false,
        }
      : undefined,

    // Social providers
    socialProviders: socialProviders
      ? Object.fromEntries(
          Object.entries(socialProviders)
            .filter(([_, config]) => config !== undefined)
            .map(([provider, config]) => {
              const providerConfig = config as NonNullable<typeof config>;
              return [
                provider,
                {
                  clientId: providerConfig.clientId,
                  clientSecret: providerConfig.clientSecret,
                  redirectURI: providerConfig.redirectURI,
                  scopes: providerConfig.scopes,
                },
              ];
            }),
        )
      : undefined,

    // Email verification
    emailVerification: emailVerification?.sendVerificationEmail
      ? {
          sendVerificationEmail: emailVerification.sendVerificationEmail,
          sendOnSignUp: emailVerification.sendOnSignUp ?? !isDevelopment,
          autoSignInAfterVerification: emailVerification.autoSignInAfterVerification ?? true,
          expiresIn: emailVerification.expiresIn ?? 86400, // 24 hours,
        }
      : undefined,

    // Session management
    session: session
      ? {
          expiresIn: session.expiresIn ?? 60 * 60 * 24 * 7, // 7 days
          updateAge: session.updateAge ?? 60 * 60 * 24, // 1 day
        }
      : undefined,

    // Rate limiting
    rateLimit: rateLimit
      ? {
          enabled: rateLimit.enabled,
          window: rateLimit.window ?? 60,
          max: rateLimit.max ?? 10,
          custom: rateLimit.custom,
        }
      : undefined,

    // Plugins
    plugins: [convex(), crossDomain({ siteUrl: baseURL }), nextCookies()],
  });
}

/**
 * Helper to get auth configuration defaults
 */
export function getAuthDefaults(isDevelopment = false): Partial<ConvexAuthOptions> {
  return {
    isDevelopment,
    emailPassword: {
      enabled: true,
      requireEmailVerification: !isDevelopment,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },
  };
}
