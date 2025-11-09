/**
 * Authentication Configuration Types
 *
 * Type definitions for configuring the authentication system.
 */

import type { SessionConfig } from "./session";

/**
 * Email and password authentication configuration.
 */
export interface EmailPasswordConfig {
  /** Enable email/password authentication */
  enabled: boolean;

  /** Minimum password length (default: 8) */
  minPasswordLength?: number;

  /** Maximum password length (default: 128) */
  maxPasswordLength?: number;

  /** Require email verification before allowing sign in */
  requireEmailVerification?: boolean;

  /** Automatically sign in after successful sign up */
  autoSignIn?: boolean;

  /** Disable new user sign ups */
  disableSignUp?: boolean;
}

/**
 * OAuth provider configuration.
 */
export interface OAuthProviderConfig {
  /** OAuth client ID */
  clientId: string;

  /** OAuth client secret */
  clientSecret: string;

  /** Redirect URI (optional, defaults to baseURL/api/auth/callback/{provider}) */
  redirectURI?: string;

  /** OAuth scopes to request */
  scopes?: string[];

  /** Additional provider-specific options */
  [key: string]: any;
}

/**
 * Social providers configuration.
 */
export interface SocialProvidersConfig {
  /** Google OAuth */
  google?: OAuthProviderConfig;

  /** GitHub OAuth */
  github?: OAuthProviderConfig;

  /** Apple OAuth */
  apple?: OAuthProviderConfig & {
    teamId?: string;
    keyId?: string;
  };

  /** Discord OAuth */
  discord?: OAuthProviderConfig;

  /** Twitter/X OAuth */
  twitter?: OAuthProviderConfig;

  /** Microsoft OAuth */
  microsoft?: OAuthProviderConfig;

  /** LinkedIn OAuth */
  linkedin?: OAuthProviderConfig;

  /** Facebook OAuth */
  facebook?: OAuthProviderConfig;
}

/**
 * Email verification configuration.
 */
export interface EmailVerificationConfig {
  /** Send verification email on sign up */
  sendOnSignUp?: boolean;

  /** Automatically sign in after email verification */
  autoSignInAfterVerification?: boolean;

  /** Verification token expiry in seconds (default: 24 hours) */
  expiresIn?: number;
}

/**
 * Two-factor authentication configuration.
 */
export interface TwoFactorConfig {
  /** Enable 2FA functionality */
  enabled: boolean;

  /** TOTP issuer name (shown in authenticator apps) */
  issuer?: string;

  /** OTP configuration */
  otpOptions?: {
    /** OTP length (default: 6) */
    length?: number;

    /** OTP validity period in seconds (default: 300) */
    period?: number;
  };

  /** Backup codes configuration */
  backupCodes?: {
    /** Number of backup codes to generate (default: 10) */
    count?: number;

    /** Backup code length (default: 10) */
    length?: number;
  };
}

/**
 * Passkey/WebAuthn configuration.
 */
export interface PasskeyConfig {
  /** Enable passkey functionality */
  enabled: boolean;

  /** Relying Party name */
  rpName?: string;

  /** Relying Party ID (domain) */
  rpID?: string;

  /** Origin URL */
  origin?: string;

  /** Authenticator selection criteria */
  authenticatorSelection?: {
    /** Require user verification */
    userVerification?: "required" | "preferred" | "discouraged";

    /** Authenticator attachment */
    authenticatorAttachment?: "platform" | "cross-platform";

    /** Require resident key */
    residentKey?: "required" | "preferred" | "discouraged";
  };
}

/**
 * Magic link configuration.
 */
export interface MagicLinkConfig {
  /** Enable magic link functionality */
  enabled: boolean;

  /** Magic link expiry in seconds (default: 10 minutes) */
  expiresIn?: number;
}

/**
 * Organization/multi-tenancy configuration.
 */
export interface OrganizationConfig {
  /** Enable organization functionality */
  enabled: boolean;

  /** Require email verification to accept invitations */
  requireEmailVerificationOnInvitation?: boolean;

  /** Allow users to create organizations */
  allowUserCreation?: boolean;

  /** Maximum number of organizations per user */
  maxOrganizationsPerUser?: number;
}

/**
 * Rate limiting configuration.
 */
export interface RateLimitConfig {
  /** Enable rate limiting */
  enabled: boolean;

  /** Time window in seconds (default: 60) */
  window?: number;

  /** Maximum requests per window (default: 10) */
  max?: number;

  /** Custom rate limits for specific endpoints */
  custom?: Record<string, { window: number; max: number }>;
}

/**
 * Email service configuration.
 */
export interface EmailConfig {
  /** Email service provider */
  provider: "resend" | "sendgrid" | "nodemailer" | "custom";

  /** API key for email service */
  apiKey?: string;

  /** From email address */
  fromEmail: string;

  /** From name */
  fromName?: string;

  /** Custom email templates */
  templates?: {
    verification?: string;
    passwordReset?: string;
    magicLink?: string;
    invitation?: string;
  };
}

/**
 * Security configuration.
 */
export interface SecurityConfig {
  /** Use secure cookies (HTTPS only) */
  useSecureCookies?: boolean;

  /** Enable CSRF protection */
  csrfProtection?: boolean;

  /** Trusted origins for CORS */
  trustedOrigins?: string[];

  /** Cookie domain */
  cookieDomain?: string;
}

/**
 * Complete authentication configuration.
 */
export interface AuthConfig {
  /** Application base URL */
  baseURL: string;

  /** Secret key for encryption/signing */
  secret: string;

  /** Application name (shown in emails, authenticator apps) */
  appName?: string;

  /** Email and password configuration */
  emailPassword?: EmailPasswordConfig;

  /** Social OAuth providers */
  socialProviders?: SocialProvidersConfig;

  /** Email verification */
  emailVerification?: EmailVerificationConfig;

  /** Session management */
  session?: SessionConfig;

  /** Rate limiting */
  rateLimit?: RateLimitConfig;

  /** Email service */
  email?: EmailConfig;

  /** Security settings */
  security?: SecurityConfig;

  /** Feature flags */
  features?: {
    /** Two-factor authentication */
    twoFactor?: TwoFactorConfig;

    /** Passkeys/WebAuthn */
    passkeys?: PasskeyConfig;

    /** Magic links */
    magicLink?: MagicLinkConfig;

    /** Organizations */
    organizations?: OrganizationConfig;

    /** Anonymous/guest authentication */
    anonymous?: boolean;

    /** Phone/SMS authentication */
    phone?: boolean;
  };

  /** Development mode */
  isDevelopment?: boolean;
}

/**
 * Authentication method types.
 */
export type AuthMethod =
  | "email"
  | "google"
  | "github"
  | "apple"
  | "discord"
  | "twitter"
  | "microsoft"
  | "magic-link"
  | "phone"
  | "passkey"
  | "anonymous";

/**
 * Authentication event types.
 */
export type AuthEvent =
  | "sign-up"
  | "sign-in"
  | "sign-out"
  | "email-verification"
  | "password-reset"
  | "password-change"
  | "2fa-enable"
  | "2fa-disable"
  | "passkey-register"
  | "passkey-remove"
  | "account-link"
  | "account-unlink"
  | "session-refresh"
  | "session-revoke";

/**
 * Authentication error codes.
 */
export type AuthErrorCode =
  | "UNAUTHORIZED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "RATE_LIMIT_EXCEEDED"
  | "2FA_REQUIRED"
  | "2FA_INVALID"
  | "PASSKEY_INVALID"
  | "ACCOUNT_LOCKED"
  | "WEAK_PASSWORD"
  | "FORBIDDEN";
