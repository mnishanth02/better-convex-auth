/**
 * Authentication Configuration Types
 *
 * This module defines the complete configuration schema for the authentication system.
 * All configuration options are strongly typed and can be partially overridden.
 */

/**
 * OAuth Provider Configuration
 */
export interface OAuthProvider {
  /** OAuth client ID */
  clientId: string;
  /** OAuth client secret */
  clientSecret: string;
}

/**
 * Route Configuration
 *
 * Defines all authentication-related routes in your application.
 */
export interface RouteConfig {
  /** Login/sign-in page route */
  login: string;
  /** Sign-up/register page route */
  signup: string;
  /** Dashboard or home page after successful authentication */
  dashboard: string;
  /** Forgot password request page route */
  forgotPassword: string;
  /** Password reset page route (with token) */
  resetPassword: string;
  /** Email verification page route */
  verifyEmail: string;
}

/**
 * Session Configuration
 *
 * Configures session lifetime and maintenance intervals.
 */
export interface SessionConfig {
  /** Session expiration time in milliseconds (default: 30 days) */
  expiresIn: number;
  /** How often to update session activity in milliseconds (default: 24 hours) */
  updateAge: number;
  /** Interval for cleaning up expired sessions in milliseconds (default: 24 hours) */
  cleanupInterval: number;
}

/**
 * Password Requirements Configuration
 *
 * Defines password strength requirements for user accounts.
 */
export interface PasswordConfig {
  /** Minimum password length */
  minLength: number;
  /** Maximum password length */
  maxLength: number;
  /** Require at least one uppercase letter */
  requireUppercase: boolean;
  /** Require at least one lowercase letter */
  requireLowercase: boolean;
  /** Require at least one number */
  requireNumbers: boolean;
  /** Require at least one special character */
  requireSpecialChars: boolean;
}

/**
 * Email Configuration
 *
 * Configures email verification and password reset behavior.
 */
export interface EmailConfig {
  /** Whether email verification is required before login */
  verificationRequired: boolean;
  /** Email verification token expiration time in milliseconds (default: 24 hours) */
  verificationExpiresIn: number;
  /** Password reset token expiration time in milliseconds (default: 1 hour) */
  resetExpiresIn: number;
}

/**
 * OAuth Providers Configuration
 *
 * Configure social authentication providers.
 * Each provider is optional and requires client credentials.
 */
export interface OAuthConfig {
  /** Google OAuth configuration */
  google?: OAuthProvider;
  /** GitHub OAuth configuration */
  github?: OAuthProvider;
  /** Apple OAuth configuration */
  apple?: OAuthProvider;
}

/**
 * Rate Limiting Configuration
 *
 * Configures rate limiting for authentication endpoints.
 */
export interface RateLimitConfig {
  /** Enable rate limiting */
  enabled: boolean;
  /** Time window in milliseconds for rate limiting (default: 60 seconds) */
  window: number;
  /** Maximum number of requests per window (default: 10) */
  max: number;
}

/**
 * Complete Authentication Configuration
 *
 * Main configuration interface that combines all auth-related settings.
 * Can be partially overridden with custom values.
 *
 * @example
 * ```typescript
 * const config: AuthConfig = {
 *   routes: {
 *     login: "/auth/login",
 *     signup: "/auth/register",
 *     dashboard: "/app"
 *   },
 *   password: {
 *     minLength: 12,
 *     requireSpecialChars: true
 *   }
 * };
 * ```
 */
export interface AuthConfig {
  /** Route configuration */
  routes: RouteConfig;
  /** Session management configuration */
  session: SessionConfig;
  /** Password requirements configuration */
  password: PasswordConfig;
  /** Email verification configuration */
  email: EmailConfig;
  /** OAuth providers configuration */
  oauth: OAuthConfig;
  /** Rate limiting configuration */
  rateLimit: RateLimitConfig;
}

/**
 * Merges custom configuration with defaults
 *
 * @param custom - Partial configuration to override defaults
 * @param defaults - Default configuration values
 * @returns Complete merged configuration
 */
export function mergeConfig(custom: Partial<AuthConfig> | undefined, defaults: AuthConfig): AuthConfig {
  if (!custom) return defaults;

  return {
    routes: { ...defaults.routes, ...custom.routes },
    session: { ...defaults.session, ...custom.session },
    password: { ...defaults.password, ...custom.password },
    email: { ...defaults.email, ...custom.email },
    oauth: { ...defaults.oauth, ...custom.oauth },
    rateLimit: { ...defaults.rateLimit, ...custom.rateLimit },
  };
}

// Note: getAuthConfig is re-exported from index.ts with defaults injected
// This avoids circular dependency issues
