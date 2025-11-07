/**
 * UserAvatar Component
 *
 * User avatar component with image and fallback initials.
 *
 * @module
 */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { User } from "lucide-react";

/**
 * Props for UserAvatar component
 */
export interface UserAvatarProps {
  /**
   * User's name
   */
  name?: string | null;

  /**
   * User's email (used for fallback if name not available)
   */
  email?: string | null;

  /**
   * Avatar image URL
   */
  image?: string | null;

  /**
   * Avatar size
   * @default "default"
   */
  size?: "sm" | "default" | "lg" | "xl";

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Get initials from name or email
 */
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (email) {
    return email.substring(0, 2).toUpperCase();
  }

  return "U";
}

/**
 * Size class mappings
 */
const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

/**
 * User avatar component with image and fallback.
 *
 * Features:
 * - Image with fallback to initials
 * - Multiple size options
 * - Automatic initials generation
 * - Accessible alt text
 *
 * @example Basic usage
 * ```tsx
 * <UserAvatar
 *   name="John Doe"
 *   email="john@example.com"
 *   image="https://example.com/avatar.jpg"
 * />
 * ```
 *
 * @example Different sizes
 * ```tsx
 * <UserAvatar name="John Doe" size="sm" />
 * <UserAvatar name="John Doe" size="lg" />
 * <UserAvatar name="John Doe" size="xl" />
 * ```
 *
 * @example Without image
 * ```tsx
 * <UserAvatar name="John Doe" email="john@example.com" />
 * ```
 *
 * @param props - Component props
 * @returns User avatar component
 * @public
 */
export function UserAvatar({ name, email, image, size = "default", className }: UserAvatarProps) {
  const initials = getInitials(name, email);
  const alt = name || email || "User avatar";

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      {image && <AvatarImage src={image} alt={alt} />}
      <AvatarFallback>{initials !== "U" ? initials : <User className="h-1/2 w-1/2" />}</AvatarFallback>
    </Avatar>
  );
}
