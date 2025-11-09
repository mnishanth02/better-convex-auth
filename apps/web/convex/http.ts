/**
 * HTTP Routes
 *
 * Registers HTTP routes for:
 * - Better Auth authentication (/auth/*)
 * - Resend webhook for email events (/resend-webhook)
 */

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { resend } from "./emailService";

const http = httpRouter();

// Register Better Auth routes (handles /auth/* endpoints)
auth.addHttpRoutes(http);

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
