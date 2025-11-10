/**
 * Auth Configuration - Better Auth with Convex Adapter
 *
 * This sets up authentication using @convex-dev/better-auth with Better Auth.
 * Customize the configuration to match your app's needs.
 */

import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth instance with Convex adapter
 *
 * This is the server-side auth instance that handles authentication logic.
 * It uses Convex as the database adapter for storing users, sessions, and accounts.
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly }: { optionsOnly?: boolean } = {},
): ReturnType<typeof betterAuth> => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },

    // Base URL for authentication (important for OAuth redirects)
    baseURL: siteUrl,

    // Database adapter (Convex)
    database: authComponent.adapter(ctx),

    // Secret for signing tokens (required in production)
    secret: process.env.BETTER_AUTH_SECRET,

    // Email & Password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Set to true if you want to require email verification
    },

    // Social OAuth providers (configure as needed)
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        enabled: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID || "",
        clientSecret: process.env.APPLE_CLIENT_SECRET || "",
        enabled: Boolean(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET),
      },
    },

    // Session configuration with proper cookie settings
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
      updateAge: 60 * 60 * 24, // 1 day - how often to update session expiry
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes client-side cache
      },
    },

    // Cookie configuration for proper session persistence
    cookies: {
      sessionToken: {
        name: "better-auth.session_token",
        options: {
          httpOnly: false, // Allow client-side access for Better Auth
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },

    // Convex plugin is required for Convex compatibility
    plugins: [convex()],
  });
};
