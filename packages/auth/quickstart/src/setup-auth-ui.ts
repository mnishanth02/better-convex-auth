import { setupAuth } from "./setup-auth";
import type { SetupAuthConfig } from "./types";

/**
 * Explicit UI-included setup (alias for setupAuth)
 *
 * Use this when you want to make it clear that you're including UI components.
 * Functionally identical to setupAuth().
 *
 * @example
 * ```typescript
 * export const auth = setupAuthUI({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 *   baseURL: "http://localhost:3000",
 * });
 * ```
 */
export function setupAuthUI(config: SetupAuthConfig) {
  return setupAuth(config);
}
