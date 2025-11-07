/**
 * User Management Utilities
 *
 * Helper functions for user operations and transformations.
 */

import type { PublicUser, User, UserRole } from "@auth/types";

/**
 * Convert a full user object to a public user (safe for client)
 *
 * @param user - Full user object
 * @returns Public user object (no sensitive data)
 */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
  };
}

/**
 * Check if a user has verified their email
 *
 * @param user - User to check
 * @returns true if email is verified
 */
export function hasVerifiedEmail(user: User): boolean {
  return user.emailVerified === true;
}

/**
 * Check if a user account is complete (has name and email verified)
 *
 * @param user - User to check
 * @returns true if profile is complete
 */
export function isProfileComplete(user: User): boolean {
  return hasVerifiedEmail(user) && !!user.name;
}

/**
 * Get user display name
 *
 * @param user - User object
 * @returns Display name (falls back to email if no name, or "User" as last resort)
 */
export function getUserDisplayName(user: User | PublicUser): string {
  if ("email" in user) {
    return user.name || user.email;
  }
  return user.name || "User";
}

/**
 * Get user initials for avatar
 *
 * @param user - User object
 * @returns User initials (e.g., "JD" for "John Doe")
 */
export function getUserInitials(user: User | PublicUser): string {
  const name = user.name || ("email" in user ? user.email : undefined);

  if (!name) return "?";

  const parts = name.split(" ").filter(Boolean);

  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    const first = parts[0];
    return first ? first.charAt(0).toUpperCase() : "?";
  }

  const first = parts[0];
  const last = parts[parts.length - 1];
  return first && last ? (first.charAt(0) + last.charAt(0)).toUpperCase() : "?";
}

/**
 * Format user creation date
 *
 * @param user - User object
 * @returns Formatted date string
 */
export function formatUserCreationDate(user: User): string {
  const date = new Date(user.createdAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Check if a user has a specific role
 *
 * @param user - User with role
 * @param role - Role to check
 * @returns true if user has the role
 */
export function hasRole(user: { role?: UserRole }, role: UserRole): boolean {
  return user.role === role;
}

/**
 * Check if a user is an admin
 *
 * @param user - User with role
 * @returns true if user is admin
 */
export function isAdmin(user: { role?: UserRole }): boolean {
  return hasRole(user, "admin");
}

/**
 * Check if a user is a moderator
 *
 * @param user - User with role
 * @returns true if user is moderator
 */
export function isModerator(user: { role?: UserRole }): boolean {
  return hasRole(user, "moderator");
}

/**
 * Check if two users are the same (by ID)
 *
 * @param user1 - First user
 * @param user2 - Second user
 * @returns true if users are the same
 */
export function isSameUser(user1: { _id: string } | { id: string }, user2: { _id: string } | { id: string }): boolean {
  const id1 = "_id" in user1 ? user1._id : user1.id;
  const id2 = "_id" in user2 ? user2._id : user2.id;
  return id1 === id2;
}

/**
 * Validate email format
 *
 * @param email - Email to validate
 * @returns true if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Mask email for display (e.g., "j***n@example.com")
 *
 * @param email - Email to mask
 * @returns Masked email
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");

  if (!local || !domain) return email;

  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }

  const maskedLocal = `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Get gravatar URL for user email
 *
 * @param email - User email
 * @param size - Image size (default: 200)
 * @returns Gravatar URL
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  // Simple hash function for demo purposes
  // In production, use a proper MD5 hash library
  const hash = email.toLowerCase().trim();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
