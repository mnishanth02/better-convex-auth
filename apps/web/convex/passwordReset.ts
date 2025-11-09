/**
 * Password Reset Module
 *
 * Handles password reset functionality including:
 * - Requesting password reset (generates token and sends email)
 * - Validating reset tokens
 * - Resetting passwords with valid tokens
 *
 * Security features:
 * - Tokens are hashed before storage
 * - Tokens expire after 1 hour
 * - Tokens are single-use only
 * - Rate limiting on reset requests
 */

import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

/**
 * Generate a secure random token
 */
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash a token using SHA-256
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Request a password reset
 *
 * This action:
 * 1. Finds the user by email
 * 2. Generates a secure reset token
 * 3. Stores the hashed token in the database
 * 4. Sends a password reset email
 *
 * Note: For security, we don't reveal whether the email exists or not
 */
export const requestPasswordReset = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Return success even for invalid emails (security)
      return { success: true };
    }

    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("byemail", (q) => q.eq("email", email.toLowerCase()))
      .first();

    // For security, don't reveal if user exists
    if (!user) {
      return { success: true };
    }

    // Check for recent reset requests (rate limiting)
    const recentToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_userId", (q) => q.eq("userId", user.id))
      .filter((q) => q.and(q.eq(q.field("used"), false), q.gt(q.field("expiresAt"), Date.now())))
      .first();

    // If there's a recent unused token (within last 5 minutes), don't create a new one
    if (recentToken && recentToken.expiresAt > Date.now() + 55 * 60 * 1000) {
      return { success: true };
    }

    // Generate token
    const plainToken = generateToken();
    const hashedToken = await hashToken(plainToken);

    // Store hashed token in database
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

    await ctx.db.insert("passwordResetTokens", {
      userId: user.id,
      token: hashedToken,
      expiresAt,
      used: false,
    });

    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${plainToken}`;

    // Schedule email sending
    await ctx.scheduler.runAfter(0, internal.emailService.sendPasswordResetEmail, {
      to: user.email,
      resetUrl,
      userName: user.name,
    });

    return { success: true };
  },
});

/**
 * Validate a password reset token
 *
 * Checks if the token is:
 * - Valid (exists in database)
 * - Not expired
 * - Not already used
 */
export const validatePasswordResetToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const { token } = args;

    if (!token || token.length < 10) {
      return {
        valid: false,
        error: "Invalid reset token",
      };
    }

    // Hash the token to look it up
    const hashedToken = await hashToken(token);

    // Find the token in database
    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", hashedToken))
      .first();

    if (!resetToken) {
      return {
        valid: false,
        error: "Invalid or expired reset link",
      };
    }

    // Check if token is expired
    if (resetToken.expiresAt < Date.now()) {
      return {
        valid: false,
        error: "This reset link has expired. Please request a new one.",
      };
    }

    // Check if token has been used
    if (resetToken.used) {
      return {
        valid: false,
        error: "This reset link has already been used. Please request a new one.",
      };
    }

    return {
      valid: true,
      userId: resetToken.userId,
    };
  },
});

/**
 * Reset password with a valid token
 *
 * This mutation:
 * 1. Validates the token
 * 2. Updates the user's password
 * 3. Marks the token as used
 * 4. Invalidates all existing sessions for security
 */
export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { token, newPassword } = args;

    // Validate password strength
    if (newPassword.length < 8) {
      throw new ConvexError("Password must be at least 8 characters long");
    }

    // Hash the token to look it up
    const hashedToken = await hashToken(token);

    // Find the token in database
    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", hashedToken))
      .first();

    if (!resetToken) {
      throw new ConvexError("Invalid or expired reset link");
    }

    // Check if token is expired
    if (resetToken.expiresAt < Date.now()) {
      throw new ConvexError("This reset link has expired. Please request a new one.");
    }

    // Check if token has been used
    if (resetToken.used) {
      throw new ConvexError("This reset link has already been used. Please request a new one.");
    }

    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("byid", (q) => q.eq("id", resetToken.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update user's password
    // Note: This assumes you have a password field or account record
    // Adjust based on your actual schema
    const account = await ctx.db
      .query("accounts")
      .withIndex("byuser", (q) => q.eq("userId", user.id))
      .filter((q) => q.eq(q.field("provider"), "password"))
      .first();

    if (account) {
      // Update existing password account
      await ctx.db.patch(account._id, {
        accessToken: passwordHash,
      });
    } else {
      // Create new password account
      await ctx.db.insert("accounts", {
        userId: user.id,
        provider: "password",
        providerAccountId: user.email,
        accessToken: passwordHash,
      });
    }

    // Mark token as used
    await ctx.db.patch(resetToken._id, {
      used: true,
    });

    // Invalidate all existing sessions for security
    const userSessions = await ctx.db
      .query("sessions")
      .withIndex("byuser", (q) => q.eq("userId", user.id))
      .collect();

    for (const session of userSessions) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

/**
 * Hash a password using a secure algorithm
 *
 * Note: In production, use a proper password hashing library like bcrypt or argon2
 * This is a simplified implementation for demonstration
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Clean up expired and used password reset tokens
 *
 * This should be called periodically (e.g., via a cron job)
 */
export const cleanupPasswordResetTokens = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();

    // Find all expired or used tokens
    const tokensToDelete = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.or(q.lt(q.field("expiresAt"), now), q.eq(q.field("used"), true)))
      .collect();

    // Delete them
    for (const token of tokensToDelete) {
      await ctx.db.delete(token._id);
    }

    return {
      deleted: tokensToDelete.length,
    };
  },
});
