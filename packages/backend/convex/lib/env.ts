/**
 * Backend Environment Variable Validation
 *
 * Validates Convex backend environment variables at deployment time.
 * This ensures all required configuration is present before the backend starts.
 *
 * @module
 */

import { z } from "zod";

/**
 * Backend environment variables schema
 */
const backendEnvSchema = z.object({
  // Site configuration
  SITE_URL: z.string().url("SITE_URL must be a valid URL").default("http://localhost:3000"),

  // OAuth providers (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_CLIENT_SECRET: z.string().optional(),

  // Email service (optional)
  RESEND_API_KEY: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validate backend environment variables
 */
function validateBackendEnv() {
  const envVars = {
    SITE_URL: process.env.SITE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };

  const parsed = backendEnvSchema.safeParse(envVars);

  if (!parsed.success) {
    console.error("❌ Invalid backend environment variables:", parsed.error.flatten().fieldErrors);
    const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
      .filter(([, errors]) => errors && errors.length > 0)
      .map(([key, errors]) => `${key}: ${errors.join(", ")}`)
      .join("; ");
    throw new Error(`Invalid backend environment configuration: ${errorMessages}`);
  }

  // Warn if OAuth providers are partially configured
  if (parsed.data.GOOGLE_CLIENT_ID && !parsed.data.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️  GOOGLE_CLIENT_ID is set but GOOGLE_CLIENT_SECRET is missing. Google OAuth will not work.");
  }
  if (parsed.data.GOOGLE_CLIENT_SECRET && !parsed.data.GOOGLE_CLIENT_ID) {
    console.warn("⚠️  GOOGLE_CLIENT_SECRET is set but GOOGLE_CLIENT_ID is missing. Google OAuth will not work.");
  }
  if (parsed.data.APPLE_CLIENT_ID && !parsed.data.APPLE_CLIENT_SECRET) {
    console.warn("⚠️  APPLE_CLIENT_ID is set but APPLE_CLIENT_SECRET is missing. Apple OAuth will not work.");
  }
  if (parsed.data.APPLE_CLIENT_SECRET && !parsed.data.APPLE_CLIENT_ID) {
    console.warn("⚠️  APPLE_CLIENT_SECRET is set but APPLE_CLIENT_ID is missing. Apple OAuth will not work.");
  }

  return parsed.data;
}

/**
 * Validated backend environment variables
 *
 * Usage:
 * ```ts
 * import { backendEnv } from './lib/env';
 *
 * const siteUrl = backendEnv.SITE_URL;
 * ```
 */
export const backendEnv = validateBackendEnv();

/**
 * Type-safe environment variable access
 */
export type BackendEnv = z.infer<typeof backendEnvSchema>;

/**
 * Check if running in production
 */
export const isProduction = backendEnv.NODE_ENV === "production";

/**
 * Check if running in development
 */
export const isDevelopment = backendEnv.NODE_ENV === "development";
