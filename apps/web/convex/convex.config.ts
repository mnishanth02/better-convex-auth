// @ts-nocheck
import betterAuth from "@convex-dev/better-auth/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();

// Better Auth component for authentication
app.use(betterAuth);

// Resend component for email delivery
app.use(resend);

export default app;
