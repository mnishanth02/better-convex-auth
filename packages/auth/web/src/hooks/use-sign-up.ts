/**
 * useSignUp Hook
 *
 * Convenience hook for sign-up with built-in loading and error states.
 *
 * @public
 */

"use client";

import { useState } from "react";
import { useAuth } from "./use-auth.js";

/**
 * Sign-up data interface
 */
export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

/**
 * Sign-up hook return type
 */
export interface UseSignUpReturn {
  /**
   * Sign up with email and password
   */
  signUpEmail: (data: SignUpData) => Promise<void>;

  /**
   * Whether sign-up is in progress
   */
  isLoading: boolean;

  /**
   * Sign-up error if any
   */
  error: Error | null;

  /**
   * Reset error state
   */
  resetError: () => void;
}

/**
 * Hook for sign-up with automatic loading and error state management.
 *
 * @example
 * ```tsx
 * function SignUpForm() {
 *   const { signUpEmail, isLoading, error } = useSignUp();
 *
 *   const handleSubmit = async (email: string, password: string, name: string) => {
 *     await signUpEmail({ email, password, name });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <Alert>{error.message}</Alert>}
 *       <button disabled={isLoading}>
 *         {isLoading ? "Creating account..." : "Sign Up"}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @returns Sign-up methods with loading and error states
 * @public
 */
export function useSignUp(): UseSignUpReturn {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signUpEmail = async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp.email({
        ...data,
        name: data.name || "", // Provide default empty string if name not provided
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign up failed"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    signUpEmail,
    isLoading,
    error,
    resetError,
  };
}
