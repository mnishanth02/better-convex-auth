# TypeScript Interface Contracts

**Version**: 1.0.0  
**Last Updated**: 2025-11-06

This document defines the TypeScript interfaces that form the contract between authentication packages and consuming applications.

## Package: `@repo/auth-types`

### User Types

```typescript
/**
 * Core user entity representing an authenticated account
 */
export interface User {
  /** Unique user identifier (UUID v4) */
  id: string;
  
  /** User's email address (unique, validated) */
  email: string;
  
  /** Whether email has been verified */
  emailVerified: boolean;
  
  /** User's display name (optional) */
  name: string | null;
  
  /** Profile image URL (optional) */
  image?: string | null;
  
  /** Account creation timestamp (milliseconds since epoch) */
  createdAt: number;
  
  /** Last update timestamp (milliseconds since epoch) */
  updatedAt: number;
}

/**
 * Extended user profile with additional fields
 */
export interface UserProfile extends User {
  /** User biography/description (max 500 chars) */
  bio?: string;
  
  /** Phone number in E.164 format */
  phoneNumber?: string;
}
```

### Session Types

```typescript
/**
 * Active authentication session
 */
export interface Session {
  /** Unique session identifier */
  id: string;
  
  /** User ID this session belongs to */
  userId: string;
  
  /** Session authentication token */
  token: string;
  
  /** Session expiration timestamp (milliseconds since epoch) */
  expiresAt: number;
  
  /** IP address of session creation (optional) */
  ipAddress?: string;
  
  /** User agent string (optional) */
  userAgent?: string;
}

/**
 * Session context including user data
 */
export interface SessionContext {
  /** Current user */
  user: User;
  
  /** Active session */
  session: Session;
  
  /** Whether user is authenticated */
  isAuthenticated: boolean;
}
```

### Authentication Input Types

```typescript
/**
 * Input for user signup
 */
export interface SignUpInput {
  /** Email address */
  email: string;
  
  /** Password (min 8 chars, must contain uppercase, lowercase, and number) */
  password: string;
  
  /** Display name (optional) */
  name?: string;
}

/**
 * Input for user signin
 */
export interface SignInInput {
  /** Email address */
  email: string;
  
  /** Password */
  password: string;
}

/**
 * Input for password reset request
 */
export interface PasswordResetInput {
  /** Email address to send reset link */
  email: string;
}

/**
 * Input for password change
 */
export interface PasswordChangeInput {
  /** Current password */
  currentPassword: string;
  
  /** New password */
  newPassword: string;
  
  /** Confirmation of new password */
  confirmPassword: string;
}
```

### Configuration Types

```typescript
/**
 * Authentication configuration
 */
export interface AuthConfig {
  /** Base URL for auth API endpoints */
  baseURL: string;
  
  /** Session duration in milliseconds (default: 7 days) */
  sessionDuration?: number;
  
  /** Whether to enable password reset flow */
  enablePasswordReset?: boolean;
  
  /** Whether to require email verification before login */
  enableEmailVerification?: boolean;
}
```

### Error Types

```typescript
/**
 * Base authentication error
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public cause?: unknown
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Error codes for authentication failures
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
```

### Platform Abstraction Types

```typescript
/**
 * Storage interface for platform-agnostic storage
 */
export interface IStorage {
  /** Get value by key */
  get(key: string): Promise<string | null>;
  
  /** Set value by key */
  set(key: string, value: string): Promise<void>;
  
  /** Remove value by key */
  remove(key: string): Promise<void>;
  
  /** Clear all values */
  clear(): Promise<void>;
}

/**
 * Cryptography interface for hashing and token generation
 */
export interface ICrypto {
  /** Hash a value (e.g., password) */
  hash(value: string): Promise<string>;
  
  /** Verify value against hash */
  verify(value: string, hash: string): Promise<boolean>;
  
  /** Generate random token */
  generateToken(): string;
}
```

---

## Package: `@repo/auth-core`

### AuthClient Interface

```typescript
/**
 * Core authentication client
 * 
 * @example
 * ```typescript
 * const client = new AuthClient({
 *   baseURL: "http://localhost:3000",
 * });
 * 
 * await client.signIn({ email, password });
 * const user = await client.getUser();
 * ```
 */
export interface IAuthClient {
  /**
   * Sign up a new user
   * 
   * @param input - Signup credentials
   * @returns Session with user data
   * @throws AuthError with code EMAIL_ALREADY_EXISTS if email taken
   * @throws AuthError with code VALIDATION_ERROR if input invalid
   */
  signUp(input: SignUpInput): Promise<Session>;
  
  /**
   * Sign in existing user
   * 
   * @param input - Login credentials
   * @returns Session with user data
   * @throws AuthError with code INVALID_CREDENTIALS if credentials wrong
   * @throws AuthError with code EMAIL_NOT_VERIFIED if email not verified (when enabled)
   */
  signIn(input: SignInInput): Promise<Session>;
  
  /**
   * Sign out current user
   * 
   * @returns void
   * @throws AuthError with code SESSION_EXPIRED if no active session
   */
  signOut(): Promise<void>;
  
  /**
   * Get current session
   * 
   * @returns Current session or null if not authenticated
   */
  getSession(): Promise<Session | null>;
  
  /**
   * Get current user
   * 
   * @returns Current user or null if not authenticated
   */
  getUser(): Promise<User | null>;
  
  /**
   * Request password reset
   * 
   * @param input - Email to send reset link
   * @returns void (email sent)
   */
  requestPasswordReset(input: PasswordResetInput): Promise<void>;
  
  /**
   * Reset password with token
   * 
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns void
   * @throws AuthError with code INVALID_TOKEN if token expired/invalid
   */
  resetPassword(token: string, newPassword: string): Promise<void>;
  
  /**
   * Change password for authenticated user
   * 
   * @param input - Current and new password
   * @returns void
   * @throws AuthError with code INVALID_CREDENTIALS if current password wrong
   */
  changePassword(input: PasswordChangeInput): Promise<void>;
}
```

---

## Package: `@repo/auth-web`

### React Hooks

```typescript
/**
 * Hook for accessing authentication client
 * 
 * @example
 * ```typescript
 * const client = useAuthClient();
 * await client.signIn({ email, password });
 * ```
 */
export function useAuthClient(): IAuthClient;

/**
 * Hook for accessing current session
 * 
 * @example
 * ```typescript
 * const { session, isLoading, error } = useSession();
 * 
 * if (isLoading) return <Spinner />;
 * if (!session) return <LoginPrompt />;
 * return <Dashboard user={session.user} />;
 * ```
 */
export function useSession(): {
  session: SessionContext | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Hook for accessing current user
 * 
 * @example
 * ```typescript
 * const { user, isLoading } = useUser();
 * ```
 */
export function useUser(): {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Hook for authentication actions
 * 
 * @example
 * ```typescript
 * const { signIn, signUp, signOut, isLoading } = useAuth();
 * 
 * await signIn({ email, password });
 * ```
 */
export function useAuth(): {
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};
```

### Provider Component

```typescript
/**
 * Authentication provider component
 * 
 * @example
 * ```typescript
 * <AuthProvider config={{ baseURL: "http://localhost:3000" }}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export interface AuthProviderProps {
  /** Authentication configuration */
  config: AuthConfig;
  
  /** Child components */
  children: React.ReactNode;
  
  /** Optional custom storage implementation */
  storage?: IStorage;
}

export function AuthProvider(props: AuthProviderProps): JSX.Element;
```

---

## Package: `@repo/auth-utils`

### Validation Functions

```typescript
/**
 * Validate email format
 * 
 * @param email - Email to validate
 * @returns Validation result with errors
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
};

/**
 * Validate password strength
 * 
 * @param password - Password to validate
 * @returns Validation result with errors
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
};

/**
 * Format validation errors from Zod
 * 
 * @param error - Zod validation error
 * @returns Object with field-level errors
 */
export function formatValidationError(error: ZodError): Record<string, string>;
```

---

## Contract Guarantees

### Type Safety

1. All types are exported from `@repo/auth-types`
2. Runtime validation schemas in `@repo/auth-utils` match TypeScript types exactly
3. No `any` types in public APIs (Constitution Principle II)
4. All optional fields explicitly marked with `?` or `| null`

### Error Handling

1. All async functions declare potential `AuthError` throws in JSDoc
2. Error codes are consistent across platforms
3. Error messages include actionable guidance (FR-014)
4. Network errors caught and wrapped with `AuthErrorCode.NETWORK_ERROR`

### Platform Compatibility

1. Core types work identically on web and React Native
2. Platform-specific augmentations extend core types without breaking compatibility
3. Storage and crypto interfaces allow platform-specific implementations
4. All hooks use React 18+ features (compatible with React 19)

### Breaking Change Policy

**Major Version Required For**:
- Removing exported types or functions
- Changing function signatures
- Renaming properties in interfaces
- Changing error codes

**Minor Version Allowed For**:
- Adding new optional properties to interfaces
- Adding new functions or types
- Adding new error codes

**Patch Version Allowed For**:
- JSDoc improvements
- Internal implementation changes
- Bug fixes that don't change contracts
