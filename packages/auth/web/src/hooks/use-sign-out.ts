/**
 * useSignOut Hook
 *
 * Convenience hook for sign-out with built-in loading and error states.
 *
 * @public
 */

"use client";

import { useState } from "react";
import { useAuth } from "./use-auth.js";

/**
 * Sign-out hook return type
 */
export interface UseSignOutReturn {
  /**
   * Sign out the current user
   */
  signOut: () => Promise<void>;

  /**
   * Whether sign-out is in progress
   */
  isLoading: boolean;

  /**
   * Sign-out error if any
   */
  error: Error | null;

  /**
   * Reset error state
   */
  resetError: () => void;
}

/**
 * Hook for sign-out with automatic loading and error state management.
 *
 * @example
 * ```tsx
 * function SignOutButton() {
 *   const { signOut, isLoading } = useSignOut();
 *
 *   return (
 *     <button onClick={signOut} disabled={isLoading}>
 *       {isLoading ? "Signing out..." : "Sign Out"}
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns Sign-out method with loading and error states
 * @public
 */
export function useSignOut(): UseSignOutReturn {
  const { signOut: authSignOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authSignOut();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign out failed"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    signOut,
    isLoading,
    error,
    resetError,
  };
}
