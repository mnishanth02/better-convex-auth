/**
 * EmailVerifiedGuard Component
 *
 * Route guard that requires users to have a verified email address.
 *
 * @module
 */

"use client";

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Spinner } from "@workspace/ui/components/spinner";
import { AlertCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useUser } from "../..";

/**
 * Props for EmailVerifiedGuard component
 */
export interface EmailVerifiedGuardProps {
  /**
   * Content to render if email is verified
   */
  children: ReactNode;

  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;

  /**
   * Custom unverified email component
   */
  unverifiedComponent?: ReactNode;

  /**
   * URL to redirect to if email is not verified
   * If provided, redirects instead of showing unverified message
   */
  redirectTo?: string;

  /**
   * Show resend verification email button
   * @default true
   */
  showResendButton?: boolean;

  /**
   * API endpoint for resending verification email
   * @default "/api/auth/resend-verification"
   */
  resendEndpoint?: string;

  /**
   * Custom title for unverified message
   * @default "Email Verification Required"
   */
  title?: string;

  /**
   * Custom description for unverified message
   * @default "Please verify your email address to access this page"
   */
  description?: string;
}

/**
 * Route guard component that requires email verification.
 *
 * Features:
 * - Checks if user's email is verified
 * - Shows loading state while checking
 * - Displays verification required message
 * - Optional resend verification email button
 * - Optional redirect to verification page
 * - Customizable messaging
 *
 * @example Basic usage
 * ```tsx
 * <EmailVerifiedGuard>
 *   <ProtectedContent />
 * </EmailVerifiedGuard>
 * ```
 *
 * @example With redirect
 * ```tsx
 * <EmailVerifiedGuard redirectTo="/verify-email">
 *   <ProtectedContent />
 * </EmailVerifiedGuard>
 * ```
 *
 * @example Custom message
 * ```tsx
 * <EmailVerifiedGuard
 *   title="Verify Your Account"
 *   description="This feature requires a verified email"
 *   showResendButton={true}
 * >
 *   <ProtectedContent />
 * </EmailVerifiedGuard>
 * ```
 *
 * @param props - Component props
 * @returns Email verified guard component
 * @public
 */
export function EmailVerifiedGuard({
  children,
  loadingComponent,
  unverifiedComponent,
  redirectTo,
  showResendButton = true,
  resendEndpoint = "/api/auth/resend-verification",
  title = "Email Verification Required",
  description = "Please verify your email address to access this page",
}: EmailVerifiedGuardProps) {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const isEmailVerified = user?.emailVerified ?? false;

  useEffect(() => {
    if (!authLoading && !isEmailVerified && redirectTo) {
      router.push(redirectTo);
    }
  }, [authLoading, isEmailVerified, redirectTo, router]);

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setResendError(null);

      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to resend verification email");
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend verification email";
      setResendError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

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

  // Email not verified
  if (!isEmailVerified) {
    // If redirectTo is provided, redirect (handled by useEffect)
    if (redirectTo) {
      return null;
    }

    // Show custom unverified component if provided
    if (unverifiedComponent) {
      return <>{unverifiedComponent}</>;
    }

    // Default unverified message
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                We've sent a verification email to <strong>{user?.email}</strong>. Please check your inbox and click the
                verification link.
              </AlertDescription>
            </Alert>

            {resendSuccess && (
              <Alert>
                <AlertDescription>Verification email sent! Please check your inbox.</AlertDescription>
              </Alert>
            )}

            {resendError && (
              <Alert variant="destructive">
                <AlertDescription>{resendError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          {showResendButton && (
            <CardFooter>
              <Button onClick={handleResendVerification} disabled={isResending} variant="outline" className="w-full">
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }

  // Email verified - render children
  return <>{children}</>;
}
