/**
 * SessionGuard Component
 *
 * Component for protecting routes and displaying loading/error states.
 *
 * @module
 */

"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../..";

/**
 * Props for SessionGuard component
 */
export interface SessionGuardProps {
  /**
   * Children to render when authenticated
   */
  children: React.ReactNode;

  /**
   * URL to redirect to if not authenticated
   * @default "/login"
   */
  redirectTo?: string;

  /**
   * Require email verification
   * @default false
   */
  requireEmailVerified?: boolean;

  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;

  /**
   * Custom unauthorized component
   */
  unauthorizedComponent?: React.ReactNode;

  /**
   * Custom unverified component
   */
  unverifiedComponent?: React.ReactNode;

  /**
   * Callback when redirecting
   */
  onRedirect?: () => void;
}

/**
 * Default loading component
 */
function DefaultLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Default unauthorized component
 */
function DefaultUnauthorized({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <CardTitle>Unauthorized</CardTitle>
          </div>
          <CardDescription>You need to be signed in to access this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push(redirectTo)} className="w-full">
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Default unverified component
 */
function DefaultUnverified() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            <CardTitle>Email Verification Required</CardTitle>
          </div>
          <CardDescription>
            Please verify your email address to access this page. Check your inbox for a verification link.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

/**
 * Session guard component for protecting routes.
 *
 * Features:
 * - Authentication check
 * - Email verification check
 * - Automatic redirects
 * - Custom loading/error states
 * - Type-safe session access
 *
 * @example Basic usage
 * ```tsx
 * <SessionGuard>
 *   <DashboardContent />
 * </SessionGuard>
 * ```
 *
 * @example With email verification
 * ```tsx
 * <SessionGuard requireEmailVerified={true}>
 *   <ProtectedContent />
 * </SessionGuard>
 * ```
 *
 * @example Custom redirect
 * ```tsx
 * <SessionGuard redirectTo="/auth/signin">
 *   <ProtectedContent />
 * </SessionGuard>
 * ```
 *
 * @param props - Component props
 * @returns Session guard component
 * @public
 */
export function SessionGuard({
  children,
  redirectTo = "/login",
  requireEmailVerified = false,
  loadingComponent,
  unauthorizedComponent,
  unverifiedComponent,
  onRedirect,
}: SessionGuardProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      onRedirect?.();
      router.push(redirectTo);
    }
  }, [isPending, session, redirectTo, router, onRedirect]);

  // Still loading
  if (isPending) {
    return loadingComponent || <DefaultLoading />;
  }

  // Not authenticated
  if (!session) {
    return unauthorizedComponent || <DefaultUnauthorized redirectTo={redirectTo} />;
  }

  // Email verification required but not verified
  if (requireEmailVerified && !session.user.emailVerified) {
    return unverifiedComponent || <DefaultUnverified />;
  }

  // Authenticated and verified (if required)
  return <>{children}</>;
}
