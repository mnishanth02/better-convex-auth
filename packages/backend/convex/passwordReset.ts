/**
 * Password Reset Functionality
 *
 * This module provides password reset capabilities including:
 * - Token generation and storage
 * - Token validation
 * - Password update with token
 * - Email sending via Resend
 */

import { generatePasswordResetToken, hashToken, verifyTokenExpiry } from "@auth/utils";
import { Resend } from "@convex-dev/resend";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const isDevelopment = process.env.NODE_ENV !== "production" || siteUrl.includes("localhost");

const resend = new Resend(components.resend, {
  testMode: isDevelopment,
});

/**
 * Request a password reset (internal mutation)
 * Generates a token and returns it for email sending
 */
export const createPasswordResetToken = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("byemail", (q) => q.eq("email", email))
      .first();

    // Don't reveal if user exists (prevent email enumeration)
    if (!user) {
      return null;
    }

    // Generate secure token
    const token = generatePasswordResetToken();
    const hashedToken = hashToken(token);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    // Store token in database
    await ctx.db.insert("passwordResetTokens", {
      userId: user.id, // Use Better Auth's string ID, not Convex _id
      token: hashedToken,
      expiresAt,
      used: false,
    });

    return {
      token,
      email,
      userName: user.name || null,
    };
  },
});

/**
 * Request a password reset (public action)
 * Sends reset email via Resend
 */
export const requestPasswordReset = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    // Create token
    const result = await ctx.runMutation(internal.passwordReset.createPasswordResetToken, {
      email,
    });

    // Don't reveal if user exists
    if (!result) {
      return { success: true };
    }

    const { token, userName } = result;
    const resetUrl = `${siteUrl}/reset-password?token=${token}`;

    // Send reset email
    await resend.sendEmail(ctx, {
      from: "Techlete <noreply@techlete.app>",
      to: email,
      subject: "Reset your Techlete password",
      html: `
<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <h1 style="color: #333;">Reset Your Password</h1>
    <p>Hi${userName ? ` ${userName}` : ""},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <p>
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">
        Reset Password
      </a>
    </p>
    <p style="color: #666; font-size: 14px;">Or copy and paste this URL: ${resetUrl}</p>
    <p style="color: #999; font-size: 13px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
    <p style="margin-top: 30px;">Stay adventurous! 🏔️</p>
  </body>
</html>
      `,
      text: `Reset Your Password

Hi${userName ? ` ${userName}` : ""},

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

Stay adventurous! 🏔️
Techlete`,
    });

    return { success: true };
  },
});

/**
 * Validate a password reset token
 * Checks if token exists, is valid, and not expired
 */
export const validatePasswordResetToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const hashedToken = hashToken(token);

    // Find token in database
    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", hashedToken))
      .first();

    if (!resetToken) {
      return { valid: false, error: "Invalid token" };
    }

    if (resetToken.used) {
      return { valid: false, error: "Token already used" };
    }

    if (!verifyTokenExpiry(resetToken.expiresAt)) {
      return { valid: false, error: "Token expired" };
    }

    return { valid: true };
  },
});

/**
 * Reset password with token
 * Updates user password and marks token as used
 *
 * NOTE: This mutation validates the token and marks it as used.
 * The actual password update must be handled by Better Auth's
 * password reset flow through the HTTP endpoint.
 *
 * For full password reset, clients should:
 * 1. Call this mutation to validate token
 * 2. Call Better Auth's password reset endpoint with the token
 *
 * Or use Better Auth's built-in password reset flow end-to-end.
 */
export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { token, newPassword }) => {
    const hashedToken = hashToken(token);

    // Find and validate token
    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", hashedToken))
      .first();

    if (!resetToken) {
      throw new Error("Invalid or expired token");
    }

    if (resetToken.used) {
      throw new Error("Token has already been used");
    }

    if (!verifyTokenExpiry(resetToken.expiresAt)) {
      throw new Error("Token has expired");
    }

    // Get user by Better Auth ID (string, not Convex _id)
    const user = await ctx.db
      .query("users")
      .withIndex("byid", (q) => q.eq("id", resetToken.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // IMPORTANT: Password hashing and update should be handled by Better Auth
    // This is a custom implementation that bypasses Better Auth's password management
    //
    // For production, consider using Better Auth's built-in password reset flow
    // or integrate with Better Auth's password update API directly
    //
    // Current limitation: We cannot directly hash passwords with Better Auth's algorithm
    // from Convex mutations without exposing Better Auth internals

    // Validate password strength (basic validation)
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (newPassword.length > 128) {
      throw new Error("Password must not exceed 128 characters");
    }

    // WARNING: This is a placeholder and does not actually update the password
    // The password update must be integrated with Better Auth's password hashing
    // See packages/backend/convex/auth.ts for Better Auth instance
    console.warn("Password reset validation passed for user:", user.email);
    console.warn("Password length:", newPassword.length);
    console.warn("IMPORTANT: Actual password update must be implemented via Better Auth");

    // Mark token as used to prevent reuse
    await ctx.db.patch(resetToken._id, {
      used: true,
    });

    return {
      success: true,
      warning: "Token validated. Password update pending Better Auth integration.",
    };
  },
});

/**
 * Clean up expired password reset tokens
 * Internal mutation called by a cron job
 */
export const cleanupExpiredResetTokens = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredTokens = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
    }

    return { deleted: expiredTokens.length };
  },
});
