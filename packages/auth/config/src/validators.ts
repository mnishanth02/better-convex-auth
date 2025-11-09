/**
 * Configuration Validators
 *
 * Runtime validation for authentication configuration using Zod.
 * Ensures type safety and provides helpful error messages.
 */

import { z } from "zod";
import type { AuthConfig } from "./auth-config";

/**
 * OAuth Provider Schema
 */
const oauthProviderSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client secret is required"),
});

/**
 * Route Configuration Schema
 */
const routeConfigSchema = z.object({
  login: z.string().min(1, "Login route is required").startsWith("/", "Route must start with /"),
  signup: z.string().min(1, "Signup route is required").startsWith("/", "Route must start with /"),
  dashboard: z.string().min(1, "Dashboard route is required").startsWith("/", "Route must start with /"),
  forgotPassword: z.string().min(1, "Forgot password route is required").startsWith("/", "Route must start with /"),
  resetPassword: z.string().min(1, "Reset password route is required").startsWith("/", "Route must start with /"),
  verifyEmail: z.string().min(1, "Verify email route is required").startsWith("/", "Route must start with /"),
});

/**
 * Session Configuration Schema
 */
const sessionConfigSchema = z.object({
  expiresIn: z.number().positive("Session expiration must be positive").int("Session expiration must be an integer"),
  updateAge: z.number().positive("Update age must be positive").int("Update age must be an integer"),
  cleanupInterval: z.number().positive("Cleanup interval must be positive").int("Cleanup interval must be an integer"),
});

/**
 * Password Configuration Schema
 */
const passwordConfigSchema = z.object({
  minLength: z
    .number()
    .min(6, "Minimum password length must be at least 6")
    .max(128, "Minimum password length cannot exceed 128")
    .int("Minimum length must be an integer"),
  maxLength: z
    .number()
    .min(8, "Maximum password length must be at least 8")
    .max(256, "Maximum password length cannot exceed 256")
    .int("Maximum length must be an integer"),
  requireUppercase: z.boolean(),
  requireLowercase: z.boolean(),
  requireNumbers: z.boolean(),
  requireSpecialChars: z.boolean(),
});

/**
 * Email Configuration Schema
 */
const emailConfigSchema = z.object({
  verificationRequired: z.boolean(),
  verificationExpiresIn: z
    .number()
    .positive("Verification expiration must be positive")
    .int("Verification expiration must be an integer"),
  resetExpiresIn: z.number().positive("Reset expiration must be positive").int("Reset expiration must be an integer"),
});

/**
 * OAuth Configuration Schema
 */
const oauthConfigSchema = z.object({
  google: oauthProviderSchema.optional(),
  github: oauthProviderSchema.optional(),
  apple: oauthProviderSchema.optional(),
});

/**
 * Rate Limit Configuration Schema
 */
const rateLimitConfigSchema = z.object({
  enabled: z.boolean(),
  window: z.number().positive("Rate limit window must be positive").int("Rate limit window must be an integer"),
  max: z.number().positive("Rate limit max must be positive").int("Rate limit max must be an integer"),
});

/**
 * Complete Authentication Configuration Schema
 */
export const authConfigSchema = z
  .object({
    routes: routeConfigSchema,
    session: sessionConfigSchema,
    password: passwordConfigSchema,
    email: emailConfigSchema,
    oauth: oauthConfigSchema,
    rateLimit: rateLimitConfigSchema,
  })
  .strict()
  .refine(
    (data: { password: { minLength: number; maxLength: number } }) =>
      data.password.minLength <= data.password.maxLength,
    {
      message: "Password minLength cannot be greater than maxLength",
      path: ["password"],
    },
  );

/**
 * Validates authentication configuration at runtime
 *
 * @param config - The configuration object to validate
 * @returns Validated configuration with proper types
 * @throws {z.ZodError} If validation fails with detailed error messages
 *
 * @example
 * ```typescript
 * try {
 *   const config = validateAuthConfig(userConfig);
 *   console.log("Config is valid:", config);
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     console.error("Validation errors:", error.errors);
 *   }
 * }
 * ```
 */
export function validateAuthConfig(config: unknown): AuthConfig {
  return authConfigSchema.parse(config);
}

/**
 * Safely validates configuration and returns result
 *
 * @param config - The configuration object to validate
 * @returns Object with success flag and data or error
 *
 * @example
 * ```typescript
 * const result = safeValidateAuthConfig(userConfig);
 * if (result.success) {
 *   console.log("Valid config:", result.data);
 * } else {
 *   console.error("Invalid config:", result.error);
 * }
 * ```
 */
export function safeValidateAuthConfig(config: unknown): z.ZodSafeParseResult<AuthConfig> {
  return authConfigSchema.safeParse(config);
}

/**
 * Type guard to check if a value is a valid AuthConfig
 *
 * @param value - The value to check
 * @returns True if value is a valid AuthConfig
 *
 * @example
 * ```typescript
 * if (isAuthConfig(someValue)) {
 *   // someValue is typed as AuthConfig
 *   console.log(someValue.routes.login);
 * }
 * ```
 */
export function isAuthConfig(value: unknown): value is AuthConfig {
  return authConfigSchema.safeParse(value).success;
}
