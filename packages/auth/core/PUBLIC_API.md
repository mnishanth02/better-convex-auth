# @auth/core - Public API Surface

This document defines the **official public API** for `@auth/core`. Only these exports are guaranteed to remain stable across minor versions.

## Package Exports

### Main Export (`@auth/core`)

All utilities and factories are re-exported from the main entry point:

```typescript
import {
  createConvexAuth,
  isSessionExpired,
  getUserDisplayName,
  hasRole,
} from "@auth/core";
```

## ⚠️ Import Restrictions

The following imports are **explicitly blocked**:

```typescript
// ❌ BLOCKED - Internal implementation
import { isSessionExpired } from "@auth/core/dist/session";
import { getUserDisplayName } from "@auth/core/src/user";
import { createConvexAuth } from "@auth/core/convex/index";
import { helper } from "@auth/core/internal/helpers";

// ✅ ALLOWED - Public API
import { isSessionExpired, getUserDisplayName, createConvexAuth } from "@auth/core";
```

## Public API Reference

### Factory Functions

#### `createConvexAuth`

Creates a Better Auth instance configured for Convex.

```typescript
function createConvexAuth(
  ctx: unknown,
  options: ConvexAuthOptions
): ReturnType<typeof betterAuth>;

interface ConvexAuthOptions {
  adapter: ConvexAdapter;
  baseURL: string;
  trustedOrigins?: string[];
  emailPassword?: EmailPasswordConfig;
  socialProviders?: SocialProvidersConfig;
  emailVerification?: EmailVerificationConfig;
  session?: SessionConfig;
  rateLimit?: RateLimitConfig;
  // ... additional Better Auth options
}
```

**Usage:**
```typescript
import { createConvexAuth } from "@auth/core";
import { components } from "./_generated/api";

export const auth = createConvexAuth(ctx, {
  adapter: components.betterAuth.adapter(ctx),
  baseURL: process.env.SITE_URL!,
  emailPassword: { enabled: true },
});
```

---

### Session Utilities

Functions for managing and validating user sessions:

#### Session Validation

```typescript
// Check if session is expired
function isSessionExpired(session: Session): boolean;

// Check if session should be refreshed
function shouldRefreshSession(session: Session, refreshThreshold?: number): boolean;

// Get detailed session lifecycle status
function getSessionStatus(session: Session): SessionLifecycleStatus;

// Validate session and return status
function validateSession(session: Session | null): {
  isValid: boolean;
  isExpired: boolean;
  needsRefresh: boolean;
  status: SessionLifecycleStatus;
};
```

#### Session Timestamps

```typescript
// Calculate session expiry timestamp
function calculateSessionExpiry(expiresIn: number): number;

// Get remaining session time in milliseconds
function getSessionTimeRemaining(session: Session): number;

// Check if session will expire soon
function willExpireSoon(session: Session, thresholdMs?: number): boolean;
```

#### Session Management

```typescript
// Create session data object
function createSessionData(session: Session, user?: User): SessionData;

// Extract session token from various sources
function extractSessionToken(
  source: string | { token: string } | null
): string | null;
```

**Usage Examples:**
```typescript
import {
  isSessionExpired,
  shouldRefreshSession,
  getSessionStatus,
  validateSession,
} from "@auth/core";

// Check if session is expired
if (isSessionExpired(session)) {
  console.log("Session expired, please log in again");
}

// Check if session should be refreshed
if (shouldRefreshSession(session)) {
  await refreshSession();
}

// Get detailed status
const status = getSessionStatus(session);
console.log(status); // "active" | "expired" | "expiring-soon" | "invalid"

// Comprehensive validation
const validation = validateSession(session);
if (!validation.isValid) {
  console.log("Invalid session");
}
```

---

### User Utilities

Functions for working with user data:

#### User Display

```typescript
// Get user's display name (name or email)
function getUserDisplayName(user: User | null | undefined): string;

// Get user initials for avatars
function getUserInitials(user: User | null | undefined): string;

// Format user for display
function formatUser(user: User): {
  displayName: string;
  initials: string;
  hasAvatar: boolean;
};
```

#### Role Management

```typescript
// Check if user has specific role
function hasRole(user: User | null | undefined, role: UserRole): boolean;

// Check if user is admin
function isAdmin(user: User | null | undefined): boolean;

// Check if user is moderator or higher
function isModerator(user: User | null | undefined): boolean;

// Get user's highest role
function getHighestRole(user: User | null | undefined): UserRole;

// Check if user has at least a certain role level
function hasRoleOrHigher(user: User | null | undefined, role: UserRole): boolean;
```

#### User Status

```typescript
// Check if user's email is verified
function isEmailVerified(user: User | null | undefined): boolean;

// Check if user account is active
function isUserActive(user: User | null | undefined): boolean;

// Check if user account is suspended
function isUserSuspended(user: User | null | undefined): boolean;
```

#### User Transformations

```typescript
// Convert user to public-safe version (removes sensitive fields)
function toPublicUser(user: User): PublicUser;

// Merge user updates with existing user
function mergeUserUpdates(
  existing: User,
  updates: Partial<UserProfileUpdate>
): User;

// Sanitize user object for API responses
function sanitizeUser(user: User, includeEmail?: boolean): PublicUser;
```

**Usage Examples:**
```typescript
import {
  getUserDisplayName,
  getUserInitials,
  hasRole,
  isAdmin,
  toPublicUser,
} from "@auth/core";

// Display user information
const displayName = getUserDisplayName(user);
const initials = getUserInitials(user); // "JD" for "John Doe"

console.log(`Welcome, ${displayName}!`);

// Check permissions
if (isAdmin(user)) {
  console.log("User has admin privileges");
}

if (hasRole(user, "moderator")) {
  console.log("User can moderate content");
}

// Prepare user for public API
const publicUser = toPublicUser(user);
// Returns user without sensitive fields like email, password hash, etc.
```

---

### Convex Integration Utilities

Helper functions for Convex-specific integration:

```typescript
// Extract auth user from Convex context
function getAuthUser(ctx: QueryCtx | MutationCtx): Promise<User | null>;

// Require authenticated user (throws if not authenticated)
function requireAuth(ctx: QueryCtx | MutationCtx): Promise<User>;

// Require specific role (throws if insufficient permissions)
function requireRole(
  ctx: QueryCtx | MutationCtx,
  role: UserRole
): Promise<User>;

// Check if current user has permission
function hasPermission(
  ctx: QueryCtx | MutationCtx,
  permission: string
): Promise<boolean>;
```

**Usage Examples:**
```typescript
import { query, mutation } from "./_generated/server";
import { requireAuth, requireRole } from "@auth/core";

// Require authentication
export const getProfile = query({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return user;
  },
});

// Require specific role
export const deleteUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    await requireRole(ctx, "admin");
    // Only admins can delete users
    await ctx.db.delete(userId);
  },
});
```

---

## Type Exports

The following types are re-exported from `@auth/types`:

```typescript
export type {
  User,
  PublicUser,
  Session,
  SessionData,
  SessionStatus,
  SessionLifecycleStatus,
  UserRole,
  AuthConfig,
} from "@auth/types";
```

---

## Versioning Policy

This package follows [Semantic Versioning 2.0.0](https://semver.org/).

### Stability Guarantees

✅ **Stable** - These exports are guaranteed stable:
- All session utilities listed above
- All user utilities listed above
- Factory functions (`createConvexAuth`)
- Convex integration utilities

⚠️ **Experimental** - May change without major version bump:
- Functions marked with `@experimental` JSDoc tag
- Internal helper functions not listed in this document

❌ **Internal** - Explicitly blocked:
- Anything under `/dist/*`, `/src/*`, `/convex/*`, `/internal/*`
- Any import paths not listed in this document

### Platform Requirements

- **Node.js**: ≥20.0.0
- **Convex**: ≥1.28.0
- **Better Auth**: ≥1.3.0

## License

MIT
