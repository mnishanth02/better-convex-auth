# Data Model: Authentication Module

**Feature**: Authentication Module Package Architecture  
**Date**: 2025-11-06  
**Source**: Better Auth + Convex Integration Pattern

## Overview

This data model defines the core entities for the authentication system built on Better Auth integrated with Convex backend. The schema leverages Better Auth's database adapter patterns while maintaining platform-agnostic TypeScript types for cross-platform use (web and mobile).

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│    User     │────────<│   Session    │         │   Account       │
│             │ 1     * │              │         │  (OAuth)        │
│ id (PK)     │         │ id (PK)      │    ┌───>│                 │
│ email       │         │ userId (FK)  │    │    │ userId (FK)     │
│ name        │         │ token        │    │    │ provider        │
│ password    │         │ expiresAt    │    │    │ providerUserId  │
│ emailVerified│        │ ipAddress    │    │    └─────────────────┘
└──────┬──────┘         │ userAgent    │    │
       │                └──────────────┘    │
       │ 1                                  │ *
       │                                    │
       │         ┌──────────────────────────┤
       │         │
       └────────>│   VerificationToken      │
            *    │                          │
                 │ identifier (email/phone) │
                 │ token                    │
                 │ expiresAt                │
                 │ type (email/reset)       │
                 └──────────────────────────┘
```

## Core Entities

### 1. User

The primary entity representing an authenticated user account.

**Table Name**: `users`  
**Primary Key**: `id` (UUID)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string (UUID) | Yes | UUID v4 format | Unique user identifier |
| `email` | string | Yes | RFC 5322 email format, max 255 chars | User's email address (unique index) |
| `emailVerified` | boolean | Yes | - | Whether email has been verified |
| `name` | string \| null | No | Max 100 chars | User's display name |
| `image` | string \| null | No | Valid URL format | Avatar/profile image URL |
| `password` | string \| null | No | Bcrypt hash (60 chars) | Hashed password (null for OAuth-only users) |
| `createdAt` | number | Yes | Positive integer timestamp | Account creation time (milliseconds since epoch) |
| `updatedAt` | number | Yes | Positive integer timestamp | Last update time (milliseconds since epoch) |

**Indexes**:
- Primary: `id`
- Unique: `email`
- Index: `createdAt` (for pagination)

**Validation Rules** (Zod Schema):
```typescript
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  emailVerified: z.boolean(),
  name: z.string().max(100).nullable(),
  image: z.string().url().nullable(),
  password: z.string().length(60).nullable(), // Bcrypt hash
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
});
```

**State Transitions**:
1. **Created** → User signs up, emailVerified = false, password hashed
2. **Verified** → User clicks verification link, emailVerified = true
3. **Updated** → User changes profile/password, updatedAt increments
4. **Deleted** → Soft delete or hard delete (implementation choice)

**Business Rules**:
- Email must be unique across all users
- Password required for email/password auth, null for OAuth-only users
- EmailVerified can be bypassed per-app configuration (FR-017)
- Name is optional but recommended for personalization

---

### 2. Session

Represents an active authentication session with token-based validation.

**Table Name**: `sessions`  
**Primary Key**: `id` (string)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | Min 32 chars | Unique session identifier (random token) |
| `userId` | string (UUID) | Yes | Foreign key to users.id | User this session belongs to |
| `token` | string | Yes | Min 32 chars | Session authentication token |
| `expiresAt` | number | Yes | Future timestamp | Session expiration time (milliseconds) |
| `ipAddress` | string \| null | No | IPv4/IPv6 format | IP address of session creation |
| `userAgent` | string \| null | No | Max 500 chars | Browser/device user agent string |
| `createdAt` | number | Yes | Positive integer timestamp | Session creation time |

**Indexes**:
- Primary: `id`
- Unique: `token`
- Index: `userId` (for querying user's sessions)
- Index: `expiresAt` (for cleanup of expired sessions)

**Validation Rules** (Zod Schema):
```typescript
const SessionSchema = z.object({
  id: z.string().min(32),
  userId: z.string().uuid(),
  token: z.string().min(32),
  expiresAt: z.number().int().positive(),
  ipAddress: z.string().ip().nullable(),
  userAgent: z.string().max(500).nullable(),
  createdAt: z.number().int().positive(),
});
```

**State Transitions**:
1. **Created** → User signs in, session created with future expiresAt
2. **Active** → Session token validates, expiresAt > Date.now()
3. **Expired** → expiresAt <= Date.now(), session invalid
4. **Revoked** → User logs out, session deleted immediately

**Business Rules**:
- Sessions expire after configurable duration (default 7 days, per assumptions)
- Multiple concurrent sessions allowed per user (different devices)
- Expired sessions cleaned up by background job
- Session token must be cryptographically secure (crypto.randomBytes)
- Sessions sync in real-time across platforms via Convex subscriptions

---

### 3. Account

Represents OAuth provider accounts linked to a user (e.g., GitHub, Google).

**Table Name**: `accounts`  
**Primary Key**: `id` (UUID)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string (UUID) | Yes | UUID v4 format | Unique account identifier |
| `userId` | string (UUID) | Yes | Foreign key to users.id | User this account is linked to |
| `provider` | string | Yes | Enum: github, google, etc. | OAuth provider name |
| `providerAccountId` | string | Yes | - | User ID from the OAuth provider |
| `accessToken` | string \| null | No | Encrypted string | OAuth access token (encrypted at rest) |
| `refreshToken` | string \| null | No | Encrypted string | OAuth refresh token (encrypted at rest) |
| `tokenExpiresAt` | number \| null | No | Future timestamp | Access token expiration time |
| `scope` | string \| null | No | - | OAuth scopes granted |
| `createdAt` | number | Yes | Positive integer timestamp | Account link creation time |

**Indexes**:
- Primary: `id`
- Unique: `(provider, providerAccountId)` composite
- Index: `userId` (for querying user's linked accounts)

**Validation Rules** (Zod Schema):
```typescript
const AccountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  provider: z.enum(["github", "google", "apple", "discord"]), // Extensible
  providerAccountId: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  tokenExpiresAt: z.number().int().positive().nullable(),
  scope: z.string().nullable(),
  createdAt: z.number().int().positive(),
});
```

**State Transitions**:
1. **Linked** → User connects OAuth provider, account created
2. **Token Refreshed** → Access token refreshed, tokenExpiresAt updated
3. **Unlinked** → User disconnects provider, account deleted

**Business Rules**:
- One account per provider per user (can't link same GitHub account twice)
- Tokens encrypted at rest for security (SC-011 security requirement)
- Access token refresh handled automatically when near expiration
- User can have multiple providers linked (e.g., GitHub + Google)

---

### 4. VerificationToken

Represents temporary tokens for email verification and password reset flows.

**Table Name**: `verificationTokens`  
**Primary Key**: `(identifier, token, type)` composite

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `identifier` | string | Yes | Email or phone format | Email address or phone number |
| `token` | string | Yes | Min 32 chars | Verification token (random, secure) |
| `expiresAt` | number | Yes | Future timestamp | Token expiration time (milliseconds) |
| `type` | string | Yes | Enum: email_verification, password_reset | Purpose of this token |
| `createdAt` | number | Yes | Positive integer timestamp | Token creation time |

**Indexes**:
- Primary: `(identifier, token, type)` composite
- Index: `expiresAt` (for cleanup of expired tokens)

**Validation Rules** (Zod Schema):
```typescript
const VerificationTokenSchema = z.object({
  identifier: z.string().email().or(z.string().regex(/^\+?[1-9]\d{1,14}$/)),
  token: z.string().min(32),
  expiresAt: z.number().int().positive(),
  type: z.enum(["email_verification", "password_reset"]),
  createdAt: z.number().int().positive(),
});
```

**State Transitions**:
1. **Created** → User requests verification/reset, token generated
2. **Sent** → Token emailed to user (external email service)
3. **Verified** → User clicks link, token consumed, deleted
4. **Expired** → expiresAt <= Date.now(), token invalid, deleted

**Business Rules**:
- Tokens expire after short duration (15 minutes for verification, 1 hour for reset)
- One-time use: token deleted after successful verification
- Old tokens invalidated when new token requested for same identifier
- Token must be cryptographically secure (crypto.randomBytes)
- Expired tokens cleaned up by background job

---

## Platform-Specific Augmentations

### Web Platform Extensions

```typescript
// @repo/auth-types/web
export interface WebUser extends User {
  browserFingerprint?: string; // For anomaly detection
}

export interface WebSession extends Session {
  refreshToken?: string;       // Optional refresh token
  csrfToken: string;           // CSRF protection token
}
```

### React Native Platform Extensions

```typescript
// @repo/auth-types/native
export interface NativeUser extends User {
  deviceId?: string;           // Device identifier
  pushToken?: string;          // Push notification token
}

export interface NativeSession extends Session {
  biometricEnabled?: boolean;  // Face ID/Touch ID enabled
  deviceTrusted?: boolean;     // Device trust status
}
```

## Convex Schema Definition

Based on Better Auth adapter pattern, the Convex schema is automatically managed by the `@convex-dev/better-auth` component. Manual schema definition:

```typescript
// packages/backend/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"]),

  sessions: defineTable({
    userId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_token", ["token"])
    .index("by_expiresAt", ["expiresAt"]),

  accounts: defineTable({
    userId: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_provider_account", ["provider", "providerAccountId"]),

  verificationTokens: defineTable({
    identifier: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    type: v.string(),
    createdAt: v.number(),
  })
    .index("by_identifier_token_type", ["identifier", "token", "type"])
    .index("by_expiresAt", ["expiresAt"]),
});
```

## Type Package Exports

```typescript
// packages/auth-types/src/index.ts
export type { User, UserProfile } from "./user";
export type { Session, SessionContext } from "./session";
export type { Account } from "./account";
export type { VerificationToken } from "./verification";
export type { SignUpInput, SignInInput, PasswordResetInput } from "./auth";
```

## Migration Strategy

Since Better Auth manages its own schema through the Convex adapter:

1. **Initial Setup**: Better Auth creates tables on first deployment
2. **Schema Sync**: Use Better Auth's migration tools for schema changes
3. **Type Generation**: Convex generates types from schema automatically
4. **Validation**: Zod schemas validate at runtime, independent of DB schema

## Security Considerations

Based on Constitution Principle V and SC-011:

- ✅ All user inputs validated with Zod schemas before database writes
- ✅ Passwords hashed with bcrypt (10 rounds minimum)
- ✅ Session tokens generated with crypto.randomBytes (256-bit minimum)
- ✅ OAuth tokens encrypted at rest in database
- ✅ Sensitive fields (password, tokens) never exposed in API responses
- ✅ Email verification tokens expire within 15 minutes
- ✅ Password reset tokens expire within 1 hour
- ✅ Expired sessions and tokens cleaned up regularly

## Real-Time Synchronization

Leveraging Convex's real-time subscriptions (from research.md):

- **Session Updates**: When user logs in/out, all connected clients receive session updates
- **User Profile Changes**: Profile updates propagate to all active sessions in real-time
- **Cross-Platform Sync**: Web and mobile apps stay synchronized via Convex subscriptions
- **Performance**: No polling required, updates pushed to clients within ~100ms

## Data Retention

- **Active Sessions**: Kept until expiration or explicit logout
- **Expired Sessions**: Deleted by background job (daily cleanup)
- **Verification Tokens**: Deleted immediately after use or expiration
- **Users**: Configurable soft delete or hard delete policy
- **OAuth Accounts**: Kept until user explicitly unlinks provider
