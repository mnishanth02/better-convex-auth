import { AuthFunctions, createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { Resend } from "@convex-dev/resend";
import { nextCookies } from "better-auth/next-js";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const isDevelopment = process.env.NODE_ENV !== "production" || siteUrl.includes("localhost");

export const authComponent = createClient<DataModel>(components.betterAuth);
// const authFunctions: AuthFunctions = internal.api;
const resend = new Resend(components.resend, {
  testMode: isDevelopment,
});

export const createAuth = (ctx: GenericCtx<DataModel>, { optionsOnly } = { optionsOnly: false }) => {
  return betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    // sendVerificationEmail: async ({ user, url }) => {
    //   await resend.sendEmail(requireActionCtx(ctx), {
    //     to: user.email,
    //     subject: "Verify your email",
    //     html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
    //   });
    // },

    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
    },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }, _request) => {
        const actionCtx = requireActionCtx(ctx);
        await resend.sendEmail(actionCtx, {
          from: "Techlete <noreply@techlete.app>",
          to: user.email,
          subject: "Verify your Techlete account",
          html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #333;">Welcome to Techlete!</h1>
              <p>Hi${user.name ? ` ${user.name}` : ""},</p>
              <p>Thanks for signing up! Please verify your email address to activate your account.</p>
              <p>
                <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  Verify Email Address
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">Or copy and paste this URL: ${url}</p>
              <p style="color: #999; font-size: 13px;">This link will expire in 24 hours. If you didn't create a Techlete account, you can ignore this email.</p>
              <p style="margin-top: 30px;">Happy adventuring! 🏔️</p>
            </body>
          </html>
          `,
          text: `Welcome to Techlete by Zealer!
            Hi${user.name ? ` ${user.name}` : ""},

            Thanks for signing up! Please verify your email address to activate your account.
            Verify your email: ${url}

            This link will expire in 24 hours. If you didn't create a Techlete account, you can ignore this email.

            Happy coding! 🏔️
            Techlete `,
        });
      },
      sendOnSignUp: !isDevelopment,
      autoSignInAfterVerification: true,
      expiresIn: 86400, // 24 hours
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    plugins: [convex(), crossDomain({ siteUrl }), nextCookies()],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
