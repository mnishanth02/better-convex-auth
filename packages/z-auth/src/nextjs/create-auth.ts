/**
 * Next.js adapter for Better Convex Auth
 *
 * This module provides a Next.js-specific implementation of createAuth
 * with all the hooks, components, and utilities you need.
 */

import type { ClientAuthConfig } from "../core/config";
import * as authWeb from "../react";
import * as authUI from "../react/ui";

/**
 * Result type for createAuth() function
 */
export interface CreateAuthResult {
  authClient: ReturnType<typeof authWeb.createAuthClient>;
  AuthProvider: ReturnType<typeof authWeb.createAuthProvider>;
  useAuth: typeof authWeb.useAuth;
  useSession: typeof authWeb.useSession;
  useUser: typeof authWeb.useUser;
  useSignIn: typeof authWeb.useSignIn;
  useSignUp: typeof authWeb.useSignUp;
  useSignOut: typeof authWeb.useSignOut;
  useAuthClient: typeof authWeb.useAuthClient;
  withAuth: typeof authWeb.withAuth;
  withSession: typeof authWeb.withSession;
  withEmailVerified: typeof authWeb.withEmailVerified;
  components: {
    Forms: {
      SignInForm: typeof authUI.SignInForm;
      SignUpForm: typeof authUI.SignUpForm;
      UpdateProfileForm: typeof authUI.UpdateProfileForm;
      ChangePasswordForm: typeof authUI.ChangePasswordForm;
      ForgotPasswordForm: typeof authUI.ForgotPasswordForm;
      ResetPasswordForm: typeof authUI.ResetPasswordForm;
    };
    Guards: {
      SessionGuard: typeof authUI.SessionGuard;
      RoleGuard: typeof authUI.RoleGuard;
      EmailVerifiedGuard: typeof authUI.EmailVerifiedGuard;
    };
    Display: {
      UserAvatar: typeof authUI.UserAvatar;
      UserBadge: typeof authUI.UserBadge;
      UserMenu: typeof authUI.UserMenu;
    };
    Actions: {
      SocialAuthButtons: typeof authUI.SocialAuthButtons;
      SignOutButton: typeof authUI.SignOutButton;
    };
    Feedback: {
      PasswordStrengthIndicator: typeof authUI.PasswordStrengthIndicator;
    };
    Utils: {
      OAuthRedirectHandler: typeof authUI.OAuthRedirectHandler;
    };
    ErrorBoundary: {
      AuthErrorBoundary: typeof authUI.AuthErrorBoundary;
    };
  };
}

/**
 * Create a complete auth setup for Next.js
 *
 * This is the main entry point for setting up Better Convex Auth in a Next.js application.
 * It returns everything you need: hooks, components, provider, and HOCs.
 *
 * @param config - Next.js auth configuration
 * @returns Complete auth setup with hooks, components, and provider
 *
 * @example
 * ```typescript
 * // lib/auth.ts
 * import { createAuth } from "@workspace/auth/nextjs";
 *
 * export const auth = createAuth({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 *   baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
 * });
 *
 * // Re-export for easy imports
 * export const {
 *   AuthProvider,
 *   useAuth,
 *   useSession,
 *   useUser,
 *   components: { SignInForm, SignUpForm, SessionGuard }
 * } = auth;
 * ```
 *
 * Then in your layout:
 * ```typescript
 * // app/layout.tsx
 * import { AuthProvider } from "@/lib/auth";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>{children}</AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function createAuth(config: ClientAuthConfig): CreateAuthResult {
  const { convexUrl, baseURL, storagePrefix, expectAuth } = config;

  // Validate required configuration
  if (!convexUrl) {
    throw new Error(
      "Missing required configuration: convexUrl\n" +
        "Please provide your Convex deployment URL:\n\n" +
        "  createAuth({\n" +
        "    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,\n" +
        "  })",
    );
  }

  // Create the auth client using @auth/web
  const authClient = authWeb.createAuthClient({
    baseURL: baseURL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
    storagePrefix,
  });

  // Create the auth provider
  const AuthProvider = authWeb.createAuthProvider({
    convexUrl,
    authClient,
    expectAuth,
  });

  // Return everything bundled together
  return {
    authClient,
    AuthProvider,
    useAuth: authWeb.useAuth,
    useSession: authWeb.useSession,
    useUser: authWeb.useUser,
    useSignIn: authWeb.useSignIn,
    useSignUp: authWeb.useSignUp,
    useSignOut: authWeb.useSignOut,
    useAuthClient: authWeb.useAuthClient,
    withAuth: authWeb.withAuth,
    withSession: authWeb.withSession,
    withEmailVerified: authWeb.withEmailVerified,
    components: {
      Forms: {
        SignInForm: authUI.SignInForm,
        SignUpForm: authUI.SignUpForm,
        UpdateProfileForm: authUI.UpdateProfileForm,
        ChangePasswordForm: authUI.ChangePasswordForm,
        ForgotPasswordForm: authUI.ForgotPasswordForm,
        ResetPasswordForm: authUI.ResetPasswordForm,
      },
      Guards: {
        SessionGuard: authUI.SessionGuard,
        RoleGuard: authUI.RoleGuard,
        EmailVerifiedGuard: authUI.EmailVerifiedGuard,
      },
      Display: {
        UserAvatar: authUI.UserAvatar,
        UserBadge: authUI.UserBadge,
        UserMenu: authUI.UserMenu,
      },
      Actions: {
        SocialAuthButtons: authUI.SocialAuthButtons,
        SignOutButton: authUI.SignOutButton,
      },
      Feedback: {
        PasswordStrengthIndicator: authUI.PasswordStrengthIndicator,
      },
      Utils: {
        OAuthRedirectHandler: authUI.OAuthRedirectHandler,
      },
      ErrorBoundary: {
        AuthErrorBoundary: authUI.AuthErrorBoundary,
      },
    },
  };
}
