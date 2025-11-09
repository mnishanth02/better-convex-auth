/**
 * Auth Configuration Template for Better Convex Auth
 *
 * Copy this file to your app's convex/ directory as auth.ts
 *
 * This sets up authentication using @convex-dev/better-auth with Better Auth.
 * Customize the configuration to match your app's needs.
 */

import { convexAdapter } from "@convex-dev/better-auth";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

/**
 * Create Better Auth instance with Convex adapter
 *
 * This is the server-side auth instance that handles authentication logic.
 * It uses Convex as the database adapter for storing users, sessions, and accounts.
 */
export const auth = betterAuth({
  // Database adapter (Convex)
  database: convexAdapter(components.betterAuth),

  // Base URL for authentication (important for OAuth redirects)
  baseURL: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      enabled: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
    // Add more providers as needed:
    // apple: {
    //   clientId: process.env.APPLE_CLIENT_ID!,
    //   clientSecret: process.env.APPLE_CLIENT_SECRET!,
    // },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24, // 1 day - how often to update session expiry
  },

  // Optional: Email service configuration (for email verification, password reset)
  // Requires @convex-dev/resend component
  // emailService: {
  //   provider: "resend",
  //   apiKey: process.env.RESEND_API_KEY,
  //   from: "noreply@yourdomain.com",
  // },

  // Optional: Advanced features (uncomment to enable)
  // plugins: [
  //   twoFactor(),
  //   passkey(),
  //   organization(),
  // ],
});
