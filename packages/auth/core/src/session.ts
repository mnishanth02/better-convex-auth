/**
 * Session Management Utilities
 *
 * Helper functions for managing user sessions.
 * These utilities accept both internal Session types and Better Auth session types.
 */

import type { AnySession, Session } from "@auth/types";

/**
 * Session lifecycle status
 */
export type SessionLifecycleStatus = "active" | "expiring" | "expired";

/**
 * Extract expiry timestamp from any session type
 */
function getExpiryTimestamp(session: AnySession): number {
  // Better Auth session structure
  if ("session" in session && session.session && "expiresAt" in session.session) {
    const expiresAt = session.session.expiresAt as Date | number;
    return expiresAt instanceof Date ? expiresAt.getTime() : expiresAt;
  }

  // Internal session structure
  if ("expiresAt" in session) {
    const expiresAt = session.expiresAt as Date | number;
    return expiresAt instanceof Date ? expiresAt.getTime() : expiresAt;
  }

  return 0; // Invalid session
}

/**
 * Extract creation timestamp from any session type
 */
function getCreatedTimestamp(session: AnySession): number {
  // Better Auth session structure
  if ("session" in session && session.session && "createdAt" in session.session) {
    const createdAt = session.session.createdAt as Date | number;
    return createdAt instanceof Date ? createdAt.getTime() : createdAt;
  }

  // Internal session structure
  if ("createdAt" in session) {
    const createdAt = session.createdAt as Date | number;
    return createdAt instanceof Date ? createdAt.getTime() : createdAt;
  }

  return Date.now();
}

/**
 * Extract updated timestamp from any session type
 */
function getUpdatedTimestamp(session: AnySession): number {
  // Better Auth session structure
  if ("session" in session && session.session && "updatedAt" in session.session) {
    const updatedAt = session.session.updatedAt as Date | number;
    return updatedAt instanceof Date ? updatedAt.getTime() : updatedAt;
  }

  // Internal session structure
  if ("updatedAt" in session) {
    const updatedAt = session.updatedAt as Date | number;
    return updatedAt instanceof Date ? updatedAt.getTime() : updatedAt;
  }

  return getCreatedTimestamp(session);
}

/**
 * Check if a session is valid (not expired)
 *
 * @param session - Session to check (internal or Better Auth)
 * @returns true if session is valid
 */
export function isSessionValid(session: AnySession): boolean {
  return getExpiryTimestamp(session) > Date.now();
}

/**
 * Check if a session is expired
 *
 * @param session - Session to check (internal or Better Auth)
 * @returns true if session is expired
 */
export function isSessionExpired(session: AnySession): boolean {
  return !isSessionValid(session);
}

/**
 * Get session lifecycle status
 *
 * @param session - Session to check (internal or Better Auth)
 * @returns Session lifecycle status
 */
export function getSessionStatus(session: AnySession): SessionLifecycleStatus {
  if (isSessionExpired(session)) {
    return "expired";
  }

  // Check if session is close to expiring (within 1 hour)
  const oneHour = 60 * 60 * 1000;
  if (getExpiryTimestamp(session) - Date.now() < oneHour) {
    return "expiring";
  }

  return "active";
}

/**
 * Check if a session should be refreshed
 *
 * @param session - Session to check (internal or Better Auth)
 * @param updateAge - Update age in seconds (default: 24 hours)
 * @returns true if session should be refreshed
 */
export function shouldRefreshSession(session: AnySession, updateAge: number = 60 * 60 * 24): boolean {
  const lastUpdated = getUpdatedTimestamp(session);
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
 * @param session - Session to check (internal or Better Auth)
 * @returns Remaining time in seconds (0 if expired)
 */
export function getRemainingSessionTime(session: AnySession): number {
  const remaining = Math.floor((getExpiryTimestamp(session) - Date.now()) / 1000);
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
