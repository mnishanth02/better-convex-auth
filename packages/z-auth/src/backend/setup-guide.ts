/**
 * Backend Utilities for Better Convex Auth
 *
 * This module provides utilities for apps to set up their own Convex backend
 * with Better Auth integration, without depending on @workspace/backend.
 */

/**
 * Instructions for setting up a Convex backend with Better Auth
 *
 * Apps should create their own `convex/` directory with the following structure:
 *
 * ```
 * your-app/
 * ├── convex/
 * │   ├── convex.config.ts      # Convex configuration
 * │   ├── schema.ts              # Database schema
 * │   ├── auth.ts                # Better Auth setup
 * │   ├── http.ts                # HTTP routes
 * │   └── [your-functions].ts   # Your Convex functions
 * ```
 *
 * This approach allows each app to:
 * - Have its own Convex deployment
 * - Customize the backend configuration
 * - Add app-specific functions
 * - Control database schema
 */

/**
 * Type definition for Convex backend setup
 *
 * Apps should use this as a reference for their backend configuration.
 */
export interface ConvexBackendSetup {
  /**
   * Convex deployment URL
   * Set via NEXT_PUBLIC_CONVEX_URL environment variable
   */
  deploymentUrl: string;

  /**
   * Whether this is a shared backend (like @workspace/backend)
   * or an app-specific backend
   */
  isShared: boolean;

  authConfig?: {
    emailProvider?: {
      from: string;
      apiKey?: string;
    };
    oauthProviders?: {
      google?: { clientId: string; clientSecret: string };
      apple?: { clientId: string; clientSecret: string };
      github?: { clientId: string; clientSecret: string };
    };
    session?: {
      expiresIn: number;
      updateAge: number;
    };
  };
}

/**
 * Guide for migrating from shared backend to app-specific backend
 *
 * Step 1: Create convex/ directory in your app
 * Step 2: Copy necessary files from packages/backend/convex/
 * Step 3: Update imports from "@workspace/backend/convex/*" to "./convex/*"
 * Step 4: Remove @workspace/backend from package.json dependencies
 * Step 5: Run `pnpm convex dev` in your app directory
 */
export const migrationSteps = [
  "Create convex/ directory in your app root",
  "Initialize Convex: npx convex dev",
  "Copy schema.ts, auth.ts, http.ts from shared backend",
  "Update environment variables with your deployment URL",
  "Update imports from @workspace/backend to local convex",
  "Remove @workspace/backend dependency",
  "Test authentication flows",
] as const;

/**
 * Example convex.config.ts for apps
 *
 * ```typescript
 * import { defineApp } from "convex/server";
 * import betterAuth from "@convex-dev/better-auth/convex.config";
 * import resend from "@convex-dev/resend/convex.config";
 *
 * const app = defineApp();
 * app.use(betterAuth);
 * app.use(resend);
 *
 * export default app;
 * ```
 */
export const exampleConvexConfig = `
import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(resend);

export default app;
`;

/**
 * Example auth.ts for apps
 *
 * This should be created in your app's convex/ directory.
 */
export const exampleAuthSetup = `
import { createConvexAuth } from "@auth/core";
import { createClient } from "@convex-dev/better-auth";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

export const authComponent = createClient<DataModel>(components.betterAuth);
const resend = new Resend(components.resend, { testMode: false });

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return createConvexAuth(ctx, {
    adapter: authComponent.adapter(ctx),
    baseURL: process.env.SITE_URL!,
    emailPassword: { enabled: true },
    // Add your configuration here
  });
};
`;

/**
 * Helper to validate backend setup
 */
export function validateBackendSetup(setup: ConvexBackendSetup): boolean {
  if (!setup.deploymentUrl) {
    console.error("Missing Convex deployment URL");
    return false;
  }

  if (!setup.deploymentUrl.includes("convex.cloud") && !setup.deploymentUrl.includes("localhost")) {
    console.error("Invalid Convex deployment URL");
    return false;
  }

  return true;
}
