/**
 * React Providers for Better Auth + Convex Integration
 *
 * This module exports provider components for setting up authentication
 * context in React applications.
 *
 * @module providers
 */

/**
 * Re-export ConvexBetterAuthProvider from the official package.
 *
 * **Usage**: Wrap your app with this provider to enable authentication.
 *
 * @example
 * ```tsx
 * import { ConvexReactClient } from "convex/react";
 * import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
 * import { authClient } from "./auth-client";
 *
 * const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
 *   expectAuth: true, // Pause queries until authenticated
 * });
 *
 * export function Providers({ children }) {
 *   return (
 *     <ConvexBetterAuthProvider client={convex} authClient={authClient}>
 *       {children}
 *     </ConvexBetterAuthProvider>
 *   );
 * }
 * ```
 *
 * @see {@link https://convex-better-auth.netlify.app/}
 */
export { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
export {
  type CreateAuthProviderOptions,
  createAuthProvider,
} from "./create-auth-provider.js";
