/**
 * Auth Provider Configuration
 *
 * This file configures authentication providers for the Convex Better Auth component.
 * Required by @convex-dev/better-auth to validate JWTs and manage authentication.
 *
 * IMPORTANT: After creating or modifying this file, you must run:
 * - `npx convex dev` (development) or
 * - `npx convex deploy` (production)
 * to sync the configuration to your backend.
 */

export default {
  providers: [
    {
      /**
       * Domain: Must match the `iss` (issuer) field of your JWT
       * For Better Auth with Convex, this should be your Convex site URL
       */
      domain: process.env.CONVEX_SITE_URL,

      /**
       * Application ID: Must match the `aud` (audience) field of your JWT
       * For Better Auth integration, this is always "convex"
       */
      applicationID: "convex",
    },
  ],
};
