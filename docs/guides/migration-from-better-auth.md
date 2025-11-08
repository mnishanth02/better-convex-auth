# Migration Guide: From Better Auth to Better Convex Auth

This guide helps you migrate from a standard Better Auth setup to our Better Auth + Convex integration.

## Overview

Better Convex Auth extends Better Auth with:
- Seamless Convex database integration
- Type-safe authentication system
- Real-time session synchronization
- Pre-built UI components
- Simplified configuration management

## Prerequisites

- Existing Better Auth project
- Node.js 20+
- pnpm 10.4.1+
- Convex account (free tier available)

## Migration Steps

### 1. Install Dependencies

```bash
# Remove old Better Auth packages (if applicable)
pnpm remove better-auth

# Install Better Convex Auth packages
pnpm add @auth/core @auth/web @auth/ui @auth/config @auth/types
pnpm add @convex-dev/better-auth convex
```

### 2. Update Convex Schema

Add authentication tables to your Convex schema (`convex/schema.ts`):

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Authentication tables
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"]),

  sessions: defineTable({
    token: v.string(),
    userId: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  accounts: defineTable({
    userId: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refreshToken: v.optional(v.string()),
    accessToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["provider", "providerAccountId"]),

  verificationTokens: defineTable({
    identifier: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("by_identifier", ["identifier"])
    .index("by_token", ["token"]),
});
```

### 3. Configure Convex Auth Backend

Create or update `packages/backend/convex/auth.config.ts`:

```typescript
import { createClient } from "@convex-dev/better-auth";
import { createConvexAuth } from "@auth/core";

// Initialize the Better Auth + Convex client
export const authComponent = createClient({
  convexUrl: process.env.CONVEX_URL!,
});

// Create auth instance
export const auth = createConvexAuth(authComponent, {
  adapter: authComponent.adapter(),
  baseURL: process.env.SITE_URL || "http://localhost:3000",
  
  emailPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  
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
});
```

### 4. Mount Auth Routes

Update `packages/backend/convex/http.ts`:

```typescript
import { httpRouter } from "convex/server";
import { auth } from "./auth.config";

const http = httpRouter();

// Mount Better Auth routes
http.route({
  path: "/api/auth",
  method: "GET",
  handler: auth.handler,
});

http.route({
  path: "/api/auth",
  method: "POST",
  handler: auth.handler,
});

export default http;
```

### 5. Set Up Client-Side Provider

Update your app provider (`apps/web/components/providers/index.tsx`):

```typescript
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createAuthClient } from "@auth/web";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const authClient = createAuthClient({
  baseURL: "/api/auth",
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AuthClientProvider client={authClient}>
        {children}
      </AuthClientProvider>
    </ConvexProvider>
  );
}
```

### 6. Update Environment Variables

Add these to your `.env.local`:

```bash
# Convex
CONVEX_URL=your-convex-url
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# Site URL
SITE_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 7. Use Pre-Built UI Components

Replace custom auth forms with our pre-built components:

**Before** (Custom form):
```tsx
function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Custom sign-in logic...
}
```

**After** (Pre-built component):
```tsx
import { SignInForm } from "@auth/ui";

function SignInPage() {
  return <SignInForm redirectTo="/dashboard" />;
}
```

### 8. Update Authentication Hooks

Replace Better Auth hooks with our integrated hooks:

**Before**:
```tsx
import { useSession } from "better-auth/react";
```

**After**:
```tsx
import { useSession } from "@auth/web";
```

All hooks maintain the same API, so no code changes needed!

## Breaking Changes

### Schema Changes
- User IDs are now managed by Convex (`_id` field)
- Timestamps use milliseconds instead of ISO strings

### Session Management
- Sessions are stored in Convex instead of cookies/database
- Real-time session updates enabled by default

### Configuration
- Configuration now centralized in `@auth/config` package
- Environment variables follow new naming convention

## Validation Checklist

After migration, verify:

- [ ] Authentication flows work (sign in, sign up, sign out)
- [ ] OAuth providers redirect correctly
- [ ] Email verification sends and validates
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect unauthenticated users
- [ ] User data displays correctly in UI

## Rollback Plan

If you need to rollback:

1. Keep your old Better Auth configuration
2. Switch environment variables back
3. Update import statements
4. Restart development server

## Need Help?

- Check [Troubleshooting Guide](./troubleshooting.md)
- Review [Recipes](./recipes.md) for common patterns
- Open an issue on GitHub

## Next Steps

- Explore [advanced features](../auth-spekkit/speckit-complete-guide.md)
- Set up [email verification](./recipes.md#email-verification)
- Configure [rate limiting](./recipes.md#rate-limiting)
- Add [multi-tenant support](./recipes.md#organizations)
