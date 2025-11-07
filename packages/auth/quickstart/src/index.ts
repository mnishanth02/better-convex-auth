// Main exports

// Re-export all components for direct import if needed
export {
  PasswordStrengthIndicator,
  SessionGuard,
  SignInForm,
  SignOutButton,
  SignUpForm,
  SocialAuthButtons,
  UserAvatar,
} from "@auth/ui";
// Re-export all hooks for direct import if needed
// Re-export HOCs for direct import if needed
export {
  useAuth,
  useAuthClient,
  useSession,
  useSignIn,
  useSignOut,
  useSignUp,
  useUser,
  withAuth,
  withEmailVerified,
  withSession,
} from "@auth/web";
export { setupAuth } from "./setup-auth";
export type { SetupAuthHeadlessResult } from "./setup-auth-headless";
export { setupAuthHeadless } from "./setup-auth-headless";
export { setupAuthUI } from "./setup-auth-ui";
// Types
export type {
  SetupAuthConfig,
  SetupAuthResult,
} from "./types";
