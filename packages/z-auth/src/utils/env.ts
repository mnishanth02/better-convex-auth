/**
 * Environment variable validation utilities
 *
 * Provides built-in validation for Better Convex Auth environment variables
 * to catch configuration issues early.
 */

import { z } from "zod";

/**
 * Client-side environment variables schema
 * These are exposed to the browser (prefixed with NEXT_PUBLIC_)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z
    .string()
    .url("NEXT_PUBLIC_CONVEX_URL must be a valid URL")
    .refine((url: string) => url.includes("convex.cloud") || url.includes("convex.site") || url.includes("localhost"), {
      message: "NEXT_PUBLIC_CONVEX_URL must be a valid Convex deployment URL",
    }),

  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be a valid URL").optional(),
});

/**
 * Server-side environment variables schema
 * These are only available on the server (NOT exposed to the browser)
 */
const serverEnvSchema = z.object({
  // Better Auth secret (required in production)
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters").optional(),

  // OAuth providers (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Email service (optional)
  RESEND_API_KEY: z.string().optional(),
});

/**
 * Combined environment schema
 */
const envSchema = clientEnvSchema.merge(serverEnvSchema);

/**
 * Validate client-side environment variables
 *
 * Call this in your app to validate that all required client-side
 * environment variables are properly configured.
 *
 * @param env - Environment variables object (defaults to process.env)
 * @returns Validated and typed environment variables
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * import { validateClientEnv } from "@workspace/auth/utils";
 *
 * export const env = validateClientEnv();
 * ```
 */
export function validateClientEnv(env: NodeJS.ProcessEnv = process.env) {
  const clientEnv = {
    NEXT_PUBLIC_CONVEX_URL: env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  };

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors)
      .filter(([, errors]) => errors && errors.length > 0)
      .map(([key, errors]) => `  • ${key}: ${errors.join(", ")}`)
      .join("\n");

    throw new Error(
      `❌ Invalid client environment variables:\n${errors}\n\n` +
        "Make sure you have set these variables in your .env.local file.",
    );
  }

  return result.data;
}

/**
 * Validate server-side environment variables
 *
 * Call this in server-side code to validate that all required server-side
 * environment variables are properly configured.
 *
 * @param env - Environment variables object (defaults to process.env)
 * @returns Validated and typed environment variables
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * import { validateServerEnv } from "@workspace/auth/utils";
 *
 * // In server-side code only
 * export const serverEnv = validateServerEnv();
 * ```
 */
export function validateServerEnv(env: NodeJS.ProcessEnv = process.env) {
  const envSchema = clientEnvSchema.merge(serverEnvSchema);

  const serverEnv = {
    NEXT_PUBLIC_CONVEX_URL: env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    APPLE_CLIENT_ID: env.APPLE_CLIENT_ID,
    APPLE_CLIENT_SECRET: env.APPLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET,
    RESEND_API_KEY: env.RESEND_API_KEY,
  };

  const result = envSchema.safeParse(serverEnv);

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors)
      .filter(([, errors]) => Array.isArray(errors) && errors.length > 0)
      .map(([key, errors]) => `  • ${key}: ${Array.isArray(errors) ? errors.join(", ") : String(errors)}`)
      .join("\n");

    throw new Error(
      `❌ Invalid server environment variables:\n${errors}\n\n` +
        "Make sure you have set these variables in your .env file.",
    );
  }

  return result.data;
}

/**
 * Check if OAuth provider is configured
 *
 * @param provider - OAuth provider name
 * @param env - Environment variables object (defaults to process.env)
 * @returns true if the provider credentials are configured
 */
export function isOAuthProviderConfigured(
  provider: "google" | "apple" | "github",
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (typeof window !== "undefined") {
    console.warn("isOAuthProviderConfigured should only be called server-side");
    return false;
  }

  switch (provider) {
    case "google":
      return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
    case "apple":
      return Boolean(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET);
    case "github":
      return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
    default:
      return false;
  }
}

/**
 * Check if email service is configured
 *
 * @param env - Environment variables object (defaults to process.env)
 * @returns true if email service (Resend) is configured
 */
export function isEmailServiceConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  if (typeof window !== "undefined") {
    console.warn("isEmailServiceConfigured should only be called server-side");
    return false;
  }

  return Boolean(env.RESEND_API_KEY);
}

/**
 * Type-safe access to validated environment variables
 */
export type ValidatedClientEnv = z.infer<typeof clientEnvSchema>;
export type ValidatedServerEnv = z.infer<typeof envSchema>;
