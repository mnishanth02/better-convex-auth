/**
 * Scheduled Tasks (Cron Jobs)
 *
 * Automatic maintenance tasks that run on a schedule:
 * - Session cleanup: Hourly removal of expired sessions
 * - Email cleanup: Daily removal of old email records from Resend component
 * - Password reset tokens: Hourly cleanup of expired tokens
 */

import { cronJobs } from "convex/server";
import { components, internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

// Clean up expired sessions every hour
crons.hourly(
  "cleanup-expired-sessions",
  { minuteUTC: 0 }, // Run at the top of every hour
  internal.sessionManagement.cleanupExpiredSessions,
);

// Clean up old email records from Resend component daily at 2 AM UTC
crons.daily("cleanup-old-resend-emails", { hourUTC: 2, minuteUTC: 0 }, internal.crons.cleanupResendEmails);

// Clean up expired password reset tokens every hour at 15 minutes past
crons.hourly("cleanup-password-reset-tokens", { minuteUTC: 15 }, internal.passwordReset.cleanupPasswordResetTokens);

/**
 * Cleanup old and abandoned emails from Resend component
 *
 * - Old emails: Successfully delivered, bounced, or cancelled emails older than 7 days
 * - Abandoned emails: Stuck in processing state for longer than 4 weeks (indicates bugs)
 */
export const cleanupResendEmails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const FOUR_WEEKS_MS = 4 * ONE_WEEK_MS;

    // Clean up successfully delivered/bounced/cancelled emails older than 7 days
    await ctx.scheduler.runAfter(0, components.resend.lib.cleanupOldEmails, {
      olderThan: ONE_WEEK_MS,
    });

    // Clean up abandoned emails (stuck in processing) older than 4 weeks
    // These usually indicate bugs and should be investigated
    await ctx.scheduler.runAfter(0, components.resend.lib.cleanupAbandonedEmails, {
      olderThan: FOUR_WEEKS_MS,
    });
  },
});

export default crons;
