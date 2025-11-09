"use client";

import React, { type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching authentication errors
 *
 * Wraps child components and catches errors, displaying a fallback UI
 * or custom error handler. Useful for protecting critical parts of
 * your app (like auth sections) from crashing.
 *
 * Example:
 * ```tsx
 * <AuthErrorBoundary
 *   showDetails={isDevelopment}
 *   onError={(error, info) => console.error("Auth error:", error)}
 * >
 *   <ProtectedComponent />
 * </AuthErrorBoundary>
 * ```
 */
export class AuthErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("AuthErrorBoundary caught an error:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, showDetails = false } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.resetError);
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-red-900">Something went wrong</h2>
            <p className="mb-4 text-sm text-red-700">An unexpected error occurred. Please try refreshing the page.</p>

            {showDetails && (
              <div className="mb-4 overflow-auto rounded bg-red-100 p-3">
                <p className="text-xs font-mono text-red-900">{error.message}</p>
                {error.stack && <pre className="mt-2 text-xs text-red-700">{error.stack}</pre>}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={this.resetError}
                className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="flex-1 rounded border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
