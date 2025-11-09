/**
 * Better Convex Auth Utilities
 *
 * Utility functions, validators, and helpers for authentication.
 *
 * @packageDocumentation
 */

export {
  AuthErrorCode,
  type AuthErrorMessage,
  createAuthError,
  ERROR_MESSAGES,
  formatZodError,
  getErrorMessage,
  isAuthError,
} from "./errors";
export * from "./tokens";
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
} from "./validators";
export * from "./validators";

/**
 * Version information
 */
export const VERSION = "0.1.0";

/**
 * Package name
 */
export const PACKAGE_NAME = "@auth/utils";
