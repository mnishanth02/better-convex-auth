/**
 * Auth Client Context
 *
 * Provides the Better Auth client instance to React components via Context.
 * This enables hooks to access the auth client without prop drilling.
 *
 * @module
 */

"use client";

import type { AuthClient as ConvexAuthClient } from "@convex-dev/better-auth/react";
import { createContext, type ReactNode, useContext } from "react";

/**
 * Type representing the Better Auth client instance with Convex integration
 */
export type AuthClient = ConvexAuthClient;

/**
 * React Context for the Auth Client
 * @internal
 */
const AuthClientContext = createContext<AuthClient | null>(null);

/**
 * Props for AuthClientProvider component
 */
export interface AuthClientProviderProps {
  /**
   * The Better Auth client instance to provide to child components
   */
  client: AuthClient;

  /**
   * Child components that will have access to the auth client
   */
  children: ReactNode;
}

/**
 * Provider component that makes the auth client available to all child components.
 *
 * This component should wrap your application at a high level, typically in your
 * root layout or app component.
 *
 * @example
 * ```tsx
 * import { createAuthClient } from "better-auth/react";
 * import { AuthClientProvider } from "../react";
 *
 * const authClient = createAuthClient({
 *   baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
 * });
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthClientProvider client={authClient}>
 *           {children}
 *         </AuthClientProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @param props - Component props
 * @returns Provider component
 * @public
 */
export function AuthClientProvider({ client, children }: AuthClientProviderProps) {
  return <AuthClientContext.Provider value={client}>{children}</AuthClientContext.Provider>;
}

/**
 * Hook to access the auth client from context.
 *
 * This hook must be used within a component that is wrapped by `AuthClientProvider`.
 * Throws an error if used outside of the provider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const client = useAuthClient();
 *
 *   const handleSignIn = async () => {
 *     await client.signIn.email({
 *       email: "user@example.com",
 *       password: "password",
 *     });
 *   };
 *
 *   return <button onClick={handleSignIn}>Sign In</button>;
 * }
 * ```
 *
 * @returns The Better Auth client instance
 * @throws {Error} If called outside of AuthClientProvider
 * @public
 */
export function useAuthClient(): AuthClient {
  const client = useContext(AuthClientContext);

  if (!client) {
    throw new Error(
      "useAuthClient must be used within AuthClientProvider. " +
        "Wrap your app with <AuthClientProvider client={authClient}> " +
        "at the root level (e.g., in your layout.tsx or _app.tsx).",
    );
  }

  return client;
}
