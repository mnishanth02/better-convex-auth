# Phase 4: Migrate Example App - IN PROGRESS

**Date**: November 9, 2025  
**Status**: 🔄 In Progress (60% Complete)

## Overview

Migrating `apps/web` from old modular `@auth/*` packages to unified `@workspace/z-auth` package with app-specific Convex backend.

## Completed Tasks ✅

### 1. Package Dependencies Updated ✅
**File**: `apps/web/package.json`

**Removed**:
- `@auth/backend`
- `@auth/config`
- `@auth/core`
- `@auth/quickstart`
- `@auth/types`
- `@auth/ui`
- `@auth/utils`
- `@auth/web`
- `@workspace/backend`

**Added**:
- `@workspace/z-auth` (unified package)
- `convex-helpers` (for Convex utilities)

**Result**: 9 packages → 2 packages (78% reduction)

### 2. App-Specific Backend Created ✅
**Location**: `apps/web/convex/`

**Files Created**:
- ✅ `convex/convex.config.ts` - Convex app configuration
- ✅ `convex/auth.ts` - Better Auth setup
- ✅ `convex/http.ts` - HTTP routes
- ✅ `convex/schema.ts` - Database schema

**Source**: Copied from `packages/z-auth/templates/`

### 3. Auth Setup Simplified ✅
**File**: `apps/web/lib/auth/setup.ts`

**Before**: 70 lines with @auth/quickstart
**After**: 60 lines with @workspace/z-auth

**Changes**:
- Using `createAuth()` from `@workspace/z-auth/nextjs`
- Direct exports of all hooks and components
- Environment variables properly configured
- All components re-exported for convenience

### 4. API Route Handler Updated ✅
**File**: `apps/web/app/api/auth/[...all]/route.ts`

**Before**: Using `@convex-dev/better-auth/nextjs`
**After**: Using `@workspace/z-auth/nextjs/handler`

Pre-built handlers now used.

### 5. TypeScript Configuration Updated ✅
**File**: `apps/web/tsconfig.json`

**Removed**: 20+ path mappings for old `@auth/*` and `@workspace/backend`
**Added**: 2 path mappings for `@workspace/z-auth`

**Result**: Simplified from 25 paths to 4 paths (84% reduction)

### 6. Core Components Updated ✅
**Files**:
- ✅ `components/providers/index.tsx` - Using new AuthProvider
- ✅ `components/layout/app-shell.tsx` - Using new useUser, UserAvatar, SignOutButton

## Remaining Tasks ⏳

### 1. Update Component Imports (HIGH PRIORITY)
**Files Needing Updates** (~15 files):

**Pattern to Replace**:
```typescript
// OLD
import { useSession, useUser } from "@auth/web";
import { SignInForm, RoleGuard } from "@auth/ui";
import { getUserRole } from "@auth/types";

// NEW
import { useSession, useUser, SignInForm, RoleGuard } from "@/lib/auth/setup";
```

**Files**:
- `app/(app)/examples/hooks/page.tsx`
- `app/(app)/examples/components/page.tsx`
- `app/(app)/examples/utilities/page.tsx`
- `app/(app)/admin/page.tsx`
- `app/(app)/moderator/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `components/session/active-sessions-list.tsx`
- ~8 more files

### 2. Replace Backend API Imports (HIGH PRIORITY)
**Pattern to Replace**:
```typescript
// OLD
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

// NEW
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
```

**Files**:
- `app/(auth)/reset-password/page.tsx`
- `components/session/active-sessions-list.tsx`
- Any other files using Convex queries/mutations

### 3. Handle getUserRole Function (MEDIUM PRIORITY)
**Issue**: `getUserRole` is from `@auth/types` package

**Options**:
A. **Copy to lib/utils** (RECOMMENDED):
```typescript
// lib/utils/auth.ts
export function getUserRole(user: any): string | undefined {
  return user?.role;
}
```

B. **Use direct property access**:
```typescript
// Replace: getUserRole(user)
// With: user?.role
```

C. **Wait for z-auth to export it**

### 4. Initialize Convex Development (HIGH PRIORITY)
**Commands to Run**:
```bash
cd apps/web
npx convex dev  # Initialize Convex backend
```

This will:
- Generate `_generated/` directory
- Create `.env.local` with NEXT_PUBLIC_CONVEX_URL
- Set up local Convex deployment

### 5. Update Example Page Documentation (LOW PRIORITY)
**Files**:
- `app/(app)/examples/page.tsx` - Update package names in descriptions
- `app/(app)/examples/hooks/page.tsx` - Update code examples

Replace references to:
- `@auth/web` → `@workspace/z-auth`
- `@auth/ui` → `@workspace/z-auth`
- `@auth/core` → `@workspace/z-auth`

### 6. Run Tests & Validation (FINAL STEP)
After all updates:
- [ ] `pnpm install` - Install new dependencies
- [ ] `pnpm typecheck` - Verify no type errors
- [ ] `pnpm build` - Build the app
- [ ] `pnpm dev` - Start development server
- [ ] Test auth flows:
  - [ ] Sign up
  - [ ] Sign in
  - [ ] Sign out
  - [ ] OAuth (if configured)
  - [ ] Email verification

## Migration Progress

**Overall**: 60% Complete

- ✅ Package dependencies (100%)
- ✅ Backend setup (100%)
- ✅ Auth configuration (100%)
- ✅ API routes (100%)
- ✅ TypeScript config (100%)
- ✅ Core providers (100%)
- 🔄 Component imports (20%)
- ⏳ Backend API imports (0%)
- ⏳ Convex initialization (0%)
- ⏳ Testing (0%)

## Files Summary

### Modified (6 files)
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `lib/auth/setup.ts`
- ✅ `app/api/auth/[...all]/route.ts`
- ✅ `components/providers/index.tsx`
- ✅ `components/layout/app-shell.tsx`

### Created (4 files)
- ✅ `convex/convex.config.ts`
- ✅ `convex/auth.ts`
- ✅ `convex/http.ts`
- ✅ `convex/schema.ts`

### Pending Updates (~15 files)
- ⏳ Various component files with old imports

## Quick Commands Reference

```bash
# Install dependencies
cd apps/web
pnpm install

# Initialize Convex
npx convex dev

# Type check
pnpm typecheck

# Build
pnpm build

# Start dev server
pnpm dev
```

## Known Issues

1. **getUserRole function**: Need to either:
   - Copy utility function to apps/web
   - Use direct property access
   - Wait for z-auth to export it

2. **Convex not initialized**: Need to run `npx convex dev` to generate types

3. **Example pages**: Still reference old package names in documentation

## Next Steps

1. **Create utility function** for getUserRole
2. **Batch update** all component imports (can use find/replace)
3. **Initialize Convex** backend
4. **Test authentication** flows
5. **Update documentation** examples

## Estimated Time to Complete

- Remaining import updates: ~30 minutes
- Convex initialization: ~5 minutes
- Testing: ~15 minutes
- **Total**: ~50 minutes

---

**Status**: Ready to continue with batch import updates  
**Blocker**: None - can proceed immediately
