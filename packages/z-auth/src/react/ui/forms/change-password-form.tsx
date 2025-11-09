/**
 * ChangePasswordForm Component
 *
 * Pre-built form for authenticated users to change their password.
 *
 * @module
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordSchema } from "../../../utils";
import { PasswordStrengthIndicator } from "../feedback/password-strength-indicator";

/**
 * Change password form validation schema
 */
const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

/**
 * Props for ChangePasswordForm component
 */
export interface ChangePasswordFormProps {
  /**
   * Callback after successful password change
   */
  onSuccess?: () => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;

  /**
   * Custom card title
   * @default "Change Password"
   */
  title?: string;

  /**
   * Custom card description
   * @default "Update your account password"
   */
  description?: string;

  /**
   * Show password strength indicator
   * @default true
   */
  showPasswordStrength?: boolean;

  /**
   * Success message to display
   * @default "Password changed successfully"
   */
  successMessage?: string;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Custom API endpoint for password change
   * @default "/api/auth/change-password"
   */
  apiEndpoint?: string;
}

/**
 * Pre-built change password form component for authenticated users.
 *
 * Features:
 * - Current password verification
 * - New password validation and strength indicator
 * - Confirm password matching
 * - Prevents reusing current password
 * - Loading states
 * - Success/error feedback
 * - Customizable styling
 * - Responsive design
 *
 * @example Basic usage
 * ```tsx
 * <ChangePasswordForm />
 * ```
 *
 * @example With callbacks
 * ```tsx
 * <ChangePasswordForm
 *   onSuccess={() => toast.success("Password updated!")}
 *   onError={(error) => toast.error(error.message)}
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <ChangePasswordForm
 *   className="max-w-md"
 *   title="Security Settings"
 *   showPasswordStrength={true}
 * />
 * ```
 *
 * @param props - Component props
 * @returns Change password form component
 * @public
 */
export function ChangePasswordForm({
  onSuccess,
  onError,
  title = "Change Password",
  description = "Update your account password",
  showPasswordStrength = true,
  successMessage = "Password changed successfully",
  className,
  apiEndpoint = "/api/auth/change-password",
}: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to change password");
      }

      setSuccess(true);
      reset();
      onSuccess?.();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to change password";
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
        {success && (
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              {...register("currentPassword")}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register("newPassword")}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
            {showPasswordStrength && newPassword && <PasswordStrengthIndicator password={newPassword} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
