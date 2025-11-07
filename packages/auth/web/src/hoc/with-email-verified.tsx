/**
 * withEmailVerified HOC
 *
 * Higher-order component to require email verification.
 *
 * @module
 */

"use client";

import { useRouter } from "next/navigation";
import { type ComponentType, useEffect } from "react";
import { useUser } from "../hooks/use-user.js";

/**
 * Options for withEmailVerified HOC
 */
export interface WithEmailVerifiedOptions {
  /**
   * URL to redirect to if email not verified
   * @default "/verify-email"
   */
  redirectTo?: string;

  /**
   * Component to show while loading
   */
  LoadingComponent?: ComponentType;
}

/**
 * Higher-order component that requires email verification.
 *
 * Wraps a component and redirects if the user's email is not verified.
 * Also redirects if user is not authenticated.
 *
 * @example Basic usage
 * ```tsx
 * const VerifiedOnlyPage = withEmailVerified(DashboardPage);
 * ```
 *
 * @example With custom redirect
 * ```tsx
 * const VerifiedSettings = withEmailVerified(SettingsPage, {
 *   redirectTo: "/check-your-email",
 * });
 * ```
 *
 * @param Component - Component to wrap
 * @param options - Configuration options
 * @returns Protected component
 * @public
 */
export function withEmailVerified<P extends object>(
  Component: ComponentType<P>,
  options: WithEmailVerifiedOptions = {},
) {
  const { redirectTo = "/verify-email", LoadingComponent } = options;

  return function ProtectedComponent(props: P) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push("/login");
        } else if (!user.emailVerified) {
          router.push(redirectTo);
        }
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
    }

    if (!user || !user.emailVerified) {
      return null;
    }

    return <Component {...props} />;
  };
}
