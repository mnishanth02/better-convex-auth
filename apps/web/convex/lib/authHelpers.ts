/**
 * Authentication Helper Functions
 *
 * These helpers provide secure, reusable auth patterns for Convex functions.
 * Always use these helpers instead of accessing ctx.auth directly to ensure
 * consistent authorization checks across your application.
 */

import type { Auth } from "convex/server";

/**
 * Get the currently authenticated user or throw an error.
 *
 * Use this helper in all protected queries and mutations to ensure
 * the user is authenticated before proceeding.
 *
 * @throws {Error} If user is not authenticated
 * @returns The authenticated user identity
 *
 * @example
 * ```typescript
 * export const updateProfile = mutation({
 *   args: { name: v.string() },
 *   handler: async (ctx, args) => {
 *     const user = await getAuthUser(ctx); // Throws if not authenticated
 *     // user.subject contains the user ID
 *   }
 * });
 * ```
 */
export async function getAuthUser(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Authentication required");
  }
  return identity;
}

/**
 * Get the currently authenticated user or return null.
 *
 * Use this helper when authentication is optional and you want to
 * provide different behavior for authenticated vs. unauthenticated users.
 *
 * @returns The authenticated user identity or null if not authenticated
 *
 * @example
 * ```typescript
 * export const getPublicProfile = query({
 *   args: { userId: v.string() },
 *   handler: async (ctx, args) => {
 *     const currentUser = await safeGetAuthUser(ctx); // Returns null if not authed
 *     // Show private info only if viewing own profile
 *     if (currentUser?.subject === args.userId) {
 *       return { ...profile, email: profile.email }; // Include private data
 *     }
 *     return profile; // Public data only
 *   }
 * });
 * ```
 */
export async function safeGetAuthUser(ctx: { auth: Auth }) {
  try {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  } catch {
    return null;
  }
}

/**
 * Get the auth user ID or throw an error.
 *
 * Convenience helper when you only need the user ID and not the full user object.
 *
 * @throws {Error} If user is not authenticated
 * @returns The authenticated user's ID
 *
 * @example
 * ```typescript
 * export const createPost = mutation({
 *   args: { content: v.string() },
 *   handler: async (ctx, args) => {
 *     const userId = await getAuthUserId(ctx);
 *     return await ctx.db.insert("posts", {
 *       content: args.content,
 *       authorId: userId,
 *       createdAt: Date.now(),
 *     });
 *   }
 * });
 * ```
 */
export async function getAuthUserId(ctx: { auth: Auth }): Promise<string> {
  const identity = await getAuthUser(ctx);
  return identity.subject;
}

/**
 * Get the auth user ID or return null.
 *
 * Convenience helper when authentication is optional.
 *
 * @returns The authenticated user's ID or null
 */
export async function safeGetAuthUserId(ctx: { auth: Auth }): Promise<string | null> {
  const identity = await safeGetAuthUser(ctx);
  return identity?.subject ?? null;
}

/**
 * Check if a user is authenticated.
 *
 * @returns true if user is authenticated, false otherwise
 *
 * @example
 * ```typescript
 * export const getContent = query({
 *   args: {},
 *   handler: async (ctx) => {
 *     const isAuth = await isAuthenticated(ctx);
 *     if (isAuth) {
 *       return await ctx.db.query("premium_content").collect();
 *     }
 *     return await ctx.db.query("free_content").collect();
 *   }
 * });
 * ```
 */
export async function isAuthenticated(ctx: { auth: Auth }): Promise<boolean> {
  const identity = await safeGetAuthUser(ctx);
  return identity !== null;
}

/**
 * Check if the authenticated user is the owner of a resource.
 *
 * @param ctx - The context
 * @param resourceUserId - The user ID that owns the resource
 * @returns true if the authenticated user owns the resource
 * @throws {Error} If user is not authenticated
 *
 * @example
 * ```typescript
 * export const deletePost = mutation({
 *   args: { postId: v.id("posts") },
 *   handler: async (ctx, args) => {
 *     const post = await ctx.db.get(args.postId);
 *     if (!post) throw new Error("Post not found");
 *
 *     if (!await isResourceOwner(ctx, post.authorId)) {
 *       throw new Error("Unauthorized: You can only delete your own posts");
 *     }
 *
 *     await ctx.db.delete(args.postId);
 *   }
 * });
 * ```
 */
export async function isResourceOwner(ctx: { auth: Auth }, resourceUserId: string): Promise<boolean> {
  const userId = await getAuthUserId(ctx);
  return userId === resourceUserId;
}

/**
 * Require resource ownership or throw an error.
 *
 * @param ctx - The context
 * @param resourceUserId - The user ID that owns the resource
 * @throws {Error} If user is not authenticated or is not the owner
 *
 * @example
 * ```typescript
 * export const updatePost = mutation({
 *   args: { postId: v.id("posts"), content: v.string() },
 *   handler: async (ctx, args) => {
 *     const post = await ctx.db.get(args.postId);
 *     if (!post) throw new Error("Post not found");
 *
 *     await requireResourceOwnership(ctx, post.authorId);
 *
 *     await ctx.db.patch(args.postId, { content: args.content });
 *   }
 * });
 * ```
 */
export async function requireResourceOwnership(ctx: { auth: Auth }, resourceUserId: string): Promise<void> {
  if (!(await isResourceOwner(ctx, resourceUserId))) {
    throw new Error("Unauthorized: You do not have permission to access this resource");
  }
}

/**
 * Error class for authentication errors.
 * Use this for throwing auth-specific errors that can be caught
 * and handled differently from other errors.
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: "UNAUTHORIZED" | "EMAIL_NOT_VERIFIED" | "FORBIDDEN" = "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Throw an AuthError with a specific code.
 *
 * @param message - Error message
 * @param code - Error code
 * @throws {AuthError}
 *
 * @example
 * ```typescript
 * export const adminAction = mutation({
 *   handler: async (ctx) => {
 *     const user = await getAuthUser(ctx);
 *     if (user.role !== "admin") {
 *       throwAuthError("Admin access required", "FORBIDDEN");
 *     }
 *     // Proceed with admin action
 *   }
 * });
 * ```
 */
export function throwAuthError(
  message: string,
  code: "UNAUTHORIZED" | "EMAIL_NOT_VERIFIED" | "FORBIDDEN" = "UNAUTHORIZED",
): never {
  throw new AuthError(message, code);
}
