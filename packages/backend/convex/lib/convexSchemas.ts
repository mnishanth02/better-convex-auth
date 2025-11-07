/**
 * Convex Validator Schemas
 *
 * Reusable Convex validators for authentication functions.
 * These are used in Convex queries and mutations for runtime validation.
 *
 * Note: These use Convex's v validator, not Zod.
 */

import { v } from "convex/values";

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (password.length > 128) {
    errors.push("Password must be at most 128 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Email validator for Convex functions
 */
export const emailValidator = v.string();

/**
 * Password validator for Convex functions
 */
export const passwordValidator = v.string();

/**
 * User ID validator
 */
export const userIdValidator = v.string();

/**
 * Session token validator
 */
export const sessionTokenValidator = v.string();

/**
 * Organization role validator
 */
export const organizationRoleValidator = v.union(v.literal("owner"), v.literal("admin"), v.literal("member"));

/**
 * Sign in args schema
 */
export const signInArgsSchema = {
  email: emailValidator,
  password: passwordValidator,
};

/**
 * Sign up args schema
 */
export const signUpArgsSchema = {
  email: emailValidator,
  password: passwordValidator,
  name: v.string(),
};

/**
 * Update profile args schema
 */
export const updateProfileArgsSchema = {
  name: v.optional(v.string()),
  image: v.optional(v.string()),
};

/**
 * Change password args schema
 */
export const changePasswordArgsSchema = {
  currentPassword: passwordValidator,
  newPassword: passwordValidator,
};

/**
 * Create organization args schema
 */
export const createOrganizationArgsSchema = {
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
};

/**
 * Update organization args schema
 */
export const updateOrganizationArgsSchema = {
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
};

/**
 * Invite member args schema
 */
export const inviteMemberArgsSchema = {
  organizationId: v.id("organizations"),
  email: emailValidator,
  role: organizationRoleValidator,
  message: v.optional(v.string()),
};

/**
 * Update member role args schema
 */
export const updateMemberRoleArgsSchema = {
  organizationId: v.id("organizations"),
  userId: userIdValidator,
  role: organizationRoleValidator,
};

/**
 * Remove member args schema
 */
export const removeMemberArgsSchema = {
  organizationId: v.id("organizations"),
  userId: userIdValidator,
};

/**
 * Pagination args schema
 */
export const paginationArgsSchema = {
  limit: v.optional(v.number()),
  cursor: v.optional(v.string()),
};

/**
 * Helper function to combine schemas
 */
export function combineSchemas<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  schema1: T,
  schema2: U,
): T & U {
  return { ...schema1, ...schema2 };
}
