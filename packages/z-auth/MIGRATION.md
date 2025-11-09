# Migration Guide: From @auth/* packages to @workspace/z-auth

This guide helps you migrate from the old multi-package architecture (`@auth/core`, `@auth/web`, `@auth/ui`, etc.) to the new unified `@workspace/z-auth` package.

## Why Migrate?

The unified package offers several advantages:

- **Simpler dependency management**: One package instead of 7+
- **Easier setup**: One function call instead of multiple configurations
- **Better DX**: Autocomplete and types work seamlessly
- **Consistent versioning**: All features versioned together
- **Reduced bundle size**: Better tree-shaking and code sharing

## Migration Overview

| Before (Old) | After (New) |
|--------------|-------------|
| `@auth/core` | `@workspace/z-auth/core` |
| `@auth/web` | `@workspace/z-auth/react` |
| `@auth/ui` | `@workspace/z-auth/react` (UI components) |
| `@auth/types` | `@workspace/z-auth/types` |
| `@auth/utils` | `@workspace/z-auth/utils` |
| `@auth/backend` | `@workspace/z-auth/backend` |
| `@auth/config` | `@workspace/z-auth/nextjs` (for Next.js) |

## Step-by-Step Migration

### Step 1: Update Dependencies

**Before** (`package.json`):
```json
{
  "dependencies": {
    "@auth/core": "workspace:*",
    "@auth/web": "workspace:*",
    "@auth/ui": "workspace:*",
    "@auth/types": "workspace:*",
    "@auth/utils": "workspace:*",
    "@workspace/backend": "workspace:*"
  }
}
```

**After** (`package.json`):
```json
{
  "dependencies": {
    "@workspace/z-auth": "workspace:*"
  }
}
```

Run the update:
```bash
pnpm remove @auth/core @auth/web @auth/ui @auth/types @auth/utils @auth/config
pnpm add @workspace/z-auth
```

### Step 2: Update Frontend Setup

**Before** (`lib/auth/auth-client.ts` + `lib/auth/auth-provider.tsx` + `lib/auth/hooks.ts`):
```typescript
// lib/auth/auth-client.ts
import { createAuthClient } from "@auth/web";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
});

// lib/auth/auth-provider.tsx
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "./auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function AuthProvider({ children }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}

// lib/auth/hooks.ts
export { useAuth, useSession, useUser } from "@auth/web";

// lib/auth/components.ts
export { SignInForm, SignUpForm } from "@auth/ui";
```

**After** (`lib/auth/setup.ts` - single file!):
```typescript
import { createAuth } from "@workspace/z-auth/nextjs";

export const auth = createAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
});

// Export everything you need
export const {
  AuthProvider,
  useAuth,
  useSession,
  useUser,
  useSignIn,
  useSignUp,
  useSignOut,
  components,
} = auth;

// Optionally, re-export components for convenience
export const {
  Forms: { SignInForm, SignUpForm, UpdateProfileForm },
  Guards: { SessionGuard, RoleGuard },
  Display: { UserAvatar, UserMenu },
  Actions: { SignOutButton, SocialAuthButtons },
} = auth.components;
```

### Step 3: Update API Routes

**Before** (`app/api/auth/[...all]/route.ts`):
```typescript
import { nextJsHandler } from "@convex-dev/better-auth/nextjs";

export const { GET, POST } = nextJsHandler();
```

**After** (`app/api/auth/[...all]/route.ts`):
```typescript
// Option 1: Use pre-built handlers (simplest)
export { GET, POST } from "@workspace/z-auth/nextjs/handler";

// Option 2: Custom handlers (if needed)
import { createHandlers } from "@workspace/z-auth/nextjs/handler";
export const { GET, POST } = createHandlers();
```

### Step 4: Update Import Statements

Use find-and-replace to update imports throughout your codebase:

| Old Import | New Import |
|------------|------------|
| `from "@auth/web"` | `from "@workspace/z-auth/react"` |
| `from "@auth/ui"` | `from "@workspace/z-auth/react"` |
| `from "@auth/types"` | `from "@workspace/z-auth/types"` |
| `from "@auth/utils"` | `from "@workspace/z-auth/utils"` |
| `from "@auth/core"` | `from "@workspace/z-auth/core"` |

**Before**:
```typescript
import { useAuth, useSession } from "@auth/web";
import { SignInForm } from "@auth/ui";
import type { User, Session } from "@auth/types";
import { validateClientEnv } from "@auth/utils";
```

**After**:
```typescript
// Option 1: Import from your setup file (recommended)
import { useAuth, useSession, SignInForm } from "@/lib/auth/setup";
import type { User, Session } from "@workspace/z-auth/types";

// Option 2: Direct imports
import { useAuth, useSession } from "@workspace/z-auth/react";
import { SignInForm } from "@workspace/z-auth/react";
import type { User, Session } from "@workspace/z-auth/types";
import { validateClientEnv } from "@workspace/z-auth/utils";
```

### Step 5: Update Backend (Optional but Recommended)

If you have a custom Convex backend, you can use the new backend factory:

**Before** (`convex/auth.ts`):
```typescript
import { betterAuth } from "better-auth";
import { convexAdapter } from "@convex-dev/better-auth";
import { components } from "./_generated/api";

export const auth = betterAuth({
  database: convexAdapter(components.betterAuth),
  baseURL: process.env.SITE_URL!,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
```

**After** (`convex/auth.ts`):
```typescript
import { createConvexBackend } from "@workspace/z-auth/backend";
import { components } from "./_generated/api";

export const auth = createConvexBackend({
  components,
  baseURL: process.env.SITE_URL!,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
```

### Step 6: Update Layout/Provider Usage

**Before** (`app/layout.tsx`):
```typescript
import { AuthProvider } from "@/lib/auth/auth-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

**After** (`app/layout.tsx`):
```typescript
import { AuthProvider } from "@/lib/auth/setup";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## Component Migration Examples

### Forms

**Before**:
```typescript
import { SignInForm, SignUpForm } from "@auth/ui";

// Usage is the same
<SignInForm redirectTo="/dashboard" />
<SignUpForm redirectTo="/dashboard" />
```

**After**:
```typescript
import { SignInForm, SignUpForm } from "@/lib/auth/setup";

// Usage is identical
<SignInForm redirectTo="/dashboard" />
<SignUpForm redirectTo="/dashboard" />
```

### Guards

**Before**:
```typescript
import { SessionGuard, RoleGuard } from "@auth/ui";

<SessionGuard>
  <ProtectedContent />
</SessionGuard>

<RoleGuard allowedRoles={["admin"]}>
  <AdminPanel />
</RoleGuard>
```

**After**:
```typescript
import { SessionGuard, RoleGuard } from "@/lib/auth/setup";

// Usage is identical
<SessionGuard>
  <ProtectedContent />
</SessionGuard>

<RoleGuard allowedRoles={["admin"]}>
  <AdminPanel />
</RoleGuard>
```

### Hooks

**Before**:
```typescript
import { useAuth, useSession, useUser } from "@auth/web";

function Profile() {
  const auth = useAuth();
  const { data: session } = useSession();
  const { user } = useUser();

  return <div>Welcome, {user?.name}</div>;
}
```

**After**:
```typescript
import { useAuth, useSession, useUser } from "@/lib/auth/setup";

// Usage is identical
function Profile() {
  const auth = useAuth();
  const { data: session } = useSession();
  const { user } = useUser();

  return <div>Welcome, {user?.name}</div>;
}
```

## New Features Available After Migration

### Error Boundary

```typescript
import { AuthErrorBoundary } from "@/lib/auth/setup";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <AuthErrorBoundary>
        {children}
      </AuthErrorBoundary>
    </AuthProvider>
  );
}
```

### Backend Factory

```typescript
import { createConvexBackend } from "@workspace/z-auth/backend";

export const auth = createConvexBackend({
  components,
  // Configuration with sensible defaults
});
```

## Breaking Changes

### 1. Import Paths
- All imports now use `@workspace/z-auth` as the base
- Subpaths changed: `/react`, `/nextjs`, `/types`, `/utils`, `/backend`

### 2. Setup Pattern
- Old: Multiple files for client, provider, hooks
- New: Single `createAuth()` call in one file

### 3. Backend Setup
- Old: Manual Better Auth configuration
- New: Optional `createConvexBackend()` factory with defaults

### 4. Component Exports
- Old: Separate packages for UI components
- New: All components under `components` object from `createAuth()`

## No Breaking Changes

✅ Component APIs remain the same
✅ Hook APIs remain the same
✅ Type definitions remain compatible
✅ Backend configuration is optional
✅ Environment variables unchanged

## Troubleshooting

### Issue: "Cannot find module '@auth/web'"

**Solution**: Update imports to `@workspace/z-auth/react`

### Issue: "createAuth is not a function"

**Solution**: Make sure you're importing from `@workspace/z-auth/nextjs`:
```typescript
import { createAuth } from "@workspace/z-auth/nextjs";
```

### Issue: "Components not found"

**Solution**: Components are now nested under `auth.components`:
```typescript
const auth = createAuth({ ... });
const { SignInForm } = auth.components.Forms;
```

### Issue: Types not working

**Solution**: Make sure TypeScript can find the types:
```typescript
import type { User, Session } from "@workspace/z-auth/types";
```

### Issue: Backend still using old packages

**Solution**: Update backend to use new factory or keep manual configuration (both work)

## Validation Checklist

After migration, verify:

- [ ] App builds without errors (`pnpm build`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Authentication flows work (sign in, sign up, sign out)
- [ ] Protected routes still work
- [ ] OAuth providers redirect correctly
- [ ] Session persists across page refreshes
- [ ] All components render correctly
- [ ] No console errors related to auth

## Rollback Plan

If you need to rollback:

1. **Keep your old code in git**:
   ```bash
   git stash
   ```

2. **Restore old dependencies**:
   ```bash
   pnpm add @auth/core @auth/web @auth/ui @auth/types @auth/utils
   pnpm remove @workspace/z-auth
   ```

3. **Restore old files**:
   ```bash
   git stash pop
   ```

4. **Restart dev server**:
   ```bash
   pnpm dev
   ```

## Getting Help

- Check the [README](./README.md) for usage examples
- Review the [CHANGELOG](./CHANGELOG.md) for recent changes
- Check existing auth setup in `apps/web/lib/auth/setup.ts` for reference
- Open an issue on GitHub if you encounter problems

## Next Steps

After successful migration:

1. **Clean up**: Remove old unused files
2. **Update documentation**: Update your team's internal docs
3. **Test thoroughly**: Run full test suite
4. **Deploy**: Deploy to staging first, then production
5. **Monitor**: Watch for any auth-related errors in production

## Benefits You'll See

After migration, you'll enjoy:

- ✅ **80% less boilerplate** - One file instead of 4+
- ✅ **Faster development** - Better autocomplete and types
- ✅ **Easier maintenance** - Single source of truth
- ✅ **Better performance** - Optimized bundle size
- ✅ **Future-proof** - Easier to upgrade and add features

## Frequently Asked Questions

**Q: Do I have to migrate all at once?**
A: No, but it's recommended. The new package is designed for easy migration.

**Q: Will my existing data/sessions be affected?**
A: No, the underlying Better Auth and Convex integration remain the same.

**Q: Can I use both old and new packages temporarily?**
A: Not recommended. It will cause conflicts and increase bundle size.

**Q: What about mobile apps (React Native)?**
A: Currently focused on web. React Native support coming in future release.

**Q: Is this a breaking change?**
A: Yes, but migration is straightforward and documented here.

**Q: How long does migration take?**
A: Typically 15-30 minutes for a small to medium app.

---

**Last Updated**: 2024-11-09
**Package Version**: 1.0.0
