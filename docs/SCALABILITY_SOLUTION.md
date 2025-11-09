# Better Convex Auth - Scalability Solution

## Problem Summary

The current auth module architecture is **not scalable** for turborepo applications due to:

1. ❌ **Too many packages** - Apps need 7+ package installs
2. ❌ **Backend coupling** - Apps tied to workspace backend package
3. ❌ **Complex setup** - 4+ files needed for configuration
4. ❌ **Framework locked** - Only works with Next.js App Router
5. ❌ **Outdated docs** - Instructions don't match implementation

## Recommended Solution

### Architecture: Unified Entry Point

Create a **single package** that works like modern libraries (Radix UI, Clerk, Auth.js):

```
@workspace/auth  (or @better-convex-auth for npm)
  ├── /nextjs      → Next.js App Router adapter
  ├── /remix       → Remix adapter (future)
  ├── /react       → React hooks & components
  ├── /types       → TypeScript types
  └── /utils       → Utilities
```

### Target Developer Experience

#### 1. Single Package Install
```bash
pnpm add @workspace/auth
```

#### 2. One-File Setup
```typescript
// lib/auth.ts
import { createAuth } from "@workspace/auth/nextjs";

export const auth = createAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  // Optional: customize
  storagePrefix: "my-app",
  expectAuth: false,
});

// Re-export everything for easy imports
export const { 
  AuthProvider, 
  useAuth, 
  useSession, 
  useUser,
  SignInForm,
  SignUpForm,
  SessionGuard 
} = auth;
```

#### 3. Auto-Setup API Routes
```typescript
// app/api/auth/[...all]/route.ts (ONE LINE!)
export { GET, POST } from "@workspace/auth/nextjs/handler";
```

#### 4. Provider (One Line)
```typescript
// app/layout.tsx
import { AuthProvider } from "@/lib/auth";

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

#### 5. Use Anywhere
```typescript
import { useUser, SignOutButton } from "@/lib/auth";

export default function Profile() {
  const { user, isPending } = useUser();
  
  if (isPending) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <SignOutButton />
    </div>
  );
}
```

### Implementation Plan

#### Phase 1: Create Unified Package
- [ ] Create `packages/z-auth/`
- [ ] Move all exports to single entry point
- [ ] Create framework adapters: `/nextjs`, `/react`
- [ ] Bundle API route handlers
- [ ] Include env validation utilities

#### Phase 2: Decouple Backend
- [ ] Make backend configuration app-specific
- [ ] Allow apps to provide their own Convex URL
- [ ] Remove dependency on `@workspace/backend`
- [ ] Create backend setup utilities for apps

#### Phase 3: Documentation
- [ ] Update `.github/copilot-instructions.md`
- [ ] Create comprehensive quickstart guide
- [ ] Add turborepo app scaffolding examples
- [ ] Document migration from current setup

#### Phase 4: Examples
- [ ] Create example Next.js app (minimal)
- [ ] Create example with custom backend
- [ ] Create example Remix app
- [ ] Create React Native example (future)

### Package Structure Details

```
@workspace/auth/
├── package.json
├── src/
│   ├── index.ts                    # Main exports
│   ├── nextjs/
│   │   ├── index.ts                # createAuth for Next.js
│   │   ├── handler.ts              # GET/POST route handlers
│   │   └── middleware.ts           # Auth middleware (future)
│   ├── react/
│   │   ├── hooks/                  # useAuth, useSession, etc.
│   │   ├── components/             # SignInForm, SignOutButton, etc.
│   │   ├── guards/                 # SessionGuard, RoleGuard
│   │   └── providers/              # AuthProvider
│   ├── types/
│   │   └── index.ts                # All TypeScript types
│   ├── utils/
│   │   ├── env.ts                  # Environment validation
│   │   ├── validation.ts           # Input validation
│   │   └── storage.ts              # Storage utilities
│   └── core/
│       ├── client.ts               # Auth client factory
│       └── config.ts               # Configuration types
```

### Internal Dependencies

The unified package should internally use:
- `better-auth` - Core authentication
- `@convex-dev/better-auth` - Convex integration
- `convex` - Convex client
- `zod` - Validation

But **consumers only install one package**.

### Environment Variables

Built-in validation for:
```env
# Required
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional (auto-detected)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...
```

### Backward Compatibility

Maintain current modular packages for backward compatibility:
- `@auth/web` → Re-export from `@workspace/auth/react`
- `@auth/ui` → Re-export from `@workspace/auth/react`
- `@auth/quickstart` → Deprecated, replaced by `@workspace/auth/nextjs`

### Success Metrics

A scalable auth module should enable:

✅ **5-Minute Setup** - New app to authenticated in 5 minutes  
✅ **Single Install** - One package, not 7+  
✅ **Framework Agnostic** - Next.js, Remix, Vite support  
✅ **Backend Flexible** - Apps use their own Convex deployment  
✅ **Zero Boilerplate** - Auto-handled API routes and env validation  
✅ **Type Safe** - Full TypeScript autocomplete  
✅ **Well Documented** - Clear guides matching implementation

## Comparison: Before vs After

### Before (Current - Not Scalable)
```json
// package.json
{
  "dependencies": {
    "@auth/quickstart": "workspace:*",
    "@auth/web": "workspace:*",
    "@auth/ui": "workspace:*",
    "@auth/types": "workspace:*",
    "@auth/backend": "workspace:*",
    "@workspace/backend": "workspace:*"
  }
}
```

Setup requires:
- 7 package installs
- 4 configuration files
- Custom env validation
- Manual API route setup
- Access to workspace backend

### After (Proposed - Scalable)
```json
// package.json
{
  "dependencies": {
    "@workspace/auth": "workspace:*"
  }
}
```

Setup requires:
- 1 package install
- 1 configuration file (lib/auth.ts)
- Built-in env validation
- Auto API routes (one-line export)
- Independent Convex deployment

## Migration Guide

For existing apps using current approach:

### Step 1: Install Unified Package
```bash
pnpm add @workspace/auth
```

### Step 2: Replace lib/auth/setup.ts
```typescript
// Before
import { setupAuth } from "@auth/quickstart";

// After
import { createAuth } from "@workspace/auth/nextjs";
```

### Step 3: Update API Routes
```typescript
// Before
import { nextJsHandler } from "@convex-dev/better-auth/nextjs";
export const { GET, POST } = nextJsHandler();

// After
export { GET, POST } from "@workspace/auth/nextjs/handler";
```

### Step 4: Remove Old Packages
```bash
pnpm remove @auth/quickstart @auth/web @auth/ui @auth/backend
```

### Step 5: Update Imports
```typescript
// Before
import { useAuth } from "@auth/web";
import { SignInForm } from "@auth/ui";

// After  
import { useAuth, SignInForm } from "@/lib/auth";
```

## Next Steps

1. **Review this proposal** - Validate approach
2. **Create unified package** - Implement @workspace/auth
3. **Migrate apps/web** - Use as proof of concept
4. **Update documentation** - Match new reality
5. **Test scalability** - Create new app in monorepo

## Questions to Address

1. Should the package be `@workspace/auth` or `@better-convex-auth` for npm?
2. Keep modular packages or deprecate completely?
3. How to handle backend configuration per-app?
4. Support other frameworks (Remix, SolidStart) in v1?
5. React Native support timeline?

---

**Conclusion**: Current implementation is **not scalable** for turborepo apps. The unified package approach solves all identified issues while maintaining flexibility and developer experience.
