import { v } from "convex/values";
import { authComponent, createAuth } from "./auth";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthUser, requireVerifiedEmail } from "./lib/authHelpers";
import { validatePassword } from "./lib/convexSchemas";
import { mutationWithRLS, queryWithRLS } from "./lib/rls";

/**
 * Update the current user's password.
 * Requires authentication and email verification.
 * Database access is automatically protected by Row-Level Security.
 */
export const updateUserPassword = mutationWithRLS({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Ensure user is authenticated
    await getAuthUser(ctx);

    // Require email verification for security-sensitive operations
    await requireVerifiedEmail(ctx);

    // Validate password strength (same validation as frontend)
    const passwordValidation = validatePassword(args.newPassword);
    if (!passwordValidation.valid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(", ")}`);
    }

    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.changePassword({
      body: {
        currentPassword: args.currentPassword,
        newPassword: args.newPassword,
      },
      headers,
    });
  },
});

/**
 * Get the current user's active sessions.
 * RLS ensures only the user's own sessions are returned.
 */
export const getUserSessions = queryWithRLS({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    // RLS automatically filters to only return sessions owned by this user
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    return sessions;
  },
});

/**
 * Revoke a specific session.
 * RLS ensures users can only revoke their own sessions.
 */
export const revokeSession = mutationWithRLS({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    await getAuthUser(ctx);

    // Find the session
    const session = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("id"), args.sessionId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    // RLS will throw an error if user doesn't own this session
    await ctx.db.delete(session._id);
  },
});
