# AI Coding Agent Instructions

## Project Overview

This is a **pnpm monorepo** for building a reusable **Better Auth + Convex authentication system** with:
- **Frontend**: Next.js 16 (App Router) with React 19 and TurboPack
- **Backend**: Convex (serverless database and functions) + Better Auth
- **UI**: Shared shadcn/ui component library using Tailwind CSS v4
- **Tooling**: Turborepo, Biome (linting/formatting), TypeScript 5.9

## Architecture & Structure

```
better-convex-auth/
├── apps/
│   └── web/                       # Next.js web application
├── packages/
│   ├── auth/                      # Better Auth modules
│   │   ├── core/                  # Better Auth + Convex integration
│   │   ├── ui/                    # Auth UI components (SignIn/SignUp forms)
│   │   ├── hooks/                 # React hooks (useAuth, useSignIn, etc.)
│   │   ├── types/                 # Shared TypeScript types
│   │   └── utils/                 # Validators, encryption, rate-limit
│   ├── backend/                   # Convex backend (database, functions)
│   ├── ui/                        # Shared shadcn/ui components
│   └── typescript-config/         # Shared TypeScript configurations
```

### Key Design Decisions

1. **Auth Package Structure**: Modular auth packages under `packages/auth/`
   - `@auth/core`: Better Auth + Convex adapter, email providers (Resend)
   - `@auth/ui`: Reusable auth components (forms, providers)
   - `@auth/hooks`: React hooks for auth operations
   - `@auth/types`: Shared types (User, Session, Organization)
   - `@auth/utils`: Validation, encryption, token generation

2. **Workspace Package Imports**: Use `@workspace/*` and `@auth/*` namespaces
   - UI: `import { Button } from "@workspace/ui/components/button"`
   - Auth: `import { useAuth } from "@auth/hooks"`
   - Core: `import { createAuthInstance } from "@auth/core"`

3. **Better Auth + Convex Integration**: 
   - Better Auth handles authentication logic and providers
   - Convex provides database adapter and serverless functions
   - Auth config in `packages/backend/convex/auth.config.ts`
   - HTTP routes mounted in `packages/backend/convex/http.ts`

4. **Monorepo Strategy**: 
   - Each package is independently buildable with its own `package.json`
   - Turborepo orchestrates task execution (build, dev, lint) with dependency graph
   - `pnpm-workspace.yaml` defines workspace structure: `apps/*` and `packages/**`
## Authentication Features

✅ Email/Password • Social OAuth (Google, GitHub, Apple, Discord) • Magic Links • Email OTP • 2FA/MFA • Passkeys • Organizations • Rate limiting • Session management

## Critical Developer Workflows

### Development Commands

```bash
pnpm dev           # Start all dev servers (Next.js, Convex)
pnpm build         # Build all packages
pnpm format        # Format code (Biome)
pnpm check         # Lint & auto-fix
```

### Adding Auth Packages

When creating new auth packages:
```
packages/auth/<package-name>/
  ├── src/
  │   └── index.ts
  ├── package.json
  └── tsconfig.json
```

Use workspace protocol: `"@auth/types": "workspace:*"`

### Adding shadcn/ui Components

Always run from monorepo root: `pnpm dlx shadcn@latest add <component-name> -c apps/web`

This places components in `packages/ui/src/components/` for workspace-wide reuse.

### Convex + Better Auth Setup

**Backend Configuration** (`packages/backend/convex/auth.config.ts`):
```typescript
import { betterAuth } from "better-auth";
import { organization, twoFactor, passkey } from "better-auth/plugins";

export const auth = betterAuth({
  database: new ConvexAdapter({ url, apiKey }),
  plugins: [organization(), twoFactor(), passkey()],
  emailAndPassword: { enabled: true },
  socialProviders: { google, github, apple },
});
```

**HTTP Routes** (`packages/backend/convex/http.ts`):
```typescript
http.route({ path: "/auth", method: "GET", handler: auth.handler });
http.route({ path: "/auth", method: "POST", handler: auth.handler });
```

## Code Conventions

**Biome**: 120 char line width, double quotes, space indentation, auto-organize imports, excludes `_generated/`

**TypeScript**: Strict mode, NodeNext modules (base), ESNext (Next.js)

**Path aliases**: `@/*` (web root), `@workspace/ui/*` (UI package), `@auth/*` (auth packages)

**File naming**: Auth packages in `packages/auth/<core|ui|hooks|types|utils>/src/`, components `PascalCase.tsx`, hooks `use-kebab-case.ts`, Convex functions `camelCase.ts`

## Integration Points

### Next.js ↔ Auth Packages

**Client Setup** (`apps/web/lib/auth/auth-client.ts`):
```typescript
import { createClientAuthInstance } from "@auth/core/client";

export const authClient = createClientAuthInstance("/api/auth", {
  organization: true, twoFactor: true, passkey: true,
});
```

**Provider** (`apps/web/components/providers/index.tsx`):
```typescript
export function Providers({ children }) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>{children}</AuthProvider>
    </ConvexProvider>
  );
}
```

### Convex Schema for Auth

```typescript
export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
  }).index("by_email", ["email"]),
  
  sessions: defineTable({
    token: v.string(),
    userId: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
  
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.string(),
  }).index("by_slug", ["slug"]),
});
```

## Common Gotchas

1. **Always use `pnpm`** (enforced by `packageManager` field, requires pnpm 10.4.1+)
2. **Node.js 20+ required** (specified in root `package.json` engines)
3. **Biome replaces ESLint/Prettier** - don't add them back
4. **Convex functions must have validators** - use `v` from `convex/values` for args
5. **Better Auth environment variables**: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` required
6. **OAuth setup**: Each provider needs client ID/secret in environment variables
7. **Email service**: Configure Resend with `RESEND_API_KEY` for verification emails
8. **Auth packages use workspace protocol**: `"@auth/types": "workspace:*"`

## Active Technologies
- TypeScript 5.9.3 with strict mode enabled
- Convex serverless database (document-oriented, real-time sync)
- Better Auth 1.2+ (TypeScript authentication framework)
- Resend (email service for verification/OTP)
- Next.js 16 (App Router, React 19, TurboPack)
- Tailwind CSS v4

## Recent Changes
- 001-auth-packages: Added auth package structure with Better Auth + Convex integration
