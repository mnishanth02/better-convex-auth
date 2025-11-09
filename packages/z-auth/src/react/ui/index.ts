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
export {
  UserAvatar,
  type UserAvatarProps,
  UserBadge,
  type UserBadgeProps,
  UserMenu,
  type UserMenuProps,
} from "./display";
// Error Boundary
export { AuthErrorBoundary, type AuthErrorBoundaryProps } from "./error-boundary";
// Feedback
export {
  PasswordStrengthIndicator,
  type PasswordStrengthIndicatorProps,
} from "./feedback";
// Forms
export {
  ChangePasswordForm,
  type ChangePasswordFormProps,
  ForgotPasswordForm,
  type ForgotPasswordFormProps,
  ResetPasswordForm,
  type ResetPasswordFormProps,
  SignInForm,
  type SignInFormProps,
  SignUpForm,
  type SignUpFormProps,
  UpdateProfileForm,
  type UpdateProfileFormProps,
} from "./forms";
// Guards
export {
  EmailVerifiedGuard,
  type EmailVerifiedGuardProps,
  RoleGuard,
  type RoleGuardProps,
  SessionGuard,
  type SessionGuardProps,
} from "./guards";
// Utils
export { OAuthRedirectHandler, type OAuthRedirectHandlerProps } from "./utils/oauth-redirect-handler";
