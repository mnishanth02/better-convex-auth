/**
 * HTTP Routes
 *
 * Registers HTTP routes for:
 * - Better Auth authentication (/auth/*)
 * - Resend webhook for email events (/resend-webhook)
 */

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";
import { resend } from "./emailService";

const http = httpRouter();

/**
 * Register authentication routes
 *
 * This mounts the Better Auth handler which handles:
 * - POST /auth/sign-in/email
 * - POST /auth/sign-up/email
 * - POST /auth/sign-out
 * - GET /auth/session
 * - GET /auth/callback/google (OAuth callbacks)
 * - GET /auth/callback/github
 * - And more...
 */
http.route({
  path: "/auth",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const auth = createAuth(ctx);
    return auth.handler(req);
  }),
});

http.route({
  path: "/auth",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const auth = createAuth(ctx);
    return auth.handler(req);
  }),
});

// Register Resend webhook for email status updates
// Set up webhook in Resend dashboard: https://resend.com/webhooks
// Webhook URL: https://[your-convex-site].convex.site/resend-webhook
// Required events: email.* (all email events)
// Set RESEND_WEBHOOK_SECRET in environment variables
http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req);
  }),
});

export default http;
