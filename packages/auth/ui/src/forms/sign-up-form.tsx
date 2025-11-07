/**
 * SignUpForm Component
 *
 * Pre-built sign-up form with email/password registration and social authentication.
 *
 * @module
 */

"use client";

import { EmailSchema, PasswordSchema } from "@auth/utils";
import { useSession, useSignUp } from "@auth/web";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SocialAuthButtons } from "../actions/social-auth-buttons";
import { PasswordStrengthIndicator } from "../feedback/password-strength-indicator";

/**
 * Sign-up form validation schema
 */
const SignUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof SignUpSchema>;

/**
 * Props for SignUpForm component
 */
export interface SignUpFormProps {
  /**
   * URL to redirect to after successful sign-up
   * @default "/dashboard"
   */
  redirectTo?: string;

  /**
   * Callback after successful sign-up
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
   * @default "Create Account"
   */
  title?: string;

  /**
   * Custom card description
   * @default "Enter your information to create an account"
   */
  description?: string;

  /**
   * Show "Sign in" link
   * @default true
   */
  showSignInLink?: boolean;

  /**
   * Sign in page URL
   * @default "/login"
   */
  signInUrl?: string;

  /**
   * Show password strength indicator
   * @default true
   */
  showPasswordStrength?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Pre-built sign-up form component with email/password registration and social auth.
 *
 * Features:
 * - Name, email, password, and confirm password fields
 * - Password strength indicator
 * - Social OAuth (GitHub, Google, Apple)
 * - Loading states
 * - Error handling
 * - Customizable styling
 * - Responsive design
 *
 * @example Basic usage
 * ```tsx
 * <SignUpForm redirectTo="/dashboard" />
 * ```
 *
 * @example With social auth
 * ```tsx
 * <SignUpForm
 *   showSocialAuth={true}
 *   socialProviders={["github", "google"]}
 *   redirectTo="/app"
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <SignUpForm
 *   className="max-w-md mx-auto"
 *   title="Join Us"
 *   description="Create your account to get started"
 * />
 * ```
 *
 * @param props - Component props
 * @returns Sign-up form component
 * @public
 */
export function SignUpForm({
  redirectTo = "/dashboard",
  onSuccess,
  onError,
  showSocialAuth = true,
  socialProviders = ["google"],
  title = "Create Account",
  description = "Enter your information to create an account",
  showSignInLink = true,
  signInUrl = "/login",
  showPasswordStrength = true,
  className,
}: SignUpFormProps) {
  const router = useRouter();
  const { signUpEmail, isLoading, error: signUpError } = useSignUp();
  const { data: sessionData, isPending: isSessionLoading } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const password = watch("password");

  // Monitor session for redirect after successful sign-up (both email and OAuth)
  useEffect(() => {
    if (pendingRedirect && sessionData && !isSessionLoading) {
      setPendingRedirect(false);
      onSuccess?.();
      router.push(redirectTo);
    }
  }, [sessionData, isSessionLoading, redirectTo, onSuccess, pendingRedirect, router]);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError(null);
      setPendingRedirect(true);
      await signUpEmail({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      // Don't redirect here - wait for session to be established via useEffect
    } catch (err) {
      setPendingRedirect(false);
      const errorMessage = err instanceof Error ? err.message : "Sign up failed";
      const userFriendlyMessage = formatSignUpError(errorMessage);
      setError(userFriendlyMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  /**
   * Format backend error messages to be more user-friendly
   */
  function formatSignUpError(error: string): string {
    const errorLowercase = error.toLowerCase();

    // Map backend errors to user-friendly messages
    if (
      errorLowercase.includes("signup disabled") ||
      errorLowercase.includes("sign up is not enabled") ||
      errorLowercase.includes("email_and_password_sign_up_is_not_enabled")
    ) {
      return "Sign up is currently disabled. Please contact support for more information.";
    }

    if (errorLowercase.includes("already exists")) {
      return "An account with this email already exists. Please sign in instead.";
    }

    if (errorLowercase.includes("invalid email")) {
      return "Please enter a valid email address.";
    }

    if (errorLowercase.includes("password")) {
      return "Password does not meet security requirements. Please try again.";
    }

    if (errorLowercase.includes("rate limit") || errorLowercase.includes("too many")) {
      return "Too many sign up attempts. Please try again later.";
    }

    // Default message for unknown errors
    return error;
  }

  const displayError = error || signUpError?.message;

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
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              disabled={isLoading}
              className="h-11"
            />
            {errors.name && <p className="text-sm text-destructive mt-1.5">{errors.name.message}</p>}
          </div>

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
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              {...register("password")}
              disabled={isLoading}
              className="h-11"
            />
            {showPasswordStrength && password && (
              <div className="mt-3">
                <PasswordStrengthIndicator password={password} />
              </div>
            )}
            {errors.password && <p className="text-sm text-destructive mt-1.5">{errors.password.message}</p>}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
              className="h-11"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>

      {showSignInLink && (
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href={signInUrl} className="text-primary hover:underline font-semibold transition-colors">
              Sign in
            </a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
