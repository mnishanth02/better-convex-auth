"use client";

/**
 * Better Convex Auth - Quickstart Setup
 *
 * This file demonstrates the new @auth/quickstart package
 * which provides one-function setup for authentication.
 *
 * 5-minute setup instead of 30+ minutes!
 */

import { setupAuth } from "@auth/quickstart";
import { env } from "@/lib/config/env";

/**
 * Main auth setup - everything configured in one function call
 * Uses validated environment variables from @/lib/config/env
 */
export const auth = setupAuth({
  convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
  baseURL: env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  storagePrefix: "better-auth",
  expectAuth: false,
});

/**
 * Export everything for easy imports throughout the app
 */
export const {
  // Provider to wrap the app
  AuthProvider,

  // Core auth hooks
  useAuth,
  useSession,
  useUser,
  useSignIn,
  useSignUp,
  useSignOut,

  // UI Components
  components: {
    Forms: { SignInForm, SignUpForm, UpdateProfileForm, ChangePasswordForm, ForgotPasswordForm, ResetPasswordForm },
    Guards: { SessionGuard, RoleGuard, EmailVerifiedGuard },
    Display: { UserAvatar, UserBadge, UserMenu },
    Actions: { SignOutButton, SocialAuthButtons },
    Feedback: { PasswordStrengthIndicator },
  },

  // Higher-order components
  withAuth,
  withSession,
  withEmailVerified,
} = auth;

/*
 * That's it! 🎉
 *
 * Compare to the old setup:
 * - No manual createAuthClient() call
 * - No manual createAuthProvider() call
 * - No separate imports from @auth/web and @auth/ui
 * - Everything in one place with full TypeScript support
 */
