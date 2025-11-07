/**
 * withAuth HOC
 *
 * Higher-order component to protect components by requiring authentication.
 *
 * @module
 */

"use client";

import { useRouter } from "next/navigation";
import { type ComponentType, useEffect } from "react";
import { useSession } from "../hooks/use-session.js";

/**
 * Options for withAuth HOC
 */
export interface WithAuthOptions {
  /**
   * URL to redirect to if not authenticated
   * @default "/login"
   */
  redirectTo?: string;

  /**
   * Component to show while loading session
   */
  LoadingComponent?: ComponentType;
}

/**
 * Higher-order component that requires authentication.
 *
 * Wraps a component and redirects to login if the user is not authenticated.
 * Shows a loading state while checking authentication status.
 *
 * @example Basic usage
 * ```tsx
 * const ProtectedDashboard = withAuth(DashboardPage);
 * ```
 *
 * @example With custom redirect
 * ```tsx
 * const ProtectedSettings = withAuth(SettingsPage, {
 *   redirectTo: "/signin",
 * });
 * ```
 *
 * @example With loading component
 * ```tsx
 * const ProtectedProfile = withAuth(ProfilePage, {
 *   LoadingComponent: () => <Spinner />,
 * });
 * ```
 *
 * @param Component - Component to wrap
 * @param options - Configuration options
 * @returns Protected component
 * @public
 */
export function withAuth<P extends object>(Component: ComponentType<P>, options: WithAuthOptions = {}) {
  const { redirectTo = "/login", LoadingComponent } = options;

  return function ProtectedComponent(props: P) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!isPending && !session) {
        router.push(redirectTo);
      }
    }, [session, isPending, router]);

    if (isPending) {
      return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}
