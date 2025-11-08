/**
 * Default Authentication Configuration
 *
 * Sensible defaults for all authentication settings.
 * These can be overridden by providing custom configuration.
 */

import type { AuthConfig } from "./auth-config.js";

/**
 * Time constants in milliseconds
 */
const TIME = {
  /** 1 hour in milliseconds */
  ONE_HOUR: 60 * 60 * 1000,
  /** 24 hours in milliseconds */
  ONE_DAY: 24 * 60 * 60 * 1000,
  /** 30 days in milliseconds */
  THIRTY_DAYS: 30 * 24 * 60 * 60 * 1000,
  /** 1 minute in milliseconds */
  ONE_MINUTE: 60 * 1000,
};

/**
 * Default Authentication Configuration
 *
 * Production-ready defaults based on best practices:
 * - 30-day session lifetime with daily activity updates
 * - Strong password requirements (min 8 chars, uppercase, lowercase, numbers)
 * - Email verification required by default
 * - Rate limiting enabled (10 requests per minute)
 * - Standard authentication routes
 */
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  routes: {
    login: "/sign-in",
    signup: "/sign-up",
    dashboard: "/dashboard",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },
  session: {
    // Session expires after 30 days
    expiresIn: TIME.THIRTY_DAYS,
    // Update session activity every 24 hours
    updateAge: TIME.ONE_DAY,
    // Cleanup expired sessions daily
    cleanupInterval: TIME.ONE_DAY,
  },
  password: {
    // Minimum 8 characters
    minLength: 8,
    // Maximum 128 characters
    maxLength: 128,
    // Require uppercase letter (A-Z)
    requireUppercase: true,
    // Require lowercase letter (a-z)
    requireLowercase: true,
    // Require at least one number (0-9)
    requireNumbers: true,
    // Special characters optional by default
    requireSpecialChars: false,
  },
  email: {
    // Email verification required before login
    verificationRequired: true,
    // Verification token expires after 24 hours
    verificationExpiresIn: TIME.ONE_DAY,
    // Password reset token expires after 1 hour
    resetExpiresIn: TIME.ONE_HOUR,
  },
  oauth: {
    // OAuth providers are optional
    // Configure via environment variables:
    // - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
    // - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
    // - APPLE_CLIENT_ID, APPLE_CLIENT_SECRET
  },
  rateLimit: {
    // Rate limiting enabled by default
    enabled: true,
    // 60-second time window
    window: TIME.ONE_MINUTE,
    // Maximum 10 requests per window
    max: 10,
  },
};

/**
 * Development Configuration
 *
 * Relaxed settings for development:
 * - Shorter session lifetime (1 day)
 * - Weaker password requirements
 * - Email verification optional
 * - Rate limiting disabled
 */
export const DEV_AUTH_CONFIG: AuthConfig = {
  ...DEFAULT_AUTH_CONFIG,
  session: {
    expiresIn: TIME.ONE_DAY,
    updateAge: TIME.ONE_HOUR,
    cleanupInterval: TIME.ONE_HOUR,
  },
  password: {
    minLength: 6,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },
  email: {
    verificationRequired: false,
    verificationExpiresIn: TIME.ONE_DAY,
    resetExpiresIn: TIME.ONE_HOUR,
  },
  rateLimit: {
    enabled: false,
    window: TIME.ONE_MINUTE,
    max: 100,
  },
};

/**
 * Strict Configuration
 *
 * Enhanced security settings for sensitive applications:
 * - Shorter session lifetime (7 days)
 * - Strong password requirements (12 chars, special chars required)
 * - Email verification required
 * - Stricter rate limiting (5 requests per minute)
 */
export const STRICT_AUTH_CONFIG: AuthConfig = {
  ...DEFAULT_AUTH_CONFIG,
  session: {
    expiresIn: 7 * TIME.ONE_DAY, // 7 days
    updateAge: 12 * TIME.ONE_HOUR, // 12 hours
    cleanupInterval: TIME.ONE_DAY,
  },
  password: {
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  email: {
    verificationRequired: true,
    verificationExpiresIn: 12 * TIME.ONE_HOUR, // 12 hours
    resetExpiresIn: 30 * TIME.ONE_MINUTE, // 30 minutes
  },
  rateLimit: {
    enabled: true,
    window: TIME.ONE_MINUTE,
    max: 5, // Stricter rate limit
  },
};
