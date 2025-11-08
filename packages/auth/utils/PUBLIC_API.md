# @auth/utils - Public API Surface

This document defines the **official public API** for `@auth/utils`. Only these exports are guaranteed to remain stable across minor versions.

## Package Exports

### Main Export (`@auth/utils`)

All utilities are re-exported from the main entry point:

```typescript
import {
  EmailSchema,
  PasswordSchema,
  generateSecureToken,
  hashToken,
  AuthError,
  ValidationError,
} from "@auth/utils";
```

## ⚠️ Import Restrictions

The following imports are **explicitly blocked**:

```typescript
// ❌ BLOCKED - Internal implementation
import { EmailSchema } from "@auth/utils/dist/validators";
import { generateSecureToken } from "@auth/utils/src/tokens";
import { AuthError } from "@auth/utils/internal/errors";

// ✅ ALLOWED - Public API
import { EmailSchema, generateSecureToken, AuthError } from "@auth/utils";
```

## Public API Reference

### Validators

Zod schemas for validating user input:

#### String Validators
- `EmailSchema` - Email address validation
- `PasswordSchema` - Password strength validation (8-128 chars)
- `NameSchema` - User name validation (2-100 chars)
- `UsernameSchema` - Username validation (alphanumeric + underscore)
- `PhoneSchema` - Phone number validation
- `UrlSchema` - URL validation

#### Specialized Validators
- `TokenSchema` - Authentication token format
- `OTPSchema` - One-time password validation (6 digits)
- `VerificationCodeSchema` - Verification code validation

#### User Input Validators
- `SignUpSchema` - Complete sign-up form validation
- `SignInSchema` - Sign-in form validation
- `ChangePasswordSchema` - Password change validation
- `UpdateProfileSchema` - Profile update validation

#### Organization Validators
- `OrganizationNameSchema` - Organization name validation
- `OrganizationSlugSchema` - Organization slug validation

---

### Token Utilities

Cryptographic token generation and validation:

#### Token Generation
- `generateSecureToken(length?: number): string` - Generate secure random token
- `generateVerificationToken(): string` - Generate email verification token (32 bytes)
- `generatePasswordResetToken(): string` - Generate password reset token (32 bytes)
- `generateOTP(length?: number): string` - Generate numeric OTP (default 6 digits)
- `generateSessionToken(): string` - Generate session token (64 bytes)

#### Token Hashing
- `hashToken(token: string): string` - Hash token with SHA-256
- `verifyToken(token: string, hash: string): boolean` - Verify token against hash

#### Token Validation
- `verifyTokenExpiry(expiresAt: number): boolean` - Check if token is expired
- `calculateTokenExpiry(expiresIn: number): number` - Calculate expiry timestamp

#### Token Management
- `isTokenExpired(expiresAt: number): boolean` - Check if token expired
- `getTimeUntilExpiry(expiresAt: number): number` - Get remaining time in ms

---

### Error Handling

Custom error classes for authentication flows:

#### Error Classes

```typescript
// Base authentication error
class AuthError extends Error {
  code: string;
  meta?: Record<string, unknown>;
  
  constructor(code: string, message: string, meta?: Record<string, unknown>);
}

// Validation error (Zod validation failures)
class ValidationError extends AuthError {
  issues: ZodIssue[];
  
  constructor(message: string, issues: ZodIssue[]);
}

// Rate limit error
class RateLimitError extends AuthError {
  retryAfter: number;
  
  constructor(message: string, retryAfter: number);
}

// Email verification error
class EmailVerificationError extends AuthError {
  constructor(message: string);
}

// Token error
class TokenError extends AuthError {
  constructor(message: string, code: string);
}
```

#### Error Codes

Standardized error codes:

```typescript
enum AuthErrorCode {
  // Authentication
  INVALID_CREDENTIALS = "invalid_credentials",
  EMAIL_ALREADY_EXISTS = "email_already_exists",
  ACCOUNT_LOCKED = "account_locked",
  
  // Email Verification
  EMAIL_NOT_VERIFIED = "email_not_verified",
  VERIFICATION_TOKEN_EXPIRED = "verification_token_expired",
  VERIFICATION_TOKEN_INVALID = "verification_token_invalid",
  
  // Password
  PASSWORD_TOO_WEAK = "password_too_weak",
  PASSWORD_RESET_TOKEN_EXPIRED = "password_reset_token_expired",
  PASSWORD_RESET_TOKEN_INVALID = "password_reset_token_invalid",
  
  // Session
  SESSION_EXPIRED = "session_expired",
  SESSION_INVALID = "session_invalid",
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  
  // Authorization
  INSUFFICIENT_PERMISSIONS = "insufficient_permissions",
  RESOURCE_NOT_FOUND = "resource_not_found",
  
  // Validation
  VALIDATION_ERROR = "validation_error",
  INVALID_INPUT = "invalid_input",
}
```

---

## Usage Examples

### Validation

```typescript
import { EmailSchema, PasswordSchema, SignUpSchema } from "@auth/utils";

// Validate individual fields
const email = EmailSchema.parse("user@example.com");
const password = PasswordSchema.parse("SecureP@ss123");

// Validate complete forms
const signUpData = SignUpSchema.parse({
  email: "user@example.com",
  password: "SecureP@ss123",
  name: "John Doe",
});
```

### Token Generation

```typescript
import {
  generateVerificationToken,
  generatePasswordResetToken,
  hashToken,
  verifyToken,
  verifyTokenExpiry,
  calculateTokenExpiry,
} from "@auth/utils";

// Generate and hash verification token
const token = generateVerificationToken();
const hashedToken = hashToken(token);

// Calculate expiry (24 hours)
const expiresAt = calculateTokenExpiry(86400); // 86400 seconds = 24 hours

// Later, verify token
const isValid = verifyToken(userProvidedToken, hashedToken);
const isNotExpired = verifyTokenExpiry(expiresAt);

if (isValid && isNotExpired) {
  // Token is valid and not expired
}
```

### Error Handling

```typescript
import { AuthError, ValidationError, AuthErrorCode } from "@auth/utils";

try {
  // Some authentication logic
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation failed:", error.issues);
  } else if (error instanceof AuthError) {
    switch (error.code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        console.log("Invalid email or password");
        break;
      case AuthErrorCode.EMAIL_NOT_VERIFIED:
        console.log("Please verify your email");
        break;
      default:
        console.log("Authentication error:", error.message);
    }
  }
}
```

---

## Versioning Policy

This package follows [Semantic Versioning 2.0.0](https://semver.org/).

### Stability Guarantees

✅ **Stable** - These exports are guaranteed stable:
- All validators listed above
- All token utilities listed above
- All error classes and error codes

⚠️ **Experimental** - May change without major version bump:
- Internal helper functions not listed in this document
- Types marked with `@experimental` JSDoc tag

❌ **Internal** - Explicitly blocked:
- Anything under `/dist/*`, `/src/*`, `/internal/*`
- Any import paths not listed in this document

## License

MIT
