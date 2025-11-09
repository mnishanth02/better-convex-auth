# Migration Guide: From Modular Packages to @workspace/z-auth

**Version**: 2.0.0  
**Date**: November 9, 2025  
**Status**: Complete ✅

## Overview

This guide helps you migrate from the old modular auth packages (`@auth/*`) to the new unified `@workspace/z-auth` package.

### What's Changing?

**Old Architecture** (Deprecated):
- 8 separate packages: `@auth/core`, `@auth/web`, `@auth/ui`, `@auth/types`, `@auth/utils`, `@auth/config`, `@auth/quickstart`, `@auth/backend`
- Shared backend: `@workspace/backend`
- Complex setup with multiple imports
- 20+ path mappings in `tsconfig.json`

**New Architecture** (Current):
- 1 unified package: `@workspace/z-auth`
- App-specific backends (each app has its own `convex/` directory)
- Simple setup with single configuration file
- 2 path mappings in `tsconfig.json`

### Benefits

| Feature | Old | New | Improvement |
|---------|-----|-----|-------------|
| **Packages** | 8 packages | 1 package | 88% reduction |
| **Dependencies** | 11 total | 2 total | 82% reduction |
| **Setup Files** | 4+ files | 1 file | 75% reduction |
| **Import Sources** | 8 different | 1 single | 88% reduction |
| **TypeScript Paths** | 20+ mappings | 2 mappings | 90% reduction |
| **Backend** | Shared | App-specific | Independent |

---

## Quick Start Migration

### Step 1: Remove Old Packages

```bash
cd your-app

# Remove all old auth packages
pnpm remove @auth/core @auth/web @auth/ui @auth/types \
             @auth/utils @auth/config @auth/quickstart \
             @auth/backend @workspace/backend
```

### Step 2: Install Unified Package

```bash
# Add the unified auth package
pnpm add @workspace/z-auth

# Add Convex helpers (if not already installed)
pnpm add convex-helpers @convex-dev/resend
```

### Step 3: Create App-Specific Backend

```bash
# Create convex directory
mkdir convex

# Copy templates from z-auth package
cp node_modules/@workspace/z-auth/templates/* convex/

# Initialize Convex
npx convex dev
```

This will:
- Create `.env.local` with `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Generate `convex/_generated/` directory with types
- Set up Better Auth and Resend components

### Step 4: Create Auth Setup File

Create `lib/auth/setup.ts`:

```typescript
"use client";

import { createAuth } from "@workspace/z-auth/nextjs";

// Get environment variables
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is required");
}

// Create auth instance
const auth = createAuth({
  convexUrl,
  baseURL,
});

// Export everything
export const {
  AuthProvider,
  useAuth,
  useSession,
  useUser,
  useSignIn,
  useSignUp,
  useSignOut,
  useAuthClient,
  withAuth,
  withSession,
  withEmailVerified,
  components,
} = auth;

// Re-export components for convenience
export const {
  Forms: { 
    SignInForm, 
    SignUpForm, 
    UpdateProfileForm, 
    ChangePasswordForm, 
    ForgotPasswordForm, 
    ResetPasswordForm 
  },
  Guards: { 
    SessionGuard, 
    RoleGuard, 
    EmailVerifiedGuard 
  },
  Display: { 
    UserAvatar, 
    UserBadge, 
    UserMenu 
  },
  Actions: { 
    SignOutButton, 
    SocialAuthButtons 
  },
  Feedback: { 
    PasswordStrengthIndicator 
  },
  Utils: { 
    OAuthRedirectHandler 
  },
} = auth.components;

// Add getUserRole helper
export type UserRole = "user" | "moderator" | "admin";

export function getUserRole(user: unknown): UserRole | undefined {
  if (user && typeof user === "object" && "role" in user) {
    return (user as { role: UserRole }).role;
  }
  return undefined;
}
```

### Step 5: Update API Route

Update `app/api/auth/[...all]/route.ts`:

```typescript
import { GET, POST } from "@workspace/z-auth/nextjs/handler";
export { GET, POST };
```

### Step 6: Update tsconfig.json

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@workspace/ui/*": ["../../packages/ui/src/*"],
      // Remove all old @auth/* paths
      // Add only these two:
      "@workspace/z-auth": ["../../packages/z-auth/src/index.ts"],
      "@workspace/z-auth/*": ["../../packages/z-auth/src/*"]
    }
  }
}
```

### Step 7: Update All Imports

**Before**:
```typescript
import { useUser, useSession } from "@auth/web";
import { SignInForm, UserAvatar } from "@auth/ui";
import { getUserRole } from "@auth/types";
import { api } from "@workspace/backend/convex/_generated/api";
```

**After**:
```typescript
import { useUser, useSession, SignInForm, UserAvatar, getUserRole } from "@/lib/auth/setup";
import { api } from "@/convex/_generated/api";
```

---

## Detailed Migration by Package

### @auth/web → @workspace/z-auth

All React hooks are now exported from your `lib/auth/setup.ts` file.

**Before**:
```typescript
import { 
  useAuth, 
  useSession, 
  useUser,
  useSignIn,
  useSignUp,
  useSignOut 
} from "@auth/web";

function MyComponent() {
  const { user } = useUser();
  const signOut = useSignOut();
  // ...
}
```

**After**:
```typescript
import { 
  useAuth, 
  useSession, 
  useUser,
  useSignIn,
  useSignUp,
  useSignOut 
} from "@/lib/auth/setup";

function MyComponent() {
  const { user } = useUser();
  const signOut = useSignOut();
  // Same usage!
}
```

### @auth/ui → @workspace/z-auth

All UI components are exported from your `lib/auth/setup.ts` file.

**Before**:
```typescript
import { 
  SignInForm,
  SignUpForm,
  UserAvatar,
  UserMenu,
  RoleGuard,
  SessionGuard,
  SignOutButton
} from "@auth/ui";
```

**After**:
```typescript
import { 
  SignInForm,
  SignUpForm,
  UserAvatar,
  UserMenu,
  RoleGuard,
  SessionGuard,
  SignOutButton
} from "@/lib/auth/setup";
```

### @auth/types → @workspace/z-auth

Types and type utilities are available from `lib/auth/setup.ts` or directly from `@workspace/z-auth/types`.

**Before**:
```typescript
import type { User, Session, UserRole } from "@auth/types";
import { getUserRole, hasRole } from "@auth/types";
```

**After**:
```typescript
import type { UserRole } from "@/lib/auth/setup";
import { getUserRole } from "@/lib/auth/setup";

// Or import types directly
import type { 
  AuthConfig, 
  AuthSession,
  AuthUser 
} from "@workspace/z-auth/types";
```

### @auth/core → @workspace/z-auth

Core utilities are either built-in to the unified package or can be implemented locally.

**Before**:
```typescript
import { 
  getUserDisplayName,
  getUserInitials,
  hasRole,
  isAdmin 
} from "@auth/core";
```

**After**:
```typescript
// Implement utilities locally (simple functions)
function getUserDisplayName(user: unknown): string {
  if (user && typeof user === "object" && "name" in user) {
    return user.name as string;
  }
  if (user && typeof user === "object" && "email" in user) {
    return (user.email as string).split("@")[0];
  }
  return "User";
}

function hasRole(user: unknown, role: string): boolean {
  if (user && typeof user === "object" && "role" in user) {
    return user.role === role;
  }
  return false;
}

// Or use the built-in getUserRole
import { getUserRole } from "@/lib/auth/setup";
```

### @auth/utils → @workspace/z-auth

Utilities are available from `@workspace/z-auth/utils`.

**Before**:
```typescript
import { validateEnv, hashPassword } from "@auth/utils";
```

**After**:
```typescript
import { validateEnv } from "@workspace/z-auth/utils";

// Or use Zod directly
import { z } from "zod";
const envSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.string(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});
const env = envSchema.parse(process.env);
```

### @auth/config → @workspace/z-auth

Configuration is now done via `createAuth()` function.

**Before**:
```typescript
import { authConfig, validateAuthConfig } from "@auth/config";

const config = authConfig({
  baseURL: process.env.SITE_URL,
  // ... many options
});
```

**After**:
```typescript
import { createAuth } from "@workspace/z-auth/nextjs";

const auth = createAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL || "",
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
});

// That's it! Configuration is automatic
```

### @auth/quickstart → @workspace/z-auth

The new unified package is even simpler than the old quickstart.

**Before**:
```typescript
import { setupAuth } from "@auth/quickstart";

const auth = setupAuth();

export const {
  AuthProvider,
  useAuth,
  // ... many exports
} = auth;
```

**After**:
```typescript
import { createAuth } from "@workspace/z-auth/nextjs";

const auth = createAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL || "",
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
});

export const { AuthProvider, useAuth, /* ... */ } = auth;
```

### @auth/backend & @workspace/backend → App-Specific Backend

Each app now has its own Convex backend.

**Before**:
```typescript
// Shared backend
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
```

**After**:
```typescript
// App-specific backend
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
```

**Backend Setup**:
```bash
# 1. Create convex directory
mkdir convex

# 2. Copy templates
cp node_modules/@workspace/z-auth/templates/* convex/

# 3. Customize templates for your app
# - auth.ts: Configure OAuth providers
# - schema.ts: Add app-specific tables
# - http.ts: Add custom routes

# 4. Initialize
npx convex dev
```

---

## Component Migration Examples

### Example 1: Sign In Page

**Before**:
```typescript
"use client";

import { SignInForm } from "@auth/ui";
import { useSession } from "@auth/web";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const { session } = useSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
    </div>
  );
}
```

**After**:
```typescript
"use client";

import { SignInForm, useSession } from "@/lib/auth/setup";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const { session } = useSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
    </div>
  );
}
```

### Example 2: Protected Dashboard

**Before**:
```typescript
"use client";

import { SessionGuard } from "@auth/ui";
import { useUser } from "@auth/web";
import { UserAvatar, SignOutButton } from "@auth/ui";

export default function Dashboard() {
  return (
    <SessionGuard>
      <DashboardContent />
    </SessionGuard>
  );
}

function DashboardContent() {
  const { user } = useUser();
  
  return (
    <div>
      <UserAvatar user={user} />
      <h1>Welcome, {user?.name}</h1>
      <SignOutButton />
    </div>
  );
}
```

**After**:
```typescript
"use client";

import { 
  SessionGuard, 
  useUser, 
  UserAvatar, 
  SignOutButton 
} from "@/lib/auth/setup";

export default function Dashboard() {
  return (
    <SessionGuard>
      <DashboardContent />
    </SessionGuard>
  );
}

function DashboardContent() {
  const { user } = useUser();
  
  return (
    <div>
      <UserAvatar user={user} />
      <h1>Welcome, {user?.name}</h1>
      <SignOutButton />
    </div>
  );
}
```

### Example 3: Admin Page with Role Guard

**Before**:
```typescript
"use client";

import { RoleGuard } from "@auth/ui";
import { useUser } from "@auth/web";
import { getUserRole } from "@auth/types";

export default function AdminPage() {
  return (
    <RoleGuard roles={["admin"]} redirectTo="/dashboard">
      <AdminContent />
    </RoleGuard>
  );
}

function AdminContent() {
  const { user } = useUser();
  const role = getUserRole(user);
  
  return <div>Admin role: {role}</div>;
}
```

**After**:
```typescript
"use client";

import { 
  RoleGuard, 
  useUser, 
  getUserRole 
} from "@/lib/auth/setup";

export default function AdminPage() {
  return (
    <RoleGuard roles={["admin"]} redirectTo="/dashboard">
      <AdminContent />
    </RoleGuard>
  );
}

function AdminContent() {
  const { user } = useUser();
  const role = getUserRole(user);
  
  return <div>Admin role: {role}</div>;
}
```

---

## Environment Variables

### Before

```env
# Old shared backend
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Many auth configs
AUTH_BASE_URL=http://localhost:3000
AUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

### After

```env
# App-specific backend (auto-generated by convex dev)
CONVEX_DEPLOYMENT=dev:your-app-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-app-deployment.convex.cloud

# Simple config
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OAuth (optional, same as before)
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
GITHUB_CLIENT_ID=your-id
GITHUB_CLIENT_SECRET=your-secret
```

---

## Troubleshooting

### Issue: "Cannot find module '@auth/web'"

**Solution**: Update all imports to use `@/lib/auth/setup`:
```typescript
// ❌ Old
import { useUser } from "@auth/web";

// ✅ New
import { useUser } from "@/lib/auth/setup";
```

### Issue: "Cannot find module '@/convex/_generated/api'"

**Solution**: Initialize Convex in your app:
```bash
cd your-app
npx convex dev
```

This generates the `_generated` directory.

### Issue: TypeScript errors about missing types

**Solution**: Update `tsconfig.json` paths:
```jsonc
{
  "compilerOptions": {
    "paths": {
      // Remove old paths
      // "@auth/*": ["..."],
      
      // Add new paths
      "@workspace/z-auth": ["../../packages/z-auth/src/index.ts"],
      "@workspace/z-auth/*": ["../../packages/z-auth/src/*"]
    }
  }
}
```

### Issue: "NEXT_PUBLIC_CONVEX_URL is required"

**Solution**: Run `npx convex dev` to generate `.env.local` automatically, or add manually:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Issue: Convex components not found

**Solution**: Make sure your `convex/convex.config.ts` includes the Better Auth component:
```typescript
import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";

const app = defineApp();
app.use(betterAuth);

export default app;
```

---

## Checklist

Use this checklist to track your migration:

### Setup
- [ ] Remove all old `@auth/*` packages
- [ ] Install `@workspace/z-auth`
- [ ] Create `convex/` directory
- [ ] Copy templates from `@workspace/z-auth/templates/`
- [ ] Run `npx convex dev`
- [ ] Verify `.env.local` created with Convex URL

### Configuration
- [ ] Create `lib/auth/setup.ts`
- [ ] Configure `createAuth()` with environment variables
- [ ] Export all hooks and components
- [ ] Add `getUserRole()` helper (if needed)
- [ ] Update `app/api/auth/[...all]/route.ts`
- [ ] Update `tsconfig.json` paths

### Code Updates
- [ ] Update all `@auth/web` imports → `@/lib/auth/setup`
- [ ] Update all `@auth/ui` imports → `@/lib/auth/setup`
- [ ] Update all `@auth/types` imports → `@/lib/auth/setup`
- [ ] Update all `@workspace/backend` imports → `@/convex`
- [ ] Update Convex API imports
- [ ] Update component usage (should be same)

### Testing
- [ ] Run `pnpm typecheck` (fix any errors)
- [ ] Run `pnpm build` (verify build succeeds)
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test sign out flow
- [ ] Test protected routes
- [ ] Test role guards
- [ ] Test OAuth (if configured)

### Cleanup
- [ ] Remove old package references from `package.json`
- [ ] Remove old path mappings from `tsconfig.json`
- [ ] Delete any unused auth setup files
- [ ] Update documentation/README

---

## Migration Time Estimates

| App Size | Estimated Time | Complexity |
|----------|---------------|-----------|
| **Small** (1-5 files) | 15-30 minutes | Low |
| **Medium** (5-20 files) | 30-60 minutes | Medium |
| **Large** (20+ files) | 1-2 hours | Medium-High |

Most of the time is spent on:
1. Find/replace imports (automated with IDE)
2. Testing auth flows
3. Fixing TypeScript errors

---

## Benefits After Migration

### Developer Experience
✅ **Simpler imports**: One source instead of 8  
✅ **Faster setup**: 3 lines instead of 10+  
✅ **Better types**: Improved TypeScript inference  
✅ **Less confusion**: Clear single package  

### Performance
✅ **Smaller bundles**: 82% fewer dependencies  
✅ **Faster installs**: 88% fewer packages  
✅ **Better tree-shaking**: Subpath exports  

### Scalability
✅ **App isolation**: Each app has own backend  
✅ **Independent deployments**: No shared bottlenecks  
✅ **Flexible schemas**: Customize per app  
✅ **Type safety**: Generated types per app  

### Maintainability
✅ **Single source**: One package to update  
✅ **Clear boundaries**: Backend per app  
✅ **Easy to understand**: Simpler architecture  
✅ **Better docs**: Consolidated documentation  

---

## Need Help?

- **Migration Issues**: See [Troubleshooting](#troubleshooting) section
- **Backend Setup**: See [BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md)
- **API Reference**: See [packages/z-auth/README.md](../packages/z-auth/README.md)
- **Examples**: Check `apps/web` for complete working example

---

## Feedback

Encountered issues during migration? Please:
1. Check the troubleshooting section above
2. Review the complete example in `apps/web`
3. Open an issue with your specific problem

---

**Last Updated**: November 9, 2025  
**Package Version**: @workspace/z-auth@1.0.0
