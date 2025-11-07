# @auth/core

Core authentication logic and backend abstraction for Better Convex Auth.

## Installation

```bash
pnpm add @auth/core
```

## Features

- ✅ **Convex Integration**: Factory function to create Better Auth instances with Convex adapter
- ✅ **Session Management**: Utilities for validating, refreshing, and managing sessions
- ✅ **User Utilities**: Helper functions for user operations and transformations
- ✅ **Type Safe**: Full TypeScript support with strict types
- ✅ **Tree-shakable**: Import only what you need

## Usage

### Creating a Convex Auth Instance

```typescript
import { createConvexAuth, getAuthDefaults } from "@auth/core/convex";
import { createClient } from "@convex-dev/better-auth";
import { components } from "./_generated/api";

const authComponent = createClient(components.betterAuth);

export const createAuth = (ctx: ConvexContext) => {
  return createConvexAuth(ctx, {
    adapter: authComponent.adapter(ctx),
    baseURL: process.env.SITE_URL || "http://localhost:3000",

    // Email/password authentication
    emailPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },

    // OAuth providers
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },

    // Rate limiting
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },

    isDevelopment: process.env.NODE_ENV !== "production",
  });
};
```

### Session Management

```typescript
import {
  isSessionValid,
  shouldRefreshSession,
  getSessionStatus,
  formatSessionTime,
  getRemainingSessionTime,
} from "@auth/core/session";

// Check if session is valid
if (isSessionValid(session)) {
  console.log("Session is active");
}

// Check if session should be refreshed
if (shouldRefreshSession(session)) {
  // Refresh the session
}

// Get session status
const status = getSessionStatus(session);
// Returns: "active" | "expiring" | "expired"

// Format remaining time
const remaining = getRemainingSessionTime(session);
const formatted = formatSessionTime(remaining);
// Returns: "5 days" or "2 hours" or "30 minutes"
```

### User Utilities

```typescript
import {
  toPublicUser,
  hasVerifiedEmail,
  getUserDisplayName,
  getUserInitials,
  maskEmail,
  isAdmin,
} from "@auth/core/user";

// Convert to public user (safe for client)
const publicUser = toPublicUser(user);

// Check email verification
if (hasVerifiedEmail(user)) {
  console.log("Email is verified");
}

// Get display name
const displayName = getUserDisplayName(user);
// Returns: "John Doe" or "john@example.com"

// Get initials for avatar
const initials = getUserInitials(user);
// Returns: "JD" for "John Doe"

// Mask email for display
const masked = maskEmail("john@example.com");
// Returns: "j***n@example.com"

// Check role
if (isAdmin(user)) {
  console.log("User is an admin");
}
```

## API Reference

### Convex Integration

#### `createConvexAuth(ctx, options)`

Creates a Better Auth instance configured for Convex.

**Parameters:**
- `ctx: ConvexContext` - Convex context with auth and db
- `options: ConvexAuthOptions` - Configuration options

**Returns:** Better Auth instance

#### `getAuthDefaults(isDevelopment?)`

Returns default auth configuration.

**Parameters:**
- `isDevelopment?: boolean` - Whether in development mode

**Returns:** Partial configuration with sensible defaults

### Session Utilities

- `isSessionValid(session)` - Check if session is valid (not expired)
- `isSessionExpired(session)` - Check if session is expired
- `getSessionStatus(session)` - Get session status (active/expiring/expired)
- `shouldRefreshSession(session, updateAge?)` - Check if session should be refreshed
- `calculateSessionExpiry(expiresIn, fromTimestamp?)` - Calculate expiration timestamp
- `getRemainingSessionTime(session)` - Get remaining time in seconds
- `formatSessionTime(seconds)` - Format time for display
- `sanitizeSession(session)` - Remove sensitive data (token)

### User Utilities

- `toPublicUser(user)` - Convert to public user (no sensitive data)
- `hasVerifiedEmail(user)` - Check if email is verified
- `isProfileComplete(user)` - Check if profile is complete
- `getUserDisplayName(user)` - Get display name
- `getUserInitials(user)` - Get initials for avatar
- `formatUserCreationDate(user)` - Format creation date
- `hasRole(user, role)` - Check if user has role
- `isAdmin(user)` - Check if user is admin
- `isSuperAdmin(user)` - Check if user is super admin
- `isSameUser(user1, user2)` - Check if two users are the same
- `isValidEmail(email)` - Validate email format
- `maskEmail(email)` - Mask email for display
- `getGravatarUrl(email, size?)` - Get Gravatar URL

## Type Safety

All functions are fully typed with TypeScript. Import types from `@auth/types`:

```typescript
import type { User, Session, AuthConfig } from "@auth/types";
```

## Best Practices

1. **Always use `createConvexAuth`** instead of manually configuring Better Auth
2. **Sanitize sessions** before sending to client using `sanitizeSession()`
3. **Convert to public user** before exposing user data using `toPublicUser()`
4. **Check email verification** for sensitive operations using `hasVerifiedEmail()`
5. **Refresh sessions proactively** using `shouldRefreshSession()`

## Related Packages

- [`@auth/types`](../types) - TypeScript types
- [`@auth/utils`](../utils) - Validation and utilities
- [`@auth/hooks`](../hooks) - React hooks (coming soon)
- [`@auth/ui`](../ui) - UI components (coming soon)

## License

MIT
