# @auth/types

Shared TypeScript types for Better Convex Auth.

## Installation

```bash
pnpm add @auth/types
```

## Usage

```typescript
import type {
  User,
  Session,
  AuthConfig,
  Organization,
  OrganizationRole,
} from "@auth/types";

// Use the types in your application
function greetUser(user: User) {
  console.log(`Hello, ${user.name || user.email}!`);
}
```

## Available Types

### User Types
- `User` - Base user object
- `PublicUser` - Public-facing user profile
- `UserProfileUpdate` - User profile update input
- `UserAccount` - OAuth account information
- `UserPreferences` - User preferences/settings
- `UserRole` - User role enum
- `UserWithRole` - User with role information
- `UserAuthMethods` - Authentication methods enabled for user

### Session Types
- `Session` - User session object
- `ActiveSession` - Active session information
- `SessionWithUser` - Session with user information
- `SessionStatus` - Session status check result
- `SessionRefreshResult` - Session refresh result
- `SessionConfig` - Session configuration options

### Auth Configuration Types
- `AuthConfig` - Complete authentication configuration
- `EmailPasswordConfig` - Email/password auth configuration
- `SocialProvidersConfig` - OAuth providers configuration
- `EmailVerificationConfig` - Email verification settings
- `TwoFactorConfig` - 2FA configuration
- `PasskeyConfig` - Passkey/WebAuthn configuration
- `MagicLinkConfig` - Magic link configuration
- `OrganizationConfig` - Organization/multi-tenancy settings
- `RateLimitConfig` - Rate limiting configuration
- `EmailConfig` - Email service configuration
- `SecurityConfig` - Security settings

### Organization Types
- `Organization` - Organization object
- `OrganizationMember` - Organization member
- `OrganizationInvitation` - Organization invitation
- `OrganizationRole` - Organization role enum
- `OrganizationPermissions` - Role-based permissions
- `CreateOrganizationInput` - Create organization input
- `UpdateOrganizationInput` - Update organization input
- `InviteMemberInput` - Invite member input
- `AcceptInvitationInput` - Accept invitation input

### Utility Types
- `AuthMethod` - Authentication method enum
- `AuthEvent` - Authentication event enum
- `AuthErrorCode` - Authentication error code enum

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type check
pnpm typecheck
```

## License

MIT
