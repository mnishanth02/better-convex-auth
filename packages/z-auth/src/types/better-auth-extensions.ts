/**
 * Better Auth Type Extensions
 *
 * Type definitions that extend Better Auth types to be compatible with our internal types.
 * These extensions bridge the gap between Better Auth's user/session structure and our
 * internal @auth/core utilities that expect Convex document IDs and additional fields.
 */

import type { Session, User, UserRole } from "./index";

/**
 * Better Auth user type as returned from the authentication library.
 * This is the actual structure returned by Better Auth's useSession hook.
 */
export interface BetterAuthUser {
  /** Better Auth user ID */
  id: string;

  /** User's email address */
  email: string;

  /** Whether email has been verified */
  emailVerified: boolean;

  /** User's display name */
  name: string;

  /** Profile image URL */
  image?: string | null;

  /** User ID reference (Better Auth internal) */
  userId?: string | null;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Better Auth session type as returned from the authentication library.
 * Better Auth returns a nested structure with both user and session objects.
 */
export interface BetterAuthSession {
  /** User object */
  user: BetterAuthUser;

  /** Session metadata */
  session: {
    /** Session ID */
    id: string;

    /** User ID */
    userId: string;

    /** Session token */
    token: string;

    /** Expiration timestamp */
    expiresAt: Date;

    /** Creation timestamp */
    createdAt: Date;

    /** Last update timestamp */
    updatedAt: Date;

    /** IP address */
    ipAddress?: string | null;

    /** User agent */
    userAgent?: string | null;
  };
}

/**
 * Extended Better Auth session with full type information
 */
export interface ExtendedBetterAuthSession extends BetterAuthSession {
  user: ExtendedBetterAuthUser;
}

/**
 * Extended Better Auth user with Convex fields.
 * This type adds fields needed by our internal utilities.
 */
export interface ExtendedBetterAuthUser extends BetterAuthUser {
  /** Convex document ID (added by our system) */
  _id: string;

  /** User role (added by our system) */
  role?: UserRole;
}

/**
 * Type guard to check if a user has a role field
 */
export function hasRole(user: unknown): user is ExtendedBetterAuthUser {
  return typeof user === "object" && user !== null && "role" in user;
}

/**
 * Type guard to check if a user has a Convex _id field
 */
export function hasConvexId(user: unknown): user is ExtendedBetterAuthUser {
  return typeof user === "object" && user !== null && "_id" in user;
}

/**
 * Convert Better Auth user to internal User type.
 * This adapter function bridges the type gap between Better Auth and our internal types.
 *
 * @param betterAuthUser - User from Better Auth
 * @param convexId - Convex document ID (if available)
 * @param role - User role (if available)
 * @returns Internal User type
 */
export function toInternalUser(betterAuthUser: BetterAuthUser, convexId?: string, role?: UserRole): User {
  return {
    _id: convexId || betterAuthUser.id, // Fallback to Better Auth ID if no Convex ID
    id: betterAuthUser.id,
    email: betterAuthUser.email,
    emailVerified: betterAuthUser.emailVerified,
    name: betterAuthUser.name,
    image: betterAuthUser.image || undefined,
    createdAt: betterAuthUser.createdAt.getTime(),
    updatedAt: betterAuthUser.updatedAt.getTime(),
  };
}

/**
 * Convert Better Auth session to internal Session type.
 * This adapter function bridges the type gap between Better Auth and our internal types.
 *
 * @param betterAuthSession - Session from Better Auth
 * @returns Internal Session type
 */
export function toInternalSession(betterAuthSession: BetterAuthSession): Session {
  return {
    _id: betterAuthSession.session.id, // Use session ID as Convex ID
    id: betterAuthSession.session.id,
    userId: betterAuthSession.session.userId,
    token: betterAuthSession.session.token,
    expiresAt: betterAuthSession.session.expiresAt.getTime(),
    createdAt: betterAuthSession.session.createdAt.getTime(),
    updatedAt: betterAuthSession.session.updatedAt.getTime(),
    ipAddress: betterAuthSession.session.ipAddress,
    userAgent: betterAuthSession.session.userAgent,
  };
}

/**
 * Type-safe helper to access user role from Better Auth user.
 * Returns undefined if role is not present.
 *
 * @param user - Better Auth user (possibly extended with role)
 * @returns User role or undefined
 */
export function getUserRole(user: BetterAuthUser | ExtendedBetterAuthUser): UserRole | undefined {
  if (hasRole(user)) {
    return user.role;
  }
  return undefined;
}

/**
 * Type-safe helper to access Convex ID from Better Auth user.
 * Returns undefined if _id is not present.
 *
 * @param user - Better Auth user (possibly extended with _id)
 * @returns Convex document ID or undefined
 */
export function getConvexId(user: BetterAuthUser | ExtendedBetterAuthUser): string | undefined {
  if (hasConvexId(user)) {
    return user._id;
  }
  return undefined;
}

/**
 * Utility type for components that accept either Better Auth user or internal User
 */
export type AnyUser = BetterAuthUser | ExtendedBetterAuthUser | User;

/**
 * Utility type for components that accept either Better Auth session or internal Session
 */
export type AnySession = BetterAuthSession | Session;
