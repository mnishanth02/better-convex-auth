"use client";

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for the application.
 * Catches and handles React rendering errors gracefully.
 *
 * @see https://nextjs.org/docs/building-your-application/routing/error-handling
 */
export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry, LogRocket)
    console.error("Application error:", error);

    // TODO: Send to error monitoring service
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription>An unexpected error occurred</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              <code className="text-xs bg-destructive/10 p-2 rounded block overflow-x-auto">
                {error.message || "Unknown error"}
              </code>
            </AlertDescription>
          </Alert>

          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1.5 py-0.5 rounded">{error.digest}</code>
            </p>
          )}

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">What you can do:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Try refreshing the page</li>
              <li>Clear your browser cache</li>
              <li>Check your internet connection</li>
              <li>If the problem persists, contact support</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button onClick={reset} className="flex-1" variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            variant="outline"
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
