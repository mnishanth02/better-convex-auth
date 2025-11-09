/**
 * Core configuration types for Better Convex Auth
 */

/**
 * Base configuration for setting up Better Convex Auth
 * (Frontend/Client configuration)
 */
export interface ClientAuthConfig {
  /**
   * Convex deployment URL
   * @example "https://your-deployment.convex.cloud"
   */
  convexUrl: string;

  /**
   * Base URL of your application (for redirects and callbacks)
   * @example "https://myapp.com" or "http://localhost:3000"
   */
  baseURL?: string;

  /**
   * Storage prefix for auth tokens (optional)
   * @default "better-auth"
   */
  storagePrefix?: string;

  /**
   * Whether to expect auth to be initialized before use
   * Set to true if you want to ensure auth is ready before rendering
   * @default false
   */
  expectAuth?: boolean;

  /**
   * Custom storage implementation (optional)
   * Use this if you want to override the default localStorage/sessionStorage
   */
  storage?: Storage;
}

/**
 * Next.js specific configuration extends the base client config
 */
export interface NextJsAuthConfig extends ClientAuthConfig {
  /**
   * Path to the API route handler (optional)
   * @default "/api/auth"
   */
  apiPath?: string;
}

/**
 * Environment variable configuration
 */
export interface AuthEnvironment {
  /**
   * Convex deployment URL
   */
  NEXT_PUBLIC_CONVEX_URL: string;

  /**
   * Application base URL
   */
  NEXT_PUBLIC_SITE_URL?: string;

  /**
   * Better Auth secret (server-side only)
   */
  BETTER_AUTH_SECRET?: string;

  /**
   * OAuth provider credentials (optional)
   */
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  APPLE_CLIENT_ID?: string;
  APPLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;

  /**
   * Email service credentials (optional)
   */
  RESEND_API_KEY?: string;
}
