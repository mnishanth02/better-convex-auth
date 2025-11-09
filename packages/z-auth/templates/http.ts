/**
 * HTTP Routes Template for Better Convex Auth
 *
 * Copy this file to your app's convex/ directory as http.ts
 *
 * This registers HTTP routes for authentication endpoints.
 * The auth handler responds to all /auth/* routes automatically.
 */

import { httpRouter } from "convex/server";
import { auth } from "./auth";

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
  handler: auth.handler,
});

http.route({
  path: "/auth",
  method: "POST",
  handler: auth.handler,
});

/**
 * Optional: Add custom HTTP routes below
 *
 * Example:
 * http.route({
 *   path: "/api/custom-endpoint",
 *   method: "GET",
 *   handler: httpAction(async (ctx) => {
 *     return new Response(JSON.stringify({ message: "Hello" }), {
 *       headers: { "Content-Type": "application/json" },
 *     });
 *   }),
 * });
 */

export default http;
