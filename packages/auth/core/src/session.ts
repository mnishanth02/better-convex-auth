/**
 * Session Management Utilities
 *
 * Helper functions for managing user sessions.
 */

import type { Session } from "@auth/types";

/**
 * Session lifecycle status
 */
export type SessionLifecycleStatus = "active" | "expiring" | "expired";

/**
 * Check if a session is valid (not expired)
 *
 * @param session - Session to check
 * @returns true if session is valid
 */
export function isSessionValid(session: Session): boolean {
  return session.expiresAt > Date.now();
}

/**
 * Check if a session is expired
 *
 * @param session - Session to check
 * @returns true if session is expired
 */
export function isSessionExpired(session: Session): boolean {
  return !isSessionValid(session);
}

/**
 * Get session lifecycle status
 *
 * @param session - Session to check
 * @returns Session lifecycle status
 */
export function getSessionStatus(session: Session): SessionLifecycleStatus {
  if (isSessionExpired(session)) {
    return "expired";
  }

  // Check if session is close to expiring (within 1 hour)
  const oneHour = 60 * 60 * 1000;
  if (session.expiresAt - Date.now() < oneHour) {
    return "expiring";
  }

  return "active";
}

/**
 * Check if a session should be refreshed
 *
 * @param session - Session to check
 * @param updateAge - Update age in seconds (default: 24 hours)
 * @returns true if session should be refreshed
 */
export function shouldRefreshSession(session: Session, updateAge: number = 60 * 60 * 24): boolean {
  const lastUpdated = session.updatedAt ?? session.createdAt;
  const updateAgeMs = updateAge * 1000;
  return Date.now() - lastUpdated > updateAgeMs;
}

/**
 * Calculate session expiration timestamp
 *
 * @param expiresIn - Expiration duration in seconds
 * @param fromTimestamp - Starting timestamp (default: now)
 * @returns Expiration timestamp in milliseconds
 */
export function calculateSessionExpiry(expiresIn: number, fromTimestamp: number = Date.now()): number {
  return fromTimestamp + expiresIn * 1000;
}

/**
 * Get remaining session time in seconds
 *
 * @param session - Session to check
 * @returns Remaining time in seconds (0 if expired)
 */
export function getRemainingSessionTime(session: Session): number {
  const remaining = Math.floor((session.expiresAt - Date.now()) / 1000);
  return Math.max(0, remaining);
}

/**
 * Format session time for display
 *
 * @param seconds - Time in seconds
 * @returns Formatted string (e.g., "5 days", "2 hours", "30 minutes")
 */
export function formatSessionTime(seconds: number): string {
  if (seconds <= 0) return "Expired";

  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;

  return "Less than a minute";
}

/**
 * Sanitize session for client (remove sensitive data)
 *
 * @param session - Full session object
 * @returns Sanitized session safe for client
 */
export function sanitizeSession(session: Session): Omit<Session, "token"> {
  const { token: _token, ...sanitized } = session;
  return sanitized;
}
