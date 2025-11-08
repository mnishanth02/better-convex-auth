/**
 * @auth/config - Centralized Authentication Configuration
 *
 * Provides type-safe configuration management for the authentication system
 * with sensible defaults and runtime validation.
 */

export { mergeConfig } from "./auth-config.js";
export type {
  AuthConfig,
  RouteConfig,
  SessionConfig,
  PasswordConfig,
  EmailConfig,
  OAuthConfig,
  OAuthProvider,
  RateLimitConfig,
} from "./auth-config.js";

export { DEFAULT_AUTH_CONFIG, DEV_AUTH_CONFIG, STRICT_AUTH_CONFIG } from "./defaults.js";

export {
  validateAuthConfig,
  safeValidateAuthConfig,
  isAuthConfig,
  authConfigSchema,
} from "./validators.js";

// Re-export getAuthConfig with defaults injected to avoid circular dependency
import { mergeConfig } from "./auth-config.js";
import { DEFAULT_AUTH_CONFIG } from "./defaults.js";
import type { AuthConfig } from "./auth-config.js";

/**
 * Gets the complete auth configuration by merging custom values with defaults
 *
 * @param custom - Partial configuration to override defaults
 * @returns Complete auth configuration
 *
 * @example
 * ```typescript
 * import { getAuthConfig } from "@auth/config";
 *
 * const config = getAuthConfig({
 *   password: { minLength: 12 }
 * });
 * ```
 */
export function getAuthConfig(custom?: Partial<AuthConfig>): AuthConfig {
  return mergeConfig(custom, DEFAULT_AUTH_CONFIG);
}
