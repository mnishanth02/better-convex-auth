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
│   ├── backend/                # Convex backend (EXISTING)
│   │   └── convex/
│   │       ├── auth/           # Auth functions (PLANNED)
│   │       └── _generated/     # Convex codegen
│   │
│   ├── ui/                     # Shared UI components (EXISTING)
│   │   ├── src/components/     # shadcn/ui components
│   │   └── src/styles/         # Tailwind CSS v4
│   │
│   ├── typescript-config/      # Shared TS configs (EXISTING)
│   │
│   └── auth/                   # Auth packages (TO BE CREATED)
│       ├── core/               # @auth/core - Platform-agnostic auth logic
│       │   ├── src/
│       │   │   ├── index.ts    # Public API
│       │   │   └── lib/        # Internal implementations
│       │   └── package.json
│       │
│       ├── ui/                 # @auth/ui - Platform-specific UI components
│       │   ├── src/
│       │   │   ├── web/        # React web components (LoginForm, etc.)
│       │   │   └── native/     # React Native components
│       │   └── package.json
│       │
│       ├── hooks/              # @auth/hooks - Client-side state hooks
│       │   ├── src/
│       │   │   ├── useAuth.ts
│       │   │   ├── useSession.ts
│       │   │   └── index.ts
│       │   └── package.json
│       │
│       ├── types/              # @auth/types - Shared TypeScript types
│       │   ├── src/types.ts    # No runtime code
│       │   └── package.json
│       │
│       └── utils/              # @auth/utils - Validation, encryption, tokens
│           ├── src/
│           │   ├── validators/ # Email, password validation
│           │   ├── encryption/ # Hashing, token generation
│           │   └── index.ts
│           └── package.json
│
├── turbo.json                  # Turborepo task orchestration
├── pnpm-workspace.yaml         # Workspace definition
└── package.json                # Root dependencies
```

**Structure Decision**: Monorepo with multiple applications + shared packages pattern. The `packages/auth/` directory groups all authentication packages under a single parent to maintain organizational clarity while preserving the `@auth/*` namespace in package.json names. This structure:
- Separates existing infrastructure (ui, backend, typescript-config) from new auth packages
- Enables independent versioning of each @auth/* package
- Supports platform-specific implementations (web/native) within @auth/ui
- Follows turborepo best practices for parallel builds and caching

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**STATUS**: No violations detected. All feature requirements align with constitution principles. No complexity justification required.
