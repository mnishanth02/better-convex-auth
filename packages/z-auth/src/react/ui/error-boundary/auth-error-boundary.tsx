/**
 * Auth Error Boundary
 *
 * React Error Boundary component specifically for handling authentication errors.
 * Catches errors in the authentication flow and provides a fallback UI.
 *
 * @module
 */

"use client";

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import type React from "react";
import { Component, type ReactNode } from "react";
import { type AuthErrorCode, getErrorMessage, isAuthError } from "../../../utils/errors";

/**
 * Props for AuthErrorBoundary component
 */
export interface AuthErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;

  /**
   * Custom fallback component to render when an error occurs
   * If not provided, a default error UI will be shown
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;

  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;

  /**
   * Whether to show detailed error information (useful for development)
   * @default process.env.NODE_ENV === 'development'
   */
  showDetails?: boolean;
}

/**
 * State for AuthErrorBoundary
 */
interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Auth Error Boundary Component
 *
 * Catches and handles errors in the authentication flow, providing a
 * user-friendly error UI with options to retry or sign out.
 *
 * @example Basic usage
 * ```tsx
 * import { AuthErrorBoundary } from "@workspace/z-auth/react";
 *
 * export default function Layout({ children }) {
 *   return (
 *     <AuthProvider>
 *       <AuthErrorBoundary>
 *         {children}
 *       </AuthErrorBoundary>
 *     </AuthProvider>
 *   );
 * }
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * <AuthErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <h1>Authentication Error</h1>
 *       <p>{error.message}</p>
 *       <button onClick={reset}>Try Again</button>
 *     </div>
 *   )}
 * >
 *   {children}
 * </AuthErrorBoundary>
 * ```
 *
 * @example With error callback
 * ```tsx
 * <AuthErrorBoundary
 *   onError={(error, errorInfo) => {
 *     // Log to error tracking service
 *     console.error("Auth error:", error, errorInfo);
 *   }}
 * >
 *   {children}
 * </AuthErrorBoundary>
 * ```
 */
export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("AuthErrorBoundary caught an error:", error, errorInfo);
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleSignOut = (): void => {
    if (typeof window !== "undefined") {
      // Clear auth storage and redirect to sign-in
      localStorage.removeItem("better-auth.session");
      window.location.href = "/sign-in";
    }
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, showDetails = process.env.NODE_ENV === "development" } = this.props;

    if (!hasError) {
      return children;
    }

    // Use custom fallback if provided
    if (fallback && error) {
      return fallback(error, this.handleReset);
    }

    // Default error UI
    const isAuth = error ? isAuthError(error) : false;
    const errorMessage = error
      ? isAuth
        ? getErrorMessage((error as Error & { code: AuthErrorCode }).code).message
        : error.message
      : "An unknown error occurred";

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Authentication Error</CardTitle>
            </div>
            <CardDescription>
              {isAuth ? "We encountered a problem with your authentication" : "An unexpected error occurred"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>

            {showDetails && error && (
              <Alert>
                <AlertTitle>Details</AlertTitle>
                <AlertDescription>
                  <pre className="mt-2 text-xs overflow-auto max-h-40">{error.stack || error.toString()}</pre>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={this.handleReset} variant="default" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              {isAuth && (
                <Button onClick={this.handleSignOut} variant="outline" className="w-full">
                  Sign Out
                </Button>
              )}

              <Button onClick={this.handleReload} variant="ghost" className="w-full">
                Reload Page
              </Button>
            </div>

            {isAuth && (
              <p className="text-sm text-muted-foreground text-center">
                If this problem persists, please contact support.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}
