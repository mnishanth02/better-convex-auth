/**
 * useUser Hook
 *
 * Convenience hook that extracts user data from the session.
 * Built on top of useSession for simplified user access.
 *
 * @example
 * ```tsx
 * function UserBadge() {
 *   const { user, isLoading, error } = useUser();
 *
 *   if (isLoading) return <Skeleton />;
 *   if (error) return null;
 *   if (!user) return <SignInButton />;
 *
 *   return (
 *     <div>
 *       <img src={user.image} alt={user.name} />
 *       <span>{user.name}</span>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * This hook is a convenience wrapper around `useSession` that:
 * - Extracts only the user object
 * - Provides cleaner API for user-focused components
 * - Maintains same loading/error states as useSession
 *
 * @public
 */

"use client";

import { useSession } from "./use-session";

/**
 * User hook return type
 */
export interface UseUserReturn {
  /**
   * The current user data, or null if not authenticated
   */
  user: NonNullable<ReturnType<typeof useSession>["data"]>["user"] | null;

  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Whether the user is currently being loaded
   */
  isLoading: boolean;

  /**
   * Error object if user fetch failed
   */
  error: Error | null;

  /**
   * Function to manually refetch the user
   */
  refetch: ReturnType<typeof useSession>["refetch"];
}

/**
 * React hook to access current user data
 *
 * This is a convenience hook that wraps `useSession` and extracts
 * only the user object. Use this when you only need user data and
 * don't need session metadata.
 *
 * **Important**: This hook must be used within a component wrapped by
 * `AuthClientProvider`.
 *
 * @returns User data with loading and error states
 *
 * @example Basic usage
 * ```tsx
 * const { user, isLoading } = useUser();
 *
 * if (isLoading) return <Loader />;
 * if (!user) return <SignInPrompt />;
 *
 * return <UserProfile user={user} />;
 * ```
 *
 * @example Conditional rendering
 * ```tsx
 * const { user } = useUser();
 *
 * return (
 *   <div>
 *     {user ? (
 *       <WelcomeMessage name={user.name} />
 *     ) : (
 *       <GuestMessage />
 *     )}
 *   </div>
 * );
 * ```
 *
 * @public
 */
export function useUser(): UseUserReturn {
  const { data, isPending, error, refetch } = useSession();

  return {
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
    isLoading: isPending,
    error,
    refetch,
  };
}
