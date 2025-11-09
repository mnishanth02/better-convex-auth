/**
 * UserBadge Component
 *
 * Display badge showing user role or status.
 *
 * @module
 */

"use client";

import { Badge } from "@workspace/ui/components/badge";
import { CheckCircle2, Mail, Shield, ShieldAlert, ShieldCheck, User } from "lucide-react";
import type { ComponentProps } from "react";
import type { UserRole } from "../../../types";

/**
 * Props for UserBadge component
 */
export interface UserBadgeProps extends Omit<ComponentProps<typeof Badge>, "children"> {
  /**
   * Type of badge to display
   */
  type: "role" | "emailVerified" | "status";

  /**
   * User role (required if type is "role")
   */
  role?: UserRole;

  /**
   * Email verified status (required if type is "emailVerified")
   */
  emailVerified?: boolean;

  /**
   * Custom status text (required if type is "status")
   */
  status?: string;

  /**
   * Show icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Custom label text (overrides default)
   */
  label?: string;
}

/**
 * Get badge configuration based on role
 */
function getRoleBadgeConfig(role: UserRole) {
  const configs = {
    admin: {
      label: "Admin",
      variant: "destructive" as const,
      icon: ShieldAlert,
    },
    user: {
      label: "User",
      variant: "secondary" as const,
      icon: User,
    },
    moderator: {
      label: "Moderator",
      variant: "default" as const,
      icon: Shield,
    },
    premium: {
      label: "Premium",
      variant: "default" as const,
      icon: ShieldCheck,
    },
  };

  return configs[role] || configs.user;
}

/**
 * Badge component for displaying user roles, status, and email verification.
 *
 * Features:
 * - Multiple badge types (role, email verified, custom status)
 * - Pre-configured styling for common roles
 * - Optional icons
 * - Customizable variants
 *
 * @example Role badge
 * ```tsx
 * <UserBadge type="role" role="admin" />
 * ```
 *
 * @example Email verified badge
 * ```tsx
 * <UserBadge type="emailVerified" emailVerified={true} />
 * ```
 *
 * @example Custom status badge
 * ```tsx
 * <UserBadge type="status" status="Active" variant="default" />
 * ```
 *
 * @example Without icon
 * ```tsx
 * <UserBadge type="role" role="moderator" showIcon={false} />
 * ```
 *
 * @example Custom label
 * ```tsx
 * <UserBadge type="role" role="admin" label="Administrator" />
 * ```
 *
 * @param props - Component props
 * @returns User badge component
 * @public
 */
export function UserBadge({
  type,
  role,
  emailVerified,
  status,
  showIcon = true,
  label,
  variant,
  className,
  ...props
}: UserBadgeProps) {
  let badgeLabel = label;
  let badgeVariant = variant;
  let Icon: typeof User | null = null;

  if (type === "role" && role) {
    const config = getRoleBadgeConfig(role);
    badgeLabel = label || config.label;
    badgeVariant = variant || config.variant;
    Icon = config.icon;
  } else if (type === "emailVerified") {
    badgeLabel = label || (emailVerified ? "Verified" : "Unverified");
    badgeVariant = variant || (emailVerified ? "default" : "secondary");
    Icon = emailVerified ? CheckCircle2 : Mail;
  } else if (type === "status") {
    badgeLabel = label || status || "Unknown";
    badgeVariant = variant || "secondary";
  }

  return (
    <Badge variant={badgeVariant} className={className} {...props}>
      {showIcon && Icon && <Icon className="h-3 w-3 mr-1" />}
      {badgeLabel}
    </Badge>
  );
}
