/**
 * Auth Configuration Template
 *
 * Copy this file to your app's convex/ directory as auth.ts
 *
 * This sets up authentication using @convex-dev/auth with OAuth providers.
 * Customize the providers array to match your app's needs.
 */

import Apple from "@auth/core/providers/apple";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Configure authentication providers
 *
 * The Resend component (configured in convex.config.ts) handles:
 * - Email verification for OAuth sign-ups
 * - Magic link authentication
 * - Password reset emails
 *
 * To add email/password auth, uncomment and configure:
 * import { Password } from "@convex-dev/auth/providers/Password";
 *
 * Then add to providers array:
 * Password({ ... })
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    // OAuth providers
    GitHub,
    Google,
    Apple,
    // Add more providers as needed:
    // Discord, Facebook, Twitter, etc.
  ],
});
