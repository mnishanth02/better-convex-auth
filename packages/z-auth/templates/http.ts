/**
 * HTTP Routes Template
 *
 * Copy this file to your app's convex/ directory as http.ts
 *
 * This registers HTTP routes for:
 * - Authentication endpoints (/auth/*)
 * - Optional: Resend webhook for email events
 */

import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Register Better Auth routes (handles /auth/* endpoints)
auth.addHttpRoutes(http);

// Optional: Add Resend webhook for email status updates
// Uncomment if you're using the Resend component for emails:
// import { httpAction } from "./_generated/server";
// import { resend } from "./emailService"; // You'll need to create this
//
// http.route({
//   path: "/resend-webhook",
//   method: "POST",
//   handler: httpAction(async (ctx, req) => {
//     return await resend.handleResendEventWebhook(ctx, req);
//   }),
// });

export default http;
