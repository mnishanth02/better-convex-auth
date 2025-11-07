/**
 * Better Convex Auth Types
 *
 * Shared TypeScript types for the Better Convex Auth system.
 * This package provides type definitions for users, sessions,
 * authentication configuration, and organizations.
 *
 * @packageDocumentation
 */

// Re-export all auth configuration types
export type {
  AuthConfig,
  AuthErrorCode,
  AuthEvent,
  AuthMethod,
  EmailConfig,
  EmailPasswordConfig,
  EmailVerificationConfig,
  MagicLinkConfig,
  OAuthProviderConfig,
  OrganizationConfig,
  PasskeyConfig,
  RateLimitConfig,
  SecurityConfig,
  SocialProvidersConfig,
  TwoFactorConfig,
} from "./auth.js";
// Re-export all organization types
export type {
  AcceptInvitationInput,
  CreateOrganizationInput,
  InviteMemberInput,
  Organization,
  OrganizationContext,
  OrganizationInvitation,
  OrganizationInvitationWithOrg,
  OrganizationMember,
  OrganizationMemberWithUser,
  OrganizationPermissions,
  OrganizationRole,
  OrganizationWithStats,
  RemoveMemberInput,
  UpdateMemberRoleInput,
  UpdateOrganizationInput,
} from "./organization.js";
// Export utility functions
export { getOrganizationPermissions } from "./organization.js";
// Re-export all session types
export type {
  ActiveSession,
  Session,
  SessionConfig,
  SessionRefreshResult,
  SessionStatus,
  SessionWithUser,
} from "./session.js";
// Re-export all user types
export type {
  PublicUser,
  User,
  UserAccount,
  UserAuthMethods,
  UserPreferences,
  UserProfileUpdate,
  UserRole,
  UserWithRole,
} from "./user.js";

/**
 * Version information
 */
export const VERSION = "0.1.0";

/**
 * Package name
 */
export const PACKAGE_NAME = "@auth/types";
