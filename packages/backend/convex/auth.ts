import { createConvexAuth } from "@auth/core";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

/**
 * SECURITY: Prevent client-side execution
 * This file contains sensitive backend logic and should NEVER run in the browser.
 */
if (typeof window !== "undefined") {
  throw new Error(
    "🚨 SECURITY ERROR: Backend authentication configuration cannot run in browser context. " +
      "This file should only be imported by Convex server functions.",
  );
}

// Import and validate environment variables
import { backendEnv, isDevelopment as isDevEnv } from "./lib/env";

const siteUrl = backendEnv.SITE_URL;
const googleClientId = backendEnv.GOOGLE_CLIENT_ID || "";
const googleClientSecret = backendEnv.GOOGLE_CLIENT_SECRET || "";
const appleClientId = backendEnv.APPLE_CLIENT_ID || "";
const appleClientSecret = backendEnv.APPLE_CLIENT_SECRET || "";
const isDevelopment = isDevEnv || siteUrl.includes("localhost");

export const authComponent = createClient<DataModel>(components.betterAuth);
const resend = new Resend(components.resend, {
  testMode: isDevelopment,
});

/**
 * Create a Better Auth instance configured for this Convex backend.
 * Uses the reusable @auth/core package for consistent configuration.
 */
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return createConvexAuth(ctx, {
    adapter: authComponent.adapter(ctx),
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],

    // Email and password authentication
    emailPassword: {
      enabled: true,
      requireEmailVerification: !isDevelopment,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
      disableSignUp: false,
    },

    // Social OAuth providers
    socialProviders: {
      google:
        googleClientId && googleClientSecret
          ? {
              clientId: googleClientId,
              clientSecret: googleClientSecret,
            }
          : undefined,
      apple:
        appleClientId && appleClientSecret
          ? {
              clientId: appleClientId,
              clientSecret: appleClientSecret,
            }
          : undefined,
    },

    // Email verification with Resend
    emailVerification: {
      sendVerificationEmail: async (params: { user: unknown; url: string }, _request?: Request) => {
        const user = params.user as { email: string; name?: string };
        const url = params.url;
        const actionCtx = requireActionCtx(ctx);
        await resend.sendEmail(actionCtx, {
          from: "Techlete <noreply@techlete.app>",
          to: user.email,
          subject: "Verify your Techlete account",
          html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #333;">Welcome to Techlete!</h1>
              <p>Hi${user.name ? ` ${user.name}` : ""},</p>
              <p>Thanks for signing up! Please verify your email address to activate your account.</p>
              <p>
                <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  Verify Email Address
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">Or copy and paste this URL: ${url}</p>
              <p style="color: #999; font-size: 13px;">This link will expire in 24 hours. If you didn't create a Techlete account, you can ignore this email.</p>
              <p style="margin-top: 30px;">Happy adventuring! 🏔️</p>
            </body>
          </html>
          `,
          text: `Welcome to Techlete by Zealer!
            Hi${user.name ? ` ${user.name}` : ""},

            Thanks for signing up! Please verify your email address to activate your account.
            Verify your email: ${url}

            This link will expire in 24 hours. If you didn't create a Techlete account, you can ignore this email.

            Happy coding! 🏔️
            Techlete `,
        });
      },
      sendOnSignUp: !isDevelopment,
      autoSignInAfterVerification: true,
      expiresIn: 86400, // 24 hours
    },

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },

    // Rate limiting to prevent brute-force attacks
    rateLimit: {
      enabled: true,
      window: 60, // 60 seconds
      max: 10, // Max 10 requests per minute per IP
    },

    // Development mode flag
    isDevelopment,
  });
};

/**
 * Get the currently authenticated user.
 * Throws an error if the user is not authenticated.
 *
 * @returns The current user object with profile information
 * @throws {Error} If user is not authenticated
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Use authComponent.getAuthUser directly as this is the primary user fetching function
    // Other functions should use the helper from lib/authHelpers.ts
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthorized: Authentication required");
    }
    return user;
  },
});
