/**
 * Configuration for setting up Better Convex Auth
 */
export interface SetupAuthConfig {
  /**
   * Convex deployment URL
   * @example "https://your-deployment.convex.cloud"
   */
  convexUrl: string;

  /**
   * Base URL of your application (for redirects)
   * @example "https://myapp.com" or "http://localhost:3000"
   */
  baseURL: string;

  /**
   * Storage prefix for auth tokens (optional)
   * @default "convex"
   */
  storagePrefix?: string;

  /**
   * Whether to expect auth to be initialized before use
   * Set to true if you want to ensure auth is ready before rendering
   * @default false
   */
  expectAuth?: boolean;
}

/**
 * Result of setupAuth() containing everything you need for auth
 */
export interface SetupAuthResult {
  /**
   * Better Auth client instance
   */
  authClient: ReturnType<typeof import("@auth/web").createAuthClient>;

  /**
   * React provider component to wrap your app
   */
  AuthProvider: ReturnType<typeof import("@auth/web").createAuthProvider>;

  /**
   * React hooks for authentication
   */
  hooks: {
    useAuth: typeof import("@auth/web").useAuth;
    useSession: typeof import("@auth/web").useSession;
    useUser: typeof import("@auth/web").useUser;
    useSignIn: typeof import("@auth/web").useSignIn;
    useSignUp: typeof import("@auth/web").useSignUp;
    useSignOut: typeof import("@auth/web").useSignOut;
    useAuthClient: typeof import("@auth/web").useAuthClient;
  };

  /**
   * Pre-built UI components
   */
  components: {
    Forms: {
      SignInForm: typeof import("@auth/ui/forms").SignInForm;
      SignUpForm: typeof import("@auth/ui/forms").SignUpForm;
      UpdateProfileForm: typeof import("@auth/ui/forms").UpdateProfileForm;
      ChangePasswordForm: typeof import("@auth/ui/forms").ChangePasswordForm;
      ForgotPasswordForm: typeof import("@auth/ui/forms").ForgotPasswordForm;
      ResetPasswordForm: typeof import("@auth/ui/forms").ResetPasswordForm;
    };
    Guards: {
      SessionGuard: typeof import("@auth/ui/guards").SessionGuard;
      RoleGuard: typeof import("@auth/ui/guards").RoleGuard;
      EmailVerifiedGuard: typeof import("@auth/ui/guards").EmailVerifiedGuard;
    };
    Display: {
      UserAvatar: typeof import("@auth/ui/display").UserAvatar;
      UserBadge: typeof import("@auth/ui/display").UserBadge;
      UserMenu: typeof import("@auth/ui/display").UserMenu;
    };
    Actions: {
      SocialAuthButtons: typeof import("@auth/ui/actions").SocialAuthButtons;
      SignOutButton: typeof import("@auth/ui/actions").SignOutButton;
    };
    Feedback: {
      PasswordStrengthIndicator: typeof import("@auth/ui/feedback").PasswordStrengthIndicator;
    };
    Utils: {
      OAuthRedirectHandler: typeof import("@auth/ui").OAuthRedirectHandler;
    };
  };

  /**
   * Higher-order components for route protection
   */
  hocs: {
    withAuth: typeof import("@auth/web").withAuth;
    withSession: typeof import("@auth/web").withSession;
    withEmailVerified: typeof import("@auth/web").withEmailVerified;
  };

  /**
   * Convenience exports of commonly used items
   */
  useAuth: typeof import("@auth/web").useAuth;
  useSession: typeof import("@auth/web").useSession;
  useUser: typeof import("@auth/web").useUser;
  useSignIn: typeof import("@auth/web").useSignIn;
  useSignUp: typeof import("@auth/web").useSignUp;
  useSignOut: typeof import("@auth/web").useSignOut;
  useAuthClient: typeof import("@auth/web").useAuthClient;
  withAuth: typeof import("@auth/web").withAuth;
  withSession: typeof import("@auth/web").withSession;
  withEmailVerified: typeof import("@auth/web").withEmailVerified;
}
