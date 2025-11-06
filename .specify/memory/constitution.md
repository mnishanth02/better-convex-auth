<!--
SYNC IMPACT REPORT
==================
Version Change: INITIAL → 1.0.0
Constitution Type: NEW (Production Authentication Module)
Ratification Date: 2025-11-06

Principles Defined:
- I. Modularity First
- II. Type Safety Across Boundaries
- III. Reusability Without Assumptions
- IV. Developer Experience is Non-Negotiable
- V. Security as Architecture, Not Afterthought
- VI. Build Performance Without Compromise
- VII. Scalability From Day One

Additional Sections:
- Decision Filters (prioritization framework)
- Phase 1 Success Criteria (measurable outcomes)

Template Consistency Status:
✅ plan-template.md: Constitution Check section compatible
✅ spec-template.md: Requirements align with principles
✅ tasks-template.md: Task categorization supports principle-driven work
⚠️  Templates reference generic constitution - no updates required

Follow-up Items:
- None: All placeholders filled
- Constitution ready for use in feature specifications
-->

# Better Convex Auth Constitution

## Core Principles

### I. Modularity First

Design every package with a single, well-defined responsibility. Establish clear boundaries between packages to prevent circular dependencies. Each package MUST have an explicit public API (exports) with internal implementation details never leaking into consumer code. Use namespace organization (`@auth/*`, `@shared/*`) for logical grouping.

**Rationale**: Modular architecture enables independent testing, parallel development, and selective adoption of features without forcing consumers to import entire systems.

### II. Type Safety Across Boundaries

TypeScript is mandatory across all packages with zero `any` types permitted in public APIs. Maintain `@auth/types` as the single source of truth for cross-package types. Export complete type definitions alongside values. Use Zod schemas for runtime validation of all external inputs. Type definitions MUST be co-located with their implementations.

**Rationale**: Compile-time type checking prevents entire classes of runtime errors, especially at package boundaries where integration bugs are most costly.

### III. Reusability Without Assumptions

Design packages for multiple deployment contexts (web, mobile, API). Core packages (`@auth/core`, `@auth/utils`) MUST NOT contain platform-specific code. Use adapter pattern for platform-specific implementations. Every feature MUST be independently adoptable without forcing adoption of entire systems. Provide sensible defaults that work for 80% of users without configuration.

**Rationale**: Platform-agnostic design maximizes code reuse across web and mobile applications, reducing maintenance burden and ensuring consistent behavior.

### IV. Developer Experience is Non-Negotiable

Functions MUST NOT produce hidden side effects. Error messages MUST be actionable and suggest specific remediation steps. Configuration MUST be declarative and type-safe. Validation errors MUST include specific field paths and correction guidance. Make debugging straightforward with clear error context and complete stack traces.

**Rationale**: Developer productivity directly impacts project velocity; poor DX leads to support burden, misuse, and abandonment.

### V. Security as Architecture, Not Afterthought

Assume all external inputs are hostile; validate at every package boundary. Apply principle of least privilege to every exported function. Implement defense in depth with multiple security layers (validation, authorization, audit). Fail securely with informative logging for security analysts. Security decisions MUST be explicit in configuration with no silent bypasses permitted.

**Rationale**: Security vulnerabilities in authentication systems have catastrophic consequences; architectural security is cheaper than post-deployment patching.

### VI. Build Performance Without Compromise

Leverage Turborepo's parallelization to maintain sub-3-minute full builds. Design packages for incremental builds and efficient caching. Monitor remote cache hit rates with target >80%. Optimize task dependencies in `turbo.json` to prevent unnecessary rebuilds. Balance testing thoroughness with CI/CD speed.

**Rationale**: Fast feedback loops improve developer productivity and enable rapid iteration; slow builds kill momentum.

### VII. Scalability From Day One

Design for horizontal scaling through stateless function implementations where possible. Use Convex's real-time subscriptions strategically, avoiding over-subscription. Index database queries proactively based on expected access patterns. Avoid N+1 query patterns through schema design and batching. Plan for multi-tenant data isolation at the architecture level.

**Rationale**: Retrofitting scalability is exponentially more expensive than building it in from the start; authentication systems are load multipliers.

## Decision Filters

When making architectural decisions, prioritize in this order:

1. **Security** - Does this pattern make the system more secure? *(Non-negotiable)*
   - All authentication/authorization logic MUST pass security review
   - Reject any approach that weakens existing security posture
   
2. **Maintainability** - Can future developers understand this? *(Code is read > written)*
   - Prefer explicit over clever
   - Document non-obvious decisions with rationale
   
3. **Performance** - Does this pattern scale with load? *(Measure, don't guess)*
   - Benchmark critical paths under expected load
   - Use profiling data to guide optimization
   
4. **Developer Experience** - Is this intuitive for users of this module? *(Reduce cognitive load)*
   - API design MUST be self-documenting
   - Common use cases should require minimal configuration
   
5. **Feature Completeness** - Does this support the required use cases? *(Necessary but not sufficient)*
   - Features are valuable only if they meet the above criteria
   - Partial implementations are acceptable if architecturally sound

## Phase 1 Success Criteria

Phase 1 establishes the foundational structure for production authentication. Success is measured by:

### Build & Type Safety
- ✅ Monorepo compiles with all TypeScript `strict` mode checks passing
- ✅ `npm audit` (or `pnpm audit`) finds zero circular dependencies between packages
- ✅ Build time remains <3 minutes with cold cache
- ✅ Turborepo remote cache hit rate >60% (target: 80% after warmup)

### Package Architecture
- ✅ Package boundaries are enforced; no cross-package imports of internals
- ✅ Each `@auth/*` package has documented public API in README
- ✅ Core packages (`@auth/core`, `@auth/utils`) contain zero platform-specific code

### Developer Experience
- ✅ New developer can initialize a project using these packages in <5 minutes
- ✅ Authentication state is type-safe across web and mobile platforms
- ✅ Error messages include actionable guidance (not just error codes)

### Security Foundations
- ✅ Security requirements are baked into package contracts (not retrofitted)
- ✅ All external inputs have Zod validation schemas
- ✅ Authorization logic is isolated and independently testable

### Testing Infrastructure
- ✅ Each package has at least one contract test verifying public API
- ✅ Test suite runs in <60 seconds
- ✅ CI pipeline fails fast on type errors before running tests

## Governance

This constitution supersedes all other development practices and guidelines. All feature specifications, implementation plans, and code reviews MUST verify compliance with these principles.

### Amendment Process

1. **Proposal**: Document proposed change with rationale and impact analysis
2. **Review**: Assess impact on existing code and templates (`.specify/templates/*`)
3. **Approval**: Requires demonstration that change improves architecture
4. **Migration**: Update affected code, templates, and documentation
5. **Versioning**: Increment constitution version per semantic versioning rules

### Versioning Policy

- **MAJOR (X.0.0)**: Backward-incompatible changes (principle removal/redefinition)
- **MINOR (x.Y.0)**: New principle added or materially expanded guidance
- **PATCH (x.y.Z)**: Clarifications, wording improvements, typo fixes

### Complexity Justification

Any deviation from these principles (e.g., adding repository pattern when direct DB access could work, introducing 4th project when 3 would suffice) MUST be documented in the implementation plan's "Complexity Tracking" table with:

- **Violation**: Which principle/guideline is being violated
- **Why Needed**: Specific technical requirement that cannot be met otherwise
- **Simpler Alternative Rejected Because**: Concrete technical reason the simpler approach fails

### Compliance Review

All PRs and design reviews MUST verify:

- TypeScript strict mode compliance
- Package boundary integrity (no circular dependencies)
- Security validation at boundaries
- Error messages include remediation guidance
- Build time impact (reject changes that degrade build performance >10%)

**Version**: 1.0.0 | **Ratified**: 2025-11-06 | **Last Amended**: 2025-11-06
