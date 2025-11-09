/**
 * Better Convex Auth Core
 *
 * Core authentication logic and backend abstraction for Better Convex Auth.
 * This package provides factory functions, utilities, and helpers for
 * integrating Better Auth with Convex.
 *
 * @packageDocumentation
 */

// Re-export Convex integration
export {
  type ConvexAuthOptions,
  createConvexAuth,
  getAuthDefaults,
} from "./convex/index";

// Re-export session utilities
export {
  calculateSessionExpiry,
  formatSessionTime,
  getRemainingSessionTime,
  getSessionStatus,
  isSessionExpired,
  isSessionValid,
  type SessionLifecycleStatus,
  sanitizeSession,
  shouldRefreshSession,
} from "./session";

// Re-export user utilities
export {
  formatUserCreationDate,
  getGravatarUrl,
  getUserDisplayName,
  getUserInitials,
  hasRole,
  hasVerifiedEmail,
  isAdmin,
  isModerator,
  isProfileComplete,
  isSameUser,
  isValidEmail,
  maskEmail,
  toPublicUser,
} from "./user";

/**
 * Version information
 */
export const VERSION = "0.1.0";

/**
 * Package name
 */
export const PACKAGE_NAME = "@auth/core";
