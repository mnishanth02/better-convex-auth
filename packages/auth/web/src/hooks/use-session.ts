/**
 * useSession Hook
 *
 * Provides reactive access to user session data with Better Auth + Convex.
 * This hook manages loading states, error handling, and real-time session updates.
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { data: session, isPending, error, refetch } = useSession();
 *
 *   if (isPending) {
 *     return <div>Loading session...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error.message}</div>;
 *   }
 *
 *   if (!session) {
 *     return <div>Not authenticated. Please sign in.</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {session.user.name}!</h1>
 *       <p>Email: {session.user.email}</p>
 *       <p>Email verified: {session.user.emailVerified ? "Yes" : "No"}</p>
 *       <button onClick={() => refetch()}>Refresh Session</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * This is a re-export from the Better Auth React client. The hook:
 * - Automatically syncs with Convex real-time updates
 * - Provides loading and error states
 * - Supports manual refetch
 * - Works with ConvexBetterAuthProvider context
 *
 * @see {@link https://better-auth.com/docs/concepts/client#usesession}
 *
 * @public
 */

"use client";

import { useAuthClient } from "../context/index";

/**
 * React hook to access user session data
 *
 * **Important**: This hook must be used within a component wrapped by
 * `AuthClientProvider`.
 *
 * @returns Session data with loading and error states from Better Auth
 *
 * @example Basic usage
 * ```tsx
 * const { data: session, isPending } = useSession();
 *
 * if (isPending) return <Loader />;
 * if (!session) return <LoginPrompt />;
 *
 * return <Dashboard user={session.user} />;
 * ```
 *
 * @example With error handling
 * ```tsx
 * const { data: session, isPending, error } = useSession();
 *
 * if (isPending) return <Loader />;
 * if (error) return <ErrorDisplay message={error.message} />;
 * if (!session) return <LoginPrompt />;
 *
 * return <Dashboard user={session.user} />;
 * ```
 *
 * @public
 */
export function useSession() {
  const client = useAuthClient();
  return client.useSession();
}
