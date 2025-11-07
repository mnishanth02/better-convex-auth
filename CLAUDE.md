# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Better Convex Auth** is a production-ready authentication system that integrates **Better Auth** with **Convex** (serverless backend). Built as a pnpm monorepo with Turborepo, it provides modular, type-safe, reusable authentication packages for web and mobile applications.

**Current Status**: Phase 1 implementation in progress on branch `001-auth-packages`. Basic auth is working; modular `@auth/*` packages are being extracted.

## Development Commands

```bash
# Start all dev servers (Next.js + Convex)
pnpm dev

# Build all packages
pnpm build

# Lint and auto-fix (Biome)
pnpm check

# Format code (Biome)
pnpm format

# Type check
cd apps/web && pnpm typecheck
cd packages/backend && pnpm typecheck

# Upgrade all dependencies
pnpm upgrade:all
```

### Package-Specific Commands

**Next.js Web App** (`apps/web/`):
```bash
cd apps/web
pnpm dev              # Start Next.js dev server with TurboPack
pnpm build            # Production build
pnpm start            # Start production server
pnpm typecheck        # Type check without emitting
```

**Convex Backend** (`packages/backend/`):
```bash
cd packages/backend
pnpm dev              # Start Convex dev server
pnpm deploy           # Deploy to production
pnpm typecheck        # Type check Convex functions
```

### Adding Components

**shadcn/ui components** (always from monorepo root):
```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

This places components in `packages/ui/src/components/` for workspace-wide reuse.

## High-Level Architecture

### Monorepo Structure

```
better-convex-auth/
├── apps/
│   └── web/                    # Next.js 16 App Router (React 19, TurboPack)
├── packages/
│   ├── auth/                   # Authentication packages (in progress)
│   │   ├── core/              # Better Auth + Convex adapter (@auth/core)
│   │   ├── ui/                # Auth UI components (@auth/ui)
│   │   ├── hooks/             # React hooks (@auth/hooks)
│   │   ├── types/             # Shared types (@auth/types)
│   │   └── utils/             # Validators, encryption (@auth/utils)
│   ├── backend/               # Convex backend (database + functions)
│   ├── ui/                    # Shared shadcn/ui components
│   └── typescript-config/     # Shared TypeScript configs
```

### Key Architecture Patterns

**1. Better Auth + Convex Integration**

Better Auth handles authentication logic; Convex provides the database adapter and serverless functions.

- **Auth Configuration**: `packages/backend/convex/auth.ts`
  - Creates Better Auth instance with Convex adapter
  - Configures providers (email/password, Google OAuth, etc.)
  - Enables plugins (organizations, 2FA, passkeys)

- **HTTP Routes**: `packages/backend/convex/http.ts`
  - Mounts auth routes at `/auth` endpoint
  - Handles GET/POST requests via `auth.handler`

- **Database Schema**: `packages/backend/convex/schema.ts`
  - Tables: `users`, `sessions`, `accounts` (OAuth)
  - Indexed by email, token, userId for efficient queries

**2. Authentication Flow**

1. Client makes request to `/auth/*` endpoint
2. Better Auth processes authentication (validate credentials, generate tokens)
3. Convex adapter stores session/user data in database
4. Client receives session token (stored in cookies/localStorage)
5. React hooks (via `@convex-dev/better-auth`) subscribe to session changes
6. Real-time session updates via Convex subscriptions

**3. Client-Side Setup**

- **Auth Client**: `apps/web/lib/auth/auth-client.ts`
  - Creates Better Auth client instance
  - Configures base URL and plugins

- **Provider**: `apps/web/components/providers/convex-client-provider.tsx`
  - Wraps app with `ConvexBetterAuthProvider`
  - Manages session state and cross-domain auth

**4. Modular Package Architecture** (Constitution Principle I)

Auth functionality is being extracted into independent `@auth/*` packages:

- `@auth/core`: Platform-agnostic authentication logic
- `@auth/ui`: Web/mobile UI components (split by platform)
- `@auth/hooks`: React hooks (useAuth, useSignIn, etc.)
- `@auth/types`: Shared TypeScript types (User, Session, Organization)
- `@auth/utils`: Validation, encryption, token generation

Each package:
- Has single responsibility
- Defines clear public API boundaries
- Uses workspace protocol: `"@auth/types": "workspace:*"`
- Can be independently versioned and published

**5. Workspace Package Imports**

```typescript
// UI components
import { Button } from "@workspace/ui/components/button"

// Auth packages (planned)
import { useAuth } from "@auth/hooks"
import { createAuthInstance } from "@auth/core"

// Backend (Convex)
import { api } from "@workspace/backend/convex/_generated/api"
```

**6. Turborepo Task Pipeline**

Tasks run in dependency order with caching:

```json
{
  "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },
  "lint": { "dependsOn": ["^lint"] },
  "dev": { "cache": false, "persistent": true }
}
```

The `^build` notation means "run build on all dependencies first."

## Code Conventions

### TypeScript Configuration

- **Strict mode enabled** across all packages
- **Module system**: NodeNext (base), ESNext (Next.js)
- **Module resolution**: NodeNext (base), Bundler (Next.js)
- **Path aliases**:
  - `@/*` maps to web app root (`apps/web/`)
  - `@workspace/ui/*` maps to UI package
  - `@workspace/backend/*` maps to backend package
  - `@auth/*` maps to auth packages (planned)

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `SignInForm.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-auth.ts`)
- **Convex functions**: `camelCase.ts` (e.g., `getUserById.ts`)
- **Auth packages**: `packages/auth/<package-name>/src/index.ts`

### Biome (Linting/Formatting)

Biome replaces ESLint and Prettier:

- **Line width**: 120 characters
- **Quotes**: Double quotes for strings
- **Indentation**: Spaces (2-space default)
- **Import organization**: Automatic (natural order)
- **Excluded**: `_generated/` directories (Convex-generated code)
- **CSS parser**: Tailwind directives enabled

**Never add ESLint or Prettier** - they conflict with Biome.

### Convex Function Conventions

All Convex functions must have validators using `v` from `convex/values`:

```typescript
import { v } from "convex/values"
import { query } from "./_generated/server"

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").filter(q => q.eq(q.field("_id"), args.userId)).first()
  },
})
```

## Environment Variables

**Required for Development**:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
```

Store these in:
- `apps/web/.env.local` (Next.js)
- `packages/backend/.env.local` (Convex)

## Important Technical Details

### Constitution Principles

This project follows seven core principles (see `.specify/memory/constitution.md`):

1. **Modularity First**: Single responsibility per package, no circular dependencies
2. **Type Safety Across Boundaries**: Zero `any` in public APIs, Zod schemas for validation
3. **Reusability Without Assumptions**: Platform-agnostic core, adapter pattern
4. **Developer Experience is Non-Negotiable**: Clear errors, autocomplete, minimal boilerplate
5. **Security as Architecture**: Input validation, secure defaults, email verification
6. **Build Performance Without Compromise**: <3 min full build, <30 sec incremental
7. **Scalability From Day One**: Rate limiting, connection pooling, horizontal scaling

These principles guide all implementation decisions.

### Convex Database Patterns

Convex is a document-oriented database with real-time synchronization:

- **Tables**: Defined in `packages/backend/convex/schema.ts`
- **Indexes**: Required for efficient queries (e.g., `by_email`, `by_token`)
- **Real-time**: All queries automatically subscribe to updates
- **Validators**: Use `v` from `convex/values` for type safety

Example schema:

```typescript
export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    token: v.string(),
    userId: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
})
```

### Better Auth Configuration

Better Auth instance is created in `packages/backend/convex/auth.ts`:

```typescript
import { betterAuth } from "better-auth"
import { convexAdapter } from "@convex-dev/better-auth"

export const auth = betterAuth({
  database: convexAdapter(/* Convex client */),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})
```

### Cross-Domain Authentication

For cross-domain auth (e.g., `app.example.com` → `api.example.com`):

1. Configure `NEXT_PUBLIC_SITE_URL` in web app
2. Set `BETTER_AUTH_URL` in backend
3. Use `ConvexBetterAuthProvider` with `storageNamespace` for localStorage isolation

## Common Gotchas

1. **Always use pnpm** (enforced by `packageManager` field, requires pnpm 10.4.1+)
2. **Node.js 20+ required** (specified in root `package.json` engines)
3. **Biome replaces ESLint/Prettier** - don't add them back
4. **Convex functions must have validators** - use `v` from `convex/values`
5. **Auth packages use workspace protocol** - `"@auth/types": "workspace:*"`
6. **shadcn components added from root** - `pnpm dlx shadcn@latest add <name> -c apps/web`
7. **Environment variables must be in `.env.local`** - never commit `.env` files
8. **Convex dev must run alongside Next.js** - `pnpm dev` starts both via Turborepo

## Key Files Reference

**Authentication Core**:
- `packages/backend/convex/auth.ts` - Better Auth instance configuration
- `packages/backend/convex/http.ts` - HTTP route registration for auth endpoints
- `packages/backend/convex/schema.ts` - Database schema (users, sessions, accounts)
- `apps/web/lib/auth/auth-client.ts` - Client-side auth client
- `apps/web/components/providers/convex-client-provider.tsx` - Session provider

**Configuration**:
- `turbo.json` - Turborepo task pipeline
- `pnpm-workspace.yaml` - Workspace package definitions
- `biome.json` - Linting and formatting rules
- `.github/copilot-instructions.md` - Detailed project documentation

**Documentation**:
- `docs/auth_module_guide.md` - Complete Better Auth + Convex integration guide
- `docs/implementation_patterns.md` - Quick implementation patterns and code snippets
- `.specify/memory/constitution.md` - Project principles and governance
- `specs/001-auth-packages/` - Current feature specification and plan

## Technology Stack

- **TypeScript 5.9.3** with strict mode
- **Next.js 16** with App Router, React 19, TurboPack
- **Convex 1.28.2** - Serverless database and functions
- **Better Auth 1.3.27** - TypeScript authentication framework
- **@convex-dev/better-auth 0.9.7** - Convex adapter for Better Auth
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Radix UI component library
- **Biome 2.3.4** - Fast linting and formatting
- **Turborepo 2.6.0** - Monorepo build system
- **pnpm 10.4.1** - Package manager with workspaces

## Additional Resources

For detailed implementation guides, see:
- `docs/auth_module_guide.md` - Step-by-step setup and integration
- `docs/implementation_patterns.md` - Code patterns and examples
- `.github/copilot-instructions.md` - Architecture and workflows
