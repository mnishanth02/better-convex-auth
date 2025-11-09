/**
 * Session Types
 *
 * Type definitions for session management.
 */

/**
 * User session object from the database.
 */
export interface Session {
  /** Unique session ID (Convex document ID) */
  _id: string;

  /** Unique session ID (Better Auth session ID) */
  id: string;

  /** User ID this session belongs to */
  userId: string;

  /** Session token (stored in cookie) */
  token: string;

  /** Timestamp when session expires */
  expiresAt: number;

  /** Timestamp when session was created */
  createdAt: number;

  /** Timestamp when session was last updated */
  updatedAt: number;

  /** IP address of the client (optional, for security) */
  ipAddress?: string | null;

  /** User agent string (optional, for security) */
  userAgent?: string | null;

  /** Device information (optional) */
  device?: {
    type?: "mobile" | "desktop" | "tablet";
    os?: string;
    browser?: string;
  };
}

/**
 * Active session information (for session management UI).
 */
export interface ActiveSession {
  id: string;
  device?: string;
  location?: string;
  ipAddress?: string;
  lastActive: number;
  current: boolean;
}

/**
 * Session with user information.
 * Joined session + user data for convenience.
 */
export interface SessionWithUser extends Session {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    emailVerified: boolean;
  };
}

/**
 * Session status check result.
 */
export interface SessionStatus {
  /** Whether a valid session exists */
  authenticated: boolean;

  /** Session expiry timestamp (if authenticated) */
  expiresAt?: number;

  /** Whether the session is fresh (recently authenticated) */
  fresh?: boolean;

  /** Time until session expires (in seconds) */
  expiresIn?: number;
}

/**
 * Session refresh result.
 */
export interface SessionRefreshResult {
  /** Whether refresh was successful */
  success: boolean;

  /** New session token (if successful) */
  token?: string;

  /** New expiry timestamp (if successful) */
  expiresAt?: number;

  /** Error message (if failed) */
  error?: string;
}

/**
 * Session configuration options.
 */
export interface SessionConfig {
  /** Session duration in seconds (default: 7 days) */
  expiresIn?: number;

  /** How often to update session age in seconds (default: 1 day) */
  updateAge?: number;

  /** How long a session is considered "fresh" in seconds (default: 10 minutes) */
  freshAge?: number;

  /** Cookie settings */
  cookie?: {
    /** Cookie name (default: "better-auth.session_token") */
    name?: string;

    /** HttpOnly flag (default: true) */
    httpOnly?: boolean;

    /** Secure flag (default: true in production) */
    secure?: boolean;

    /** SameSite policy (default: "lax") */
    sameSite?: "strict" | "lax" | "none";

    /** Cookie domain */
    domain?: string;

    /** Cookie path (default: "/") */
    path?: string;
  };
}
