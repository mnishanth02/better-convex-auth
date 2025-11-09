/**
 * SignOutButton Component
 *
 * Pre-built sign-out button with optional confirmation dialog.
 *
 * @module
 */

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignOut } from "../..";

/**
 * Props for SignOutButton component
 */
export interface SignOutButtonProps {
  /**
   * URL to redirect to after sign-out
   * @default "/"
   */
  redirectTo?: string;

  /**
   * Show confirmation dialog before signing out
   * @default false
   */
  showConfirmation?: boolean;

  /**
   * Button variant
   * @default "ghost"
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

  /**
   * Button size
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

  /**
   * Show icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Custom button text
   * @default "Sign Out"
   */
  children?: React.ReactNode;

  /**
   * Callback after successful sign-out
   */
  onSuccess?: () => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Sign-out button component with optional confirmation.
 *
 * Features:
 * - Confirmation dialog option
 * - Loading states
 * - Error handling
 * - Automatic redirect
 * - Customizable styling
 *
 * @example Basic usage
 * ```tsx
 * <SignOutButton />
 * ```
 *
 * @example With confirmation
 * ```tsx
 * <SignOutButton showConfirmation={true} redirectTo="/login" />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <SignOutButton variant="destructive" size="sm">
 *   Log Out
 * </SignOutButton>
 * ```
 *
 * @param props - Component props
 * @returns Sign-out button component
 * @public
 */
export function SignOutButton({
  redirectTo = "/",
  showConfirmation = false,
  variant = "ghost",
  size = "default",
  showIcon = true,
  children = "Sign Out",
  onSuccess,
  onError,
  className,
}: SignOutButtonProps) {
  const router = useRouter();
  const { signOut, isLoading } = useSignOut();
  const [showDialog, setShowDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      onSuccess?.();
      router.push(redirectTo);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign out failed");
      onError?.(error);
    }
  };

  const handleClick = () => {
    if (showConfirmation) {
      setShowDialog(true);
    } else {
      handleSignOut();
    }
  };

  return (
    <>
      <Button variant={variant} size={size} onClick={handleClick} disabled={isLoading} className={className}>
        {showIcon && <LogOut className="h-4 w-4" />}
        {children}
      </Button>

      {showConfirmation && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign Out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out? You'll need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut} disabled={isLoading}>
                {isLoading ? "Signing out..." : "Sign Out"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
