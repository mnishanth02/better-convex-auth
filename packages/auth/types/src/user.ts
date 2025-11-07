/**
 * User Types
 *
 * Type definitions for user-related data structures.
 */

/**
 * Base user object from the database.
 * This represents the core user data stored in Convex.
 */
export interface User {
  /** Unique internal ID (Convex document ID) */
  _id: string;

  /** Unique external ID (Better Auth user ID) */
  id: string;

  /** User's email address */
  email: string;

  /** Whether the email has been verified */
  emailVerified: boolean;

  /** User's display name */
  name?: string;

  /** URL to user's profile image */
  image?: string;

  /** Timestamp when user was created */
  createdAt: number;

  /** Timestamp when user was last updated */
  updatedAt: number;
}

/**
 * Public user profile (safe to expose to other users).
 * Excludes sensitive information like email verification status.
 */
export interface PublicUser {
  id: string;
  name?: string;
  image?: string;
}

/**
 * User profile update input.
 * Fields that can be updated by the user.
 */
export interface UserProfileUpdate {
  name?: string;
  image?: string;
}

/**
 * User account with OAuth provider information.
 */
export interface UserAccount {
  /** Account ID in Convex */
  _id: string;

  /** User ID this account belongs to */
  userId: string;

  /** OAuth provider (google, github, apple, etc.) */
  provider: string;

  /** Provider's unique identifier for this account */
  providerAccountId: string;

  /** OAuth access token */
  accessToken?: string;

  /** OAuth refresh token */
  refreshToken?: string;

  /** Token expiration timestamp */
  expiresAt?: number;

  /** OAuth token type (usually "Bearer") */
  tokenType?: string;

  /** OAuth scopes granted */
  scope?: string;

  /** ID token (for OpenID Connect) */
  idToken?: string;

  /** Timestamp when account was linked */
  createdAt: number;
}

/**
 * User preferences/settings.
 * Application-specific user preferences.
 */
export interface UserPreferences {
  /** User ID */
  userId: string;

  /** Email notification preferences */
  emailNotifications?: {
    marketing?: boolean;
    updates?: boolean;
    security?: boolean;
  };

  /** UI theme preference */
  theme?: "light" | "dark" | "system";

  /** Language preference (ISO 639-1 code) */
  language?: string;

  /** Timezone (IANA timezone database name) */
  timezone?: string;
}

/**
 * User role (for role-based access control).
 */
export type UserRole = "user" | "admin" | "moderator";

/**
 * Extended user with role information.
 */
export interface UserWithRole extends User {
  role: UserRole;
}

/**
 * User authentication methods enabled.
 */
export interface UserAuthMethods {
  /** Email/password authentication enabled */
  emailPassword: boolean;

  /** OAuth providers linked */
  oauthProviders: string[];

  /** Passkeys registered */
  passkeys: number;

  /** Two-factor authentication enabled */
  twoFactor: boolean;
}
