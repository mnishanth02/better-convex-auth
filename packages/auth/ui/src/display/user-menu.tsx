/**
 * UserMenu Component
 *
 * Dropdown menu with user actions (profile, settings, sign out).
 *
 * @module
 */

"use client";

import { useSignOut, useUser } from "@auth/web";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";

/**
 * Props for UserMenu component
 */
export interface UserMenuProps {
  /**
   * Profile page URL
   * @default "/profile"
   */
  profileUrl?: string;

  /**
   * Settings page URL
   * @default "/settings"
   */
  settingsUrl?: string;

  /**
   * URL to redirect to after sign out
   * @default "/login"
   */
  signOutRedirectTo?: string;

  /**
   * Show profile menu item
   * @default true
   */
  showProfile?: boolean;

  /**
   * Show settings menu item
   * @default true
   */
  showSettings?: boolean;

  /**
   * Custom menu items to add before sign out
   */
  customItems?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }>;

  /**
   * Avatar size
   * @default "default"
   */
  avatarSize?: "sm" | "default" | "lg";

  /**
   * Additional CSS class for trigger button
   */
  className?: string;

  /**
   * Callback after sign out
   */
  onSignOut?: () => void;
}

/**
 * Dropdown menu component with user actions.
 *
 * Features:
 * - User avatar trigger
 * - Profile and settings links
 * - Sign out action
 * - Custom menu items
 * - Keyboard navigation
 *
 * @example Basic usage
 * ```tsx
 * <UserMenu />
 * ```
 *
 * @example Custom URLs
 * ```tsx
 * <UserMenu
 *   profileUrl="/account/profile"
 *   settingsUrl="/account/settings"
 *   signOutRedirectTo="/goodbye"
 * />
 * ```
 *
 * @example With custom items
 * ```tsx
 * <UserMenu
 *   customItems={[
 *     { label: "Billing", href: "/billing", icon: CreditCard },
 *     { label: "Support", onClick: openSupport, icon: HelpCircle }
 *   ]}
 * />
 * ```
 *
 * @example Without some default items
 * ```tsx
 * <UserMenu showProfile={false} showSettings={false} />
 * ```
 *
 * @param props - Component props
 * @returns User menu component
 * @public
 */
export function UserMenu({
  profileUrl = "/profile",
  settingsUrl = "/settings",
  signOutRedirectTo = "/login",
  showProfile = true,
  showSettings = true,
  customItems = [],
  avatarSize = "default",
  className,
  onSignOut,
}: UserMenuProps) {
  const { user } = useUser();
  const { signOut } = useSignOut();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    onSignOut?.();
    router.push(signOutRedirectTo);
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        <button type="button" className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
          <UserAvatar name={user.name} email={user.email} image={user.image} size={avatarSize} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {showProfile && (
          <DropdownMenuItem onClick={() => router.push(profileUrl)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        )}
        {showSettings && (
          <DropdownMenuItem onClick={() => router.push(settingsUrl)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        )}
        {customItems.length > 0 &&
          customItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={`${item.label}-${index}`}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.href) {
                    router.push(item.href);
                  }
                }}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {item.label}
              </DropdownMenuItem>
            );
          })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
