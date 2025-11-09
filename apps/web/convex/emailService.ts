/**
 * Email Service
 *
 * Handles email sending via Resend component for:
 * - Email verification
 * - Password reset
 * - Magic links
 * - Notifications
 *
 * Uses the @convex-dev/resend component for:
 * - Queueing and batching
 * - Durable execution with automatic retries
 * - Idempotency to prevent duplicate sends
 * - Rate limiting
 */

import { Resend } from "@convex-dev/resend";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { backendEnv } from "./lib/env";

/**
 * Initialize Resend component
 *
 * Set testMode: false in production to send real emails.
 * In development, emails only go to test addresses (delivered@resend.dev).
 */
export const resend = new Resend(components.resend, {
  testMode: backendEnv.NODE_ENV !== "production",
});

/**
 * Send email verification link
 *
 * This is an internal mutation that can be scheduled or called
 * from other backend functions to send verification emails.
 */
export const sendVerificationEmail = internalMutation({
  args: {
    to: v.string(),
    verificationUrl: v.string(),
    userName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailId = await resend.sendEmail(ctx, {
      from: "Techlete <noreply@techlete.app>",
      to: args.to,
      subject: "Verify your email address",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 10px 10px;">
              ${args.userName ? `<p style="font-size: 16px; margin-bottom: 20px;">Hi ${args.userName},</p>` : ""}
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thanks for signing up! Please verify your email address by clicking the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${args.verificationUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 10px;">
                This link will expire in 24 hours.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} Techlete. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { emailId };
  },
});

/**
 * Send password reset link
 */
export const sendPasswordResetEmail = internalMutation({
  args: {
    to: v.string(),
    resetUrl: v.string(),
    userName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailId = await resend.sendEmail(ctx, {
      from: "Techlete <noreply@techlete.app>",
      to: args.to,
      subject: "Reset your password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 10px 10px;">
              ${args.userName ? `<p style="font-size: 16px; margin-bottom: 20px;">Hi ${args.userName},</p>` : ""}
              <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${args.resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 10px;">
                This link will expire in 1 hour.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} Techlete. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { emailId };
  },
});

/**
 * Send magic link for passwordless authentication
 */
export const sendMagicLinkEmail = internalMutation({
  args: {
    to: v.string(),
    magicLinkUrl: v.string(),
    userName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailId = await resend.sendEmail(ctx, {
      from: "Techlete <noreply@techlete.app>",
      to: args.to,
      subject: "Sign in to Techlete",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sign In to Techlete</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Sign In to Techlete</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 10px 10px;">
              ${args.userName ? `<p style="font-size: 16px; margin-bottom: 20px;">Hi ${args.userName},</p>` : ""}
              <p style="font-size: 16px; margin-bottom: 20px;">
                Click the button below to sign in to your Techlete account:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${args.magicLinkUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Sign In
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you didn't request this sign-in link, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 10px;">
                This link will expire in 15 minutes for security.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} Techlete. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { emailId };
  },
});

/**
 * Send welcome email after successful verification
 */
export const sendWelcomeEmail = internalMutation({
  args: {
    to: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const emailId = await resend.sendEmail(ctx, {
      from: "Techlete <noreply@techlete.app>",
      to: args.to,
      subject: "Welcome to Techlete!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Techlete</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Techlete! 🎉</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${args.userName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for joining Techlete! Your email has been verified and your account is now active.
              </p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                Here's what you can do next:
              </p>
              <ul style="font-size: 16px; margin: 20px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Complete your profile</li>
                <li style="margin-bottom: 10px;">Explore the dashboard</li>
                <li style="margin-bottom: 10px;">Set up your preferences</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${backendEnv.SITE_URL}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you have any questions or need help getting started, feel free to reach out to our support team.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} Techlete. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { emailId };
  },
});

/**
 * Test email sending (for development)
 *
 * Send a test email to verify Resend configuration.
 * In test mode, emails only go to delivered@resend.dev.
 */
export const sendTestEmail = internalMutation({
  args: {},
  handler: async (ctx) => {
    const emailId = await resend.sendEmail(ctx, {
      from: "Techlete <noreply@techlete.app>",
      to: "delivered@resend.dev",
      subject: "Test Email from Techlete",
      html: "<p>This is a test email from Techlete auth system. If you see this, Resend is configured correctly! ✅</p>",
    });

    return {
      success: true,
      emailId,
      message: "Test email sent successfully. Check delivered@resend.dev in Resend dashboard.",
    };
  },
});
