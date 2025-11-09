/**
 * Better Convex Auth Utilities
 *
 * Utility functions, validators, and helpers for authentication.
 *
 * @packageDocumentation
 */

export * from "./env";
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
export const VERSION = "1.0.0";

/**
 * Package name
 */
export const PACKAGE_NAME = "@workspace/z-auth/utils";
