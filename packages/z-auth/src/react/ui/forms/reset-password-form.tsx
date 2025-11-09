/**
 * ResetPasswordForm Component
 *
 * Pre-built form for resetting password with a token.
 *
 * @module
 */

"use client";

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
import { PasswordSchema } from "../../../utils";
import { PasswordStrengthIndicator } from "../feedback/password-strength-indicator";

/**
 * Reset password form validation schema
 */
const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

/**
 * Props for ResetPasswordForm component
 */
export interface ResetPasswordFormProps {
  /**
   * Reset token from URL or email link
   */
  token: string;

  /**
   * URL to redirect to after successful password reset
   * @default "/login"
   */
  redirectTo?: string;

  /**
   * Callback after successful password reset
   */
  onSuccess?: () => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;

  /**
   * Custom card title
   * @default "Reset Password"
   */
  title?: string;

  /**
   * Custom card description
   * @default "Enter your new password"
   */
  description?: string;

  /**
   * Show password strength indicator
   * @default true
   */
  showPasswordStrength?: boolean;

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
   * @default "/api/auth/reset-password"
   */
  apiEndpoint?: string;
}

/**
 * Pre-built password reset form component.
 *
 * Features:
 * - Password validation and strength indicator
 * - Confirm password matching
 * - Token-based authentication
 * - Loading states
 * - Error handling
 * - Customizable styling
 * - Responsive design
 *
 * @example Basic usage
 * ```tsx
 * <ResetPasswordForm token={tokenFromUrl} />
 * ```
 *
 * @example With callbacks
 * ```tsx
 * <ResetPasswordForm
 *   token={tokenFromUrl}
 *   onSuccess={() => toast.success("Password reset successfully")}
 *   redirectTo="/dashboard"
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <ResetPasswordForm
 *   token={tokenFromUrl}
 *   className="max-w-md mx-auto"
 *   title="Create New Password"
 *   showPasswordStrength={true}
 * />
 * ```
 *
 * @param props - Component props
 * @returns Reset password form component
 * @public
 */
export function ResetPasswordForm({
  token,
  redirectTo = "/login",
  onSuccess,
  onError,
  title = "Reset Password",
  description = "Enter your new password",
  showPasswordStrength = true,
  showSignInLink = true,
  signInUrl = "/login",
  className,
  apiEndpoint = "/api/auth/reset-password",
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to reset password");
      }

      onSuccess?.();
      router.push(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

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
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
              autoFocus
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            {showPasswordStrength && password && <PasswordStrengthIndicator password={password} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
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
