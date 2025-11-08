/**
 * Scheduled tasks (cron jobs)
 *
 * This module defines recurring background tasks for maintenance:
 * - Cleanup expired sessions
 * - Cleanup expired password reset tokens
 * - Cleanup old verification tokens
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

/**
 * Clean up expired sessions
 * Runs every hour to remove sessions that have expired
 */
crons.interval("cleanup-expired-sessions", { hours: 1 }, internal.sessionManagement.cleanupExpiredSessions);

/**
 * Clean up expired password reset tokens
 * Runs every day at 2 AM to remove old reset tokens
 */
crons.daily(
  "cleanup-expired-reset-tokens",
  { hourUTC: 2, minuteUTC: 0 },
  internal.passwordReset.cleanupExpiredResetTokens,
);

export default crons;
