# AI Coding Agent Instructions

## Project Overview

This is a **pnpm monorepo** for building full-stack applications with:
- **Frontend**: Next.js 16 (App Router) with React 19 and TurboPack
- **Backend**: Convex (serverless database and functions)
- **UI**: Shared shadcn/ui component library using Tailwind CSS v4
- **Tooling**: Turborepo, Biome (linting/formatting), TypeScript 5.9

## Architecture & Structure

```
better-convex-auth/
├── apps/web/              # Next.js application
├── packages/
│   ├── backend/           # Convex backend (database, functions)
│   ├── ui/                # Shared shadcn/ui components
│   └── typescript-config/ # Shared TypeScript configurations
```

### Key Design Decisions

1. **Workspace Package Imports**: Use `@workspace/*` namespace for internal packages
   - Components: `import { Button } from "@workspace/ui/components/button"`
   - Styles: `import "@workspace/ui/globals.css"`
   - Backend exports: `@repo/backend` (not yet integrated in web app)

2. **Monorepo Strategy**: 
   - Each package is independently buildable with its own `package.json`
   - Turborepo orchestrates task execution (build, dev, lint) with dependency graph
   - `pnpm-workspace.yaml` defines workspace structure: `apps/*` and `packages/*`

3. **Convex Backend Isolation**: Backend lives in `packages/backend/convex/`
   - Has its own dev server (`convex dev`)
   - Generates TypeScript types in `_generated/` (excluded from Biome linting)
   - Not yet connected to web app (no ConvexProvider in `apps/web/components/providers.tsx`)

## Critical Developer Workflows

### Development Commands

```bash
# Start all dev servers (Next.js, Convex)
pnpm dev

# Build all packages
pnpm build

# Format code (Biome)
pnpm format

# Lint & auto-fix
pnpm check

# Upgrade all dependencies
pnpm upgrade:all
```

### Adding shadcn/ui Components

**Always run from monorepo root**, targeting the `apps/web` directory:

```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

This places components in `packages/ui/src/components/` for workspace-wide reuse.

### Convex Development

```bash
# From packages/backend/
pnpm dev         # Starts Convex dev server
pnpm deploy      # Deploy to production
pnpm typecheck   # Type-check Convex functions
```

**Important**: Convex functions live in `packages/backend/convex/`. The `predev` script ensures Convex codegen runs before dev server starts.

## Code Conventions

### Biome Configuration (Root-Level)

- **Formatter**: 120 char line width, double quotes, space indentation
- **Linter**: Recommended rules enabled
- **Auto-organize imports** on save (natural identifier order)
- **Excludes**: `_generated/` directories (Convex codegen)
- Configured in `biome.json` at root and `packages/ui/biome.json`

### TypeScript Configuration

- **Base config**: `packages/typescript-config/base.json` (strict mode, NodeNext modules)
- **Next.js config**: `packages/typescript-config/nextjs.json` (extends base, ESNext modules)
- **Path aliases** in `apps/web/tsconfig.json`:
  - `@/*` → Root of web app
  - `@workspace/ui/*` → `packages/ui/src/*`

### Component Patterns

1. **Theme Support**: All apps use `next-themes` with system default
   - Provider in `apps/web/components/providers.tsx`
   - Applied to `<html>` tag with `suppressHydrationWarning`

2. **Font Loading**: Geist fonts (sans + mono) via `next/font/google`
   - CSS variables: `--font-sans`, `--font-mono`
   - Applied via className to `<body>`

3. **UI Component Exports**: Granular exports in `packages/ui/package.json`
   ```json
   "exports": {
     "./components/*": "./src/components/*.tsx",
     "./hooks/*": "./src/hooks/*.ts"
   }
   ```

## Integration Points

### Next.js ↔ UI Package

- **Transpilation**: `transpilePackages: ["@workspace/ui"]` in `next.config.mjs`
- **Global CSS**: Imported in `apps/web/app/layout.tsx`
- **Tailwind CSS v4**: Uses `@tailwindcss/postcss` (configured in `packages/ui/postcss.config.mjs`)

### Convex Integration (Pending)

**Not yet implemented**: To connect Convex to Next.js:
1. Add `ConvexProviderWithClerk` or `ConvexReactClient` to `apps/web/components/providers.tsx`
2. Import Convex API from `@repo/backend/convex/_generated/api`
3. Use `useQuery`, `useMutation` hooks in React components

## Common Gotchas

1. **Always use `pnpm`** (enforced by `packageManager` field, requires pnpm 10.4.1+)
2. **Node.js 20+ required** (specified in root `package.json` engines)
3. **Biome replaces ESLint/Prettier** - don't add them back
4. **Convex functions must have validators** - use `v` from `convex/values` for args
5. **Turbo caching**: Dev tasks are `persistent: true` and don't cache; builds cache in `.turbo/`

## File Naming & Location Rules

- **React components**: `PascalCase.tsx` in `packages/ui/src/components/`
- **Hooks**: `use-kebab-case.ts` in `packages/ui/src/hooks/`
- **Convex functions**: `camelCase.ts` in `packages/backend/convex/`
- **Next.js routes**: Follow App Router conventions in `apps/web/app/`

## Testing & Validation

Currently no test infrastructure. When adding:
- Add task to `turbo.json` with `dependsOn: ["^build"]`
- Follow monorepo pattern: each package tests itself
- Run via `turbo test` for parallel execution
