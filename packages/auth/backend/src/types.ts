/**
 * Configuration options for creating a Convex Auth Backend
 */
export interface ConvexAuthBackendConfig {
  /**
   * Convex Better Auth adapter
   * Created using components.betterAuth.adapter(ctx)
   */
  adapter: unknown;

  /**
   * Base URL of the site (for OAuth callbacks, etc.)
   * Example: "https://myapp.com" or "http://localhost:3000"
   */
  baseURL: string;

  /**
   * Trusted origins for CORS (optional)
   * Defaults to [baseURL]
   */
  trustedOrigins?: string[];

  /**
   * Email/password authentication configuration
   */
  emailPassword?: {
    /** Enable email/password auth */
    enabled: boolean;
    /** Require email verification before allowing sign in */
    requireEmailVerification?: boolean;
    /** Minimum password length */
    minPasswordLength?: number;
    /** Maximum password length */
    maxPasswordLength?: number;
    /** Auto sign in after successful registration */
    autoSignIn?: boolean;
    /** Disable new user registrations */
    disableSignUp?: boolean;
  };

  /**
   * Social OAuth provider configuration
   */
  socialProviders?: {
    google?: {
      clientId: string;
      clientSecret: string;
    };
    github?: {
      clientId: string;
      clientSecret: string;
    };
    apple?: {
      clientId: string;
      clientSecret: string;
    };
    discord?: {
      clientId: string;
      clientSecret: string;
    };
  };

  /**
   * Email verification configuration
   */
  emailVerification?: {
    /** Resend client for sending verification emails */
    resend: unknown;
    /** Email sender address and name */
    from: {
      email: string;
      name: string;
    };
    /** Custom email template (optional) */
    template?: {
      subject?: string;
      html?: (params: EmailTemplateParams) => string;
      text?: (params: EmailTemplateParams) => string;
    };
    /** Send verification email on sign up */
    sendOnSignUp?: boolean;
    /** Auto sign in after email verification */
    autoSignInAfterVerification?: boolean;
    /** Token expiry in seconds */
    expiresIn?: number;
  };

  /**
   * Session configuration
   */
  session?: {
    /** Session expiry in seconds (default: 7 days) */
    expiresIn?: number;
    /** Session update age in seconds (default: 1 day) */
    updateAge?: number;
  };

  /**
   * Rate limiting configuration
   */
  rateLimit?: {
    /** Enable rate limiting */
    enabled: boolean;
    /** Time window in seconds */
    window?: number;
    /** Max requests per window */
    max?: number;
  };

  /**
   * Development mode flag
   * When true, disables email verification and enables test mode
   */
  isDevelopment?: boolean;
}

/**
 * Result of creating a Convex Auth Backend
 */
export interface ConvexAuthBackendResult {
  /**
   * Better Auth instance configured for Convex
   */
  auth: unknown;

  /**
   * Configuration used to create the auth instance
   */
  config: ConvexAuthBackendConfig;
}

/**
 * Email template parameters
 */
export interface EmailTemplateParams {
  user: {
    email: string;
    name?: string;
  };
  url: string;
}

/**
 * Default email templates
 */
export interface EmailTemplates {
  verification: {
    subject: string;
    html: (params: EmailTemplateParams) => string;
    text: (params: EmailTemplateParams) => string;
  };
  passwordReset: {
    subject: string;
    html: (params: EmailTemplateParams) => string;
    text: (params: EmailTemplateParams) => string;
  };
  magicLink: {
    subject: string;
    html: (params: EmailTemplateParams) => string;
    text: (params: EmailTemplateParams) => string;
  };
}
