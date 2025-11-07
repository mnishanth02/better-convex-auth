/**
 * UpdateProfileForm Component
 *
 * Pre-built form for authenticated users to update their profile information.
 *
 * @module
 */

"use client";

import { useUser } from "@auth/web";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Update profile form validation schema
 */
const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;

/**
 * Props for UpdateProfileForm component
 */
export interface UpdateProfileFormProps {
  /**
   * Callback after successful profile update
   */
  onSuccess?: () => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;

  /**
   * Custom card title
   * @default "Update Profile"
   */
  title?: string;

  /**
   * Custom card description
   * @default "Update your account information"
   */
  description?: string;

  /**
   * Success message to display
   * @default "Profile updated successfully"
   */
  successMessage?: string;

  /**
   * Show bio field
   * @default false
   */
  showBio?: boolean;

  /**
   * Show image/avatar field
   * @default true
   */
  showImage?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Custom API endpoint for profile update
   * @default "/api/auth/update-profile"
   */
  apiEndpoint?: string;
}

/**
 * Pre-built profile update form component for authenticated users.
 *
 * Features:
 * - Auto-populated with current user data
 * - Email, name, image, and bio fields
 * - Loading states
 * - Success/error feedback
 * - Customizable styling
 * - Responsive design
 *
 * @example Basic usage
 * ```tsx
 * <UpdateProfileForm />
 * ```
 *
 * @example With callbacks
 * ```tsx
 * <UpdateProfileForm
 *   onSuccess={() => toast.success("Profile updated!")}
 *   showBio={true}
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <UpdateProfileForm
 *   className="max-w-2xl"
 *   title="Account Settings"
 *   showBio={true}
 *   showImage={true}
 * />
 * ```
 *
 * @param props - Component props
 * @returns Update profile form component
 * @public
 */
export function UpdateProfileForm({
  onSuccess,
  onError,
  title = "Update Profile",
  description = "Update your account information",
  successMessage = "Profile updated successfully",
  showBio = false,
  showImage = true,
  className,
  apiEndpoint = "/api/auth/update-profile",
}: UpdateProfileFormProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || "",
      bio: "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(apiEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      setSuccess(true);
      onSuccess?.();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              {...register("name")}
              disabled={isLoading}
              autoComplete="name"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            <p className="text-xs text-muted-foreground">
              Changing your email may require verification before it takes effect.
            </p>
          </div>

          {showImage && (
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...register("image")}
                disabled={isLoading}
              />
              {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
            </div>
          )}

          {showBio && (
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                {...register("bio")}
                disabled={isLoading}
                rows={4}
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || !isDirty}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
