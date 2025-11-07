/**
 * useSignIn Hook
 *
 * Convenience hook for sign-in with built-in loading and error states.
 *
 * @public
 */

"use client";

import { useState } from "react";
import { useAuth } from "./use-auth";

/**
 * Sign-in data interface
 */
export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign-in hook return type
 */
export interface UseSignInReturn {
  /**
   * Sign in with email and password
   */
  signInEmail: (credentials: SignInData) => Promise<void>;

  /**
   * Sign in with social provider
   */
  signInSocial: (provider: "github" | "google" | "apple") => Promise<void>;

  /**
   * Whether sign-in is in progress
   */
  isLoading: boolean;

  /**
   * Sign-in error if any
   */
  error: Error | null;

  /**
   * Reset error state
   */
  resetError: () => void;
}

/**
 * Hook for sign-in with automatic loading and error state management.
 *
 * @example
 * ```tsx
 * function SignInForm() {
 *   const { signInEmail, isLoading, error } = useSignIn();
 *
 *   const handleSubmit = async (email: string, password: string) => {
 *     await signInEmail({ email, password });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <Alert>{error.message}</Alert>}
 *       <button disabled={isLoading}>
 *         {isLoading ? "Signing in..." : "Sign In"}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @returns Sign-in methods with loading and error states
 * @public
 */
export function useSignIn(): UseSignInReturn {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signInEmail = async (credentials: SignInData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signIn.email(credentials);

      // Better Auth returns { data, error } response format
      // Check if there's an error in the response
      if (response && typeof response === "object" && "error" in response && response.error) {
        const errorObj = response.error as { code?: string; message?: string } | string;
        const errorMessage = typeof errorObj === "string" ? errorObj : errorObj?.message || "Sign in failed";
        const error = new Error(errorMessage);
        setError(error);
        throw error;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign in failed");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInSocial = async (provider: "github" | "google" | "apple") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signIn.social({ provider });

      // Better Auth returns { data, error } response format
      // Check if there's an error in the response
      if (response && typeof response === "object" && "error" in response && response.error) {
        const errorObj = response.error as { code?: string; message?: string } | string;
        const errorMessage = typeof errorObj === "string" ? errorObj : errorObj?.message || "Sign in failed";
        const error = new Error(errorMessage);
        setError(error);
        throw error;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign in failed");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    signInEmail,
    signInSocial,
    isLoading,
    error,
    resetError,
  };
}
