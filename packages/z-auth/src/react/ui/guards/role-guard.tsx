/**
 * RoleGuard Component
 *
 * Route guard that requires users to have specific roles.
 *
 * @module
 */

"use client";

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Spinner } from "@workspace/ui/components/spinner";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { UserRole } from "../../../types";
import { useUser } from "../..";

/**
 * Props for RoleGuard component
 */
export interface RoleGuardProps {
  /**
   * Content to render if user has required role(s)
   */
  children: ReactNode;

  /**
   * Required role(s) - user must have at least one
   */
  roles: UserRole | UserRole[];

  /**
   * If true, user must have ALL specified roles
   * If false, user must have AT LEAST ONE role
   * @default false
   */
  requireAll?: boolean;

  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;

  /**
   * Custom unauthorized component
   */
  unauthorizedComponent?: ReactNode;

  /**
   * URL to redirect to if user lacks required role(s)
   * If provided, redirects instead of showing unauthorized message
   */
  redirectTo?: string;

  /**
   * Custom title for unauthorized message
   * @default "Access Denied"
   */
  title?: string;

  /**
   * Custom description for unauthorized message
   * @default "You do not have permission to access this page"
   */
  description?: string;

  /**
   * Show button to go back
   * @default true
   */
  showBackButton?: boolean;

  /**
   * Custom back button URL
   * @default "/"
   */
  backUrl?: string;
}

/**
 * Route guard component that requires specific user roles.
 *
 * Features:
 * - Single or multiple role requirements
 * - "Any of" or "All of" role matching
 * - Shows loading state while checking
 * - Displays unauthorized message
 * - Optional redirect to access denied page
 * - Customizable messaging
 *
 * @example Basic usage (single role)
 * ```tsx
 * <RoleGuard roles="admin">
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 *
 * @example Multiple roles (any of)
 * ```tsx
 * <RoleGuard roles={["admin", "moderator"]}>
 *   <ModeratorPanel />
 * </RoleGuard>
 * ```
 *
 * @example Multiple roles (all of)
 * ```tsx
 * <RoleGuard roles={["admin", "superuser"]} requireAll={true}>
 *   <SuperAdminPanel />
 * </RoleGuard>
 * ```
 *
 * @example With redirect
 * ```tsx
 * <RoleGuard roles="admin" redirectTo="/unauthorized">
 *   <ProtectedContent />
 * </RoleGuard>
 * ```
 *
 * @param props - Component props
 * @returns Role guard component
 * @public
 */
export function RoleGuard({
  children,
  roles,
  requireAll = false,
  loadingComponent,
  unauthorizedComponent,
  redirectTo,
  title = "Access Denied",
  description = "You do not have permission to access this page",
  showBackButton = true,
  backUrl = "/",
}: RoleGuardProps) {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();

  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  // TODO: Add role support to user type in Better Auth schema
  // For now, we'll use a type assertion to access role property
  const userRole = (user as unknown as { role?: UserRole })?.role;

  const hasRequiredRole = (() => {
    if (!userRole) return false;

    if (requireAll) {
      return requiredRoles.every((role) => userRole === role);
    }
    return requiredRoles.some((role) => userRole === role);
  })();

  useEffect(() => {
    if (!authLoading && !hasRequiredRole && redirectTo) {
      router.push(redirectTo);
    }
  }, [authLoading, hasRequiredRole, redirectTo, router]);

  // Loading state
  if (authLoading) {
    return (
      loadingComponent ?? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="h-8 w-8" />
        </div>
      )
    );
  }

  // User lacks required role(s)
  if (!hasRequiredRole) {
    // If redirectTo is provided, redirect (handled by useEffect)
    if (redirectTo) {
      return null;
    }

    // Show custom unauthorized component if provided
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>;
    }

    // Default unauthorized message
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Insufficient Permissions</AlertTitle>
              <AlertDescription>
                This page requires {requireAll ? "all of" : "one of"} the following role(s):{" "}
                <strong>{requiredRoles.join(", ")}</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
          {showBackButton && (
            <CardFooter>
              <Button onClick={() => router.push(backUrl)} variant="outline" className="w-full">
                Go Back
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }

  // User has required role(s) - render children
  return <>{children}</>;
}
