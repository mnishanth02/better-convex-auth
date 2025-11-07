/**
 * SocialAuthButtons Component
 *
 * Pre-built social OAuth authentication buttons.
 *
 * @module
 */

"use client";

import { useAuth } from "@auth/web";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

/**
 * Props for SocialAuthButtons component
 */
export interface SocialAuthButtonsProps {
  /**
   * OAuth providers to show
   * @default ["github"]
   */
  providers?: Array<"github" | "google" | "apple">;

  /**
   * URL to redirect to after successful authentication
   */
  redirectTo?: string;

  /**
   * Button variant
   * @default "outline"
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

  /**
   * Button size
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

  /**
   * Display mode: "vertical" or "horizontal"
   * @default "vertical"
   */
  mode?: "vertical" | "horizontal";

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Provider configuration
 */
const providerConfig = {
  github: {
    name: "GitHub",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  google: {
    name: "Google",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  apple: {
    name: "Apple",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
};

/**
 * Social OAuth authentication buttons component.
 *
 * Features:
 * - Support for GitHub, Google, and Apple OAuth
 * - Customizable button styles
 * - Loading states
 * - Error handling
 * - Vertical or horizontal layout
 *
 * @example Basic usage
 * ```tsx
 * <SocialAuthButtons providers={["github", "google"]} />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <SocialAuthButtons
 *   providers={["github", "google", "apple"]}
 *   mode="horizontal"
 *   variant="default"
 *   size="lg"
 * />
 * ```
 *
 * @param props - Component props
 * @returns Social auth buttons component
 * @public
 */
export function SocialAuthButtons({
  providers = ["github"],
  redirectTo,
  variant = "outline",
  size = "default",
  mode = "vertical",
  className,
}: SocialAuthButtonsProps) {
  const auth = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: "github" | "google" | "apple") => {
    try {
      setLoadingProvider(provider);
      setError(null);
      await auth.signIn.social({
        provider,
        callbackURL: redirectTo,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to sign in with ${providerConfig[provider].name}`);
    } finally {
      setLoadingProvider(null);
    }
  };

  const containerClass =
    mode === "horizontal" ? `flex flex-row gap-2 ${className || ""}` : `flex flex-col gap-2 ${className || ""}`;

  return (
    <div className={containerClass}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {providers.map((provider) => {
        const config = providerConfig[provider];
        const isLoading = loadingProvider === provider;

        return (
          <Button
            key={provider}
            variant={variant}
            size={size}
            onClick={() => handleSocialSignIn(provider)}
            disabled={loadingProvider !== null}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {config.icon}
                Continue with {config.name}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
