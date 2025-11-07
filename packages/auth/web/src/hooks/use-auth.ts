/**
 * useAuth Hook
 *
 * Provides authentication actions (signIn, signOut, signUp, etc.)
 * with Better Auth + Convex integration.
 *
 * @example
 * ```tsx
 * function AuthForm() {
 *   const auth = useAuth();
 *   const { data: session } = useSession();
 *
 *   const handleSignIn = async (email: string, password: string) => {
 *     await auth.signIn.email({
 *       email,
 *       password,
 *     });
 *   };
 *
 *   return session ? (
 *     <button onClick={() => auth.signOut()}>Sign Out</button>
 *   ) : (
 *     <SignInForm onSubmit={handleSignIn} />
 *   );
 * }
 * ```
 *
 * @public
 */

"use client";

import { useAuthClient } from "../context/index";

/**
 * React hook to access authentication actions
 *
 * Provides methods for signing in, signing up, signing out, and managing
 * user accounts. All methods integrate with Convex backend automatically.
 *
 * **Important**: This hook must be used within a component wrapped by
 * `AuthClientProvider`.
 *
 * @returns Authentication action methods
 *
 * @example Sign in with email
 * ```tsx
 * const auth = useAuth();
 *
 * const handleSignIn = async (email: string, password: string) => {
 *   await auth.signIn.email({ email, password });
 * };
 * ```
 *
 * @example Sign out
 * ```tsx
 * const auth = useAuth();
 *
 * return (
 *   <button onClick={() => auth.signOut()}>
 *     Sign Out
 *   </button>
 * );
 * ```
 *
 * @example Social sign in
 * ```tsx
 * const auth = useAuth();
 *
 * return (
 *   <button onClick={() => auth.signIn.social({ provider: "github" })}>
 *     Continue with GitHub
 *   </button>
 * );
 * ```
 *
 * @public
 */
export function useAuth() {
  const client = useAuthClient();
  return client;
}
