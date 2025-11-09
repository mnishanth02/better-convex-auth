/**
 * Environment Variable Validation
 *
 * Validates and type-checks all environment variables at application startup.
 * This prevents runtime errors due to missing or invalid configuration.
 *
 * @module
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

  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .default("http://localhost:3000")
    .optional(),
});

/**
 * Server-side environment variables schema
 * These are only available on the server (NOT exposed to the browser)
 */
const serverEnvSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Optional OAuth credentials (only needed if using social auth)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_CLIENT_SECRET: z.string().optional(),

  // Optional email service credentials
  RESEND_API_KEY: z.string().optional(),
});

/**
 * Combined environment schema
 */
const envSchema = clientEnvSchema.merge(serverEnvSchema);

/**
 * Validate and parse environment variables
 */
function validateEnv() {
  // On the client, only validate client-side variables
  if (typeof window !== "undefined") {
    const clientEnv = {
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    };

    const parsed = clientEnvSchema.safeParse(clientEnv);

    if (!parsed.success) {
      console.error("❌ Invalid client environment variables:", parsed.error.flatten().fieldErrors);
      const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
        .filter(([, errors]) => errors && errors.length > 0)
        .map(([key, errors]) => `${key}: ${errors.join(", ")}`)
        .join("; ");
      throw new Error(`Invalid environment configuration: ${errorMessages}`);
    }

    return parsed.data;
  }

  // On the server, validate all variables
  const serverEnv = {
    // Client variables (available on server too)
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,

    // Server-only variables
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  };

  const parsed = envSchema.safeParse(serverEnv);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
      .filter(([, errors]) => errors && errors.length > 0)
      .map(([key, errors]) => `${key}: ${errors.join(", ")}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${errorMessages}`);
  }

  return parsed.data;
}

/**
 * Validated and typed environment variables
 *
 * Usage:
 * ```ts
 * import { env } from '@/lib/config/env';
 *
 * // Type-safe access
 * const convexUrl = env.NEXT_PUBLIC_CONVEX_URL;
 * ```
 */
export const env = validateEnv();

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Check if running in production (server-side only)
 */
export const isProduction = typeof window === "undefined" ? (env as Env).NODE_ENV === "production" : false;

/**
 * Check if running in development (server-side only)
 */
export const isDevelopment = typeof window === "undefined" ? (env as Env).NODE_ENV === "development" : true;

/**
 * Check if running in test environment (server-side only)
 */
export const isTest = typeof window === "undefined" ? (env as Env).NODE_ENV === "test" : false;

/**
 * Helper to check if OAuth provider is configured (server-side only)
 */
export function isOAuthProviderConfigured(provider: "google" | "apple"): boolean {
  if (typeof window !== "undefined") {
    console.warn("isOAuthProviderConfigured should only be called server-side");
    return false;
  }

  const serverEnv = env as Env;
  if (provider === "google") {
    return Boolean(serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET);
  }
  if (provider === "apple") {
    return Boolean(serverEnv.APPLE_CLIENT_ID && serverEnv.APPLE_CLIENT_SECRET);
  }
  return false;
}

/**
 * Helper to check if email service is configured (server-side only)
 */
export function isEmailServiceConfigured(): boolean {
  if (typeof window !== "undefined") {
    console.warn("isEmailServiceConfigured should only be called server-side");
    return false;
  }

  const serverEnv = env as Env;
  return Boolean(serverEnv.RESEND_API_KEY);
}
