# GitHub Spec-Kit Templates: Better-Convex-Auth Implementation
## Complete Workflow for Each Phase (Solo Developer)

---

## PHASE 1: Foundation & Project Structure (Week 1-2)

### /speckit.constitution
**Project Principles for Phase 1 Foundation**

```
You are architecting a production-ready authentication module for a monorepo supporting Next.js web and Expo React Native apps. Your work in Phase 1 establishes the foundational structure that enables scalability and code reuse.

## Core Principles

### 1. Modularity First
- Design every package with a single, well-defined responsibility
- Establish clear boundaries between packages to prevent circular dependencies
- Each package must have an explicit public API (exports)
- Internal implementation details should never leak into consumer code
- Use namespace organization (@auth/*, @shared/*) for logical grouping

### 2. Type Safety Across Boundaries
- TypeScript is mandatory across all packages, zero "any" types in public APIs
- Maintain @auth/types as the single source of truth for cross-package types
- Export complete type definitions, not just values
- Use Zod schemas for runtime validation of all external inputs
- Type definitions must be co-located with their implementations

### 3. Reusability Without Assumptions
- Design packages for multiple deployment contexts (web, mobile, API)
- Avoid platform-specific code in core packages (@auth/core, @auth/utils)
- Use adapter pattern for platform-specific implementations
- Every feature must be independently adoptable (don't force adoption of entire systems)
- Provide sensible defaults that work for 80% of users without configuration

### 4. Developer Experience is Non-Negotiable
- Zero hidden side effects in exported functions
- Error messages must be actionable and suggest solutions
- Configuration should be declarative and type-safe
- Provide validation errors with specific remediation steps
- Make debugging easy with clear error context and stack traces

### 5. Security as Architecture, Not Afterthought
- Assume all external inputs are hostile; validate at every boundary
- Apply principle of least privilege to every function
- Implement defense in depth: multiple security layers
- Fail securely with informative logging for security analysts
- Make security decisions explicit in configuration (no silent security bypasses)

### 6. Build Performance Without Compromise
- Leverage Turborepo's parallelization to maintain sub-3-minute full builds
- Design for incremental builds and efficient caching
- Monitor remote cache hit rates; target > 80%
- Optimize task dependencies to prevent unnecessary rebuilds
- Balance thoroughness with speed in CI/CD

### 7. Scalability From Day One
- Design for horizontal scaling (stateless where possible)
- Use Convex's real-time subscriptions strategically
- Index database queries proactively
- Avoid N+1 query patterns through schema design
- Plan for multi-tenant data isolation at the architecture level

## Decision Filters

When making architectural decisions, prioritize in this order:
1. **Security** - Does this pattern make the system more secure? (Non-negotiable)
2. **Maintainability** - Can future developers understand this? (Code read > code written)
3. **Performance** - Does this pattern scale with load? (Measure, don't guess)
4. **Developer Experience** - Is this intuitive for users of this module? (Reduce cognitive load)
5. **Feature Completeness** - Does this support the required use cases? (Necessary but not sufficient)

## What Success Looks Like for Phase 1

✓ Monorepo compiles with all TypeScript strict mode checks passing
✓ Package boundaries are enforced; `npm audit` finds zero circular dependencies
✓ New developer can start a project using these packages in < 5 minutes
✓ Authentication state is type-safe across web and mobile platforms
✓ Build time is predictable and < 3 minutes with cold cache
✓ Security requirements are baked into the architecture, not retrofitted
```

---

### /speckit.specify
**Detailed Requirements for Phase 1**

```
## Feature Specifications

### Requirement 1: Turborepo Monorepo Architecture
**Status**: Core infrastructure
**Priority**: P0 (Blocking all other work)

#### Directory Structure Implementation
**Requirement**: Establish a reproducible monorepo layout that accommodates apps, packages, and centralized backend.

- **Root Configuration**
  - turbo.json: Define all task pipelines, caching rules, and transitive dependencies
  - pnpm-workspace.yaml: Declare workspace boundaries and filtering rules
  - .gitignore: Exclude build artifacts, cache directories, and node_modules
  - Implement workspace-level tsconfig.base.json for shared compiler settings
  - All configuration should be DRY (Don't Repeat Yourself)

- **Apps Directory** (/apps)
  - /apps/web: Next.js application with App Router
    - Independent package.json with app-specific dependencies
    - app/ directory for routes and layouts
    - public/ for static assets
    - Consumption-only (no exported modules from this app)
  - /apps/mobile: Expo project
    - Expo configuration files (app.json, eas.json)
    - app/ directory for Expo Router routes
    - No exports to other packages
  - /apps/admin (optional): Administrative dashboard
    - Separate deployment from main app
    - Specialized UI components for admin tasks

- **Packages Directory** (/packages)
  - /packages/@auth/core: Core integration layer
    - Direct dependency on Better Auth and Convex SDKs
    - Export server-side authentication primitives
    - Zero consumer-facing UI in this package
  - /packages/@auth/ui: UI component library
    - Separate implementations: /src/web for React, /src/native for React Native
    - Export headless components with styling hooks
    - No business logic, purely presentational
  - /packages/@auth/hooks: React hooks for state management
    - useAuth, useSession, useOAuth, useTwoFactor, usePasskey, useOrganization
    - Client-side only (use 'use client' directive)
    - Real-time subscriptions to Convex
  - /packages/@auth/types: Shared TypeScript definitions
    - User model, session types, configuration schemas
    - Export only types and interfaces
    - No runtime code in this package
  - /packages/@auth/utils: Pure utility functions
    - Input validators (email, password, phone)
    - Encryption/hashing wrappers
    - Token generation and verification
    - No async operations or side effects

- **Convex Directory** (/convex)
  - _generated/: Auto-generated types from schema
  - schema.ts: Complete database schema definitions
  - functions/: Organized by domain
    - /auth/: Authentication-related functions
    - /users/: User profile and account management
    - /organizations/: Team and multi-tenant operations
    - /sessions/: Session management queries
  - lib/: Shared helpers for permission checks, validators
  - http.ts: Better Auth handler HTTP routes

#### Dependency Management
**Requirement**: Use pnpm workspaces for efficient, reproducible dependency management.

- Use single lock file (pnpm-lock.yaml) at root
- Specify peer dependencies explicitly (never rely on hoisting)
- Use workspace: protocol for internal package references
- Run `pnpm install` only at root level; never install in individual packages
- Use `pnpm filter` for selective CI runs on changed packages

#### Package Boundaries Enforcement
**Requirement**: Prevent circular dependencies and enforce clear separation of concerns.

- Define explicit entry points via package.json exports field
- Each package should be independently publishable to npm
- Internal packages should have @-scoped names
- Use ESLint's no-restricted-imports to prevent boundary violations
- Document package purposes and dependencies in README files

---

### Requirement 2: Package Structure & Responsibilities
**Status**: Core infrastructure
**Priority**: P0

#### @auth/core Package Specification
**Responsibility**: Integration layer between Better Auth and Convex

- **Exports**:
  - `createAuthConfig()`: Initializes Better Auth with Convex adapter
  - `BetterAuthOptions`: Configuration type for authentication setup
  - `ConvexAuthAdapter`: Adapter implementation for Better Auth
  - `initializeAuth()`: Server-side initialization for Next.js route handlers

- **Internal Implementation** (not exported):
  - Better Auth SDK configuration
  - Convex function routing
  - Plugin orchestration logic
  - Configuration validation using Zod

- **Dependencies**:
  - `better-auth`: Core authentication library
  - `@convex/auth`: Convex authentication utilities
  - `zod`: Runtime schema validation

#### @auth/ui Package Specification
**Responsibility**: Platform-agnostic authentication UI components

- **Web Components** (/src/web):
  - `<LoginForm />`: Email/password login with validation
  - `<SignupForm />`: Registration form with email verification
  - `<OAuthButton />`: Social login button component
  - `<PasswordResetForm />`: Password recovery flow
  - `<TwoFactorSetup />`: 2FA enrollment UI
  - `<PasskeyRegister />`: Passkey registration component

- **Mobile Components** (/src/native):
  - React Native equivalents of above components
  - `<SafeAreaView>` wrappers for iOS safe area
  - Platform-specific keyboard handling

- **Design System**:
  - Headless architecture with styling hooks
  - Accept className props for Tailwind/CSS customization
  - Support dark mode via context provider
  - Implement consistent validation feedback

#### @auth/hooks Package Specification
**Responsibility**: React hooks for authentication state and actions

- **useAuth()**: Primary authentication hook
  - Returns: `{ user, session, isLoading, error, signIn, signUp, signOut }`
  - Handles real-time session updates
  - Provides optimistic updates for sign-out

- **useSession()**: Session-specific operations
  - Returns: `{ session, refreshToken, revokeSession, isValid }`
  - Manages token refresh lifecycle
  - Monitors session expiration

- **useOAuth()**: Social login orchestration
  - Returns: `{ signInWith, isLoading, error }`
  - Handles provider-specific flows
  - Manages OAuth state and code exchange

- **useTwoFactor()**: 2FA management
  - Returns: `{ isEnabled, setup, verify, disable, backupCodes }`
  - Enrollment and verification workflows

- **usePasskey()**: WebAuthn operations
  - Returns: `{ register, authenticate, list, revoke }`
  - Device credential management

- **useOrganization()**: Multi-tenant operations
  - Returns: `{ organization, setOrganization, list, create, leave }`
  - Organization context switching

#### @auth/types Package Specification
**Responsibility**: Single source of truth for TypeScript types

- **User Types**:
  - `User`: Core user profile (id, email, name, image)
  - `UserProfile`: Extended user information
  - `UserSession`: Session-specific data

- **Authentication Types**:
  - `AuthSession`: Session payload and metadata
  - `OAuthProvider`: Union of supported OAuth providers
  - `AuthenticationMethod`: Enum of available auth methods

- **Configuration Types**:
  - `AuthConfig`: Complete configuration schema
  - `EmailConfig`: Email service configuration
  - `SecurityConfig`: Security-related settings

#### @auth/utils Package Specification
**Responsibility**: Pure, side-effect-free utility functions

- **Validators**:
  - `validateEmail(email: string): ValidationResult`
  - `validatePassword(password: string): ValidationResult`
  - `validatePhoneNumber(phone: string, region: string): ValidationResult`
  - Return structured results with specific error messages

- **Token Utilities**:
  - `generateToken(length: number): string`: Cryptographically secure token
  - `verifyToken(token: string, expected: string): boolean`: Constant-time comparison
  - `tokenToHash(token: string): string`: One-way hashing

- **Encryption**:
  - `encryptData(data: string, key: string): string`
  - `decryptData(encrypted: string, key: string): string`
  - Use established libraries (libsodium.js, tweetnacl.js)

- **Email Templates**:
  - `generateVerificationEmail(link: string, userName: string): string`
  - `generatePasswordResetEmail(link: string): string`
  - `generateOtpEmail(code: string): string`

---

### Requirement 3: Turborepo Configuration Strategy
**Status**: Build infrastructure
**Priority**: P0

#### turbo.json Task Pipeline Design
**Requirement**: Define deterministic, cacheable build tasks with proper ordering

- **Build Pipeline**:
  ```
  typecheck → lint → build → test (in parallel) → e2e-test
  ```
  - typecheck: TypeScript compiler in noEmit mode
  - lint: ESLint across all packages
  - build: Package compilation and artifact generation
  - test: Unit and integration tests
  - e2e-test: Full end-to-end testing (sequential, runs after tests)

- **Development Pipeline**:
  ```
  dev (parallel for all packages)
  ```
  - Watch mode for all packages
  - Hot reload support

- **Task Definition Requirements**:
  - Every task must have explicit inputs and outputs
  - Inputs: source files that affect task execution
  - Outputs: artifacts that should be cached
  - Define dependencies between tasks (e.g., test depends on build)

#### Caching Strategy
**Requirement**: Maximize cache hit rates and minimize unnecessary work

- **Cache Configuration**:
  - Cache outputs: compiled code, type definitions, test results
  - Cache inputs: source files, dependency lockfile
  - Use .gitignore patterns for cache directory

- **Cache Keys**:
  - Automatically based on inputs (turbo handles this)
  - Include environment variables in cache key if they affect output
  - Use `$TURBO_DEFAULT$` for standard caching

- **Remote Cache**:
  - Configure Turbo Remote Cache from day one
  - Estimate CI savings: ~60% time reduction with proper caching
  - Use Vercel's managed cache or self-host

#### Task Inputs & Outputs Specification
**Requirement**: Precise definition ensures correct caching behavior

- **typecheck Task**:
  - Inputs: `["tsconfig.json", "src/**/*.ts", "src/**/*.tsx"]`
  - Outputs: `[]` (no artifacts, error exit code is the output)

- **lint Task**:
  - Inputs: `["src/**/*.ts", "src/**/*.tsx", ".eslintrc.json"]`
  - Outputs: `[]` (linting produces no cacheable artifacts)

- **build Task**:
  - Inputs: `["src/**", "tsconfig.json", "package.json"]`
  - Outputs: `["dist", ".tsbuildinfo"]`

- **test Task**:
  - Inputs: `["src/**", "test/**", "vitest.config.ts"]`
  - Outputs: `["coverage"]`

---

## Acceptance Criteria for Phase 1

- [ ] Monorepo builds successfully with `pnpm install && pnpm build`
- [ ] TypeScript strict mode passes across all packages
- [ ] No circular dependencies detected by eslint-plugin-import
- [ ] Package boundaries enforce no internal implementation leaks
- [ ] New developer can initialize first project in < 5 minutes using published packages
- [ ] Full rebuild takes < 3 minutes on modern hardware
- [ ] Turborepo Remote Cache hit rate > 80% on second CI run
- [ ] All packages have complete JSDoc documentation
- [ ] Security scanning finds zero critical vulnerabilities
```

---

### /speckit.clarify
**Clarifying Questions for Phase 1**

```
## Clarification Prompts

### About Monorepo Strategy
1. **Deployment Independence**: Should each app (web, mobile, admin) be deployable independently, or are they always deployed together? This affects versioning strategy.
   - Answer needed: Impacts semantic versioning and release coordination

2. **Package Publishing**: Will @auth/* packages be published to npm for external use, or are they internal-only? This affects API stability and documentation requirements.
   - Answer needed: Affects changelog requirements and backwards compatibility commitments

3. **Private Dependencies**: Do you need support for private npm registry or GitHub Packages for internal-only packages? 
   - Answer needed: Affects CI/CD pipeline setup and authentication configuration

### About Package Organization
4. **Shared Utilities Scope**: Should @shared/* contain platform-specific code (React/React Native conditionals), or should each platform have its own utilities package?
   - Answer needed: Affects tree-shaking, bundle size, and import ergonomics

5. **UI Component Variants**: For @auth/ui components, should both web and native implementations always be kept in sync, or can they diverge based on platform constraints?
   - Answer needed: Affects versioning strategy and maintenance burden

### About Turborepo Configuration
6. **Development Mode Priority**: For local development, is fast iteration (hot reload, minimal type checking) more important than catching all errors, or should CI mode be strict and dev mode permissive?
   - Answer needed: Affects tsconfig strictness and developer productivity vs safety trade-off

7. **CI Parallelization**: How many concurrent tasks should CI pipelines run? This depends on infrastructure (GitHub Actions minutes, self-hosted runners).
   - Answer needed: Affects task scheduling and overall CI time

### About Security Assumptions
8. **Email Verification Requirement**: Should email verification be mandatory before account activation, or configurable per app?
   - Answer needed: Affects auth schema and user flow implementation

9. **Rate Limiting Defaults**: What should be the default rate limits for sensitive endpoints (login, password reset)? Should these be configurable per deployment?
   - Answer needed: Affects security posture and developer flexibility

### About TypeScript Strategy
10. **Strict Mode Requirement**: Should all packages maintain TypeScript strict mode enabled, or should @auth/ui relax constraints to support more flexible styling patterns?
    - Answer needed: Affects type safety vs developer ergonomics trade-off

## Resolution Strategy
Answer these questions before moving to Phase 2. Document answers in project ADRs (Architecture Decision Records) for future reference. Update Phase 2 specifications based on Phase 1 decisions.
```

---

### /speckit.plan
**Technical Implementation Plan for Phase 1**

```
## Implementation Roadmap

### Week 1: Days 1-3 - Monorepo Foundation
**Objective**: Establish the structural foundation for all future work

#### Step 1: Repository Initialization
- [ ] Create root turborepo configuration
  - Initialize turbo.json with workspace-level settings
  - Define shared task pipelines (typecheck, lint, build, test)
  - Configure output paths and cache settings
- [ ] Set up pnpm workspaces
  - Create pnpm-workspace.yaml at root
  - Define workspace glob patterns
  - Configure lockfile strategy
- [ ] Establish TypeScript base configuration
  - Create tsconfig.base.json with shared settings
  - Enable all strict mode flags
  - Set up path aliases for @auth/*, @shared/*, @convex aliases
- [ ] Configure linting infrastructure
  - Install ESLint, Prettier, and relevant plugins
  - Create shared .eslintrc.json and .prettierrc.json
  - Add eslint-plugin-import for circular dependency detection
  - Add eslint-plugin-turbo for proper turbo usage patterns

**Validation**: `pnpm install` succeeds, `pnpm lint` finds no errors, `pnpm format` completes without changes

---

#### Step 2: Create Package Structures
- [ ] Initialize @auth/core package
  - Create package.json with proper exports field
  - Set up src/ directory with index.ts entry point
  - Create lib/ subdirectory for internal implementations
  - Add README with package purpose and API overview
- [ ] Initialize @auth/ui package
  - Create package.json with web and native export paths
  - Set up src/web/ and src/native/ directories
  - Create component stub files (LoginForm, SignupForm, etc.)
  - Add component documentation stubs
- [ ] Initialize @auth/hooks package
  - Create package.json with client-side-only marker
  - Set up src/ directory for hooks
  - Create stub files for each hook (useAuth, useSession, etc.)
- [ ] Initialize @auth/types package
  - Create package.json with types-only exports
  - Set up src/types.ts with interface definitions
  - Ensure no runtime code in this package
- [ ] Initialize @auth/utils package
  - Create package.json with utilities export
  - Set up src/ directory organized by utility category
  - Create validator, encryption, token, email subdirectories

**Validation**: All packages can be independently built, `pnpm list` shows correct tree structure, packages are properly linked

---

#### Step 3: Configure Workspace Linking & Dependencies
- [ ] Update all package.json files with workspace dependencies
  - Use workspace: protocol for @auth/* references
  - Specify peer dependencies (e.g., react, convex)
  - Pin versions consistently across packages
- [ ] Verify dependency resolution
  - Run `pnpm install` successfully
  - Check for duplicate dependency warnings
  - Confirm workspace linking works with `pnpm why`
- [ ] Set up import paths
  - Configure TypeScript path aliases
  - Test alias resolution in IDE

**Validation**: `pnpm build` compiles all packages, imports resolve correctly in all packages, no hoisting issues

---

### Week 1: Days 4-5 - Turborepo Configuration & CI/CD Foundation
**Objective**: Establish build automation and caching infrastructure

#### Step 4: Define Task Pipelines
- [ ] Configure build tasks
  - typecheck task with TypeScript strict mode
  - lint task with ESLint
  - build task with tsup/tsc for package compilation
  - test task with Vitest
  - Define task dependencies (test depends on build)
- [ ] Set up development tasks
  - dev task for watch mode in all packages
  - Configure hot module reloading where applicable
- [ ] Configure output paths
  - dist/ for compiled output
  - coverage/ for test results
  - .tsbuildinfo for incremental builds

**Validation**: `pnpm build` completes in < 2 minutes on cold cache, `pnpm dev` starts with hot reload

---

#### Step 5: Implement Caching Strategy
- [ ] Configure turbo.json caching
  - Define inputs and outputs for each task
  - Set cache retention policies
  - Configure .gitignore for cache directory
- [ ] Set up Remote Cache (optional but recommended)
  - Configure Vercel Remote Cache or self-hosted solution
  - Test remote cache with `turbo telemetry` enabled
- [ ] Optimize cache hits
  - Ensure consistent Node versions across CI/local
  - Lock all transitive dependencies
  - Document cache invalidation patterns

**Validation**: Second build run uses cache (> 80% time savings), cache hit rate visible in turbo output

---

#### Step 6: GitHub Actions CI/CD Pipeline
- [ ] Create main workflow file (.github/workflows/ci.yml)
  - Trigger on push to main and PR creation
  - Install dependencies with cache restoration
  - Run typecheck, lint, build in parallel
  - Run tests with coverage reporting
  - Upload coverage to Codecov
- [ ] Set up branch protection rules
  - Require CI to pass before merging
  - Require at least one review
  - Dismiss stale reviews on new commits

**Validation**: CI passes on sample commit, PR shows CI checks passing/failing, Remote Cache improves subsequent runs

---

### Week 2: Days 6-7 - Apps Setup & Integration Testing
**Objective**: Create consumable applications that use the packages

#### Step 7: Initialize Next.js Web App
- [ ] Create /apps/web with Next.js 15+
  - Use create-next-app with App Router
  - Configure tsconfig.json extending base config
  - Add dependency on @auth/* packages
- [ ] Set up app structure
  - Create (auth) route group for public routes
  - Create (dashboard) route group for protected routes
  - Set up root layout with providers
- [ ] Test package consumption
  - Import types from @auth/types
  - Verify types resolve correctly
  - Create stub components that import from @auth/ui

**Validation**: `pnpm dev` starts web app, TypeScript finds no errors, app can import from all @auth/* packages

---

#### Step 8: Initialize Expo Mobile App
- [ ] Create /apps/mobile with Expo SDK 51+
  - Use `npx create-expo-app`
  - Configure app.json with project metadata
  - Set up Expo Router configuration
- [ ] Set up app structure
  - Create auth navigation stack
  - Create app navigation stack
  - Set up root layout component
- [ ] Test package consumption
  - Import from @auth/types
  - Verify React Native components from @auth/ui work
  - Test @auth/hooks in React Native context

**Validation**: Expo preview starts successfully, app compiles for iOS and Android simulators, imports work correctly

---

#### Step 9: Create Integration Tests
- [ ] Set up Vitest for integration testing
  - Test package exports are complete
  - Test cross-package imports work
  - Mock Convex and Better Auth dependencies
- [ ] Write tests for:
  - Package initialization in different contexts (web, mobile, SSR)
  - Type resolution across packages
  - Circular dependency detection
  - Import path resolution

**Validation**: Integration test suite passes, dependency graph analysis shows no cycles, all packages properly link

---

### Week 2: Days 8-10 - Documentation & Handoff
**Objective**: Create clear documentation for ongoing work and team collaboration

#### Step 10: Create Architecture Documentation
- [ ] Write ARCHITECTURE.md at root
  - Overview of monorepo structure
  - Package responsibilities and boundaries
  - Dependency graph diagram
  - Design decisions and rationale (ADRs)
- [ ] Create DEVELOPMENT.md
  - Local setup instructions (one-command startup)
  - Common development tasks
  - Debugging guide
  - Troubleshooting common issues
- [ ] Document each package
  - README.md in each package directory
  - API documentation stub (auto-generated)
  - Example usage for each exported item
  - Breaking change notes

**Validation**: New developer can follow DEVELOPMENT.md and have working setup, no ambiguity about package purposes

---

#### Step 11: Set Up Code Quality Standards
- [ ] Configure pre-commit hooks
  - Run linting and formatting on staged files
  - Run typecheck on modified TypeScript
  - Prevent commits with console.log() statements
- [ ] Create CONTRIBUTING.md
  - Code style guidelines
  - Commit message format
  - Pull request template
  - Testing requirements
- [ ] Set up .editorconfig
  - Consistent indentation across editors
  - Line ending consistency
  - File encoding standards

**Validation**: Pre-commit hooks prevent problematic commits, documentation is clear and follows best practices

---

#### Step 12: Establish Package Publishing Pipeline (Preparation)
- [ ] Create npm publishing configuration (not yet publishing)
  - Set up changesets CLI for version management
  - Create .changeset/config.json
  - Document version strategy
- [ ] Prepare package.json for publication
  - Ensure all metadata is accurate
  - Set up proper access levels
  - Document breaking changes

**Validation**: Changesets CLI runs without errors, release workflow is documented and ready for execution

---

## Implementation Dependencies & Blockers

### Critical Path Dependencies
1. TypeScript base config → All other TypeScript work
2. Package structure → Workspace linking
3. Workspace linking → App setup
4. Turborepo config → CI/CD setup
5. CI/CD setup → Feature work in Phase 2

### Risk Mitigations
- **Monorepo tool instability**: Use pnpm 8+ and turbo 2+, both battle-tested
- **TypeScript strict mode catching too many errors**: Relax gradually with disable comments and ADR
- **Circular dependency issues**: Set up linting early to catch immediately
- **CI pipeline too slow**: Implement remote cache from day one, target < 3 minutes

### Success Indicators
✓ All tasks in Phase 1 checklist completed
✓ CI/CD runs successfully on sample commits
✓ New developer setup time < 5 minutes
✓ Build time < 3 minutes on cold cache, < 30 seconds on warm cache
✓ Zero lint/type errors, all tests passing
✓ Documentation complete and tested with external reviewer
```

---

### /speckit.tasks
**Task Breakdown for Phase 1**

```
## Granular Task List for Phase 1

### Task Group 1: Monorepo Initialization (Est. 4 hours)

#### Task 1.1: Create Turborepo Configuration
- [ ] Initialize new Git repository or prepare existing one
- [ ] Run `npx create-turbo@latest`
- [ ] Review generated turbo.json structure
- [ ] Create custom turbo.json with Phase 1 requirements
- [ ] Configure workspace filtering patterns
- Time: 1 hour
- Validation: turbo.json exists, syntax is valid, `turbo --version` shows installed version

#### Task 1.2: Set Up pnpm Workspaces
- [ ] Install pnpm globally (`npm i -g pnpm`)
- [ ] Create pnpm-workspace.yaml at root
- [ ] Define workspace patterns:
  - `- "apps/*"`
  - `- "packages/@auth/*"`
  - `- "packages/@shared/*"`
  - `- "convex"`
- [ ] Create .npmrc with pnpm settings
- Time: 30 minutes
- Validation: `pnpm list` shows workspace structure, no errors on install

#### Task 1.3: Configure Root TypeScript
- [ ] Create tsconfig.base.json
- [ ] Set all strict mode flags to true
- [ ] Configure compilerOptions:
  - strict: true
  - noImplicitAny: true
  - strictNullChecks: true
  - strictFunctionTypes: true
- [ ] Set up path aliases:
  - @auth/*: ./packages/@auth/*/src
  - @shared/*: ./packages/@shared/*/src
  - @convex/*: ./convex/*
- [ ] Create tsconfig.json referencing tsconfig.base.json
- Time: 1 hour
- Validation: TypeScript compiler recognizes all paths, no resolution errors

#### Task 1.4: Set Up ESLint & Prettier
- [ ] Install dependencies: eslint, prettier, typescript-eslint
- [ ] Create root .eslintrc.json with strict rules
- [ ] Add ESLint plugins:
  - @typescript-eslint/eslint-plugin
  - eslint-plugin-import (for circular dependencies)
  - eslint-plugin-turbo
- [ ] Create .prettierrc with project formatting rules
- [ ] Configure ESLint to run from root across all packages
- [ ] Add pre-commit hook configuration (husky setup placeholder)
- Time: 1.5 hours
- Validation: `pnpm lint` runs without errors, `pnpm format` reformats correctly

---

### Task Group 2: Package Scaffolding (Est. 6 hours)

#### Task 2.1: Create @auth/core Package
- [ ] Create /packages/@auth/core directory
- [ ] Initialize package.json with:
  - name: "@auth/core"
  - version: "0.0.1"
  - type: "module"
  - exports: { ".": "./dist/index.js", "./types": "./dist/index.d.ts" }
  - files: ["dist", "README.md"]
- [ ] Create src/index.ts as entry point
- [ ] Create src/lib/ directory for internal implementations
- [ ] Create src/convex-adapter.ts stub
- [ ] Create src/better-auth-config.ts stub
- [ ] Add README.md explaining package purpose
- [ ] Create tsconfig.json extending base config
- Time: 1 hour
- Validation: Package structure correct, `pnpm -r -F @auth/core build` runs without errors

#### Task 2.2: Create @auth/ui Package
- [ ] Create /packages/@auth/ui directory
- [ ] Initialize package.json with dual exports:
  - exports: {
      "./web": "./dist/web/index.js",
      "./native": "./dist/native/index.js"
    }
- [ ] Create src/web/ subdirectory with component stubs:
  - LoginForm.tsx
  - SignupForm.tsx
  - OAuthButton.tsx
  - PasswordResetForm.tsx
  - TwoFactorSetup.tsx
  - PasskeyRegister.tsx
- [ ] Create src/native/ subdirectory with React Native equivalents
- [ ] Create README.md with component documentation structure
- [ ] Add tsconfig.json with jsx and jsxImportSource configuration
- Time: 1.5 hours
- Validation: Both web and native implementations compile, can import from both

#### Task 2.3: Create @auth/hooks Package
- [ ] Create /packages/@auth/hooks directory
- [ ] Initialize package.json with client-side marker
- [ ] Create src/ directory with individual hook files:
  - useAuth.ts - stub
  - useSession.ts - stub
  - useOAuth.ts - stub
  - useTwoFactor.ts - stub
  - usePasskey.ts - stub
  - useOrganization.ts - stub
- [ ] Create src/index.ts re-exporting all hooks
- [ ] Add README.md documenting each hook signature
- [ ] Add dependency on @auth/types
- Time: 1 hour
- Validation: All hooks export correctly, can import from @auth/hooks in other packages

#### Task 2.4: Create @auth/types Package
- [ ] Create /packages/@auth/types directory
- [ ] Initialize package.json with types-only configuration
- [ ] Create src/types.ts with interface definitions:
  - User
  - UserSession
  - AuthSession
  - OAuthProvider (union type)
  - AuthenticationMethod (enum)
  - AuthConfig
  - EmailConfig
  - SecurityConfig
- [ ] Create src/index.ts re-exporting all types
- [ ] Add README.md explaining type hierarchy
- [ ] Ensure no runtime code in package
- Time: 45 minutes
- Validation: Pure types export, no runtime dependencies, can import all types

#### Task 2.5: Create @auth/utils Package
- [ ] Create /packages/@auth/utils directory
- [ ] Initialize package.json with utils export
- [ ] Create src/ directory structure:
  - validators/ subdirectory for input validators
  - encryption/ subdirectory for crypto utilities
  - tokens/ subdirectory for token operations
  - email/ subdirectory for email utilities
- [ ] Create stub files in each subdirectory
- [ ] Create src/index.ts re-exporting all utilities
- [ ] Add README.md with utility documentation
- [ ] Add dependency on Zod for validators
- Time: 1 hour
- Validation: All utilities export correctly, validators accept appropriate inputs

---

### Task Group 3: Workspace Linking & Testing (Est. 4 hours)

#### Task 3.1: Configure Workspace Dependencies
- [ ] Update @auth/core package.json:
  - Add dependencies: better-auth, @convex/auth, zod
  - Add devDependencies: @types/better-auth (if available)
- [ ] Update @auth/ui package.json:
  - Add peerDependencies: react, react-dom, react-native
  - Add dependencies: @auth/types
- [ ] Update @auth/hooks package.json:
  - Add peerDependencies: react
  - Add dependencies: @auth/types, @auth/core
- [ ] Update @auth/utils package.json:
  - Add dependencies: zod
  - Add optional dependencies: libsodium.js, tweetnacl.js
- [ ] Run `pnpm install` at root
- [ ] Verify workspace linking with `pnpm list --recursive`
- Time: 1 hour
- Validation: `pnpm install` succeeds without errors, all workspace links resolve

#### Task 3.2: Test Cross-Package Imports
- [ ] Create integration test file: root/test/integration.test.ts
- [ ] Test imports from each package:
  - `import * from "@auth/core"`
  - `import * from "@auth/ui/web"`
  - `import * from "@auth/ui/native"`
  - `import * from "@auth/hooks"`
  - `import type * from "@auth/types"`
  - `import * from "@auth/utils"`
- [ ] Verify all imports resolve correctly
- [ ] Run TypeScript compiler on test file
- Time: 1 hour
- Validation: All imports resolve, TypeScript finds no type errors

#### Task 3.3: Set Up Vitest for Unit Testing
- [ ] Install vitest, @vitest/ui, @vitest/coverage-v8
- [ ] Create root vitest.config.ts
- [ ] Configure test environment: node
- [ ] Set up coverage thresholds
- [ ] Create example test file in each package
- [ ] Run `pnpm test` successfully
- Time: 1 hour
- Validation: Vitest runs without errors, coverage reports generate correctly

#### Task 3.4: Verify No Circular Dependencies
- [ ] Install depcheck and npm-audit-resolver
- [ ] Create script: `pnpm lint:deps`
- [ ] Run circular dependency detection with eslint-plugin-import
- [ ] Document any necessary exceptions
- [ ] Set up CI check to prevent circular dependencies
- Time: 30 minutes
- Validation: Circular dependency scan completes with no issues found

---

### Task Group 4: Turborepo Task Configuration (Est. 3 hours)

#### Task 4.1: Define Build Task Pipeline
- [ ] Create root turbo.json task definitions for:
  - typecheck
  - lint
  - build
  - test
  - e2e-test (optional)
- [ ] For typecheck task:
  - inputs: ["tsconfig.json", "src/**/*.ts", "src/**/*.tsx"]
  - outputs: []
  - dependsOn: []
- [ ] For lint task:
  - inputs: ["src/**/*.ts", "src/**/*.tsx", ".eslintrc.json"]
  - outputs: []
  - dependsOn: []
- [ ] For build task:
  - inputs: ["src/**", "package.json", "tsconfig.json"]
  - outputs: ["dist", ".tsbuildinfo"]
  - dependsOn: ["^build", "typecheck", "lint"]
- [ ] For test task:
  - inputs: ["src/**", "test/**", "vitest.config.ts"]
  - outputs: ["coverage"]
  - dependsOn: ["build"]
- Time: 1 hour
- Validation: `turbo run build` completes successfully with task ordering

#### Task 4.2: Configure Package-Level Build Scripts
- [ ] Add to root package.json scripts:
  - "build": "turbo run build"
  - "dev": "turbo run dev --parallel"
  - "test": "turbo run test"
  - "lint": "turbo run lint"
  - "typecheck": "turbo run typecheck"
- [ ] Add to each package package.json scripts:
  - "typecheck": "tsc --noEmit"
  - "lint": "eslint src --fix"
  - "build": "tsup src/index.ts --dts --format esm,cjs" (or similar)
  - "test": "vitest run"
  - "dev": "tsup src/index.ts --watch --dts"
- Time: 1 hour
- Validation: `pnpm build` runs all tasks in correct order, `pnpm dev` starts all packages in watch mode

#### Task 4.3: Set Up Build Output Configuration
- [ ] Create tsup.config.ts at root (or use individual configs)
- [ ] Configure output directory: dist/
- [ ] Enable source maps for debugging
- [ ] Configure for both ESM and CJS output
- [ ] Create .gitignore entries for build artifacts
- [ ] Test build produces correct output structure
- Time: 45 minutes
- Validation: `pnpm build` produces dist/ directories with correct file structure

#### Task 4.4: Implement Caching Configuration
- [ ] Update turbo.json with caching settings:
  - outputMode: "new-only" for CI
  - outputMode: "full" for local development
  - Include $TURBO_DEFAULT$ for standard patterns
- [ ] Configure cache directory: .turbo/
- [ ] Add to .gitignore
- [ ] Create .turbo/.gitkeep for git tracking
- [ ] Document cache invalidation scenarios
- Time: 30 minutes
- Validation: Cache directory is created, builds use cache on second run

---

### Task Group 5: CI/CD Pipeline Setup (Est. 4 hours)

#### Task 5.1: Create GitHub Actions Workflow
- [ ] Create .github/workflows/ directory
- [ ] Create ci.yml workflow file with jobs:
  - install
  - typecheck
  - lint
  - build
  - test
- [ ] Configure workflow to trigger on:
  - push to main branch
  - pull requests
  - manual dispatch (for debugging)
- [ ] Add dependency caching for pnpm and npm
- Time: 1.5 hours
- Validation: Workflow file syntax is valid, triggers on expected events

#### Task 5.2: Configure CI Job Steps
- [ ] Set up Node.js version matrix (18.x, 20.x)
- [ ] Configure pnpm installation and caching
- [ ] Add workflow steps:
  1. Checkout code
  2. Install pnpm
  3. Install dependencies
  4. Run typecheck
  5. Run lint
  6. Run build
  7. Run tests with coverage
- [ ] Add failure notifications
- [ ] Configure artifact upload for coverage reports
- Time: 1 hour
- Validation: Workflow runs successfully on test push, generates artifacts

#### Task 5.3: Set Up Branch Protection Rules
- [ ] Navigate to repository settings
- [ ] Create branch protection rule for main:
  - Require status checks to pass: CI workflow
  - Require at least one review
  - Dismiss stale pull request approvals
  - Require signed commits (optional)
- [ ] Configure for all pushes to main
- Time: 30 minutes
- Validation: Cannot merge PR without passing CI, PR blocking rules enforced

#### Task 5.4: Configure Remote Cache (Optional but Recommended)
- [ ] Choose cache provider:
  - Vercel's managed Remote Cache (recommended for starters)
  - Or self-host with turbo-remote-cache
- [ ] Generate cache tokens
- [ ] Set up CI environment variables:
  - TURBO_TEAM
  - TURBO_TOKEN
  - TURBO_REMOTE_ONLY (for CI)
- [ ] Test remote cache hit rate on second CI run
- [ ] Document cache invalidation procedures
- Time: 1 hour
- Validation: Second CI run shows cache hits, build time reduced by > 60%

---

### Task Group 6: Application Initialization (Est. 4 hours)

#### Task 6.1: Create Next.js Web App
- [ ] Run `pnpm create next-app@latest` in apps/ directory
- [ ] Configure with:
  - App Router: Yes
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: Yes
  - Import alias: Yes (@/*)
- [ ] Update tsconfig.json to extend root config
- [ ] Add @auth/* packages as dependencies
- [ ] Create directory structure:
  - app/(auth)/: Public routes
  - app/(dashboard)/: Protected routes
  - app/layout.tsx: Root layout with providers
- [ ] Test app loads without errors
- Time: 1.5 hours
- Validation: `pnpm dev` starts app on localhost:3000, TypeScript finds no errors

#### Task 6.2: Create Expo Mobile App
- [ ] Run `npx create-expo-app apps/mobile` 
- [ ] Configure app.json with project metadata
- [ ] Install Expo Router: `npx install-expo-modules`
- [ ] Set up Expo Router structure:
  - app/(auth)/: Authentication screens
  - app/(app)/: App screens
  - app/_layout.tsx: Root navigator
- [ ] Add @auth/* packages as dependencies
- [ ] Test app starts in simulator without errors
- Time: 1.5 hours
- Validation: Expo preview loads successfully, app compiles for iOS and Android

#### Task 6.3: Test Package Consumption in Apps
- [ ] In Next.js app:
  - Import type from @auth/types
  - Import component stub from @auth/ui/web
  - Verify no TypeScript errors
- [ ] In Expo app:
  - Import type from @auth/types
  - Import component stub from @auth/ui/native
  - Verify compilation succeeds
- [ ] Run `pnpm build` from root successfully
- Time: 1 hour
- Validation: Both apps compile with package imports, full monorepo build succeeds

---

### Task Group 7: Documentation Creation (Est. 3 hours)

#### Task 7.1: Write ARCHITECTURE.md
- [ ] Create ARCHITECTURE.md at repository root
- [ ] Include sections:
  - Monorepo Structure (directory overview)
  - Package Responsibilities (table of all packages)
  - Dependency Graph (visual or text representation)
  - Design Decisions (ADRs for major choices)
  - Development Workflow (day-to-day operations)
- [ ] Include ASCII diagrams for structure clarity
- [ ] Link to individual package README files
- Time: 1 hour
- Validation: Comprehensive overview complete, diagrams are accurate

#### Task 7.2: Write DEVELOPMENT.md
- [ ] Create DEVELOPMENT.md at root
- [ ] Include sections:
  - Quick Start (one-command setup)
  - Directory Structure Explanation
  - Common Commands:
    - pnpm build
    - pnpm dev
    - pnpm test
    - pnpm lint
  - IDE Setup (VS Code extensions, settings.json)
  - Debugging Guide
  - Troubleshooting
- [ ] Provide one-command startup script
- [ ] Test instructions with new local clone
- Time: 1 hour
- Validation: New developer can follow guide and have working environment

#### Task 7.3: Create Package README Files
- [ ] For each @auth/* package, create README.md with:
  - Package purpose (1-2 sentences)
  - Installation instructions
  - Basic usage example
  - API overview (function/component names)
  - Link to full documentation
  - Contributing guidelines
- [ ] Create README stub for /convex backend
- Time: 1 hour
- Validation: All package README files exist, provide clear entry points

---

### Task Group 8: Code Quality Standards (Est. 2 hours)

#### Task 8.1: Set Up Pre-Commit Hooks
- [ ] Install husky: `pnpm add -D husky && pnpm exec husky install`
- [ ] Create .husky/pre-commit hook with steps:
  - Run lint-staged on modified files
  - Run typecheck on TypeScript changes
  - Prevent commits with console.log() statements
- [ ] Install lint-staged: `pnpm add -D lint-staged`
- [ ] Configure .lintstagedrc.js
- [ ] Test hooks prevent problematic commits
- Time: 45 minutes
- Validation: Pre-commit hooks trigger on staged files, prevent console.log commits

#### Task 8.2: Create CONTRIBUTING.md
- [ ] Create CONTRIBUTING.md at root with:
  - Code Style Guidelines
  - Commit Message Format (Conventional Commits)
  - PR Template
  - Testing Requirements (80% coverage minimum)
  - Review Process
  - Release Process (changesets workflow)
- [ ] Create .editorconfig for IDE consistency
- [ ] Add PR template: .github/pull_request_template.md
- [ ] Include commit message examples
- Time: 45 minutes
- Validation: CONTRIBUTING.md is comprehensive, templates exist in .github/

#### Task 8.3: Configure Additional Tooling
- [ ] Add .editorconfig to root
- [ ] Set up VS Code workspace settings (.vscode/settings.json)
- [ ] Add recommended extensions (.vscode/extensions.json)
- [ ] Create .nvmrc or .node-version for Node version pinning
- [ ] Configure IDE debugging for Next.js and Expo
- Time: 30 minutes
- Validation: Team members get consistent IDE experience

---

### Task Group 9: Package Publishing Preparation (Est. 2 hours)

#### Task 9.1: Set Up Changesets
- [ ] Install changesets: `pnpm add -D @changesets/cli`
- [ ] Run `pnpm changeset init`
- [ ] Configure .changeset/config.json:
  - commit: false (manual commit step)
  - linked: [] (independent versioning)
  - access: "restricted" (private until released)
  - baseBranch: "main"
- [ ] Document version strategy (semantic versioning)
- [ ] Create VERSIONING.md explaining bumping rules
- Time: 45 minutes
- Validation: changesets CLI configured and working

#### Task 9.2: Prepare npm Publishing
- [ ] Create GitHub Action for publishing:
  - Trigger on version tags
  - Run build
  - Publish to npm with authentication
- [ ] Document npm account setup requirements
- [ ] Create .npmrc with publishing settings
- [ ] Set up npm 2FA for package publishing
- [ ] Create PUBLISHING.md with step-by-step release process
- Time: 1 hour
- Validation: Publishing workflow documented and tested (don't actually publish yet)

#### Task 9.3: Final Phase 1 Checklist
- [ ] All 12 task groups completed
- [ ] Full build completes successfully
- [ ] CI/CD pipeline passes
- [ ] All documentation written and reviewed
- [ ] Team has working local development environment
- [ ] No critical security or performance issues
- Time: Validation pass-through
- Validation: All checkboxes passing, ready to move to Phase 2

---

## Estimated Total Time: Phase 1
- Task Groups: 9
- Total Tasks: 36
- Estimated Hours: 26-30 hours
- Recommended Duration: 2 weeks (40 hour work weeks, accounting for interruptions)
- Solo Developer Pace: Can be compressed to 1.5 weeks with focused effort
```

---

### /speckit.implement
**Implementation Instructions for Phase 1**

```
## Step-by-Step Implementation Guide

### Before You Start
1. Ensure Node.js 18+ is installed: `node --version`
2. Ensure pnpm is installed: `npm install -g pnpm`
3. Have IDE (VS Code recommended) with TypeScript support open
4. Create new GitHub repository or prepare existing one
5. Clone repository locally to working directory

### Phase 1 Complete Implementation Path

#### PART 1: Repository Foundation (Days 1-2)

**Step 1: Initialize Turborepo**
```bash
cd /path/to/your/project
npx create-turbo@latest
# or
npx turbo@latest init
```

**Step 2: Configure pnpm Workspaces**
Create `pnpm-workspace.yaml` at repository root:
```yaml
packages:
  - 'apps/*'
  - 'packages/@auth/*'
  - 'packages/@shared/*'
  - 'convex'
```

Remove existing node_modules and lock files (if migrating):
```bash
rm -rf node_modules pnpm-lock.yaml yarn.lock package-lock.json
```

**Step 3: Create Root TypeScript Configuration**
Create `tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "paths": {
      "@auth/core": ["./packages/@auth/core/src"],
      "@auth/core/*": ["./packages/@auth/core/src/*"],
      "@auth/ui": ["./packages/@auth/ui/src"],
      "@auth/ui/*": ["./packages/@auth/ui/src/*"],
      "@auth/hooks": ["./packages/@auth/hooks/src"],
      "@auth/hooks/*": ["./packages/@auth/hooks/src/*"],
      "@auth/types": ["./packages/@auth/types/src"],
      "@auth/types/*": ["./packages/@auth/types/src/*"],
      "@auth/utils": ["./packages/@auth/utils/src"],
      "@auth/utils/*": ["./packages/@auth/utils/src/*"]
    }
  },
  "include": []
}
```

**Step 4: Install Build Tools**
```bash
pnpm add -D typescript @types/node
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D prettier
pnpm add -D eslint-plugin-import eslint-plugin-turbo
pnpm add -D tsup @types/node
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
```

**Step 5: Configure ESLint**
Create `.eslintrc.json` at root:
```json
{
  "root": true,
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:turbo/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "import", "turbo"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "import/no-cycle": "error"
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "parserOptions": {
        "project": ["./tsconfig.json"]
      }
    }
  ]
}
```

**Step 6: Configure Prettier**
Create `.prettierrc` at root:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

Create `.prettierignore`:
```
node_modules
dist
build
coverage
.turbo
pnpm-lock.yaml
*.lock
```

---

#### PART 2: Package Structure Setup (Days 2-3)

**Step 7: Create Package Directories**
```bash
# Create directory structure
mkdir -p packages/@auth/core/src/lib
mkdir -p packages/@auth/ui/src/{web,native}
mkdir -p packages/@auth/hooks/src
mkdir -p packages/@auth/types/src
mkdir -p packages/@auth/utils/src/{validators,encryption,tokens,email}

# Create Convex directory
mkdir -p convex/{functions/{auth,users,organizations,sessions},lib}
```

**Step 8: Create @auth/core Package**
Create `packages/@auth/core/package.json`:
```json
{
  "name": "@auth/core",
  "version": "0.0.1",
  "description": "Core Better Auth and Convex integration",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsup src/index.ts --dts --format esm",
    "dev": "tsup src/index.ts --watch --dts --format esm",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --fix"
  },
  "dependencies": {
    "better-auth": "^0.16.0",
    "@convex/auth": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "workspace:*",
    "tsup": "workspace:*",
    "@typescript-eslint/eslint-plugin": "workspace:*"
  }
}
```

Create `packages/@auth/core/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

Create `packages/@auth/core/src/index.ts`:
```typescript
// Re-export public API
export type { BetterAuthOptions } from './better-auth-config';
export { createAuthConfig } from './better-auth-config';
export { ConvexAuthAdapter } from './convex-adapter';

// Export version for debugging
export const VERSION = '0.0.1';
```

Create `packages/@auth/core/src/better-auth-config.ts`:
```typescript
// Placeholder for Better Auth configuration
export type BetterAuthOptions = {
  secret: string;
  baseURL: string;
  emailConfig?: {
    provider: 'resend';
    apiKey: string;
  };
};

export function createAuthConfig(options: BetterAuthOptions) {
  // Implementation will follow in Phase 2
  return {
    ...options,
    _placeholder: true,
  };
}
```

Create `packages/@auth/core/src/convex-adapter.ts`:
```typescript
// Placeholder for Convex adapter
export class ConvexAuthAdapter {
  constructor(options: unknown) {
    // Implementation will follow in Phase 2
  }
}
```

Create `packages/@auth/core/README.md`:
```markdown
# @auth/core

Core integration layer between Better Auth and Convex.

## Installation

\`\`\`bash
pnpm add @auth/core
\`\`\`

## Usage

[Full documentation coming in Phase 2]

## API

- `createAuthConfig()`: Initialize Better Auth configuration
- `ConvexAuthAdapter`: Convex adapter for Better Auth

## Development

\`\`\`bash
pnpm dev          # Watch mode
pnpm build        # Build for production
pnpm typecheck    # Type checking
pnpm lint         # Lint code
\`\`\`
```

**Step 9: Create @auth/ui Package**
Create `packages/@auth/ui/package.json`:
```json
{
  "name": "@auth/ui",
  "version": "0.0.1",
  "description": "Authentication UI components for web and mobile",
  "type": "module",
  "exports": {
    "./web": {
      "types": "./dist/web/index.d.ts",
      "default": "./dist/web/index.js"
    },
    "./native": {
      "types": "./dist/native/index.d.ts",
      "default": "./dist/native/index.js"
    }
  },
  "files": ["dist", "README.md"],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true
    }
  },
  "dependencies": {
    "@auth/types": "workspace:*"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --fix"
  }
}
```

Create `packages/@auth/ui/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

Create `packages/@auth/ui/tsup.config.ts`:
```typescript
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    name: 'web',
    entry: { index: 'src/web/index.tsx' },
    format: ['esm'],
    dts: true,
  },
  {
    name: 'native',
    entry: { index: 'src/native/index.tsx' },
    format: ['esm'],
    dts: true,
    external: ['react-native'],
  },
]);
```

Create component stubs (`packages/@auth/ui/src/web/index.tsx`):
```typescript
export function LoginForm(props: any) {
  return <div>LoginForm</div>;
}

export function SignupForm(props: any) {
  return <div>SignupForm</div>;
}

export function OAuthButton(props: any) {
  return <button>OAuth Button</button>;
}
```

Create native equivalents (`packages/@auth/ui/src/native/index.tsx`):
```typescript
import { View, Text } from 'react-native';

export function LoginForm(props: any) {
  return <View><Text>LoginForm</Text></View>;
}

// ... other components
```

**Step 10: Create @auth/hooks Package**
Create `packages/@auth/hooks/package.json`:
```json
{
  "name": "@auth/hooks",
  "version": "0.0.1",
  "description": "React hooks for authentication",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist", "README.md"],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@auth/types": "workspace:*",
    "@auth/core": "workspace:*"
  },
  "scripts": {
    "build": "tsup src/index.ts --dts --format esm",
    "dev": "tsup src/index.ts --watch --dts --format esm",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --fix"
  }
}
```

Create hook stubs (`packages/@auth/hooks/src/index.ts`):
```typescript
'use client';

export function useAuth() {
  return {
    user: null,
    session: null,
    isLoading: false,
    error: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
  };
}

export function useSession() {
  return {
    session: null,
    refreshToken: async () => {},
    revokeSession: async () => {},
    isValid: false,
  };
}

export function useOAuth() {
  return {
    signInWith: async () => {},
    isLoading: false,
    error: null,
  };
}

export function useTwoFactor() {
  return {
    isEnabled: false,
    setup: async () => {},
    verify: async () => {},
    disable: async () => {},
    backupCodes: [],
  };
}

export function usePasskey() {
  return {
    register: async () => {},
    authenticate: async () => {},
    list: async () => [],
    revoke: async () => {},
  };
}

export function useOrganization() {
  return {
    organization: null,
    setOrganization: async () => {},
    list: async () => [],
    create: async () => {},
    leave: async () => {},
  };
}
```

**Step 11: Create @auth/types Package**
Create `packages/@auth/types/package.json`:
```json
{
  "name": "@auth/types",
  "version": "0.0.1",
  "description": "Shared TypeScript type definitions",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

Create types (`packages/@auth/types/src/index.ts`):
```typescript
export type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSession = {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
};

export type AuthSession = {
  user: User;
  session: UserSession;
};

export type OAuthProvider = 'google' | 'github' | 'discord' | 'apple';

export enum AuthenticationMethod {
  EMAIL_PASSWORD = 'email_password',
  OAUTH = 'oauth',
  MAGIC_LINK = 'magic_link',
  EMAIL_OTP = 'email_otp',
  TOTP = 'totp',
  PASSKEY = 'passkey',
}

export type AuthConfig = {
  secret: string;
  baseURL: string;
  emailConfig?: {
    provider: 'resend';
    apiKey: string;
  };
  oauthProviders?: OAuthProvider[];
  enableMfa?: boolean;
  enablePasskeys?: boolean;
  enableOrganizations?: boolean;
};
```

**Step 12: Create @auth/utils Package**
Create `packages/@auth/utils/package.json`:
```json
{
  "name": "@auth/utils",
  "version": "0.0.1",
  "description": "Utility functions for authentication",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./validators": {
      "types": "./dist/validators/index.d.ts",
      "default": "./dist/validators/index.js"
    },
    "./tokens": {
      "types": "./dist/tokens/index.d.ts",
      "default": "./dist/tokens/index.js"
    }
  },
  "files": ["dist"],
  "dependencies": {
    "zod": "^3.22.0"
  },
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --fix"
  }
}
```

Create `packages/@auth/utils/tsup.config.ts`:
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/validators/index.ts', 'src/tokens/index.ts'],
  format: ['esm'],
  dts: true,
});
```

Create utility stubs:

`packages/@auth/utils/src/index.ts`:
```typescript
export * from './validators';
export * from './tokens';
```

`packages/@auth/utils/src/validators/index.ts`:
```typescript
import { z } from 'zod';

const emailSchema = z.string().email();

export function validateEmail(email: string) {
  const result = emailSchema.safeParse(email);
  return {
    valid: result.success,
    error: result.error?.message,
  };
}

export function validatePassword(password: string) {
  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters' };
  }
  return { valid: true };
}
```

`packages/@auth/utils/src/tokens/index.ts`:
```typescript
import { randomBytes } from 'crypto';

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function verifyToken(token: string, expected: string): boolean {
  return token === expected;
}
```

---

#### PART 3: Workspace Setup (Days 3-4)

**Step 13: Install Dependencies**
```bash
pnpm install
pnpm rebuild
```

**Step 14: Update Root package.json Scripts**
Add to root `package.json`:
```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "type-check": "turbo run typecheck"
  }
}
```

**Step 15: Configure Turborepo**
Update `turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*.local"],
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    "typecheck": {
      "outputs": [],
      "cache": true,
      "inputs": ["tsconfig.json", "src/**/*.ts", "src/**/*.tsx"]
    },
    "lint": {
      "outputs": [],
      "cache": true,
      "inputs": ["src/**/*.{ts,tsx}", ".eslintrc.json"]
    },
    "build": {
      "outputs": ["dist/**"],
      "cache": true,
      "inputs": ["src/**", "package.json", "tsconfig.json"],
      "dependsOn": ["^build", "typecheck", "lint"]
    },
    "test": {
      "outputs": ["coverage/**"],
      "cache": true,
      "inputs": ["src/**", "test/**", "vitest.config.ts"],
      "dependsOn": ["build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Step 16: Test Build**
```bash
pnpm build
```

Expected output: All packages build successfully, artifacts in dist/ directories.

**Step 17: Create Monorepo Test File**
Create `test/integration.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Monorepo Integration', () => {
  it('should import from @auth/core', async () => {
    const core = await import('@auth/core');
    expect(core.VERSION).toBeDefined();
  });

  it('should import from @auth/types', async () => {
    const types = await import('@auth/types');
    expect(types.AuthenticationMethod).toBeDefined();
  });

  it('should import from @auth/utils', async () => {
    const utils = await import('@auth/utils');
    expect(utils.validateEmail).toBeDefined();
  });
});
```

Run test:
```bash
pnpm test
```

---

#### PART 4: Application Setup (Days 4-5)

**Step 18: Create Next.js Web App**
```bash
cd apps
pnpm create next-app@latest web --typescript --tailwind --app --yes
cd ..
```

Update `apps/web/tsconfig.json` to extend base:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@auth/ui": ["../../packages/@auth/ui/src/web"],
      "@auth/hooks": ["../../packages/@auth/hooks/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

Add to `apps/web/package.json`:
```json
{
  "dependencies": {
    "@auth/types": "workspace:*",
    "@auth/ui": "workspace:*",
    "@auth/hooks": "workspace:*"
  }
}
```

**Step 19: Create Expo Mobile App**
```bash
cd apps
npx create-expo-app@latest mobile
cd mobile
npx install-expo-modules
pnpm add -D expo-router expo-constants
cd ../..
```

Update `apps/mobile/package.json`:
```json
{
  "dependencies": {
    "@auth/types": "workspace:*",
    "@auth/ui": "workspace:*",
    "@auth/hooks": "workspace:*"
  }
}
```

**Step 20: Update Root .gitignore**
```
node_modules
pnpm-lock.yaml
*.log
dist
build
coverage
.turbo
.env*.local
.DS_Store
.idea
.vscode/*.workspace
```

---

#### PART 5: CI/CD Setup (Day 5)

**Step 21: Create GitHub Actions Workflow**
Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Type checking
        run: pnpm typecheck

      - name: Linting
        run: pnpm lint

      - name: Build
        run: pnpm build

      - name: Tests
        run: pnpm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.node-version == '20.x'
```

**Step 22: Configure Branch Protection**
1. Go to repository Settings
2. Navigate to Branches
3. Add rule for main branch
4. Require CI to pass
5. Require at least 1 review

---

#### PART 6: Documentation (Days 5-6)

**Step 23: Create ARCHITECTURE.md**
Create at root:
```markdown
# Better-Convex-Auth Architecture

## Monorepo Structure

\`\`\`
.
├── apps/
│   ├── web/              # Next.js web application
│   └── mobile/           # Expo React Native application
├── packages/
│   └── @auth/
│       ├── core/         # Better Auth + Convex integration
│       ├── ui/           # UI components
│       ├── hooks/        # React hooks
│       ├── types/        # TypeScript types
│       └── utils/        # Utilities
├── convex/               # Backend functions and schema
├── turbo.json            # Turborepo configuration
└── pnpm-workspace.yaml   # Workspace configuration
\`\`\`

## Package Responsibilities

| Package | Purpose | Exports |
|---------|---------|---------|
| @auth/core | Better Auth + Convex integration | Server config functions |
| @auth/ui | Authentication UI components | React & React Native components |
| @auth/hooks | Auth state management | useAuth, useSession, etc |
| @auth/types | Shared TypeScript definitions | User, Session, Config types |
| @auth/utils | Pure utility functions | Validators, encryption, tokens |

## Development Workflow

All commands run from repository root:

\`\`\`bash
pnpm install        # Install dependencies
pnpm build          # Build all packages
pnpm dev            # Start all packages in watch mode
pnpm test           # Run tests
pnpm lint           # Run linting
\`\`\`
```

**Step 24: Create DEVELOPMENT.md**
Create at root:
```markdown
# Development Setup

## Quick Start

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

This starts:
- All packages in watch mode
- Next.js web app on http://localhost:3000
- Expo server for mobile development

## Common Commands

\`\`\`bash
pnpm build              # Build all packages
pnpm test               # Run all tests
pnpm lint               # Run linting
pnpm typecheck          # TypeScript checking
pnpm build --filter=@auth/core  # Build specific package
\`\`\`

## IDE Setup

### VS Code
1. Install extensions:
   - ESLint
   - Prettier
   - TypeScript Vue Plugin
   - React Native Tools

2. Create .vscode/settings.json
3. Configure formatter as Prettier
```

**Step 25: Package README Files**

Update each package `README.md` with purpose statement.

---

### Validation Checklist

```bash
# Verify structure
ls -la apps/
ls -la packages/@auth/

# Verify builds
pnpm build

# Verify tests
pnpm test

# Verify no circular dependencies
pnpm lint

# Verify type safety
pnpm typecheck

# Verify CI/CD
# Check GitHub Actions workflow runs successfully
```

## Completion Criteria

✓ All 12 package directories created
✓ `pnpm install` completes without errors
✓ `pnpm build` completes in < 2 minutes
✓ `pnpm dev` starts all packages
✓ CI/CD workflow passes
✓ No TypeScript errors
✓ No ESLint errors
✓ Documentation complete
✓ New developer can follow DEVELOPMENT.md successfully
```

---

### /speckit.analyze
**Consistency Analysis for Phase 1**

```
## Architecture Consistency Checks

### Dependency Consistency
**Check**: No version mismatches across packages
- [ ] All @auth/* packages use same versions of dependencies
- [ ] Peer dependencies clearly specified for React packages
- [ ] No duplicate version specifications in package.json files
- [ ] Lock file (pnpm-lock.yaml) is consistent

**Verification**:
```bash
pnpm list --recursive --depth=0 | grep -E "typescript|zod|react"
# Should show consistent versions across packages
```

**Issue Resolution Process**:
If versions differ:
1. Identify which package has wrong version
2. Update that package.json
3. Run `pnpm install`
4. Commit lock file changes

---

### Package Boundary Consistency
**Check**: Each package respects established boundaries
- [ ] @auth/core doesn't export UI components
- [ ] @auth/ui doesn't contain business logic
- [ ] @auth/hooks only exports React hooks
- [ ] @auth/types contains no runtime code
- [ ] @auth/utils contains no side effects

**Verification**:
```bash
# Check @auth/types for runtime code
grep -r "export function\|export const" packages/@auth/types/src/
# Should return no results

# Check circular dependencies
eslint . --ext .ts,.tsx
# Should show no import/no-cycle errors
```

**Issue Resolution**:
If boundary violations found:
1. Identify violating code
2. Move to appropriate package
3. Update imports in dependent packages
4. Re-run linting

---

### TypeScript Configuration Consistency
**Check**: All packages follow same TypeScript rules
- [ ] tsconfig.base.json enforced across all packages
- [ ] Strict mode enabled everywhere
- [ ] Path aliases consistent
- [ ] Generated type declarations included in build outputs

**Verification**:
```bash
# Check all packages extend base config
grep "extends.*base.json" packages/*/tsconfig.json
# Should show exact pattern match

# Verify strict mode enabled
pnpm typecheck
# Should have zero errors
```

**Issue Resolution**:
If TypeScript configs diverge:
1. Identify differences from tsconfig.base.json
2. Remove package-level overrides unless justified
3. Add ADR explaining exception
4. Update documentation

---

### Export Consistency
**Check**: All packages export consistent API surface
- [ ] Each package has primary export from src/index.ts
- [ ] Re-exports properly named and grouped
- [ ] No wildcard re-exports from internal modules
- [ ] Clear separation between public and internal APIs

**Verification**:
```bash
# Check primary exports
for dir in packages/@auth/*/; do
  echo "=== $(basename $dir) ==="
  cat "$dir/src/index.ts" | head -20
done
```

**Issue Resolution**:
If exports inconsistent:
1. Define module contract in package README
2. Consolidate exports to src/index.ts
3. Add barrel exports for related modules
4. Document rationale for export structure

---

### Build Configuration Consistency
**Check**: All packages build correctly
- [ ] turbo.json properly defines all build tasks
- [ ] Each package has build script
- [ ] Build outputs go to dist/ directory
- [ ] tsup/tsc configurations consistent

**Verification**:
```bash
# Verify each package builds independently
for pkg in packages/@auth/*; do
  echo "Building $(basename $pkg)..."
  pnpm --filter="$(basename $pkg)" build || echo "FAILED: $(basename $pkg)"
done
```

**Issue Resolution**:
If build fails:
1. Check error message for missing dependencies
2. Verify tsconfig.json extends base config
3. Check for syntax errors in source
4. Verify build output paths match turbo.json

---

### Cache Configuration Consistency
**Check**: Turborepo caching properly configured
- [ ] All deterministic tasks have caching enabled
- [ ] Input patterns match actual files
- [ ] Output paths match actual build outputs
- [ ] Cache hit rate > 80% on second build

**Verification**:
```bash
# First build (cold cache)
time pnpm build

# Second build (warm cache, should be much faster)
time pnpm build

# Check Remote Cache stats (if configured)
turbo telemetry status
```

**Issue Resolution**:
If cache hit rate low:
1. Review turbo.json input definitions
2. Ensure inputs match actual modified files
3. Check cache invalidation rules
4. Verify outputs correctly defined

---

### Dependency Graph Consistency
**Check**: No unintended dependencies or cycles
- [ ] Dependency graph is acyclic
- [ ] Only forward dependencies (no upward deps)
- [ ] Peer dependencies explicit
- [ ] No implicit transitive dependency chains

**Verification**:
```bash
# Generate and review dependency graph
pnpm install --dry-run 2>&1 | grep -E "^[├└]|ERR"

# Check for cycles with eslint
eslint . --ext .ts --plugin import --rule 'import/no-cycle: error'
```

**Issue Resolution**:
If cycles detected:
1. Identify packages involved in cycle
2. Determine which dependency can be reversed
3. Move shared code to common package
4. Update imports and re-test

---

### Documentation Consistency
**Check**: All documentation accurate and up-to-date
- [ ] ARCHITECTURE.md matches actual structure
- [ ] DEVELOPMENT.md contains working setup instructions
- [ ] Package README.md files are complete
- [ ] Type definitions have JSDoc comments

**Verification**:
```bash
# New developer clones and follows DEVELOPMENT.md
# Should result in working environment

# Check for missing documentation
find packages -name "*.ts" -not -path "*/node_modules/*" \
  -not -path "*/dist/*" | head -5 | while read f; do
    grep -q "/**" "$f" || echo "Missing docs: $f"
done
```

**Issue Resolution**:
If documentation issues:
1. Update documentation to match code
2. Add JSDoc comments to exported functions
3. Include code examples in README files
4. Create troubleshooting section if issues common

---

## Consistency Report Generation

Run this script to generate consistency report:

```bash
#!/bin/bash
echo "=== Phase 1 Consistency Check ==="
echo ""

echo "1. TypeScript Compilation..."
pnpm typecheck && echo "✓ PASS" || echo "✗ FAIL"
echo ""

echo "2. ESLint (No Cycles)..."
pnpm lint && echo "✓ PASS" || echo "✗ FAIL"
echo ""

echo "3. Build Success..."
pnpm build && echo "✓ PASS" || echo "✗ FAIL"
echo ""

echo "4. Tests..."
pnpm test && echo "✓ PASS" || echo "✗ FAIL"
echo ""

echo "=== Phase 1 Consistency: COMPLETE ==="
```

Save as `scripts/consistency-check.sh` and run:
```bash
chmod +x scripts/consistency-check.sh
./scripts/consistency-check.sh
```
```

---

### /speckit.checklist
**Quality Validation for Phase 1**

```
## Phase 1 Final Validation Checklist

### Infrastructure Validation

#### Monorepo Setup
- [ ] Repository contains turbo.json at root
- [ ] Repository contains pnpm-workspace.yaml
- [ ] pnpm-lock.yaml is committed to git
- [ ] Root package.json contains workspace scripts
- [ ] Root tsconfig.base.json with strict mode enabled
- [ ] .eslintrc.json configured with type checking rules
- [ ] .prettierrc present with formatting rules

**Fix if Failed**:
- Verify turbo.json syntax: `pnpm exec turbo --help`
- Verify pnpm workspace: `pnpm list --recursive`
- Regenerate lock file: `rm pnpm-lock.yaml && pnpm install`

---

#### Package Structure
- [ ] All 5 @auth/* packages exist with proper structure:
  - [ ] @auth/core: src/index.ts, tsconfig.json, package.json
  - [ ] @auth/ui: src/web, src/native, tsconfig.json, package.json
  - [ ] @auth/hooks: src/*.ts files, tsconfig.json, package.json
  - [ ] @auth/types: src/types.ts, tsconfig.json, package.json
  - [ ] @auth/utils: src/validators, src/tokens, tsconfig.json, package.json
- [ ] Each package has README.md with purpose statement
- [ ] No package contains commented-out code
- [ ] All files follow naming convention (kebab-case for files, camelCase for exports)

**Fix if Failed**:
- Create missing directories: `mkdir -p packages/@auth/core/src`
- Add README to packages: `echo "# @auth/core" > packages/@auth/core/README.md`
- Update package.json files with proper exports field

---

#### Workspace Linking
- [ ] pnpm install completes without errors
- [ ] pnpm list shows proper dependency tree
- [ ] No "circular dependency" warnings
- [ ] All @auth/* packages appear in dependency tree
- [ ] workspace: protocol used for internal references

**Fix if Failed**:
```bash
# Clean and rebuild workspace
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
pnpm list --recursive
```

---

### Build & Compilation Validation

#### TypeScript Compilation
- [ ] `pnpm typecheck` passes with zero errors
- [ ] No "any" types in public APIs (src/index.ts files)
- [ ] All imports resolve correctly
- [ ] Generated .d.ts files are valid

**Fix if Failed**:
```bash
pnpm typecheck  # Find specific errors
# Fix errors in source files
# Ensure tsconfig.json extends tsconfig.base.json
```

---

#### Build Process
- [ ] `pnpm build` completes successfully
- [ ] All packages produce dist/ directory
- [ ] No build warnings (except node_modules)
- [ ] Build time < 3 minutes
- [ ] Generated files are .gitignored

**Fix if Failed**:
```bash
pnpm clean  # May need: rm -rf packages/*/dist
pnpm build  # Review error output
# Check tsconfig.json compilerOptions.outDir
```

---

#### Package Exports
- [ ] Each package exports from dist/ directory
- [ ] package.json exports field properly configured
- [ ] Exports include TypeScript type definitions
- [ ] Both ESM and CJS formats supported (if applicable)

**Fix if Failed**:
- Review package.json exports field format
- Ensure build step generates .d.ts files
- Test imports from generated dist/ directory

---

### Code Quality Validation

#### Linting
- [ ] `pnpm lint` produces zero errors
- [ ] No console.log statements in code
- [ ] No import cycles detected
- [ ] Turbo rules followed (proper task dependency markers)
- [ ] All imports from packages are resolved

**Fix if Failed**:
```bash
pnpm lint  # Review error list
eslint . --fix  # Auto-fix where possible
# Manually fix remaining issues
```

---

#### Type Safety
- [ ] TypeScript strict mode: enabled
- [ ] `noImplicitAny`: error
- [ ] `strictNullChecks`: error
- [ ] All exported functions have type annotations
- [ ] No @ts-ignore comments in production code

**Fix if Failed**:
- Add type annotations to function parameters
- Update tsconfig.base.json strict settings
- Remove @ts-ignore and fix underlying issues

---

#### Code Style
- [ ] All files pass Prettier formatting: `pnpm format --check`
- [ ] Consistent naming conventions (files: kebab-case, exports: camelCase)
- [ ] Consistent indentation (2 spaces)
- [ ] No trailing whitespace
- [ ] Files end with newline

**Fix if Failed**:
```bash
pnpm format  # Auto-format all files
git add .
```

---

### Testing Validation

#### Test Coverage
- [ ] All packages have test/ or __tests__/ directory
- [ ] Integration test file at root: test/integration.test.ts
- [ ] `pnpm test` runs without errors
- [ ] All tests pass
- [ ] Code coverage reports generated

**Fix if Failed**:
```bash
pnpm test --reporter=verbose  # Show failing tests
# Add test files to packages
# Update vitest configuration if needed
```

---

#### Test Quality
- [ ] Tests import from built dist/ directory
- [ ] Tests mock external dependencies
- [ ] At least one test per public export
- [ ] No skipped tests (no .skip or .only)
- [ ] Tests document expected behavior

**Fix if Failed**:
- Write test files for each package
- Add import statements matching public API
- Update test structure in DEVELOPMENT.md

---

### Documentation Validation

#### Root Documentation
- [ ] ARCHITECTURE.md exists and is complete
  - [ ] Explains directory structure
  - [ ] Lists all packages and responsibilities
  - [ ] Includes dependency graph
  - [ ] Explains key decisions
- [ ] DEVELOPMENT.md exists and is complete
  - [ ] Contains quick start instructions
  - [ ] Lists common commands
  - [ ] Includes IDE setup
  - [ ] Has troubleshooting section
- [ ] CONTRIBUTING.md exists (if public project)
- [ ] .editorconfig created

**Fix if Failed**:
- Create missing documentation files
- Review documentation against actual implementation
- Test documentation with new developer setup

---

#### Package Documentation
- [ ] Each package has README.md
- [ ] README includes: purpose, installation, usage, API overview
- [ ] README links to full documentation (Phase 2)
- [ ] At least one usage example in each README
- [ ] Breaking change notes (if applicable)

**Fix if Failed**:
```bash
# For each package, create/update README.md
for pkg in packages/@auth/*; do
  [ ! -f "$pkg/README.md" ] && echo "# $(basename $pkg)" > "$pkg/README.md"
done
```

---

#### Code Documentation
- [ ] All exported functions/types have JSDoc comments
- [ ] JSDoc includes parameter descriptions
- [ ] JSDoc includes return type descriptions
- [ ] Complex algorithms are explained
- [ ] Known limitations are documented

**Fix if Failed**:
- Add /** */ comment blocks before exports
- Use @param, @returns JSDoc tags
- Include @example tags for common usage

---

### CI/CD Validation

#### GitHub Actions
- [ ] .github/workflows/ci.yml exists
- [ ] Workflow runs on push to main and PRs
- [ ] All workflow steps complete successfully
- [ ] Coverage reports uploaded
- [ ] Build artifacts generated

**Fix if Failed**:
```bash
# Push to branch and create PR to test workflow
# Check Actions tab for workflow results
# Review workflow logs for errors
```

---

#### Branch Protection
- [ ] main branch has protection rules
- [ ] CI must pass before merging
- [ ] At least one review required
- [ ] Stale approvals dismissed on new commits

**Fix if Failed**:
- Go to Settings → Branches
- Add rule for main branch
- Configure required checks and reviews

---

### Security Validation

#### Dependency Security
- [ ] `npm audit` shows zero vulnerabilities
- [ ] All packages use latest stable versions
- [ ] No hard-coded secrets in code
- [ ] .env files are properly .gitignored
- [ ] Lock file is committed (dependency tracking)

**Fix if Failed**:
```bash
npm audit  # Review vulnerabilities
npm audit fix  # Auto-fix where possible
# Manually update vulnerable dependencies
```

---

#### Access Control
- [ ] No sensitive files in git history
- [ ] .gitignore properly configured
- [ ] npm credentials not in repository
- [ ] Deploy keys configured (not personal tokens)

**Fix if Failed**:
- Add sensitive files to .gitignore
- Use `git rm --cached` for accidentally committed files
- Rotate any exposed credentials

---

### Performance Validation

#### Build Performance
- [ ] Cold build time < 3 minutes
- [ ] Warm build time < 30 seconds (with cache)
- [ ] Incremental build time < 5 seconds
- [ ] Build tasks properly parallelized

**Fix if Failed**:
```bash
# Profile build
time pnpm build
# Check turbo.json task dependencies
# Review which tasks run sequentially vs parallel
```

---

#### Bundle Size
- [ ] Each package < 100KB (gzipped)
- [ ] No unnecessary dependencies
- [ ] Tree-shaking enabled in build
- [ ] Source maps generated for debugging

**Fix if Failed**:
- Review package.json dependencies
- Ensure build configured for treeshaking
- Remove unused code

---

### Deployment Readiness Validation

#### Next.js App
- [ ] Application starts without errors: `pnpm dev` (in apps/web)
- [ ] Can import types from @auth/types
- [ ] Can import components from @auth/ui/web
- [ ] Can import hooks from @auth/hooks
- [ ] No TypeScript errors in IDE

**Fix if Failed**:
- Verify app is running on correct port
- Check tsconfig.json path aliases
- Ensure package imports are correct

---

#### Expo Mobile App
- [ ] Application starts in simulator: `npx expo start`
- [ ] Can import from @auth/* packages
- [ ] No TypeScript errors
- [ ] Builds successfully for iOS and Android

**Fix if Failed**:
- Clear expo cache: `npx expo start --clear`
- Check React Native compatibility
- Verify package.json dependencies

---

### Final Sign-Off

#### Checklist Summary
- [ ] All infrastructure items checked
- [ ] All build & compilation items checked
- [ ] All code quality items checked
- [ ] All testing items checked
- [ ] All documentation items checked
- [ ] All CI/CD items checked
- [ ] All security items checked
- [ ] All performance items checked
- [ ] All deployment readiness items checked

#### Approval Gates
- [ ] Code reviewed by team member (solo: self-review)
- [ ] All CI checks passing
- [ ] Documentation reviewed
- [ ] Performance benchmarks met
- [ ] Security audit passed

#### Ready for Phase 2
- [ ] Repository is clean (no uncommitted changes)
- [ ] Git history is clean (meaningful commits)
- [ ] Tags created for Phase 1 milestone
- [ ] Changelog updated
- [ ] Phase 2 kickoff scheduled

**Sign-Off**:
```bash
# Create Phase 1 completion tag
git tag -a v1.0.0-phase1 -m "Phase 1: Foundation complete"
git push origin v1.0.0-phase1

# Document completion
echo "Phase 1 Complete - $(date)" >> CHANGELOG.md
git commit -am "chore: Phase 1 completion"
```

---

## Validation Script

Create `scripts/validate-phase1.sh`:

```bash
#!/bin/bash
set -e

echo "=== Phase 1 Validation ==="
echo ""

PASS_COUNT=0
FAIL_COUNT=0

# Check function
check() {
  local name="$1"
  local command="$2"
  
  if eval "$command" > /dev/null 2>&1; then
    echo "✓ $name"
    ((PASS_COUNT++))
  else
    echo "✗ $name"
    ((FAIL_COUNT++))
  fi
}

# Run checks
check "TypeScript compilation" "pnpm typecheck"
check "ESLint validation" "pnpm lint"
check "Build success" "pnpm build"
check "Tests passing" "pnpm test"
check "No vulnerabilities" "npm audit"

echo ""
echo "=== Results ==="
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo "✓ Phase 1 Validation Complete"
  exit 0
else
  echo "✗ Phase 1 Validation Failed"
  exit 1
fi
```

Run validation:
```bash
chmod +x scripts/validate-phase1.sh
./scripts/validate-phase1.sh
```
```

---

## End of Phase 1 Spec-Kit Templates

This completes the comprehensive GitHub Spec-Kit templates for **Phase 1: Foundation & Project Structure** of the Better-Convex-Auth implementation.

---

# PHASE 2: Better Auth & Convex Integration (Week 2-3)

[Continuing with Phase 2 templates...]

### /speckit.constitution
**Project Principles for Phase 2**

```
You are implementing core authentication functionality by integrating Better Auth with Convex backend. Your work in Phase 2 transforms the Phase 1 foundation into a functioning authentication system.

## Core Principles for Phase 2

### 1. Security-First Integration
- Every Convex function must validate authentication before processing
- Better Auth configuration should enforce secure defaults
- Database schema must support audit logging of security events
- Token management should be centralized and immutable
- Apply defense in depth: multiple validation layers

### 2. Backend-Frontend Separation
- All security logic resides in Convex (backend)
- Better Auth SDK handles client-side state
- No sensitive data (tokens, secrets) exposed to client unnecessarily
- API contracts are strictly typed with shared @auth/types
- Client trusts but always verifies on backend

### 3. Convex as Source of Truth
- Database schema is the contract between frontend and backend
- Queries define what data frontend can access
- Mutations enforce business logic and validation
- Actions handle external integrations (email, SMS)
- HTTP routes proxy Better Auth handler

### 4. Type-Safety Through Boundaries
- Convex-generated types must be imported and used in frontend
- Better Auth config types match Convex expectations
- Session validation types consistent across layers
- Compilation fails if types don't align (schema changes)
- Database queries must specify return types

### 5. Real-Time Data Sync
- Convex subscriptions keep frontend in sync with backend
- Authentication state changes propagate immediately
- Multi-device logout works in real-time
- Session invalidation is instant across all devices
- Use optimistic updates for perceived instant responsiveness

### 6. Scalability Through Statelessness
- Sessions are stateless JWTs when possible
- Convex handles scaling automatically
- No sticky sessions or server affinity required
- Database queries are efficiently indexed
- Rate limiting is application-level, not infrastructure

### 7. Developer Experience in Backend Integration
- Convex error messages are specific and actionable
- Better Auth config is well-structured and documented
- Functions are small, testable, and composable
- Validation errors guide user toward correct input
- Types make impossible states unrepresentable

## Phase 2 Success Criteria

✓ Better Auth fully configured with email/password and OAuth
✓ Convex schema models users, sessions, and organizations
✓ Secure password reset and email verification flows working
✓ Multi-factor authentication groundwork laid
✓ All data properly indexed for performance
✓ Zero security vulnerabilities in integration
✓ > 90% test coverage for authentication logic
✓ Frontend can authenticate and maintain session
```

### /speckit.specify
**Detailed Requirements for Phase 2**

```
## Feature Specifications

### Requirement 1: Convex Database Schema & Functions
**Status**: Critical backend infrastructure
**Priority**: P0

#### Database Schema Implementation
**Requirement**: Design and implement complete Convex schema for authentication

**Users Table**:
- id: string (primary key)
- email: string (indexed, unique)
- emailVerified: boolean
- name: string | null
- image: string | null
- password: string (hashed with scrypt)
- createdAt: number (timestamp)
- updatedAt: number (timestamp)
- deletedAt: number | null (soft deletes for GDPR)
- metadata: JSON (extensible user data)

**Sessions Table**:
- id: string (primary key)
- userId: string (foreign key to users, indexed)
- token: string (indexed for fast lookup)
- expiresAt: number (timestamp, indexed for cleanup)
- createdAt: number (timestamp)
- userAgent: string (for device tracking)
- ipAddress: string (for geographic tracking)

**Accounts (OAuth Providers)**:
- id: string (primary key)
- userId: string (foreign key to users, indexed)
- provider: string ("google" | "github" | "discord" | "apple")
- providerAccountId: string
- providerData: JSON (store provider-specific metadata)
- createdAt: number (timestamp)

**Verification Tokens** (Email & Password Reset):
- id: string (primary key)
- userId: string (foreign key to users, indexed)
- email: string (for verification records)
- token: string (hashed token, indexed)
- tokenType: string ("email_verification" | "password_reset")
- expiresAt: number (timestamp, indexed for cleanup)
- usedAt: number | null (null until used, for single-use tokens)
- createdAt: number (timestamp)

**Organizations Table**:
- id: string (primary key)
- name: string
- slug: string (unique, for URLs)
- ownerId: string (foreign key to users)
- image: string | null
- metadata: JSON (customization, branding)
- createdAt: number (timestamp)
- updatedAt: number (timestamp)

**Organization Members Table**:
- id: string (primary key)
- organizationId: string (foreign key to orgs, indexed)
- userId: string (foreign key to users, indexed)
- role: string ("owner" | "admin" | "member" | "guest")
- invitedAt: number | null
- joinedAt: number (timestamp)
- updatedAt: number (timestamp)
- composite index: (organizationId, userId) for fast lookups

#### Convex Function Organization
**Requirement**: Structure functions by responsibility domain

**Auth Functions** (/convex/functions/auth):
- `signUp(email, password, name)`: Create new user with password
- `signIn(email, password)`: Authenticate existing user
- `resetPasswordRequest(email)`: Initiate password reset
- `resetPassword(token, newPassword)`: Complete password reset
- `verifyEmail(token)`: Confirm email ownership
- `signOut(sessionId)`: Invalidate session

**Session Functions** (/convex/functions/sessions):
- `createSession(userId, metadata)`: Create authenticated session
- `validateSession(token)`: Check if session is valid
- `getSession(sessionId)`: Retrieve session details
- `listActiveSessions(userId)`: Get all user sessions
- `revokeSession(sessionId)`: End specific session
- `revokeAllSessions(userId)`: Force logout everywhere

**User Functions** (/convex/functions/users):
- `getUser(userId)`: Get current user profile
- `updateProfile(userId, updates)`: Update user info
- `updatePassword(userId, oldPassword, newPassword)`: Change password
- `deleteAccount(userId)`: Soft delete user account
- `getUserByEmail(email)`: Lookup by email (auth context)

**Organization Functions** (/convex/functions/organizations):
- `createOrganization(userId, name)`: Create new team
- `getOrganization(orgId)`: Get org details
- `listUserOrganizations(userId)`: All orgs user belongs to
- `addMember(orgId, email, role)`: Invite member
- `removeMember(orgId, userId)`: Remove member
- `updateMemberRole(orgId, userId, role)`: Change role

#### Security Architecture
**Requirement**: Implement security best practices throughout functions

- **Authentication Validation**:
  - Every public function validates ctx.auth.getUserIdentity()
  - Authentication failures return specific error code
  - Log failed authentication attempts for monitoring
  - Rate limit to prevent brute force

- **Authorization Checks**:
  - Row-level security for user-specific data
  - Organization membership validation
  - Role-based permission checks
  - Resource ownership verification

- **Input Validation**:
  - Use Zod schema validators on all inputs
  - Validate email format, password requirements
  - Sanitize string inputs (trim, max length)
  - Reject null/undefined on required fields

- **Data Protection**:
  - Hash passwords with scrypt (memory-hard algorithm)
  - Encrypt sensitive tokens in database
  - Never log passwords or sensitive data
  - Implement data retention policies

---

### Requirement 2: Better Auth Configuration & Setup
**Status**: Critical
**Priority**: P0

#### Email/Password Authentication
**Requirement**: Complete implementation of traditional auth

- **Signup Flow**:
  - Email validation (valid format, not already registered)
  - Password validation (minimum 12 chars, complexity)
  - Create user record with hashed password
  - Send verification email with link
  - Require email verification before full access
  - Store signup metadata (ip, user agent, timestamp)

- **Signin Flow**:
  - Email lookup in database
  - Constant-time password comparison
  - Create session token
  - Return session to client
  - Set secure HttpOnly cookie
  - Track failed attempts (lock after 10 attempts/15 min)

- **Password Reset**:
  - Generate secure random token
  - Store token hash with expiration (1 hour)
  - Send email with reset link
  - Validate token on reset endpoint
  - Hash new password
  - Invalidate all existing sessions
  - Log password reset event

- **Configuration**:
  - Password requirements: 12+ chars, uppercase, lowercase, number, symbol
  - Session expiration: 30 days default, configurable
  - Email verification required: true (default)
  - Allow signup: true (configurable per environment)

#### Social OAuth Integration
**Requirement**: Support popular OAuth providers

- **Supported Providers**:
  - Google OAuth 2.0
  - GitHub OAuth 2.0
  - Apple Sign In
  - Discord OAuth 2.0

- **For Each Provider**:
  - Client ID and secret from provider
  - Redirect URI properly configured
  - PKCE flow enabled (for security)
  - State validation to prevent CSRF
  - Scope configuration (minimal permissions)

- **Account Linking**:
  - If OAuth email matches existing user, link account
  - Allow users to link multiple providers
  - Prevent account takeover via provider compromise
  - Allow unlinking if user has password

- **Session Handling**:
  - Create session after OAuth completion
  - Store provider-specific metadata
  - Handle provider token refresh
  - Graceful degradation if provider unavailable

#### Advanced Authentication Methods
**Requirement**: Prepare groundwork for future methods

- **Magic Links**:
  - Generate time-limited (15 min) secure link
  - Single-use token validation
  - Deep linking support for mobile
  - Token preview in email (not full token)

- **Email OTP**:
  - 6-digit codes with 10-minute expiration
  - Rate limiting (max 5 sends per hour)
  - Auto-fill support on mobile (WebAuthn)
  - Resend with exponential backoff

- **Two-Factor Authentication**:
  - TOTP (Time-based One-Time Password) support
  - Backup codes (10 single-use codes)
  - Recovery procedures documented
  - Enforcement policies (require vs optional)

- **Passkeys (WebAuthn)**:
  - Device-bound credential registration
  - Biometric authentication support
  - Phishing-resistant authentication
  - User verification via device

#### Configuration Strategy
**Requirement**: Better Auth configuration accessible and maintainable

- **Configuration Location**: @auth/core package
- **Exports**:
  - `createAuthConfig(options: BetterAuthOptions)`: Factory function
  - `BetterAuthOptions`: Type for configuration
  - `ConvexAuthAdapter`: Adapter for Convex integration
  - `getAuthHandler()`: HTTP handler for routes

- **Configuration Keys**:
  - secret: string (from environment)
  - baseURL: string (application URL)
  - database: Convex connection
  - emailProvider: Resend configuration
  - oauthProviders: Provider credentials
  - sessionExpiration: number (seconds)
  - passwordRequirements: strength rules

- **Environment-Specific**:
  - Development: Relaxed security, debug logging
  - Staging: Production-like, but separate database
  - Production: Strict security, no debug output

---

### Requirement 3: Email Service Integration
**Status**: Important
**Priority**: P1

#### Resend Email Provider
**Requirement**: Send authentication emails reliably

- **Provider Configuration**:
  - API key from Resend dashboard
  - Sender email address verified
  - Domain authentication (SPF, DKIM, DMARC)
  - Webhook for bounce/complaint handling

- **Email Types**:
  - Email verification: Confirm email ownership
  - Password reset: Allow user to regain access
  - Magic link: Passwordless authentication
  - OTP: One-time password for 2FA
  - Invitation: Invite user to organization
  - Account recovery: Multi-factor recovery

- **Template Design**:
  - HTML templates with branding
  - Plain text fallbacks for email clients
  - Responsive design for mobile
  - Localization support (language selection)
  - Unsubscribe links (transactional emails)

- **Deliverability**:
  - SPF/DKIM/DMARC authentication
  - Sender reputation monitoring
  - Bounce and complaint handling
  - Retry logic with exponential backoff
  - Rate limiting to prevent blocks

#### Email Validation
**Requirement**: Ensure high delivery rates

- **Pre-Send Validation**:
  - Email format validation (RFC 5322)
  - Disposable email detection
  - Typo detection (common domains)
  - Bounce handling for known bad addresses

- **Post-Send Tracking**:
  - Log all email sends with metadata
  - Track open events
  - Track link click events
  - Monitor bounce rates

---

### Requirement 4: Rate Limiting & Security
**Status**: Essential
**Priority**: P0

#### Rate Limiting Implementation
**Requirement**: Protect endpoints from abuse

- **Authentication Endpoints**:
  - /signin: 10 attempts per 15 minutes
  - /signup: 5 attempts per 15 minutes
  - /password-reset: 3 attempts per hour
  - /verify-email: 5 sends per hour

- **Implementation Method**:
  - Track by IP address + user identifier
  - Sliding window algorithm
  - Persistent storage (database)
  - Exponential backoff (optional)

- **Handling Breaches**:
  - Return 429 (Too Many Requests) status
  - Indicate when rate limit resets
  - Log rate limit violations
  - Alert if thresholds exceeded

#### Security Monitoring
**Requirement**: Detect and respond to threats

- **Monitoring Events**:
  - Failed authentication attempts
  - Successful authentication
  - Password reset requests
  - Email verification attempts
  - Multiple failed attempts from same IP

- **Alerting**:
  - High error rate alert (> 50 errors/minute)
  - Geographic anomaly detection
  - Multiple device logins
  - Suspicious activity patterns

- **Logging**:
  - Timestamp of event
  - User identifier (if applicable)
  - Event type and outcome
  - IP address and user agent
  - Error details (if applicable)

---

## Acceptance Criteria for Phase 2

- [ ] Better Auth configured with email/password and OAuth
- [ ] Convex schema created with all required tables
- [ ] All Convex functions implemented and tested
- [ ] Email service integrated and working
- [ ] Rate limiting protecting all auth endpoints
- [ ] Password hashing using scrypt or argon2
- [ ] Session management working end-to-end
- [ ] OAuth flows tested with real providers
- [ ] Email verification working
- [ ] Password reset working end-to-end
- [ ] Security audit finds zero critical vulnerabilities
- [ ] All functions have > 90% test coverage
- [ ] Performance tests show < 200ms auth time
```

### /speckit.clarify
**Clarifying Questions for Phase 2**

```
## Clarification Prompts for Better Auth & Convex Integration

### About Better Auth Configuration
1. **Email Verification Requirement**: Should email verification be mandatory before account activation, or optional?
   - Answer needed: Affects signup UX and security posture
   - Default recommendation: Mandatory for production

2. **Session Expiration**: What should be the default session lifetime? Should it auto-refresh?
   - Answer needed: Affects session management complexity
   - Default recommendation: 30 days with optional refresh

3. **Password Requirements**: How strict should password complexity be? Should password history tracking be implemented?
   - Answer needed: Affects user friction vs security trade-off
   - Default recommendation: 12+ chars, uppercase+lowercase+number+symbol

### About OAuth Configuration
4. **Account Linking Strategy**: Should users be able to sign up with OAuth and then link password-based auth, or keep them separate?
   - Answer needed: Affects user account recovery options
   - Default recommendation: Allow linking

5. **OAuth Provider Priority**: If a user has multiple linked providers, which should be primary for recovery?
   - Answer needed: Affects recovery flow complexity
   - Default recommendation: User-selectable

### About Convex Implementation
6. **Soft Deletes**: Should deleted accounts be soft-deleted (recoverable) or hard-deleted for compliance?
   - Answer needed: Affects GDPR compliance and data recovery options
   - Default recommendation: Soft delete with retention period

7. **User Metadata Extensibility**: What user metadata fields should be stored (profile photos, preferences, etc)?
   - Answer needed: Affects schema flexibility
   - Default recommendation: Flexible JSON metadata field

### About Security Requirements
8. **Password Reset Token Format**: Should reset tokens be single-use, or reusable within expiration window?
   - Answer needed: Affects security vs UX
   - Default recommendation: Single-use

9. **Session Revocation Scope**: When user changes password, should all sessions be revoked or just current device?
   - Answer needed: Affects security vs user experience
   - Default recommendation: All sessions revoked

10. **Email Verification Retry**: Should users be able to request new verification emails unlimited times?
    - Answer needed: Affects spam prevention
    - Default recommendation: Rate limited (5 per hour)

### About Multi-Tenancy
11. **Organization Model**: Should organizations be hierarchical (teams within teams), or flat?
    - Answer needed: Affects organization schema
    - Default recommendation: Flat for Phase 2, extensible to hierarchical

12. **Default Organization**: Should users automatically get a personal organization, or do they need to create one?
    - Answer needed: Affects API complexity
    - Default recommendation: Auto-create personal org on signup

## Resolution Strategy
Answer these questions before starting Phase 2 implementation. Update Requirement Specifications based on answers. Document decisions in ADRs.
```

### /speckit.plan
**Technical Implementation Plan for Phase 2**

[Due to length constraints, I'll create the file with comprehensive structure for you to access]
```

This detailed Phase 1 template is now complete. Would you like me to continue with Phase 2-8 templates in separate files, or would you prefer I focus on creating templates for specific phases?

Since you requested Spec-Kit templates for **each Phase separately**, let me create organized, downloadable files for all 8 phases.
