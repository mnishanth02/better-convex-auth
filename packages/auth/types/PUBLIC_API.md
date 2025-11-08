# @auth/types - Public API Surface

This document defines the **official public API** for `@auth/types`. Only these exports are guaranteed to remain stable across minor versions.

## Package Exports

### Main Export (`@auth/types`)

All types are re-exported from the main entry point:

```typescript
import type { User, Session, AuthConfig } from "@auth/types";
```

### Sub-Exports

Types can also be imported from category-specific exports:

```typescript
// User types
import type { User, UserRole, UserStatus } from "@auth/types/user";

// Session types
import type { Session, SessionStatus } from "@auth/types/session";

// Auth configuration types
import type { AuthConfig, EmailPasswordConfig } from "@auth/types/auth";

// Organization types
import type { Organization, OrganizationMember } from "@auth/types/organization";
```

## ⚠️ Import Restrictions

The following imports are **explicitly blocked** to maintain encapsulation:

```typescript
// ❌ BLOCKED - Internal implementation
import { User } from "@auth/types/dist/user";
import { User } from "@auth/types/src/user";
import { User } from "@auth/types/internal/user";

// ✅ ALLOWED - Public API
import type { User } from "@auth/types";
import type { User } from "@auth/types/user";
```

## Public API Reference

### User Types (`@auth/types/user`)

#### Core Interfaces
- `User` - Complete user object with all fields
- `PublicUser` - Sanitized user object for public display
- `UserProfileUpdate` - Input type for updating user profile
- `UserAccount` - OAuth account linkage information
- `UserPreferences` - User preferences and settings

#### Enums
- `UserRole` - User role levels (`user`, `moderator`, `admin`)
- `UserStatus` - User account status (`active`, `suspended`, `deleted`)

#### Helper Types
- `UserWithRole` - User with role information
- `UserAuthMethods` - Authentication methods enabled for user

---

### Session Types (`@auth/types/session`)

#### Core Interfaces
- `Session` - User session object
- `ActiveSession` - Active session with metadata
- `SessionWithUser` - Session with user information included
- `SessionStatus` - Session validity check result
- `SessionRefreshResult` - Result of session refresh operation

#### Enums
- `SessionStatus` - Session status (`active`, `expired`, `invalid`)
- `SessionLifecycleStatus` - Detailed lifecycle status

#### Configuration
- `SessionConfig` - Session configuration options

---

### Auth Configuration (`@auth/types/auth`)

#### Main Configuration
- `AuthConfig` - Complete authentication configuration

#### Provider Configurations
- `EmailPasswordConfig` - Email/password authentication settings
- `SocialProvidersConfig` - OAuth providers (Google, GitHub, Apple, Discord)
- `EmailVerificationConfig` - Email verification requirements
- `TwoFactorConfig` - 2FA/MFA settings
- `PasskeyConfig` - Passkey/WebAuthn configuration
- `MagicLinkConfig` - Magic link settings

#### Feature Configurations
- `OrganizationConfig` - Multi-tenancy settings
- `RateLimitConfig` - Rate limiting rules
- `EmailConfig` - Email service configuration
- `SecurityConfig` - Security policies

---

### Organization Types (`@auth/types/organization`)

#### Core Interfaces
- `Organization` - Organization/tenant object
- `OrganizationMember` - Member of an organization
- `OrganizationInvitation` - Pending invitation

#### Enums
- `OrganizationRole` - Member roles (`owner`, `admin`, `member`, `guest`)
- `OrganizationPermissions` - Permission levels

#### Input Types
- `CreateOrganizationInput` - Create organization request
- `UpdateOrganizationInput` - Update organization request
- `InviteMemberInput` - Invite member request
- `AcceptInvitationInput` - Accept invitation request

---

## Versioning Policy

### Semantic Versioning

This package follows [Semantic Versioning 2.0.0](https://semver.org/):

- **Major version** (1.0.0 → 2.0.0): Breaking changes to public API
- **Minor version** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch version** (1.0.0 → 1.0.1): Bug fixes, backward compatible

### Stability Guarantees

✅ **Stable** - These exports are guaranteed stable:
- All types listed in this document
- All sub-exports (`/user`, `/session`, `/auth`, `/organization`)

⚠️ **Experimental** - These may change without major version bump:
- Types marked with `@experimental` JSDoc tag
- Types not listed in this document

❌ **Internal** - These are explicitly blocked:
- Anything under `/dist/*`, `/src/*`, `/internal/*`
- Any import paths not listed in this document

### Breaking Change Policy

Breaking changes to the public API will:
1. Be announced in CHANGELOG.md
2. Include migration guide
3. Provide deprecation warnings (when possible)
4. Require major version bump

## Support

- **Documentation**: See main README.md
- **Issues**: Report via GitHub Issues
- **Questions**: Use GitHub Discussions

## License

MIT
