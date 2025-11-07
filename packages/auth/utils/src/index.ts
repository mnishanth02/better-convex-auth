/**
 * Better Convex Auth Utilities
 *
 * Utility functions, validators, and helpers for authentication.
 *
 * @packageDocumentation
 */

// Re-export all token utilities
export * from "./tokens.js";
export type {
  ChangePasswordData,
  CreateOrganizationData,
  InviteMemberData,
  PasswordResetData,
  PasswordResetRequestData,
  SignInData,
  SignUpData,
  UpdateOrganizationData,
  UpdateProfileData,
} from "./validators.js";
// Re-export all validators
export * from "./validators.js";

/**
 * Version information
 */
export const VERSION = "0.1.0";

/**
 * Package name
 */
export const PACKAGE_NAME = "@auth/utils";
