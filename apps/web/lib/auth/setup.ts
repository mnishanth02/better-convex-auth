"use client";

/**
 * Better Convex Auth - Unified Package Setup
 *
 * Using @workspace/z-auth - one package for everything!
 * Simple, type-safe, and scalable authentication.
 */

import { createAuth } from "@workspace/z-auth/nextjs";

// Get environment variables
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is required");
}

/**
 * Main auth setup - single function call
 * Returns hooks, components, and provider
 */
const auth = createAuth({
  convexUrl,
  baseURL,
});

// Export the provider and all hooks
export const {
  AuthProvider,
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
  components,
} = auth;

// Re-export components for convenience
export const {
  Forms: { SignInForm, SignUpForm, UpdateProfileForm, ChangePasswordForm, ForgotPasswordForm, ResetPasswordForm },
  Guards: { SessionGuard, RoleGuard, EmailVerifiedGuard },
  Display: { UserAvatar, UserBadge, UserMenu },
  Actions: { SignOutButton, SocialAuthButtons },
  Feedback: { PasswordStrengthIndicator },
  Utils: { OAuthRedirectHandler },
} = auth.components;

/**
 * Utility Functions
 */

// User role type
export type UserRole = "user" | "moderator" | "admin";

/**
 * Type-safe helper to access user role.
 * Returns undefined if role is not present.
 */
export function getUserRole(user: unknown): UserRole | undefined {
  if (user && typeof user === "object" && "role" in user) {
    return (user as { role: UserRole }).role;
  }
  return undefined;
}

/**
 * That's it! 🎉
 *
 * Compare to the old setup:
 * - 1 package instead of 7+
 * - 1 file instead of 4+
 * - Simple imports: import { useAuth, UserAvatar } from "@/lib/auth/setup"
 * - Full TypeScript support built-in
 * - All components and hooks in one place
 */
