/**
 * Session Management
 *
 * This module provides session management capabilities:
 * - List user sessions
 * - Invalidate specific sessions
 * - Invalidate all sessions (logout everywhere)
 * - Track session activity
 * - Cleanup expired sessions
 */

import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

/**
 * Get all active sessions for the current user
 */
export const getUserSessions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Authentication required");
    }

    const userId = identity.subject;

    // Get all sessions for this user
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("byuser", (q) => q.eq("userId", userId))
      .filter((q) => q.gt(q.field("expiresAt"), Date.now()))
      .collect();

    // Get current session to identify it
    const allUserSessions = await ctx.db
      .query("sessions")
      .withIndex("byuser", (q) => q.eq("userId", userId))
      .collect();
    const currentToken = allUserSessions.find((s) => s.expiresAt > Date.now())?.token;

    return sessions.map((s) => ({
      id: s._id,
      token: `${s.token.slice(0, 8)}...${s.token.slice(-8)}`, // Masked token
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: currentToken ? s.token === currentToken : false,
    }));
  },
});

/**
 * Invalidate a specific session
 */
export const invalidateSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Authentication required");
    }

    // Get the session to invalidate
    const targetSession = await ctx.db.get(sessionId);

    if (!targetSession) {
      throw new Error("Session not found");
    }

    // Ensure user owns this session
    if (targetSession.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Delete the session
    await ctx.db.delete(sessionId);

    return { success: true };
  },
});

/**
 * Invalidate all sessions except current (logout everywhere else)
 */
export const invalidateAllOtherSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Authentication required");
    }

    const userId = identity.subject;

    // Get current session to preserve it
    const allSessions = await ctx.db
      .query("sessions")
      .withIndex("byuser", (q) => q.eq("userId", userId))
      .collect();

    // Find the most recent active session as "current"
    const now = Date.now();
    const activeSessions = allSessions.filter((s) => s.expiresAt > now);
    const currentSession = activeSessions.sort((a, b) => b.updatedAt - a.updatedAt)[0];

    // Delete all other sessions
    let deletedCount = 0;
    for (const s of allSessions) {
      if (currentSession && s._id !== currentSession._id) {
        await ctx.db.delete(s._id);
        deletedCount++;
      }
    }

    return { deletedCount };
  },
});

/**
 * Invalidate all sessions including current (complete logout)
 */
export const invalidateAllSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Authentication required");
    }

    const userId = identity.subject;

    // Get all user sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("byuser", (q) => q.eq("userId", userId))
      .collect();

    // Delete all sessions
    for (const s of sessions) {
      await ctx.db.delete(s._id);
    }

    return { deletedCount: sessions.length };
  },
});

/**
 * Update session activity timestamp
 * Called periodically to track last activity
 */
export const updateSessionActivity = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Authentication required");
    }

    const userId = identity.subject;

    // Find the most recent active session for this user
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("byuser", (q) => q.eq("userId", userId))
      .filter((q) => q.gt(q.field("expiresAt"), Date.now()))
      .collect();

    if (sessions.length === 0) {
      throw new Error("No active session found");
    }

    // Update the most recent session
    const currentSession = sessions.sort((a, b) => b.updatedAt - a.updatedAt)[0];

    if (currentSession) {
      await ctx.db.patch(currentSession._id, {
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

/**
 * Clean up expired sessions (internal, called by cron)
 */
export const cleanupExpiredSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all expired sessions
    const expiredSessions = await ctx.db
      .query("sessions")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    // Delete expired sessions
    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }

    return { deleted: expiredSessions.length };
  },
});

/**
 * Get session statistics for current user
 */
export const getSessionStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Authentication required");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Get all sessions for this user
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("byuser", (q) => q.eq("userId", userId))
      .collect();

    const activeSessions = sessions.filter((s) => s.expiresAt > now);
    const expiredSessions = sessions.filter((s) => s.expiresAt <= now);

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      expiredSessions: expiredSessions.length,
      oldestSessionCreated: sessions.length > 0 ? Math.min(...sessions.map((s) => s.createdAt)) : null,
      newestSessionCreated: sessions.length > 0 ? Math.max(...sessions.map((s) => s.createdAt)) : null,
    };
  },
});
