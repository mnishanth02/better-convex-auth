"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertCircle } from "lucide-react";

interface AuthErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * Default error fallback UI for authentication errors
 *
 * Displays a user-friendly error message with recovery options
 */
export function AuthErrorFallback({ error, reset }: AuthErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription>We encountered an issue with your authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{error.message || "An unexpected error occurred"}</p>

          <div className="flex flex-col gap-2">
            <Button onClick={reset} variant="default" className="w-full">
              Try Again
            </Button>
            <Button
              onClick={() => {
                window.location.href = "/";
              }}
              variant="outline"
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
