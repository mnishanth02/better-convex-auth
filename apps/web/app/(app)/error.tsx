"use client";

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for authenticated app routes.
 * Provides context-aware error handling for the dashboard and protected pages.
 */
export default function AppError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error with app context
    console.error("App route error:", error);

    // TODO: Send to error monitoring with user context
    // Example: Sentry.captureException(error, { tags: { section: 'app' } });
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
              <CardDescription>An error occurred while loading this page</CardDescription>
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

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              This error occurred in the application dashboard. Your authentication session is still valid.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button onClick={reset} className="flex-1" variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={() => router.push("/app/dashboard")} variant="outline" className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
