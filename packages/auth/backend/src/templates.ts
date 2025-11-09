import type { EmailTemplateParams, EmailTemplates } from "./types";

/**
 * Default email verification template
 */
export const defaultVerificationEmailTemplate = {
  subject: "Verify your email address",

  html: (params: EmailTemplateParams): string => {
    const { user, url } = params;
    const userName = user.name ? ` ${user.name}` : "";
    return [
      "<!DOCTYPE html>",
      "<html>",
      "  <body style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;\">",
      '    <h1 style="color: #333;">Verify Your Email</h1>',
      `    <p>Hi${userName},</p>`,
      "    <p>Thanks for signing up! Please verify your email address to activate your account.</p>",
      "    <p>",
      `      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">`,
      "        Verify Email Address",
      "      </a>",
      "    </p>",
      `    <p style="color: #666; font-size: 14px;">Or copy and paste this URL: ${url}</p>`,
      '    <p style="color: #999; font-size: 13px;">This link will expire in 24 hours. If you didn\'t create an account, you can ignore this email.</p>',
      "  </body>",
      "</html>",
    ].join("\n");
  },

  text: (params: EmailTemplateParams): string => {
    const { user, url } = params;
    const userName = user.name ? ` ${user.name}` : "";
    return [
      "Verify Your Email",
      "",
      `Hi${userName},`,
      "",
      "Thanks for signing up! Please verify your email address to activate your account.",
      "",
      `Verify your email: ${url}`,
      "",
      "This link will expire in 24 hours. If you didn't create an account, you can ignore this email.",
    ].join("\n");
  },
};

/**
 * Default password reset template
 */
export const defaultPasswordResetTemplate = {
  subject: "Reset your password",

  html: (params: EmailTemplateParams): string => {
    const { user, url } = params;
    const userName = user.name ? ` ${user.name}` : "";
    return [
      "<!DOCTYPE html>",
      "<html>",
      "  <body style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;\">",
      '    <h1 style="color: #333;">Reset Your Password</h1>',
      `    <p>Hi${userName},</p>`,
      "    <p>We received a request to reset your password. Click the button below to create a new password:</p>",
      "    <p>",
      `      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">`,
      "        Reset Password",
      "      </a>",
      "    </p>",
      `    <p style="color: #666; font-size: 14px;">Or copy and paste this URL: ${url}</p>`,
      '    <p style="color: #999; font-size: 13px;">This link will expire in 1 hour. If you didn\'t request a password reset, you can ignore this email.</p>',
      "  </body>",
      "</html>",
    ].join("\n");
  },

  text: (params: EmailTemplateParams): string => {
    const { user, url } = params;
    const userName = user.name ? ` ${user.name}` : "";
    return [
      "Reset Your Password",
      "",
      `Hi${userName},`,
      "",
      "We received a request to reset your password. Click the link below to create a new password:",
      "",
      url,
      "",
      "This link will expire in 1 hour. If you didn't request a password reset, you can ignore this email.",
    ].join("\n");
  },
};

/**
 * Default magic link template
 */
export const defaultMagicLinkTemplate = {
  subject: "Your sign-in link",

  html: (params: EmailTemplateParams): string => {
    const { user, url } = params;
    const userName = user.name ? ` ${user.name}` : "";
    return [
      "<!DOCTYPE html>",
      "<html>",
      "  <body style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;\">",
      '    <h1 style="color: #333;">Sign In to Your Account</h1>',
      `    <p>Hi${userName},</p>`,
      "    <p>Click the button below to sign in to your account:</p>",
      "    <p>",
      `      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">`,
      "        Sign In",
      "      </a>",
      "    </p>",
      `    <p style="color: #666; font-size: 14px;">Or copy and paste this URL: ${url}</p>`,
      '    <p style="color: #999; font-size: 13px;">This link will expire in 15 minutes. If you didn\'t request this link, you can ignore this email.</p>',
      "  </body>",
      "</html>",
    ].join("\n");
  },

  text: (params: EmailTemplateParams): string => {
    const { user, url } = params;
    const userName = user.name ? ` ${user.name}` : "";
    return [
      "Sign In to Your Account",
      "",
      `Hi${userName},`,
      "",
      "Click the link below to sign in to your account:",
      "",
      url,
      "",
      "This link will expire in 15 minutes. If you didn't request this link, you can ignore this email.",
    ].join("\n");
  },
};

/**
 * All default email templates
 */
export const defaultEmailTemplates: EmailTemplates = {
  verification: defaultVerificationEmailTemplate,
  passwordReset: defaultPasswordResetTemplate,
  magicLink: defaultMagicLinkTemplate,
};
