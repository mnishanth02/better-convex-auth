# @auth/utils

Utility functions, validators, and helpers for Better Convex Auth.

## Installation

```bash
pnpm add @auth/utils
```

## Features

- **Validators** - Zod schemas for form validation
- **Schemas** - Convex validators for backend validation
- **Token Generation** - Secure random token utilities
- **Type Safety** - Full TypeScript support

## Usage

### Validators (Client-side with Zod)

```typescript
import { SignUpSchema, EmailSchema, PasswordSchema } from "@auth/utils/validators";

// Validate sign-up form
const result = SignUpSchema.safeParse({
  email: "user@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  name: "John Doe",
});

if (!result.success) {
  console.error(result.error.flatten().fieldErrors);
} else {
  // Data is valid and type-safe
  const { email, password, name } = result.data;
}

// Validate individual fields
const emailResult = EmailSchema.safeParse("user@example.com");
const passwordResult = PasswordSchema.safeParse("SecurePass123!");
```

### Schemas (Server-side with Convex)

```typescript
import { signUpArgsSchema, updateProfileArgsSchema } from "@auth/utils/schemas";
import { mutation } from "./_generated/server";

export const signUp = mutation({
  args: signUpArgsSchema,
  handler: async (ctx, args) => {
    // args are validated by Convex runtime
    const { email, password, name } = args;
    // ... implementation
  },
});
```

### Token Generation

```typescript
import {
  generateToken,
  generateOTP,
  generateBackupCodes,
  generateVerificationToken,
  hashToken,
  isTokenExpired,
} from "@auth/utils/tokens";

// Generate a verification token
const token = generateVerificationToken(); // 64-character token

// Generate an OTP for 2FA
const otp = generateOTP(6); // 6-digit OTP

// Generate backup codes for 2FA
const backupCodes = generateBackupCodes(10); // Array of 10 codes

// Hash a token for storage
const hash = await hashToken(token);

// Check if token is expired
const expired = isTokenExpired(expiresAt);
```

## Available Validators

### Authentication
- `SignUpSchema` - Sign-up form (email, password, confirmPassword, name)
- `SignInSchema` - Sign-in form (email, password)
- `PasswordResetRequestSchema` - Password reset request (email)
- `PasswordResetSchema` - Password reset (token, password, confirmPassword)
- `ChangePasswordSchema` - Change password (currentPassword, newPassword, confirmNewPassword)

### User Profile
- `UpdateProfileSchema` - Update profile (name, image)
- `DisplayNameSchema` - Display name (2-50 chars)
- `EmailSchema` - Email address
- `PasswordSchema` - Strong password (8+ chars, uppercase, lowercase, number, special char)
- `SimplePasswordSchema` - Basic password (8-128 chars)

### Organization
- `CreateOrganizationSchema` - Create organization (name, slug, description, image)
- `UpdateOrganizationSchema` - Update organization
- `InviteMemberSchema` - Invite member (email, role, message)
- `OrganizationSlugSchema` - URL-friendly slug

### Other
- `UsernameSchema` - Username (3-20 chars, alphanumeric + underscore)
- `PhoneSchema` - Phone number (E.164 format)
- `OTPSchema` - 6-digit OTP
- `BackupCodeSchema` - 10-character backup code
- `URLSchema` - Valid URL
- `RedirectURLSchema` - OAuth redirect URL

## Token Utilities

### Generation
- `generateToken(length)` - URL-safe random token
- `generateOTP(length)` - Numeric OTP
- `generateBackupCode()` - 10-char alphanumeric code
- `generateBackupCodes(count)` - Multiple backup codes
- `generateVerificationToken()` - 64-char verification token
- `generateSessionToken()` - 128-char session token
- `generateAPIKey(prefix)` - API key with optional prefix

### Hashing & Verification
- `hashToken(token)` - SHA-256 hash
- `verifyTokenHash(token, hash)` - Verify token against hash

### Expiration
- `isTokenExpired(expiresAt)` - Check if token expired
- `calculateExpiresAt(expiresIn)` - Calculate expiration timestamp

### Display
- `formatTokenForDisplay(token)` - Format for UI (e.g., "abcd...wxyz")

## TypeScript Types

All validators export corresponding TypeScript types:

```typescript
import type { SignUpData, SignInData, UpdateProfileData } from "@auth/utils";

function handleSignUp(data: SignUpData) {
  // data is fully typed
}
```

## Development

```bash
# Build the package
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck
```

## License

MIT
