import {
  ChangePasswordForm,
  EmailVerifiedGuard,
  ForgotPasswordForm,
  PasswordStrengthIndicator,
  ResetPasswordForm,
  RoleGuard,
  SessionGuard,
  SignInForm,
  SignOutButton,
  SignUpForm,
  SocialAuthButtons,
  UpdateProfileForm,
  UserAvatar,
  UserBadge,
  UserMenu,
} from "@auth/ui";
import {
  createAuthClient,
  createAuthProvider,
  useAuth,
  useAuthClient,
  useSession,
  useSignIn,
  useSignOut,
  useSignUp,
  useUser,
  withAuth,
  withEmailVerified,
  withSession,
} from "@auth/web";

import type { SetupAuthConfig, SetupAuthResult } from "./types";

/**
 * One-function setup for Better Convex Auth
 *
 * Returns everything you need to add authentication to your Next.js app:
 * - AuthProvider to wrap your app
 * - Hooks for accessing auth state
 * - Pre-built UI components
 * - HOCs for route protection
 *
 * @example
 * ```typescript
 * // lib/auth/setup.ts
 * export const auth = setupAuth({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 *   baseURL: "http://localhost:3000",
 * });
 *
 * export const {
 *   AuthProvider,
 *   useAuth,
 *   useSession,
 *   components: { SignInForm, SignUpForm }
 * } = auth;
 * ```
 */
export function setupAuth(config: SetupAuthConfig): SetupAuthResult {
  const { convexUrl, baseURL, storagePrefix, expectAuth } = config;

  // Create the auth client
  const authClient = createAuthClient({
    baseURL,
    storagePrefix,
  });

  // Create the auth provider
  const AuthProvider = createAuthProvider({
    convexUrl,
    authClient,
    expectAuth,
  });

  // Return everything bundled together
  return {
    // Core instances
    authClient,
    AuthProvider,

    // Organized exports
    hooks: {
      useAuth,
      useSession,
      useUser,
      useSignIn,
      useSignUp,
      useSignOut,
      useAuthClient,
    },
    components: {
      Forms: {
        SignInForm,
        SignUpForm,
        UpdateProfileForm,
        ChangePasswordForm,
        ForgotPasswordForm,
        ResetPasswordForm,
      },
      Guards: {
        SessionGuard,
        RoleGuard,
        EmailVerifiedGuard,
      },
      Display: {
        UserAvatar,
        UserBadge,
        UserMenu,
      },
      Actions: {
        SocialAuthButtons,
        SignOutButton,
      },
      Feedback: {
        PasswordStrengthIndicator,
      },
    },
    hocs: {
      withAuth,
      withSession,
      withEmailVerified,
    },

    // Convenience exports (commonly used items at top level)
    useAuth,
    useSession,
    useUser,
    useSignIn,
    useSignUp,
    useSignOut,
    useAuthClient,
    withAuth,
    withSession,
    withEmailVerified,
  };
}
