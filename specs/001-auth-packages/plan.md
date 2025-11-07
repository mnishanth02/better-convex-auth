# Implementation Plan: Authentication Module Package Architecture

**Branch**: `001-auth-packages` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auth-packages/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a modular authentication system for a pnpm monorepo with separate packages for core logic (`@auth/core`), UI components (`@auth/ui`), state hooks (`@auth/hooks`), shared types (`@auth/types`), and utilities (`@auth/utils`). The architecture enables independent deployment of web and mobile applications while maintaining type safety, security boundaries, and build performance through Turborepo orchestration. The system integrates Better Auth with Convex backend, supporting configurable email verification and platform-optimized UI implementations with consistent API contracts.

## Technical Context

**Language/Version**: TypeScript 5.9.3 with strict mode enabled  
**Primary Dependencies**: 
- Next.js 16.0.1 with React 19.2 and TurboPack (web frontend)
- Convex 1.28.2 (serverless backend, database, real-time subscriptions)
- Better Auth (authentication library - integration pattern NEEDS CLARIFICATION)
- Biome 2.3.4 (linting and formatting)
- Turborepo 2.6.0 (monorepo build orchestration)
- pnpm 10.4.1 (package manager with workspace protocol)

**Storage**: Convex serverless database (document-oriented, real-time sync)  
**Testing**: Vitest (NEEDS CLARIFICATION - not yet configured)  
**Target Platform**: 
- Web: Next.js App Router (React Server Components + Client Components)
- Mobile: Expo/React Native (NEEDS CLARIFICATION - planned but not yet initialized)
- Server: Node.js >= 20

**Project Type**: Monorepo with multiple apps (web, mobile planned) and shared packages  
**Performance Goals**: 
- Build: <3 minutes cold cache, <30 seconds incremental
- Runtime: <50KB gzipped for minimal auth bundle
- Cache hit rate: >80% on CI/CD

**Constraints**: 
- TypeScript strict mode with zero `any` in public APIs
- No circular dependencies between packages
- Platform-agnostic core packages
- All external inputs validated with runtime schemas (Zod NEEDS CLARIFICATION)

**Scale/Scope**: 
- 5+ authentication packages (`@auth/*` namespace)
- 2+ applications (web deployed, mobile planned)
- Independent deployment per application
- Configurable features (email verification, OAuth, 2FA)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Modularity First ✅
- **Compliance**: Feature spec mandates 5+ distinct packages with single responsibilities
- **Evidence**: FR-001 requires separation of core, UI, hooks, types, and utilities
- **Status**: PASS - Architecture inherently modular

### Principle II: Type Safety Across Boundaries ✅
- **Compliance**: FR-018 enforces TypeScript strict mode with zero exceptions
- **Evidence**: FR-004 requires complete type definitions; FR-013 mandates co-location
- **Status**: PASS - Type safety is non-negotiable requirement

### Principle III: Reusability Without Assumptions ✅
- **Compliance**: FR-006 requires platform-agnostic core with isolated adapters
- **Evidence**: FR-019 enforces consistent API contracts across web/mobile platforms
- **Status**: PASS - Multi-platform reusability is explicit requirement

### Principle IV: Developer Experience is Non-Negotiable ✅
- **Compliance**: FR-014 mandates actionable error messages with remediation steps
- **Evidence**: SC-001 requires <5 minute integration time; SC-007 requires JSDoc on all exports
- **Status**: PASS - DX metrics are measurable success criteria

### Principle V: Security as Architecture, Not Afterthought ✅
- **Compliance**: FR-005 requires runtime validation at all package boundaries
- **Evidence**: User Story 4 focuses on security boundary enforcement as P1 priority
- **Status**: PASS - Security is architectural, not retrofitted

### Principle VI: Build Performance Without Compromise ✅
- **Compliance**: FR-008/FR-009 mandate incremental builds with caching
- **Evidence**: SC-002/SC-003 define <3min cold, <30sec incremental build times
- **Status**: PASS - Performance targets are explicit and measurable

### Principle VII: Scalability From Day One ✅
- **Compliance**: FR-016 enables independent app deployment without coordinated releases
- **Evidence**: Architecture supports multiple apps with selective feature adoption (FR-010)
- **Status**: PASS - Multi-tenant design with independent scaling

### Decision Filter Compliance
1. **Security**: ✅ Runtime validation (FR-005), boundary enforcement (User Story 4)
2. **Maintainability**: ✅ Package boundaries (FR-003), documentation (SC-007)
3. **Performance**: ✅ Build caching (FR-009), bundle size (SC-010)
4. **Developer Experience**: ✅ Error messages (FR-014), integration time (SC-001)
5. **Feature Completeness**: ✅ All functional requirements mapped to architecture

### Violations Requiring Justification
**NONE** - All constitution principles align with feature requirements. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-packages/
├── plan.md              # This file (completed)
├── research.md          # Phase 0 output (next step)
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (API schemas)
```

### Source Code (repository root)

```text
better-convex-auth/
├── apps/
│   ├── web/                    # Next.js 16 app (EXISTING)
│   │   ├── app/                # App Router pages
│   │   ├── components/         # App-specific components
│   │   └── package.json        # Dependencies: @workspace/ui, @auth/* (planned)
│   └── mobile/                 # Expo app (PLANNED - not yet created)
│
├── packages/
│   ├── backend/                # Convex backend (IMPLEMENTED)
│   │   └── convex/
│   │       ├── auth.ts         # Auth instance creation ✅
│   │       ├── auth.config.ts  # Better Auth configuration ✅
│   │       ├── http.ts         # HTTP routes ✅
│   │       ├── schema.ts       # Auth database schema ✅
│   │       ├── lib/            # Security utilities ✅
│   │       │   ├── auth-helpers.ts  # Authorization helpers
│   │       │   ├── rls.ts          # Row-Level Security
│   │       │   └── convex-schemas.ts # Runtime validators
│   │       └── _generated/     # Convex codegen
│   │
│   ├── ui/                     # Shared UI components (EXISTING)
│   │   ├── src/components/     # shadcn/ui components
│   │   └── src/styles/         # Tailwind CSS v4
│   │
│   ├── typescript-config/      # Shared TS configs (EXISTING)
│   │
│   └── auth/                   # Auth packages (IMPLEMENTED ✅)
│       ├── core/               # @auth/core - Convex + Better Auth integration ✅
│       │   ├── src/
│       │   │   ├── index.ts    # Public API
│       │   │   ├── session.ts  # 8 session utilities
│       │   │   ├── user.ts     # 14 user utilities
│       │   │   └── convex/     # Convex auth factory
│       │   └── package.json
│       │
│       ├── web/                # @auth/web - React hooks + client + providers ✅
│       │   ├── src/
│       │   │   ├── client/     # Auth client factory
│       │   │   ├── hooks/      # useSession, useAuth, useUser, etc. (7 hooks)
│       │   │   ├── providers/  # AuthProvider factory
│       │   │   ├── hoc/        # withAuth, withSession, withEmailVerified
│       │   │   ├── context/    # React context
│       │   │   └── index.ts    # Unified exports
│       │   └── package.json
│       │
│       ├── ui/                 # @auth/ui - Pre-built auth components ✅
│       │   ├── src/
│       │   │   ├── forms/      # SignInForm, SignUpForm
│       │   │   ├── guards/     # SessionGuard
│       │   │   ├── actions/    # SignOutButton, SocialAuthButtons
│       │   │   ├── display/    # UserAvatar
│       │   │   ├── feedback/   # PasswordStrengthIndicator
│       │   │   └── index.ts    # Component exports
│       │   └── package.json
│       │
│       ├── quickstart/         # @auth/quickstart - One-function setup ✅
│       │   ├── src/
│       │   │   ├── setup-auth.ts      # setupAuth() - full setup
│       │   │   ├── setup-auth-ui.ts   # setupAuthUI() - alias
│       │   │   ├── setup-auth-headless.ts # setupAuthHeadless() - hooks only
│       │   │   ├── types.ts           # Setup interfaces
│       │   │   └── index.ts           # Exports + re-exports
│       │   └── package.json
│       │
│       ├── types/              # @auth/types - Shared TypeScript types ✅
│       │   ├── src/
│       │   │   ├── user.ts     # User, PublicUser, UserAccount types
│       │   │   ├── session.ts  # Session types
│       │   │   ├── auth.ts     # Auth config types
│       │   │   ├── organization.ts # Organization types
│       │   │   └── index.ts    # Type exports
│       │   └── package.json
│       │
│       └── utils/              # @auth/utils - Validation, tokens, security ✅
│           ├── src/
│           │   ├── validators.ts    # 20+ Zod schemas
│           │   ├── tokens.ts        # 11 token generation utilities
│           │   └── index.ts         # Utility exports
│           └── package.json
│
├── turbo.json                  # Turborepo task orchestration
├── pnpm-workspace.yaml         # Workspace definition
└── package.json                # Root dependencies
```

**Structure Decision**: Monorepo with multiple applications + shared packages pattern. The `packages/auth/` directory groups all authentication packages under a single parent to maintain organizational clarity while preserving the `@auth/*` namespace in package.json names. 

**Key Architectural Decisions (Implemented):**

1. **@auth/web = client + hooks + providers**: Instead of separate `@auth/hooks` and `@auth/client` packages, we unified them into `@auth/web` for better developer experience. This eliminates the need for multiple imports and provides a cohesive authentication API.

2. **Better Auth Direct Integration**: We use Better Auth's client directly (`better-auth/react`) rather than wrapping it in a custom AuthClient class. The `@auth/web` package provides convenience hooks and factories but delegates core functionality to Better Auth.

3. **@auth/quickstart for Rapid Setup**: Created a dedicated package that provides `setupAuth()` - a single function that returns everything developers need (client, provider, hooks, components, HOCs). This achieves the <5 minute integration goal.

4. **ConvexBetterAuthProvider**: Using `@convex-dev/better-auth/react` provider directly instead of creating custom providers. Our `@auth/web` package exports factory functions to create configured instances.

5. **Web-First Approach**: Phases 1-4 focus on web implementation. Mobile/native support (React Native) is deferred to later phases rather than built in parallel.

6. **Component Organization**: `@auth/ui` components are organized by category (forms, guards, actions, display, feedback) rather than by platform (web/native). Native variants will be added later as separate exports.

7. **Security at Multiple Layers**: 
   - Backend: `lib/auth-helpers.ts` (authorization), `lib/rls.ts` (row-level security), `lib/convex-schemas.ts` (runtime validation)
   - Validation: `@auth/utils` provides 20+ Zod schemas for input validation
   - Core: `@auth/core` provides session and user utilities with security checks

This structure:
- Simplifies imports: `import { useSession, useAuth } from "@auth/web"` instead of multiple packages
- Reduces cognitive load: One package per concern (web hooks, UI components, types, utils)
- Enables rapid setup: `setupAuth()` from `@auth/quickstart` configures everything
- Maintains type safety: Full TypeScript support across all packages
- Supports incremental adoption: Can import individual functions or use quickstart
- Follows turborepo best practices for parallel builds and caching

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**STATUS**: No violations detected. All feature requirements align with constitution principles. No complexity justification required.
