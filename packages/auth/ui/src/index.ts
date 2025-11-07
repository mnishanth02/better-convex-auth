/**
 * Better Convex Auth UI Components
 *
 * Pre-built, customizable UI components for authentication flows.
 * Works seamlessly with @auth/web and Better Auth.
 *
 * @packageDocumentation
 */

// Actions & Buttons
export { SignOutButton, type SignOutButtonProps, SocialAuthButtons, type SocialAuthButtonsProps } from "./actions";
// Display
export { UserAvatar, type UserAvatarProps } from "./display";
// Feedback
export {
  PasswordStrengthIndicator,
  type PasswordStrengthIndicatorProps,
} from "./feedback";
// Forms
export { SignInForm, type SignInFormProps, SignUpForm, type SignUpFormProps } from "./forms";
// Guards
export { SessionGuard, type SessionGuardProps } from "./guards";

/**
 * Package version
 */
export const VERSION = "0.1.0";

/**
 * Package name
 */
export const PACKAGE_NAME = "@auth/ui";
