/**
 * ForgotPasswordForm Component
 *
 * Pre-built form for requesting password reset emails.
 *
 * @module
 */

"use client";

import { EmailSchema } from "@auth/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Forgot password form validation schema
 */
const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

/**
 * Props for ForgotPasswordForm component
 */
export interface ForgotPasswordFormProps {
  /**
   * Callback after successful password reset request
   */
  onSuccess?: (email: string) => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;

  /**
   * Custom card title
   * @default "Forgot Password"
   */
  title?: string;

  /**
   * Custom card description
   * @default "Enter your email address and we'll send you a password reset link"
   */
  description?: string;

  /**
   * Success message to display
   * @default "Check your email for a password reset link"
   */
  successMessage?: string;

  /**
   * Show "Back to sign in" link
   * @default true
   */
  showSignInLink?: boolean;

  /**
   * Sign in page URL
   * @default "/login"
   */
  signInUrl?: string;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Custom API endpoint for password reset
   * @default "/api/auth/forgot-password"
   */
  apiEndpoint?: string;
}

/**
 * Pre-built forgot password form component.
 *
 * Features:
 * - Email validation
 * - Loading states
 * - Success/error feedback
 * - Customizable styling
 * - Responsive design
 *
 * @example Basic usage
 * ```tsx
 * <ForgotPasswordForm />
 * ```
 *
 * @example With callbacks
 * ```tsx
 * <ForgotPasswordForm
 *   onSuccess={(email) => console.log(`Reset link sent to ${email}`)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <ForgotPasswordForm
 *   className="max-w-md mx-auto"
 *   title="Reset Your Password"
 *   successMessage="Password reset instructions sent!"
 * />
 * ```
 *
 * @param props - Component props
 * @returns Forgot password form component
 * @public
 */
export function ForgotPasswordForm({
  onSuccess,
  onError,
  title = "Forgot Password",
  description = "Enter your email address and we'll send you a password reset link",
  successMessage = "Check your email for a password reset link",
  showSignInLink = true,
  signInUrl = "/login",
  className,
  apiEndpoint = "/api/auth/forgot-password",
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send reset email");
      }

      setSuccess(true);
      onSuccess?.(data.email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>{successMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              We've sent a password reset link to <strong>{getValues("email")}</strong>. Please check your inbox and
              follow the instructions.
            </AlertDescription>
          </Alert>
        </CardContent>
        {showSignInLink && (
          <CardFooter className="flex justify-center">
            <a href={signInUrl} className="text-sm text-primary hover:underline">
              Back to sign in
            </a>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              disabled={isLoading}
              autoFocus
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </CardContent>

      {showSignInLink && (
        <CardFooter className="flex justify-center">
          <a href={signInUrl} className="text-sm text-muted-foreground hover:text-primary">
            Back to sign in
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
