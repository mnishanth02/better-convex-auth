/**
 * SignInForm Component
 *
 * Pre-built sign-in form with email/password and social authentication.
 *
 * @module
 */

"use client";

import { EmailSchema } from "@auth/utils";
import { useSignIn } from "@auth/web";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SocialAuthButtons } from "../actions/social-auth-buttons";

/**
 * Sign-in form validation schema
 */
const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

/**
 * Props for SignInForm component
 */
export interface SignInFormProps {
  /**
   * URL to redirect to after successful sign-in
   * @default "/dashboard"
   */
  redirectTo?: string;

  /**
   * Callback after successful sign-in
   */
  onSuccess?: () => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;

  /**
   * Show social authentication buttons
   * @default true
   */
  showSocialAuth?: boolean;

  /**
   * OAuth providers to show
   * @default ["google"]
   */
  socialProviders?: Array<"github" | "google" | "apple" | "facebook">;

  /**
   * Custom card title
   * @default "Sign In"
   */
  title?: string;

  /**
   * Custom card description
   * @default "Enter your credentials to access your account"
   */
  description?: string;

  /**
   * Show "Sign up" link
   * @default true
   */
  showSignUpLink?: boolean;

  /**
   * Sign up page URL
   * @default "/signup"
   */
  signUpUrl?: string;

  /**
   * Show "Forgot password" link
   * @default true
   */
  showForgotPasswordLink?: boolean;

  /**
   * Forgot password page URL
   * @default "/forgot-password"
   */
  forgotPasswordUrl?: string;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Pre-built sign-in form component with email/password and social auth.
 *
 * Features:
 * - Email and password validation
 * - Social OAuth (GitHub, Google, Apple)
 * - Loading states
 * - Error handling
 * - Customizable styling
 * - Responsive design
 *
 * @example Basic usage
 * ```tsx
 * <SignInForm redirectTo="/dashboard" />
 * ```
 *
 * @example With social auth
 * ```tsx
 * <SignInForm
 *   showSocialAuth={true}
 *   socialProviders={["github", "google"]}
 *   redirectTo="/app"
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <SignInForm
 *   className="max-w-md mx-auto"
 *   title="Welcome Back"
 *   description="Sign in to continue"
 * />
 * ```
 *
 * @param props - Component props
 * @returns Sign-in form component
 * @public
 */
export function SignInForm({
  redirectTo = "/dashboard",
  onSuccess,
  onError,
  showSocialAuth = true,
  socialProviders = ["google"],
  title = "Sign In",
  description = "Enter your credentials to access your account",
  showSignUpLink = true,
  signUpUrl = "/signup",
  showForgotPasswordLink = true,
  forgotPasswordUrl = "/forgot-password",
  className,
}: SignInFormProps) {
  const router = useRouter();
  const { signInEmail, isLoading, error: signInError } = useSignIn();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError(null);
      await signInEmail(data);
      onSuccess?.();
      router.push(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  const displayError = error || signInError?.message;

  return (
    <Card className={className}>
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayError && (
          <Alert variant="destructive">
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        {showSocialAuth && (
          <>
            <SocialAuthButtons providers={socialProviders} redirectTo={redirectTo} variant="outline" size="default" />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="thezealerzone@gmail.com"
              {...register("email")}
              disabled={isLoading}
              className="h-11"
            />
            {errors.email && <p className="text-sm text-destructive mt-1.5">{errors.email.message}</p>}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              {showForgotPasswordLink && (
                <a
                  href={forgotPasswordUrl}
                  className="text-sm font-medium text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              {...register("password")}
              disabled={isLoading}
              className="h-11"
            />
            {errors.password && <p className="text-sm text-destructive mt-1.5">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      {showSignUpLink && (
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href={signUpUrl} className="text-primary hover:underline font-semibold transition-colors">
              Sign up
            </a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
