# Build Performance & DX

## Overview

This document describes the build optimizations and developer experience improvements implemented in the better-convex-auth monorepo.

## Build Optimizations

### Incremental TypeScript Builds

All TypeScript packages now use incremental compilation with the following benefits:
- **Faster rebuilds**: Only changed files are recompiled
- **Build info caching**: `.tsbuildinfo` files track compilation state
- **Composite projects**: Enable project references for better dependency tracking

**Configuration** (`packages/typescript-config/base.json`):
```json
{
  "compilerOptions": {
    "incremental": true,
    "composite": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### Turborepo Caching

Enhanced Turborepo configuration for optimal caching:

**Features**:
- ✅ Task output caching (build, lint, typecheck)
- ✅ Input tracking (source files, config files, env vars)
- ✅ Dependency-aware task execution
- ✅ Global dependencies (.env*, tsconfig.json)

**Configuration** (`turbo.json`):
```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", "*.tsbuildinfo"],
      "inputs": ["$TURBO_DEFAULT$", ".env*", "tsconfig.json"],
      "cache": true
    }
  }
}
```

### Build Performance Metrics

Run benchmarks with:
```bash
node scripts/benchmark-build.js
```

**Expected Performance**:
- **Cold build**: First build with no cache (~30-60s depending on hardware)
- **Warm build**: Subsequent builds with cache (>80% faster, ~5-10s)
- **Incremental rebuild**: Single file change (<3s)

**Performance Targets**:
- Cache hit rate: >80% on repeated builds
- TypeScript incremental rebuild: <5s for single file change
- Full clean build: <60s on modern hardware

### Build Artifacts

Build artifacts that are cached and version controlled:

**Cached (gitignored)**:
- `dist/` - Compiled output
- `*.tsbuildinfo` - TypeScript build info
- `.next/` - Next.js build cache
- `.turbo/` - Turborepo cache

**Version Controlled**:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- Source files (`src/**`)

## Developer Experience

### Quick Start

New developers can set up their environment in <5 minutes:

```bash
# Clone repository
git clone <repository-url>
cd better-convex-auth

# Run setup script
./scripts/setup-dev.sh

# Start development
pnpm dev
```

### Development Scripts

**Common Commands**:
```bash
# Development
pnpm dev              # Start Next.js + Convex
pnpm dev:full         # Start all packages in watch mode
pnpm dev:typecheck    # Type checking in watch mode

# Building
pnpm build            # Build all packages
pnpm typecheck        # Type check all packages

# Code Quality
pnpm check            # Lint and format check
pnpm format           # Auto-format code

# Benchmarking
node scripts/benchmark-build.js  # Measure build performance
```

### Environment Setup

**Required Environment Variables**:

`apps/web/.env.local`:
```env
# Convex
NEXT_PUBLIC_CONVEX_URL=<your-deployment-url>
CONVEX_DEPLOYMENT=<your-deployment-name>

# Better Auth
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
BETTER_AUTH_URL=http://localhost:3000

# OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email
RESEND_API_KEY=
```

### IDE Setup

**VS Code (Recommended)**:
- Biome extension for formatting/linting
- TypeScript 5.9+ for best type checking
- Recommended workspace settings included

**Required Tools**:
- Node.js 20+
- pnpm 10.4.1+
- Git

## Build Performance Benchmarks

### How to Benchmark

```bash
# Run full benchmark suite
node scripts/benchmark-build.js

# Results saved to .build-benchmark-results.json
```

**Benchmark Metrics**:
1. **Cold Build**: Clean build with no cache (3 iterations)
2. **Warm Build**: Build with Turborepo cache (3 iterations)
3. **Typecheck**: TypeScript type checking only (3 iterations)

**Output Includes**:
- Average, min, max times for each benchmark
- Cache improvement percentage
- Pass/fail status against target metrics

### Sample Results

```
📊 Benchmark Summary
====================

Cold Build:
  Average: 45.32s
  Min:     43.21s
  Max:     48.15s

Warm Build:
  Average: 8.45s
  Min:     7.89s
  Max:     9.23s

Typecheck:
  Average: 12.34s
  Min:     11.98s
  Max:     12.87s

📈 Performance Metrics:
  Cache improvement: 81.4%
  Target: >80% (✅ PASS)
```

## Optimization Tips

### For Package Authors

1. **Keep TypeScript configs lean**: Extend base configs instead of duplicating
2. **Minimize dependencies**: Only add what you need
3. **Use workspace protocol**: `"@auth/types": "workspace:*"`
4. **Enable composite**: Allows better TypeScript project references

### For App Developers

1. **Use dev mode**: `pnpm dev` starts all services with hot reload
2. **Parallel typecheck**: Run `pnpm dev:typecheck` in separate terminal
3. **Clean when stuck**: `pnpm turbo clean` clears all caches
4. **Check build times**: Monitor with benchmark script

### CI/CD Optimization

**GitHub Actions Example**:
```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 10.4.1

- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Restore Turbo cache
  uses: actions/cache@v3
  with:
    path: .turbo
    key: turbo-${{ runner.os }}-${{ github.sha }}
    restore-keys: turbo-${{ runner.os }}-

- name: Build
  run: pnpm build
```

## Troubleshooting

### Build Issues

**Problem**: "Build is slow even with cache"
- Solution: Run `pnpm turbo clean` and rebuild
- Check: Ensure `.tsbuildinfo` files are gitignored but not cleaned by scripts

**Problem**: "TypeScript errors after dependency update"
- Solution: Delete all `.tsbuildinfo` files and rebuild
- Command: `find . -name "*.tsbuildinfo" -delete && pnpm build`

**Problem**: "Turbo cache not working"
- Solution: Check `turbo.json` outputs match actual build outputs
- Verify: `inputs` array includes all relevant source files

### Development Issues

**Problem**: "Hot reload not working"
- Solution: Restart dev server, check file watchers aren't exceeded
- macOS: `sudo sysctl -w kern.maxfiles=65536`

**Problem**: "Type errors in IDE but build passes"
- Solution: Reload TypeScript server in IDE
- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

## Future Improvements

Potential optimizations to consider:

1. **Remote Caching**: Set up Turborepo remote cache (Vercel or self-hosted)
2. **Build Parallelization**: Further optimize task dependencies
3. **Module Federation**: Share code between apps without rebuilding
4. **SWC Compilation**: Consider SWC instead of tsc for faster builds
5. **Selective Tests**: Only run tests for changed packages

## Metrics to Track

Key metrics for monitoring build performance:

- **Build time**: Target <60s cold, <10s warm
- **Cache hit rate**: Target >80%
- **Dependency count**: Minimize to reduce install time
- **Bundle size**: Monitor Next.js bundle analyzer
- **Type checking**: Target <15s for full workspace

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [pnpm Workspaces](https://pnpm.io/workspaces)
