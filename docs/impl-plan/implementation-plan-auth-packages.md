# Better Convex Auth - Complete Implementation Plan

**Document Version**: 1.0.0
**Created**: 2025-11-07
**Status**: Draft - Awaiting Approval
**Estimated Total Effort**: 40-60 hours (2-3 weeks)

---

## Executive Summary

This document provides a complete implementation plan for building a production-ready, plug-and-play authentication system for Better Convex Auth. The goal is to transform the current monorepo into a reusable authentication solution that enables developers to set up complete authentication in **5 minutes** instead of 30+ minutes.

### Current State
- ✅ Backend auth working (`@auth/core`, Convex integration)
- ⚠️ `@auth/web` contains type-only stubs (non-functional)
- ❌ `@auth/ui` is empty
- ⚠️ `apps/web` implements auth manually (not using packages)
- ❌ No quickstart/setup utilities
- ❌ Documentation doesn't match implementation

### Target State
- ✅ `@auth/web` provides real React hooks and utilities
- ✅ `@auth/ui` provides pre-built, customizable components
- ✅ `@auth/quickstart` provides one-function setup
- ✅ `apps/web` uses packages consistently (reference implementation)
- ✅ 5-minute setup for new apps
- ✅ Documentation matches implementation
- ✅ Full TypeScript support with type safety

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Package Specifications](#package-specifications)
3. [Phase 1: Fix @auth/web](#phase-1-fix-authweb)
4. [Phase 2: Build @auth/ui Core](#phase-2-build-authui-core)
5. [Phase 3: Migrate apps/web](#phase-3-migrate-appsweb)
6. [Phase 4: Create @auth/quickstart](#phase-4-create-authquickstart)
7. [Phase 5: Advanced Components](#phase-5-advanced-components)
8. [Phase 6: Documentation & Polish](#phase-6-documentation--polish)
9. [Phase 7: React Native Support](#phase-7-react-native-support)
10. [Testing Strategy](#testing-strategy)
11. [Migration Guide](#migration-guide)
12. [Success Criteria](#success-criteria)

---

## Architecture Overview

### Package Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                         apps/web                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages (app/*/page.tsx)                                  │  │
│  │  - Route definitions                                     │  │
│  │  - SEO metadata                                          │  │
│  │  - App-specific layouts                                  │  │
│  │  - Custom branding/styling                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓ imports                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    @auth/quickstart                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  setupAuth() - One-function setup                        │  │
│  │  Returns: { AuthProvider, hooks, components }            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    ↓ orchestrates                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        @auth/ui                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pre-built Components                                    │  │
│  │  - <SignInForm />                                        │  │
│  │  - <SignUpForm />                                        │  │
│  │  - <SignOutButton />                                     │  │
│  │  - <SessionGuard />                                      │  │
│  │  - <UserAvatar />                                        │  │
│  │  - <PasswordStrengthIndicator />                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓ uses                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        @auth/web                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Integration                                       │  │
│  │  - useAuth()                                             │  │
│  │  - useSession()                                          │  │
│  │  - useUser()                                             │  │
│  │  - <AuthClientProvider />                                │  │
│  │  - createBetterAuthClient()                              │  │
│  │  - createAuthProvider()                                  │  │
│  │  - withAuth() HOC                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    ↓ uses                                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│   @auth/types    │   @auth/utils    │      @auth/core          │
│   - User types   │   - Validators   │   - Backend factory      │
│   - Session      │   - Zod schemas  │   - createConvexAuth()   │
│   - Auth config  │   - Token utils  │   - Session utilities    │
└──────────────────┴──────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     @workspace/ui                               │
│  shadcn/ui components (Button, Input, Card, Alert, etc.)       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              packages/backend (Convex)                          │
│  - Database schema                                              │
│  - Auth configuration                                           │
│  - HTTP handlers                                                │
│  - Protected queries/mutations                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Dependency Flow

```
apps/web → @auth/quickstart → @auth/ui → @auth/web → @auth/{types,utils,core}
                                   ↓
                            @workspace/ui
```

### Key Principles

1. **Separation of Concerns**: Each package has a single, clear responsibility
2. **Composability**: Components and hooks work independently or together
3. **Customizability**: All components accept className, style, and event handler props
4. **Type Safety**: Full TypeScript support, no `any` types in public APIs
5. **Framework Agnostic Core**: `@auth/core` has no React dependencies
6. **Platform-Specific UI**: `@auth/ui/web` and `@auth/ui/native` (future)
7. **Zero Breaking Changes**: Maintain backward compatibility

---

## Package Specifications

### @auth/types

**Status**: ✅ Complete
**Purpose**: Shared TypeScript type definitions
**Dependencies**: None (pure types)
**Exports**:
- `User`, `PublicUser`, `UserRole`, `UserProfileUpdate`
- `Session`, `SessionStatus`, `SessionConfig`
- `AuthConfig`, `AuthMethod`, `OAuthProvider`
- `Organization`, `OrganizationMember`, `OrganizationRole`

**No changes needed** - This package is complete.

---

### @auth/utils

**Status**: ✅ Complete
**Purpose**: Validation, token generation, encryption
**Dependencies**: `zod`, `@auth/types`
**Exports**:
- `EmailSchema`, `PasswordSchema`, `SimplePasswordSchema`
- `SignUpSchema`, `SignInSchema`, `UpdateProfileSchema`
- `validateEmail()`, `validatePasswordStrength()`
- `generateToken()`, `hashToken()`

**Minor additions needed**:
- Export validators as both Zod schemas and plain functions
- Add JSDoc comments for all exports

---

### @auth/core

**Status**: ✅ Complete
**Purpose**: Backend integration, platform-agnostic logic
**Dependencies**: `@auth/types`, `@auth/utils`, `better-auth`, `@convex-dev/better-auth`
**Exports**:
- `createConvexAuth()` - Factory for Better Auth + Convex
- `getAuthDefaults()` - Default configuration
- Session utilities (`isSessionValid`, `shouldRefreshSession`, etc.)
- User utilities (`toPublicUser`, `getUserDisplayName`, etc.)

**No changes needed** - This package is complete.

---

### @auth/web

**Status**: ❌ Broken (type-only stubs)
**Purpose**: React hooks and client setup
**Dependencies**: `@auth/types`, `better-auth/react`, `@convex-dev/better-auth/react`, `react`

**Current State**:
```typescript
// packages/auth/web/src/hooks/use-session.ts
export function useSession(): UseSessionReturn {
  throw new Error("useSession must be called from actual auth client...");
}
```

**Target State**:
```typescript
// Real implementation using context
export function useSession(): UseSessionReturn {
  const client = useAuthClient();
  return client.useSession();
}
```

**Required Exports**:
- Context: `AuthClientContext`, `AuthClientProvider`, `useAuthClient()`
- Hooks: `useAuth()`, `useSession()`, `useUser()`, `useSignIn()`, `useSignOut()`, `useSignUp()`
- Factories: `createBetterAuthClient()`, `createAuthProvider()`
- HOCs: `withAuth()`, `withSession()`, `withEmailVerified()`
- Types: Re-export Better Auth types with augmentations

---

### @auth/ui

**Status**: ❌ Empty
**Purpose**: Pre-built React components
**Dependencies**: `@auth/web`, `@auth/types`, `@auth/utils`, `@workspace/ui`, `react`

**Required Exports**:

#### Forms
- `<SignInForm />` - Email/password + social sign-in
- `<SignUpForm />` - Registration with validation
- `<ForgotPasswordForm />` - Request password reset
- `<ResetPasswordForm />` - Set new password
- `<ChangePasswordForm />` - Change password (authenticated)
- `<UpdateProfileForm />` - Update user profile
- `<VerifyEmailForm />` - Enter verification code

#### Actions
- `<SignOutButton />` - Sign out with confirmation
- `<DeleteAccountButton />` - Delete account with confirmation
- `<SocialAuthButton />` - Single OAuth provider button
- `<SocialAuthButtons />` - Multiple OAuth providers
- `<ResendVerificationButton />` - Resend email verification

#### Guards
- `<SessionGuard />` - Require authentication
- `<EmailVerifiedGuard />` - Require verified email
- `<RoleGuard />` - Require specific role
- `<PermissionGuard />` - Check custom permissions
- `<ProtectedRoute />` - Protected navigation wrapper

#### Display
- `<UserAvatar />` - User profile picture with fallback
- `<UserBadge />` - Compact user display (avatar + name)
- `<UserMenu />` - Dropdown menu with profile/sign out
- `<SessionInfo />` - Display session details
- `<EmailVerificationBanner />` - Prompt to verify email

#### Feedback
- `<PasswordStrengthIndicator />` - Visual password strength
- `<SessionExpiryWarning />` - Session about to expire
- `<AuthErrorAlert />` - Display authentication errors
- `<LoadingState />` - Auth loading indicator

#### Layouts
- `<AuthLayout />` - Centered card layout for auth pages
- `<AuthCard />` - Card container with consistent styling

---

### @auth/quickstart

**Status**: ❌ Does not exist
**Purpose**: One-function setup for new apps
**Dependencies**: `@auth/web`, `@auth/ui`, `@auth/types`

**Required Exports**:
- `setupAuth()` - Main setup function
- `setupAuthUI()` - Setup with UI components included
- `setupAuthHeadless()` - Setup hooks only (no UI)

**Example Usage**:
```typescript
import { setupAuth } from "@auth/quickstart";

export const {
  AuthProvider,
  useAuth,
  useSession,
  useUser,
  components: {
    SignInForm,
    SignUpForm,
    SessionGuard,
  }
} = setupAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
});
```

---

## Phase 1: Fix @auth/web

**Goal**: Transform `@auth/web` from type-only stubs to real working implementations
**Estimated Effort**: 8-12 hours
**Priority**: P0 (Critical)

### 1.1 Create Auth Client Context

**File**: `packages/auth/web/src/context/auth-client-context.tsx`

**Implementation**:
```typescript
import { createContext, useContext, type ReactNode } from "react";
import type { createAuthClient } from "better-auth/react";

type AuthClient = ReturnType<typeof createAuthClient>;

const AuthClientContext = createContext<AuthClient | null>(null);

export interface AuthClientProviderProps {
  client: AuthClient;
  children: ReactNode;
}

export function AuthClientProvider({ client, children }: AuthClientProviderProps) {
  return (
    <AuthClientContext.Provider value={client}>
      {children}
    </AuthClientContext.Provider>
  );
}

export function useAuthClient(): AuthClient {
  const client = useContext(AuthClientContext);
  if (!client) {
    throw new Error(
      "useAuthClient must be used within AuthClientProvider. " +
      "Wrap your app with <AuthClientProvider client={authClient}>"
    );
  }
  return client;
}
```

**Tests**:
- ✅ Throws error when used outside provider
- ✅ Returns client when used inside provider
- ✅ Multiple providers work independently (nested)

---

### 1.2 Implement Real Hooks

#### useAuth Hook

**File**: `packages/auth/web/src/hooks/use-auth.ts`

**Implementation**:
```typescript
import { useAuthClient } from "../context/auth-client-context.js";
import type { UseAuthReturn } from "@auth/types";

export function useAuth(): UseAuthReturn {
  const client = useAuthClient();

  return {
    signIn: client.signIn,
    signUp: client.signUp,
    signOut: client.signOut,
    updateUser: client.updateUser,
    changeEmail: client.changeEmail,
    changePassword: client.changePassword,
    deleteAccount: client.deleteAccount,
    sendVerificationEmail: client.sendVerificationEmail,
    resetPassword: client.resetPassword,
    client, // Expose full client for advanced usage
  };
}
```

**Type Definition** (in `@auth/types`):
```typescript
export interface UseAuthReturn {
  signIn: {
    email: (credentials: EmailSignInCredentials, callbacks?: SignInCallbacks) => Promise<void>;
    social: (params: SocialSignInParams, callbacks?: SignInCallbacks) => Promise<void>;
  };
  signUp: {
    email: (data: EmailSignUpData, callbacks?: SignUpCallbacks) => Promise<void>;
  };
  signOut: (callbacks?: SignOutCallbacks) => Promise<void>;
  updateUser: (data: UserUpdateData) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  deleteAccount: (callbacks?: DeleteAccountCallbacks) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  client: ReturnType<typeof createAuthClient>; // Full client access
}
```

**Tests**:
- ✅ All methods callable
- ✅ Returns Better Auth client methods
- ✅ Throws error outside provider

---

#### useSession Hook

**File**: `packages/auth/web/src/hooks/use-session.ts`

**Implementation**:
```typescript
import { useAuthClient } from "../context/auth-client-context.js";
import type { UseSessionReturn } from "@auth/types";

export function useSession(): UseSessionReturn {
  const client = useAuthClient();
  return client.useSession();
}
```

**Type Definition** (already exists in Better Auth):
```typescript
export interface UseSessionReturn {
  data: Session | null;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Tests**:
- ✅ Returns session data when authenticated
- ✅ Returns null when not authenticated
- ✅ Updates reactively on auth state changes

---

#### useUser Hook

**File**: `packages/auth/web/src/hooks/use-user.ts`

**Implementation**:
```typescript
import { useSession } from "./use-session.js";
import type { UseUserReturn } from "@auth/types";

export function useUser(): UseUserReturn {
  const { data, isPending, error, refetch } = useSession();

  return {
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
    isLoading: isPending,
    error,
    refetch,
  };
}
```

**Type Definition** (in `@auth/types`):
```typescript
export interface UseUserReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Tests**:
- ✅ Extracts user from session
- ✅ Returns null when no session
- ✅ `isAuthenticated` correct in all states

---

#### Additional Hooks

**File**: `packages/auth/web/src/hooks/use-sign-in.ts`
```typescript
export function useSignIn() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signInEmail = async (credentials: EmailSignInCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn.email(credentials);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { signInEmail, isLoading, error };
}
```

**Similar hooks**:
- `useSignUp()` - Sign-up with loading/error state
- `useSignOut()` - Sign-out with loading/error state
- `useUpdateProfile()` - Update profile with loading/error state

---

### 1.3 Create Client Factory

**File**: `packages/auth/web/src/client/create-auth-client.ts`

**Implementation**:
```typescript
import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";

export interface CreateAuthClientOptions {
  baseURL: string;
  storagePrefix?: string;
  storage?: Storage;
  plugins?: unknown[];
}

export function createAuthClient(options: CreateAuthClientOptions) {
  const {
    baseURL,
    storagePrefix = "better-convex-auth",
    storage = typeof window !== "undefined" ? window.localStorage : undefined,
    plugins = [],
  } = options;

  return createBetterAuthClient({
    baseURL,
    plugins: [
      convexClient(),
      crossDomainClient({
        storage,
        storagePrefix,
      }),
      ...plugins,
    ],
  });
}
```

**Tests**:
- ✅ Creates client with default plugins
- ✅ Accepts custom plugins
- ✅ Configures storage correctly
- ✅ Works in SSR (no window)

---

### 1.4 Create Provider Factory

**File**: `packages/auth/web/src/providers/create-auth-provider.tsx`

**Implementation**:
```typescript
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ReactNode } from "react";
import type { createAuthClient } from "../client/create-auth-client.js";

export interface CreateAuthProviderOptions {
  convexUrl: string;
  authClient: ReturnType<typeof createAuthClient>;
  expectAuth?: boolean;
}

export function createAuthProvider(options: CreateAuthProviderOptions) {
  const { convexUrl, authClient, expectAuth = false } = options;

  const convex = new ConvexReactClient(convexUrl, { expectAuth });

  return function AuthProvider({ children }: { children: ReactNode }) {
    return (
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        {children}
      </ConvexBetterAuthProvider>
    );
  };
}
```

**Tests**:
- ✅ Creates provider component
- ✅ Integrates Convex + Better Auth
- ✅ `expectAuth` option works

---

### 1.5 Create HOCs

**File**: `packages/auth/web/src/hoc/with-auth.tsx`

**Implementation**:
```typescript
import { useEffect, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../hooks/use-session.js";

export interface WithAuthOptions {
  redirectTo?: string;
  LoadingComponent?: ComponentType;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = "/login", LoadingComponent } = options;

  return function ProtectedComponent(props: P) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!isPending && !session) {
        router.push(redirectTo);
      }
    }, [session, isPending, router]);

    if (isPending) {
      return LoadingComponent ? <LoadingComponent /> : null;
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}
```

**Similar HOCs**:
- `withEmailVerified()` - Require verified email
- `withRole()` - Require specific role
- `withSession()` - Inject session as prop

---

### 1.6 Update Package Exports

**File**: `packages/auth/web/src/index.ts`

**Implementation**:
```typescript
// Context
export {
  AuthClientProvider,
  useAuthClient,
  type AuthClientProviderProps,
} from "./context/auth-client-context.js";

// Hooks
export { useAuth } from "./hooks/use-auth.js";
export { useSession } from "./hooks/use-session.js";
export { useUser } from "./hooks/use-user.js";
export { useSignIn } from "./hooks/use-sign-in.js";
export { useSignUp } from "./hooks/use-sign-up.js";
export { useSignOut } from "./hooks/use-sign-out.js";

// Client Factory
export { createAuthClient, type CreateAuthClientOptions } from "./client/create-auth-client.js";

// Provider Factory
export { createAuthProvider, type CreateAuthProviderOptions } from "./providers/create-auth-provider.js";

// HOCs
export { withAuth, type WithAuthOptions } from "./hoc/with-auth.js";
export { withEmailVerified, type WithEmailVerifiedOptions } from "./hoc/with-email-verified.js";
export { withRole, type WithRoleOptions } from "./hoc/with-role.js";
export { withSession, type WithSessionOptions } from "./hoc/with-session.js";

// Re-export types from @auth/types
export type * from "@auth/types";
```

---

### 1.7 Update package.json

**File**: `packages/auth/web/package.json`

**Changes**:
```json
{
  "name": "@auth/web",
  "version": "0.2.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./hooks": {
      "types": "./dist/hooks/index.d.ts",
      "default": "./dist/hooks/index.js"
    },
    "./client": {
      "types": "./dist/client/index.d.ts",
      "default": "./dist/client/index.js"
    },
    "./providers": {
      "types": "./dist/providers/index.d.ts",
      "default": "./dist/providers/index.js"
    },
    "./hoc": {
      "types": "./dist/hoc/index.d.ts",
      "default": "./dist/hoc/index.js"
    }
  },
  "dependencies": {
    "@auth/types": "workspace:*",
    "better-auth": "^1.3.27",
    "@convex-dev/better-auth": "^0.9.7",
    "convex": "^1.28.2",
    "react": "^19.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "next": "^14.0.0 || ^15.0.0 || ^16.0.0"
  }
}
```

---

### 1.8 Phase 1 Acceptance Criteria

- ✅ All hooks return real implementations (not stubs)
- ✅ `AuthClientProvider` works correctly
- ✅ `useAuth()`, `useSession()`, `useUser()` functional
- ✅ Client and provider factories work
- ✅ HOCs protect components correctly
- ✅ TypeScript types are correct and exported
- ✅ All exports documented with JSDoc
- ✅ No linter errors
- ✅ Package builds successfully
- ✅ Manual testing confirms functionality

---

## Phase 2: Build @auth/ui Core

**Goal**: Create essential UI components for authentication
**Estimated Effort**: 12-16 hours
**Priority**: P0 (Critical)

### 2.1 Package Setup

**File**: `packages/auth/ui/package.json`

**Implementation**:
```json
{
  "name": "@auth/ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./forms": {
      "types": "./dist/forms/index.d.ts",
      "default": "./dist/forms/index.js"
    },
    "./guards": {
      "types": "./dist/guards/index.d.ts",
      "default": "./dist/guards/index.js"
    },
    "./display": {
      "types": "./dist/display/index.d.ts",
      "default": "./dist/display/index.js"
    },
    "./actions": {
      "types": "./dist/actions/index.d.ts",
      "default": "./dist/actions/index.js"
    },
    "./feedback": {
      "types": "./dist/feedback/index.d.ts",
      "default": "./dist/feedback/index.js"
    },
    "./layouts": {
      "types": "./dist/layouts/index.d.ts",
      "default": "./dist/layouts/index.js"
    }
  },
  "dependencies": {
    "@auth/web": "workspace:*",
    "@auth/types": "workspace:*",
    "@auth/utils": "workspace:*",
    "@workspace/ui": "workspace:*",
    "react": "^19.0.0",
    "react-hook-form": "^7.53.2",
    "zod": "^3.24.1"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "next": "^14.0.0 || ^15.0.0 || ^16.0.0"
  }
}
```

**Directory Structure**:
```
packages/auth/ui/src/
├── forms/
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   ├── forgot-password-form.tsx
│   └── index.ts
├── guards/
│   ├── session-guard.tsx
│   ├── email-verified-guard.tsx
│   ├── role-guard.tsx
│   └── index.ts
├── display/
│   ├── user-avatar.tsx
│   ├── user-badge.tsx
│   └── index.ts
├── actions/
│   ├── sign-out-button.tsx
│   ├── social-auth-buttons.tsx
│   └── index.ts
├── feedback/
│   ├── password-strength-indicator.tsx
│   ├── email-verification-banner.tsx
│   └── index.ts
├── layouts/
│   ├── auth-layout.tsx
│   ├── auth-card.tsx
│   └── index.ts
└── index.ts
```

---

### 2.2 SignInForm Component

**File**: `packages/auth/ui/src/forms/sign-in-form.tsx`

**Implementation**:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@auth/utils";
import { useAuth } from "@auth/web";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { SocialAuthButtons } from "../actions/social-auth-buttons.js";
import type { z } from "zod";

export interface SignInFormProps {
  /** Redirect URL after successful sign-in */
  redirectTo?: string;
  /** Callback after successful sign-in */
  onSuccess?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Show social authentication buttons */
  showSocialAuth?: boolean;
  /** OAuth providers to show */
  socialProviders?: ("github" | "google" | "apple")[];
  /** Custom card title */
  title?: string;
  /** Custom card description */
  description?: string;
  /** Show "Sign up" link */
  showSignUpLink?: boolean;
  /** Sign up page URL */
  signUpUrl?: string;
  /** Show "Forgot password" link */
  showForgotPasswordLink?: boolean;
  /** Forgot password page URL */
  forgotPasswordUrl?: string;
  /** Additional CSS class */
  className?: string;
}

export function SignInForm({
  redirectTo = "/dashboard",
  onSuccess,
  onError,
  showSocialAuth = true,
  socialProviders = ["github"],
  title = "Sign In",
  description = "Enter your credentials to access your account",
  showSignUpLink = true,
  signUpUrl = "/signup",
  showForgotPasswordLink = true,
  forgotPasswordUrl = "/forgot-password",
  className,
}: SignInFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            router.push(redirectTo);
          },
          onError: (ctx) => {
            const errorMessage = ctx.error?.message || "Failed to sign in. Please check your credentials.";
            setError(errorMessage);
            onError?.(new Error(errorMessage));
          },
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {showForgotPasswordLink && (
                <a
                  href={forgotPasswordUrl}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {showSocialAuth && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <SocialAuthButtons
              providers={socialProviders}
              callbackURL={redirectTo}
              onError={onError}
            />
          </>
        )}
      </CardContent>

      {showSignUpLink && (
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href={signUpUrl} className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
```

**Tests**:
- ✅ Renders with default props
- ✅ Form validation works (empty fields, invalid email)
- ✅ Submits with valid credentials
- ✅ Displays error messages
- ✅ Disables form during submission
- ✅ Calls onSuccess callback
- ✅ Calls onError callback
- ✅ Shows/hides social auth based on prop
- ✅ Shows/hides sign-up link based on prop

---

### 2.3 SignUpForm Component

**File**: `packages/auth/ui/src/forms/sign-up-form.tsx`

**Similar structure to SignInForm, with additions**:
- Name field
- Password confirmation field
- Password strength indicator (live)
- Terms of service checkbox (optional)
- Email verification notice after signup

**Key Differences**:
```typescript
export interface SignUpFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showSocialAuth?: boolean;
  socialProviders?: ("github" | "google" | "apple")[];
  requireTermsAcceptance?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  showPasswordStrength?: boolean;
  showSignInLink?: boolean;
  signInUrl?: string;
  className?: string;
}

// Additional form fields:
<Input {...register("name")} placeholder="John Doe" />
<Input {...register("confirmPassword")} type="password" />
{showPasswordStrength && <PasswordStrengthIndicator password={watch("password")} />}
{requireTermsAcceptance && (
  <Checkbox {...register("acceptTerms")}>
    I accept the <a href={termsUrl}>Terms</a> and <a href={privacyUrl}>Privacy Policy</a>
  </Checkbox>
)}
```

---

### 2.4 SessionGuard Component

**File**: `packages/auth/ui/src/guards/session-guard.tsx`

**Implementation**:
```typescript
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession, useUser } from "@auth/web";
import type { UserRole } from "@auth/types";

export interface SessionGuardProps {
  /** Content to render when authenticated */
  children: ReactNode;
  /** Fallback to render when not authenticated */
  fallback?: ReactNode;
  /** Redirect URL when not authenticated */
  redirectTo?: string;
  /** Require email to be verified */
  requireEmailVerified?: boolean;
  /** Require specific role */
  requireRole?: UserRole;
  /** Callback when unauthorized */
  onUnauthorized?: () => void;
  /** Show loading state */
  showLoading?: boolean;
  /** Custom loading component */
  LoadingComponent?: React.ComponentType;
}

export function SessionGuard({
  children,
  fallback,
  redirectTo = "/login",
  requireEmailVerified = false,
  requireRole,
  onUnauthorized,
  showLoading = true,
  LoadingComponent,
}: SessionGuardProps) {
  const { data: session, isPending } = useSession();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      onUnauthorized?.();
      router.push(redirectTo);
    }
  }, [session, isPending, router, redirectTo, onUnauthorized]);

  // Loading state
  if (isPending) {
    if (!showLoading) return null;
    if (LoadingComponent) return <LoadingComponent />;
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Not authenticated
  if (!session || !user) {
    return fallback ? <>{fallback}</> : null;
  }

  // Email verification required
  if (requireEmailVerified && !user.emailVerified) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold">Email Verification Required</h2>
          <p className="mt-2 text-muted-foreground">
            Please verify your email address to continue.
          </p>
        </div>
      </div>
    );
  }

  // Role check
  if (requireRole && user.role !== requireRole) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // All checks passed
  return <>{children}</>;
}
```

**Tests**:
- ✅ Redirects when not authenticated
- ✅ Shows loading state while checking
- ✅ Renders children when authenticated
- ✅ Checks email verification
- ✅ Checks role requirement
- ✅ Custom fallback works
- ✅ onUnauthorized callback fires

---

### 2.5 SignOutButton Component

**File**: `packages/auth/ui/src/actions/sign-out-button.tsx`

**Implementation**:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@auth/web";
import { Button, type ButtonProps } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";

export interface SignOutButtonProps extends Omit<ButtonProps, "onClick"> {
  /** Redirect URL after sign-out */
  redirectTo?: string;
  /** Callback after successful sign-out */
  onSuccess?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Show confirmation dialog */
  showConfirmation?: boolean;
  /** Confirmation dialog title */
  confirmTitle?: string;
  /** Confirmation dialog description */
  confirmDescription?: string;
  /** Button text */
  children?: React.ReactNode;
}

export function SignOutButton({
  redirectTo = "/",
  onSuccess,
  onError,
  showConfirmation = false,
  confirmTitle = "Sign Out",
  confirmDescription = "Are you sure you want to sign out?",
  children = "Sign Out",
  ...buttonProps
}: SignOutButtonProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({
        onSuccess: () => {
          onSuccess?.();
          router.push(redirectTo);
        },
        onError: (ctx) => {
          const error = new Error(ctx.error?.message || "Failed to sign out");
          onError?.(error);
        },
      });
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button {...buttonProps} disabled={isLoading}>
            {isLoading ? "Signing out..." : children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button {...buttonProps} onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? "Signing out..." : children}
    </Button>
  );
}
```

---

### 2.6 UserAvatar Component

**File**: `packages/auth/ui/src/display/user-avatar.tsx`

**Implementation**:
```typescript
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { getUserInitials, getUserDisplayName } from "@auth/core";
import { useUser } from "@auth/web";
import type { User, PublicUser } from "@auth/types";

export interface UserAvatarProps {
  /** User to display (defaults to current user) */
  user?: User | PublicUser | null;
  /** Avatar size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Show name next to avatar */
  showName?: boolean;
  /** Use initials as fallback */
  fallbackToInitials?: boolean;
  /** Additional CSS class */
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function UserAvatar({
  user: propUser,
  size = "md",
  showName = false,
  fallbackToInitials = true,
  className,
}: UserAvatarProps) {
  const { user: currentUser } = useUser();
  const user = propUser ?? currentUser;

  if (!user) {
    return null;
  }

  const displayName = getUserDisplayName(user);
  const initials = fallbackToInitials ? getUserInitials(user) : "?";

  const avatarElement = (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      {user.image && <AvatarImage src={user.image} alt={displayName} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );

  if (!showName) {
    return avatarElement;
  }

  return (
    <div className="flex items-center gap-2">
      {avatarElement}
      <span className="text-sm font-medium">{displayName}</span>
    </div>
  );
}
```

---

### 2.7 PasswordStrengthIndicator Component

**File**: `packages/auth/ui/src/feedback/password-strength-indicator.tsx`

**Implementation**:
```typescript
"use client";

import { useMemo } from "react";
import { Progress } from "@workspace/ui/components/progress";

export interface PasswordStrengthIndicatorProps {
  /** Password to check */
  password: string;
  /** Show detailed requirements */
  showRequirements?: boolean;
  /** Minimum strength (0-4) to consider valid */
  minStrength?: number;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;

  let score = 0;
  let label = "Too weak";
  let color = "bg-destructive";

  if (metRequirements >= 5) {
    score = 4;
    label = "Very strong";
    color = "bg-green-500";
  } else if (metRequirements >= 4) {
    score = 3;
    label = "Strong";
    color = "bg-green-400";
  } else if (metRequirements >= 3) {
    score = 2;
    label = "Fair";
    color = "bg-yellow-500";
  } else if (metRequirements >= 2) {
    score = 1;
    label = "Weak";
    color = "bg-orange-500";
  }

  return { score, label, color, requirements };
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
  minStrength = 3,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  const progress = (strength.score / 4) * 100;
  const isValid = strength.score >= minStrength;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength</span>
        <span className={`text-sm font-medium ${isValid ? "text-green-600" : "text-muted-foreground"}`}>
          {strength.label}
        </span>
      </div>
      <Progress value={progress} className="h-2" indicatorClassName={strength.color} />

      {showRequirements && (
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className={strength.requirements.minLength ? "text-green-600" : ""}>
            {strength.requirements.minLength ? "✓" : "○"} At least 8 characters
          </li>
          <li className={strength.requirements.hasUppercase ? "text-green-600" : ""}>
            {strength.requirements.hasUppercase ? "✓" : "○"} One uppercase letter
          </li>
          <li className={strength.requirements.hasLowercase ? "text-green-600" : ""}>
            {strength.requirements.hasLowercase ? "✓" : "○"} One lowercase letter
          </li>
          <li className={strength.requirements.hasNumber ? "text-green-600" : ""}>
            {strength.requirements.hasNumber ? "✓" : "○"} One number
          </li>
          <li className={strength.requirements.hasSpecial ? "text-green-600" : ""}>
            {strength.requirements.hasSpecial ? "✓" : "○"} One special character
          </li>
        </ul>
      )}
    </div>
  );
}
```

---

### 2.8 SocialAuthButtons Component

**File**: `packages/auth/ui/src/actions/social-auth-buttons.tsx`

**Implementation**:
```typescript
"use client";

import { useState } from "react";
import { useAuth } from "@auth/web";
import { Button } from "@workspace/ui/components/button";
import { Github, Mail } from "lucide-react"; // Icons from lucide-react

export interface SocialAuthButtonsProps {
  /** OAuth providers to show */
  providers: ("github" | "google" | "apple")[];
  /** Redirect URL after successful sign-in */
  callbackURL?: string;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Button layout */
  layout?: "horizontal" | "vertical";
  /** Additional CSS class */
  className?: string;
}

const providerConfig = {
  github: {
    name: "GitHub",
    icon: Github,
  },
  google: {
    name: "Google",
    icon: Mail, // Replace with proper Google icon
  },
  apple: {
    name: "Apple",
    icon: Mail, // Replace with proper Apple icon
  },
};

export function SocialAuthButtons({
  providers,
  callbackURL = "/dashboard",
  onError,
  layout = "vertical",
  className,
}: SocialAuthButtonsProps) {
  const { signIn } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn.social(
        {
          provider,
          callbackURL,
        },
        {
          onError: (ctx) => {
            const error = new Error(ctx.error?.message || `Failed to sign in with ${provider}`);
            onError?.(error);
          },
        }
      );
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const layoutClasses = layout === "horizontal" ? "flex gap-2" : "space-y-2";

  return (
    <div className={`${layoutClasses} ${className || ""}`}>
      {providers.map((provider) => {
        const config = providerConfig[provider];
        const Icon = config.icon;
        const isLoading = loadingProvider === provider;

        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            onClick={() => handleSocialSignIn(provider)}
            disabled={!!loadingProvider}
            className="w-full"
          >
            {!isLoading && <Icon className="mr-2 h-4 w-4" />}
            {isLoading ? `Connecting...` : `Continue with ${config.name}`}
          </Button>
        );
      })}
    </div>
  );
}
```

---

### 2.9 Phase 2 Acceptance Criteria

- ✅ `SignInForm` component works with validation
- ✅ `SignUpForm` component works with password strength
- ✅ `SessionGuard` component protects routes
- ✅ `SignOutButton` component signs out users
- ✅ `UserAvatar` component displays user info
- ✅ `PasswordStrengthIndicator` shows strength
- ✅ `SocialAuthButtons` component triggers OAuth
- ✅ All components are fully typed
- ✅ All components accept customization props
- ✅ All components use @workspace/ui for base components
- ✅ Package builds successfully
- ✅ Manual testing confirms all components work

---

## Phase 3: Migrate apps/web

**Goal**: Update `apps/web` to use `@auth/web` and `@auth/ui` packages consistently
**Estimated Effort**: 4-6 hours
**Priority**: P0 (Critical)

### 3.1 Update Dependencies

**File**: `apps/web/package.json`

**Changes**:
```json
{
  "dependencies": {
    "@auth/types": "workspace:*",
    "@auth/web": "workspace:*",
    "@auth/ui": "workspace:*",
    // Remove any direct better-auth imports if using @auth/web
  }
}
```

Run: `pnpm install`

---

### 3.2 Update Auth Client Setup

**File**: `apps/web/lib/auth/auth-client.ts`

**Before**:
```typescript
import { createAuthClient } from "better-auth/react";
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [
    convexClient(),
    crossDomainClient({
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storagePrefix: "better-convex-auth",
    }),
  ],
});
```

**After** (using `@auth/web`):
```typescript
import { createAuthClient } from "@auth/web";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  storagePrefix: "better-convex-auth",
});

// Re-export hooks for convenience
export { useAuth, useSession, useUser } from "@auth/web";
```

---

### 3.3 Update Provider

**File**: `apps/web/components/providers/convex-client-provider.tsx`

**Before**:
```typescript
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  expectAuth: false,
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
```

**After** (using `@auth/web`):
```typescript
import { createAuthProvider } from "@auth/web";
import { authClient } from "@/lib/auth/auth-client";

export const ConvexClientProvider = createAuthProvider({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  authClient,
  expectAuth: false,
});
```

Even simpler - just use the factory!

---

### 3.4 Update Login Page

**File**: `apps/web/app/(auth)/login/page.tsx`

**Before** (143 lines of custom form):
```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
// ... 130+ more lines
```

**After** (using `@auth/ui`):
```typescript
import { SignInForm } from "@auth/ui/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Better Convex Auth",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm
        redirectTo="/dashboard"
        showSocialAuth
        socialProviders={["github"]}
        className="w-full max-w-md"
      />
    </div>
  );
}
```

**Lines of code**: 143 → 20 (85% reduction!)

---

### 3.5 Update Signup Page

**File**: `apps/web/app/(auth)/signup/page.tsx`

**Before** (180 lines of custom form with validation):
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
// ... manual validation, state management, etc.
```

**After** (using `@auth/ui`):
```typescript
import { SignUpForm } from "@auth/ui/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Better Convex Auth",
  description: "Create your account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm
        redirectTo="/dashboard"
        showSocialAuth
        socialProviders={["github"]}
        showPasswordStrength
        requireTermsAcceptance
        termsUrl="/terms"
        privacyUrl="/privacy"
        className="w-full max-w-md"
      />
    </div>
  );
}
```

**Lines of code**: 180 → 22 (88% reduction!)

---

### 3.6 Update Dashboard Page

**File**: `apps/web/app/(app)/dashboard/page.tsx`

**Before**:
```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name || user.email}!</p>
        </div>
        {/* More dashboard content */}
      </div>
    </div>
  );
}
```

**After** (using `@auth/ui` and `@auth/web`):
```typescript
import { SessionGuard } from "@auth/ui/guards";
import { UserAvatar } from "@auth/ui/display";
import { SignOutButton } from "@auth/ui/actions";
import { useUser } from "@/lib/auth/auth-client";

export default function DashboardPage() {
  return (
    <SessionGuard redirectTo="/login">
      <DashboardContent />
    </SessionGuard>
  );
}

function DashboardContent() {
  const { user } = useUser();

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}!</p>
        </div>
        <div className="flex items-center gap-4">
          <UserAvatar showName />
          <SignOutButton variant="outline" />
        </div>
      </div>
      {/* More dashboard content */}
    </div>
  );
}
```

**Benefits**:
- ✅ Protection handled by `<SessionGuard>`
- ✅ No manual redirect logic
- ✅ Cleaner component structure
- ✅ Reusable components

---

### 3.7 Add Validation from @auth/utils

**Current Issue**: Signup page has inline validation

**File**: `apps/web/app/(auth)/signup/page.tsx` (if keeping custom form)

**Before**:
```typescript
if (password.length < 8) {
  setError("Password must be at least 8 characters");
  return;
}
```

**After** (use Zod schema):
```typescript
import { SimplePasswordSchema } from "@auth/utils";

const result = SimplePasswordSchema.safeParse(password);
if (!result.success) {
  setError(result.error.errors[0].message);
  return;
}
```

**Note**: If using `<SignUpForm>` from `@auth/ui`, this is already handled internally.

---

### 3.8 Remove Duplicate Code

**Files to check for duplicates**:
- `apps/web/lib/auth/*` - Keep only `auth-client.ts`, remove others
- `apps/web/hooks/*` - Remove any auth hooks (use `@auth/web`)
- `apps/web/components/auth/*` - Remove if using `@auth/ui`

**Keep**:
- `apps/web/lib/auth/auth-client.ts` - Client instance
- App-specific components (non-auth)
- Custom business logic

**Remove**:
- Custom auth forms (if using `@auth/ui`)
- Custom auth hooks (if using `@auth/web`)
- Validation logic (if using `@auth/utils`)

---

### 3.9 Phase 3 Acceptance Criteria

- ✅ `apps/web` uses `@auth/web` hooks
- ✅ Auth pages use `@auth/ui` components
- ✅ No duplicate auth logic in apps/web
- ✅ All auth functionality works (sign in, sign up, sign out)
- ✅ Protected routes work with `<SessionGuard>`
- ✅ OAuth authentication works
- ✅ No TypeScript errors
- ✅ No linter errors
- ✅ App builds successfully
- ✅ Manual testing confirms all flows work

---

## Phase 4: Create @auth/quickstart

**Goal**: Provide one-function setup for new apps
**Estimated Effort**: 4-6 hours
**Priority**: P1 (High)

### 4.1 Package Setup

**File**: `packages/auth/quickstart/package.json`

**Implementation**:
```json
{
  "name": "@auth/quickstart",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "dependencies": {
    "@auth/web": "workspace:*",
    "@auth/ui": "workspace:*",
    "@auth/types": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "next": "^14.0.0 || ^15.0.0 || ^16.0.0"
  }
}
```

**Directory Structure**:
```
packages/auth/quickstart/src/
├── setup-auth.ts
├── setup-auth-ui.ts
├── setup-auth-headless.ts
└── index.ts
```

---

### 4.2 Main Setup Function

**File**: `packages/auth/quickstart/src/setup-auth.ts`

**Implementation**:
```typescript
import { createAuthClient, createAuthProvider, type CreateAuthClientOptions } from "@auth/web";
import * as hooks from "@auth/web";
import * as components from "@auth/ui";

export interface SetupAuthConfig {
  /** Convex deployment URL */
  convexUrl: string;
  /** Base URL for authentication */
  baseURL: string;
  /** Storage prefix for localStorage */
  storagePrefix?: string;
  /** Expect authentication for all Convex requests */
  expectAuth?: boolean;
  /** Additional auth client options */
  clientOptions?: Partial<CreateAuthClientOptions>;
}

export function setupAuth(config: SetupAuthConfig) {
  const {
    convexUrl,
    baseURL,
    storagePrefix = "better-convex-auth",
    expectAuth = false,
    clientOptions = {},
  } = config;

  // Create auth client
  const authClient = createAuthClient({
    baseURL,
    storagePrefix,
    ...clientOptions,
  });

  // Create provider
  const AuthProvider = createAuthProvider({
    convexUrl,
    authClient,
    expectAuth,
  });

  // Return everything needed
  return {
    // Core
    authClient,
    AuthProvider,

    // Hooks
    useAuth: hooks.useAuth,
    useSession: hooks.useSession,
    useUser: hooks.useUser,
    useSignIn: hooks.useSignIn,
    useSignUp: hooks.useSignUp,
    useSignOut: hooks.useSignOut,
    useAuthClient: hooks.useAuthClient,

    // Components (organized by category)
    components: {
      // Forms
      SignInForm: components.SignInForm,
      SignUpForm: components.SignUpForm,
      ForgotPasswordForm: components.ForgotPasswordForm,
      ResetPasswordForm: components.ResetPasswordForm,
      ChangePasswordForm: components.ChangePasswordForm,

      // Guards
      SessionGuard: components.SessionGuard,
      EmailVerifiedGuard: components.EmailVerifiedGuard,
      RoleGuard: components.RoleGuard,

      // Display
      UserAvatar: components.UserAvatar,
      UserBadge: components.UserBadge,

      // Actions
      SignOutButton: components.SignOutButton,
      SocialAuthButtons: components.SocialAuthButtons,

      // Feedback
      PasswordStrengthIndicator: components.PasswordStrengthIndicator,
      EmailVerificationBanner: components.EmailVerificationBanner,
    },

    // HOCs
    withAuth: hooks.withAuth,
    withSession: hooks.withSession,
    withEmailVerified: hooks.withEmailVerified,
  };
}
```

---

### 4.3 UI-Only Setup

**File**: `packages/auth/quickstart/src/setup-auth-ui.ts`

**Implementation**:
```typescript
import { setupAuth, type SetupAuthConfig } from "./setup-auth.js";

/**
 * Setup auth with all UI components included
 * Same as setupAuth but more explicit naming
 */
export function setupAuthUI(config: SetupAuthConfig) {
  return setupAuth(config);
}
```

---

### 4.4 Headless Setup

**File**: `packages/auth/quickstart/src/setup-auth-headless.ts`

**Implementation**:
```typescript
import { createAuthClient, createAuthProvider, type CreateAuthClientOptions } from "@auth/web";
import * as hooks from "@auth/web";
import type { SetupAuthConfig } from "./setup-auth.js";

/**
 * Setup auth without UI components (hooks only)
 * Use this if you want to build custom UI
 */
export function setupAuthHeadless(config: SetupAuthConfig) {
  const {
    convexUrl,
    baseURL,
    storagePrefix = "better-convex-auth",
    expectAuth = false,
    clientOptions = {},
  } = config;

  const authClient = createAuthClient({
    baseURL,
    storagePrefix,
    ...clientOptions,
  });

  const AuthProvider = createAuthProvider({
    convexUrl,
    authClient,
    expectAuth,
  });

  return {
    authClient,
    AuthProvider,
    ...hooks,
  };
}
```

---

### 4.5 Package Exports

**File**: `packages/auth/quickstart/src/index.ts`

**Implementation**:
```typescript
export { setupAuth, type SetupAuthConfig } from "./setup-auth.js";
export { setupAuthUI } from "./setup-auth-ui.js";
export { setupAuthHeadless } from "./setup-auth-headless.js";

// Re-export everything from @auth/web and @auth/ui for convenience
export * from "@auth/web";
export * from "@auth/ui";
```

---

### 4.6 Usage Examples

**Example 1: Full Setup with UI**

**File**: `apps/web/lib/auth.ts`

```typescript
import { setupAuth } from "@auth/quickstart";

export const {
  AuthProvider,
  useAuth,
  useSession,
  useUser,
  components: {
    SignInForm,
    SignUpForm,
    SessionGuard,
    SignOutButton,
    UserAvatar,
  },
} = setupAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
});
```

**Example 2: Headless (Custom UI)**

```typescript
import { setupAuthHeadless } from "@auth/quickstart";

export const {
  AuthProvider,
  useAuth,
  useSession,
  useUser,
} = setupAuthHeadless({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
});

// Build your own custom UI components using the hooks
```

---

### 4.7 Create README

**File**: `packages/auth/quickstart/README.md`

**Content**: Comprehensive quickstart guide with:
- Installation instructions
- 5-minute setup guide
- Code examples
- Common patterns
- Troubleshooting

---

### 4.8 Phase 4 Acceptance Criteria

- ✅ `setupAuth()` function works correctly
- ✅ Returns all hooks and components
- ✅ `AuthProvider` component works
- ✅ `setupAuthHeadless()` works without UI
- ✅ TypeScript types are correct
- ✅ Package builds successfully
- ✅ README is comprehensive
- ✅ Works in Next.js 14, 15, 16
- ✅ Works with React 18 and 19

---

## Phase 5: Advanced Components

**Goal**: Build additional UI components for complete auth UX
**Estimated Effort**: 8-12 hours
**Priority**: P2 (Medium)

### 5.1 Additional Form Components

#### ForgotPasswordForm

**File**: `packages/auth/ui/src/forms/forgot-password-form.tsx`

**Features**:
- Email input with validation
- Submit button
- Loading state
- Success message (email sent)
- Back to login link

#### ResetPasswordForm

**File**: `packages/auth/ui/src/forms/reset-password-form.tsx`

**Features**:
- New password input
- Confirm password input
- Password strength indicator
- Token validation (from URL)
- Submit button
- Success redirect

#### ChangePasswordForm

**File**: `packages/auth/ui/src/forms/change-password-form.tsx`

**Features**:
- Current password input
- New password input
- Confirm new password input
- Password strength indicator
- Submit button
- Success message

#### UpdateProfileForm

**File**: `packages/auth/ui/src/forms/update-profile-form.tsx`

**Features**:
- Name input
- Email input (with re-verification)
- Profile image upload
- Submit button
- Success message

---

### 5.2 Additional Guard Components

#### EmailVerifiedGuard

**File**: `packages/auth/ui/src/guards/email-verified-guard.tsx`

**Features**:
- Check email verification status
- Show verification required message
- Resend verification button
- Custom fallback

#### RoleGuard

**File**: `packages/auth/ui/src/guards/role-guard.tsx`

**Features**:
- Check user role
- Support multiple required roles
- Show "access denied" message
- Custom fallback

#### PermissionGuard

**File**: `packages/auth/ui/src/guards/permission-guard.tsx`

**Features**:
- Check custom permissions
- Flexible permission checking function
- Show "permission denied" message
- Custom fallback

---

### 5.3 Additional Display Components

#### UserBadge

**File**: `packages/auth/ui/src/display/user-badge.tsx`

**Features**:
- Compact user display (avatar + name)
- Hover card with more info
- Click to view profile
- Status indicator (online/offline)

#### UserMenu

**File**: `packages/auth/ui/src/display/user-menu.tsx`

**Features**:
- Dropdown menu
- User avatar trigger
- Profile link
- Settings link
- Sign out button
- Role/status badge

#### SessionInfo

**File**: `packages/auth/ui/src/display/session-info.tsx`

**Features**:
- Display session creation time
- Display session expiry time
- Display "expires in" countdown
- Refresh session button

---

### 5.4 Additional Feedback Components

#### EmailVerificationBanner

**File**: `packages/auth/ui/src/feedback/email-verification-banner.tsx`

**Features**:
- Banner at top of page
- "Verify your email" message
- Resend verification button
- Dismiss button (with localStorage)
- Auto-hide when verified

#### SessionExpiryWarning

**File**: `packages/auth/ui/src/feedback/session-expiry-warning.tsx`

**Features**:
- Show when session < 5 minutes remaining
- Toast notification
- "Extend session" button
- Countdown timer

#### AuthErrorAlert

**File**: `packages/auth/ui/src/feedback/auth-error-alert.tsx`

**Features**:
- Display authentication errors
- User-friendly error messages
- Retry button
- Close button

---

### 5.5 Additional Action Components

#### DeleteAccountButton

**File**: `packages/auth/ui/src/actions/delete-account-button.tsx`

**Features**:
- Confirmation dialog (double-check)
- Password confirmation
- Loading state
- Success redirect to homepage

#### ResendVerificationButton

**File**: `packages/auth/ui/src/actions/resend-verification-button.tsx`

**Features**:
- Resend verification email
- Rate limiting (prevent spam)
- Success message
- Loading state

---

### 5.6 Layout Components

#### AuthLayout

**File**: `packages/auth/ui/src/layouts/auth-layout.tsx`

**Features**:
- Centered layout
- Responsive design
- Optional background image
- Optional logo
- Footer with links

#### AuthCard

**File**: `packages/auth/ui/src/layouts/auth-card.tsx`

**Features**:
- Card container
- Consistent padding
- Shadow and border
- Responsive width
- Optional header/footer

---

### 5.7 Phase 5 Acceptance Criteria

- ✅ All additional components implemented
- ✅ Components follow design system
- ✅ Components are fully typed
- ✅ Components accept customization props
- ✅ All components tested manually
- ✅ Documentation for each component
- ✅ Storybook stories (optional, future)

---

## Phase 6: Documentation & Polish

**Goal**: Comprehensive documentation and final polish
**Estimated Effort**: 6-8 hours
**Priority**: P1 (High)

### 6.1 Package READMEs

**Files to create/update**:
- `packages/auth/web/README.md` - Hooks and setup guide
- `packages/auth/ui/README.md` - Component library guide
- `packages/auth/quickstart/README.md` - 5-minute setup guide
- `packages/auth/types/README.md` - Type definitions reference
- `packages/auth/utils/README.md` - Utilities and validators guide
- `packages/auth/core/README.md` - Backend integration guide

**Each README should include**:
- Purpose and scope
- Installation instructions
- Quick start example
- API reference (all exports)
- Usage examples
- TypeScript types
- Common patterns
- Troubleshooting

---

### 6.2 Main Documentation

**File**: `docs/quickstart.md`

**Content**:
```markdown
# Better Convex Auth - Quickstart Guide

Get authentication working in your Next.js + Convex app in 5 minutes.

## Prerequisites
- Next.js 14+ with App Router
- Convex backend deployed
- Node.js 20+

## Installation

1. Install packages:
```bash
pnpm add @auth/quickstart @auth/types
```

2. Setup auth (app/lib/auth.ts):
```typescript
import { setupAuth } from "@auth/quickstart";

export const { AuthProvider, useAuth, useSession, components } = setupAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
});
```

3. Wrap your app (app/layout.tsx):
```typescript
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

4. Add login page (app/login/page.tsx):
```typescript
import { components } from "@/lib/auth";

export default function LoginPage() {
  return <components.SignInForm redirectTo="/dashboard" />;
}
```

5. Add protected page (app/dashboard/page.tsx):
```typescript
import { components } from "@/lib/auth";

export default function DashboardPage() {
  return (
    <components.SessionGuard>
      <h1>Dashboard</h1>
    </components.SessionGuard>
  );
}
```

Done! You now have working authentication. ✅
```

---

### 6.3 API Reference

**File**: `docs/api-reference.md`

**Content**: Complete API documentation for:
- All hooks (useAuth, useSession, useUser, etc.)
- All components (props, examples, screenshots)
- All utilities (validators, token functions)
- All types (interfaces, enums, type aliases)

**Format**:
```markdown
## useSession()

Returns the current session state.

### Signature
```typescript
function useSession(): UseSessionReturn
```

### Return Type
```typescript
interface UseSessionReturn {
  data: Session | null;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### Example
```typescript
import { useSession } from "@auth/web";

function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {session.user.name}!</div>;
}
```
```

---

### 6.4 Migration Guide

**File**: `docs/migration-guide.md`

**Content**: Guide for migrating from:
- Custom auth implementation → Better Convex Auth
- Better Auth (standalone) → Better Convex Auth
- Clerk → Better Convex Auth
- Auth.js (NextAuth) → Better Convex Auth

**Sections**:
- Why migrate?
- Breaking changes
- Step-by-step migration
- Code comparison (before/after)
- Troubleshooting common issues

---

### 6.5 Examples Repository

**File**: `docs/examples.md`

**Content**: Link to example implementations:
- Minimal setup (5 minutes)
- Full-featured app (with all components)
- Custom UI (headless hooks)
- Multi-tenant (organizations)
- Mobile app (React Native, future)

---

### 6.6 Architecture Decision Records (ADRs)

**File**: `docs/architecture/adr-001-package-boundaries.md`

**Content**: Document key architectural decisions:
- ADR-001: Package boundaries and separation of concerns
- ADR-002: Type-only vs implementation packages
- ADR-003: Context-based hooks vs direct client access
- ADR-004: Component customization strategy
- ADR-005: Cross-platform support approach

**Format** (ADR template):
```markdown
# ADR-001: Package Boundaries and Separation of Concerns

## Status
Accepted

## Context
We needed to decide how to split authentication functionality across packages...

## Decision
We will use the following package structure:
- @auth/core: Backend integration (platform-agnostic)
- @auth/web: React hooks and client setup
- @auth/ui: Pre-built React components
- @auth/quickstart: One-function setup

## Consequences
### Positive
- Clear separation of concerns
- Each package has single responsibility
- Easy to consume in different environments

### Negative
- More packages to maintain
- Dependency management complexity

## Alternatives Considered
- Monolithic package: Rejected due to tight coupling
- Framework-specific packages: Rejected due to duplication
```

---

### 6.7 Contribution Guide

**File**: `docs/contributing.md`

**Content**:
- How to set up development environment
- How to run tests
- How to add new components
- Code style guidelines (Biome)
- PR process and review guidelines
- Issue triage process

---

### 6.8 Troubleshooting Guide

**File**: `docs/troubleshooting.md`

**Content**: Common issues and solutions:
- "useAuthClient must be used within AuthClientProvider"
- Type errors with Better Auth
- CORS issues with Convex
- Session not persisting
- OAuth redirect issues
- Email verification not working

**Format**:
```markdown
## Issue: "useAuthClient must be used within AuthClientProvider"

### Cause
You're calling a hook from `@auth/web` outside of the `<AuthProvider>` component.

### Solution
Wrap your app with `<AuthProvider>`:

```typescript
// app/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}
```

### Still not working?
- Check that AuthProvider is in a Client Component (add "use client")
- Ensure you're not calling hooks in Server Components
```

---

### 6.9 Phase 6 Acceptance Criteria

- ✅ All package READMEs complete
- ✅ Quickstart guide complete
- ✅ API reference complete
- ✅ Migration guide complete
- ✅ Examples documented
- ✅ ADRs written
- ✅ Contribution guide complete
- ✅ Troubleshooting guide complete
- ✅ All code has JSDoc comments
- ✅ All exports documented

---

## Phase 7: React Native Support

**Goal**: Add React Native support for mobile apps
**Estimated Effort**: 12-16 hours
**Priority**: P3 (Low - Future)

### 7.1 Create @auth/native Package

**Directory**: `packages/auth/native`

**Similar to `@auth/web` but for React Native**:
- Use React Native AsyncStorage instead of localStorage
- React Navigation instead of Next.js router
- Expo compatible

---

### 7.2 Create @auth/ui/native Components

**Directory**: `packages/auth/ui/src/native`

**Components**:
- Native equivalents of web components
- Use React Native UI libraries (e.g., React Native Paper)
- Same props API as web components
- Platform-specific styling

---

### 7.3 Update @auth/quickstart

**Add mobile setup**:
```typescript
import { setupAuthNative } from "@auth/quickstart/native";

export const { AuthProvider, useAuth } = setupAuthNative({
  convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL!,
  baseURL: process.env.EXPO_PUBLIC_API_URL!,
});
```

---

### 7.4 Phase 7 Acceptance Criteria

- ✅ `@auth/native` package works with React Native
- ✅ Native UI components work on iOS/Android
- ✅ AsyncStorage integration works
- ✅ React Navigation integration works
- ✅ Expo compatible
- ✅ Example React Native app works
- ✅ Documentation for mobile setup

---

## Testing Strategy

### Unit Tests

**Tools**: Vitest + React Testing Library

**Files to test**:
- All hooks in `@auth/web`
- All utility functions in `@auth/utils`
- Session/user utilities in `@auth/core`

**Coverage goal**: 80%+

**Example**:
```typescript
// packages/auth/web/src/hooks/use-session.test.tsx
import { renderHook } from "@testing-library/react";
import { useSession } from "./use-session";
import { AuthClientProvider } from "../context/auth-client-context";

describe("useSession", () => {
  it("returns session when authenticated", () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <AuthClientProvider client={mockAuthClient}>
          {children}
        </AuthClientProvider>
      ),
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it("returns null when not authenticated", () => {
    // ... test implementation
  });
});
```

---

### Integration Tests

**Tools**: Playwright

**Scenarios to test**:
- Complete sign-up flow
- Complete sign-in flow
- OAuth authentication
- Password reset flow
- Protected route access
- Session persistence
- Sign out flow

**Example**:
```typescript
// e2e/auth-flow.spec.ts
import { test, expect } from "@playwright/test";

test("complete sign-up and sign-in flow", async ({ page }) => {
  // Sign up
  await page.goto("/signup");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "SecurePass123!");
  await page.fill('input[name="confirmPassword"]', "SecurePass123!");
  await page.click('button[type="submit"]');

  // Verify redirect to dashboard
  await expect(page).toHaveURL("/dashboard");

  // Verify user is authenticated
  await expect(page.locator("text=Welcome")).toBeVisible();

  // Sign out
  await page.click('button:has-text("Sign Out")');

  // Verify redirect to home
  await expect(page).toHaveURL("/");
});
```

---

### Manual Testing Checklist

**Auth Flows**:
- [ ] Email/password sign-up
- [ ] Email/password sign-in
- [ ] GitHub OAuth sign-in
- [ ] Google OAuth sign-in (if configured)
- [ ] Password reset flow
- [ ] Email verification flow
- [ ] Profile update
- [ ] Password change
- [ ] Account deletion

**Component Testing**:
- [ ] SignInForm renders and works
- [ ] SignUpForm renders and works
- [ ] SessionGuard protects routes
- [ ] UserAvatar displays correctly
- [ ] SignOutButton works
- [ ] PasswordStrengthIndicator shows correct strength
- [ ] SocialAuthButtons work

**Error Handling**:
- [ ] Invalid email format shows error
- [ ] Weak password shows error
- [ ] Wrong password shows error
- [ ] Network errors show friendly message
- [ ] Session expiry handled gracefully

**Edge Cases**:
- [ ] No network connection
- [ ] Convex backend down
- [ ] Concurrent sign-in/sign-out
- [ ] Expired session tokens
- [ ] Malformed OAuth responses

---

## Migration Guide

### For Apps Using Custom Auth

**Current Setup**:
```typescript
// Custom auth implementation in app
import { createAuthClient } from "better-auth/react";
// ... 50+ lines of setup
```

**Migration Steps**:

1. **Install packages**:
```bash
pnpm add @auth/quickstart @auth/ui @auth/web @auth/types
```

2. **Replace auth setup**:
```typescript
// Before: lib/auth-client.ts (50+ lines)
// After: lib/auth.ts (10 lines)
import { setupAuth } from "@auth/quickstart";
export const { AuthProvider, useAuth, useSession, components } = setupAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
});
```

3. **Update provider**:
```typescript
// Before: Custom provider setup
// After: Use AuthProvider from setupAuth
import { AuthProvider } from "@/lib/auth";
<AuthProvider>{children}</AuthProvider>
```

4. **Replace auth pages**:
```typescript
// Before: Custom login form (143 lines)
// After: Use SignInForm (10 lines)
import { components } from "@/lib/auth";
<components.SignInForm redirectTo="/dashboard" />
```

5. **Update protected routes**:
```typescript
// Before: Manual useEffect + router logic
// After: Use SessionGuard
import { components } from "@/lib/auth";
<components.SessionGuard>{children}</components.SessionGuard>
```

6. **Test thoroughly**:
- [ ] Sign in works
- [ ] Sign up works
- [ ] OAuth works
- [ ] Protected routes work
- [ ] Sign out works

**Estimated migration time**: 2-4 hours

---

### Breaking Changes

**v0.1.x → v0.2.x**:
- `@auth/web` hooks are now real implementations (not stubs)
- Must wrap app with `<AuthClientProvider>` or use `setupAuth()`
- Import paths changed:
  - Before: `import { useSession } from "better-auth/react"`
  - After: `import { useSession } from "@auth/web"`

**Migration path**: See above

---

## Success Criteria

### Development Success Criteria

**Phase 1-4 Complete**:
- ✅ All packages build without errors
- ✅ TypeScript types are correct throughout
- ✅ No linter warnings (Biome)
- ✅ All manual tests pass
- ✅ Documentation is complete

**Performance**:
- ✅ Package build time < 30 seconds
- ✅ App build time doesn't increase significantly
- ✅ Bundle size increase < 50 KB (gzipped)

**Developer Experience**:
- ✅ Setup time: 5 minutes (down from 30+ minutes)
- ✅ Code reduction: 80%+ in auth pages
- ✅ Type safety: Full IntelliSense support
- ✅ Customization: All components accept custom props

---

### User Success Criteria

**Functionality**:
- ✅ Email/password authentication works
- ✅ OAuth authentication works
- ✅ Email verification works
- ✅ Password reset works
- ✅ Protected routes work
- ✅ Session persistence works
- ✅ Real-time session updates work

**UX**:
- ✅ Forms have proper validation
- ✅ Error messages are user-friendly
- ✅ Loading states are clear
- ✅ Mobile responsive design
- ✅ Accessible (WCAG 2.1 AA)

---

### Production Readiness Checklist

**Before v1.0.0 release**:
- [ ] All packages tested in production-like environment
- [ ] Security audit completed
- [ ] Performance benchmarks meet targets
- [ ] Documentation reviewed and complete
- [ ] Migration guide tested with real apps
- [ ] Examples repository deployed
- [ ] Storybook deployed (optional)
- [ ] Changelog generated
- [ ] Release notes written
- [ ] Breaking changes clearly documented

---

## Timeline & Milestones

### Sprint 1 (Week 1)
- **Days 1-2**: Phase 1 - Fix @auth/web
- **Days 3-5**: Phase 2 - Build @auth/ui core

**Deliverable**: Working hooks and core components

---

### Sprint 2 (Week 2)
- **Days 1-2**: Phase 3 - Migrate apps/web
- **Days 3-4**: Phase 4 - Create @auth/quickstart
- **Day 5**: Testing and bug fixes

**Deliverable**: Complete integration in apps/web, quickstart package

---

### Sprint 3 (Week 3)
- **Days 1-3**: Phase 5 - Advanced components
- **Days 4-5**: Phase 6 - Documentation & polish

**Deliverable**: Complete component library, full documentation

---

### Future (Optional)
- **Week 4**: Phase 7 - React Native support
- **Week 5**: Storybook, advanced examples
- **Week 6**: Performance optimization, security audit

---

## Risk Management

### Technical Risks

**Risk**: Better Auth API changes
**Mitigation**: Pin dependency versions, monitor releases, maintain wrapper layer

**Risk**: Convex integration breaks
**Mitigation**: Pin @convex-dev/better-auth version, comprehensive tests

**Risk**: Type errors in complex hook usage
**Mitigation**: Extensive TypeScript tests, type-only imports where possible

---

### Schedule Risks

**Risk**: Phase takes longer than estimated
**Mitigation**: Prioritize P0 items, defer P2/P3 features

**Risk**: Unforeseen breaking changes
**Mitigation**: Thorough testing at each phase, maintain changelog

---

### Quality Risks

**Risk**: Components don't meet UX standards
**Mitigation**: User testing, accessibility audit, iterate based on feedback

**Risk**: Documentation incomplete
**Mitigation**: Write docs alongside code, review before each phase completion

---

## Maintenance Plan

### Post-Launch

**Weekly**:
- Monitor GitHub issues
- Review and merge PRs
- Update dependencies (security patches)

**Monthly**:
- Better Auth version updates
- Convex version updates
- Review and update documentation

**Quarterly**:
- Major version updates
- Feature requests evaluation
- Performance audit

---

### Version Strategy

**Semantic Versioning** (semver):
- **Patch** (0.1.x): Bug fixes, documentation updates
- **Minor** (0.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

**Release Cadence**:
- Patch releases: As needed (bug fixes)
- Minor releases: Monthly (new features)
- Major releases: Quarterly (breaking changes)

---

## Conclusion

This implementation plan provides a complete roadmap for transforming Better Convex Auth into a production-ready, plug-and-play authentication system. By following this plan:

- **Developers** can set up authentication in 5 minutes
- **Apps** benefit from 80%+ code reduction in auth pages
- **Users** get a polished, accessible authentication experience
- **Maintainers** have clear boundaries and well-documented code

**Estimated Total Effort**: 40-60 hours (2-3 weeks)

**Priority Phases**:
1. P0 (Critical): Phases 1-4
2. P1 (High): Phase 6
3. P2 (Medium): Phase 5
4. P3 (Low): Phase 7

**Next Step**: Get approval and begin Phase 1 implementation.

---

**Document Status**: Draft - Awaiting Review
**Last Updated**: 2025-11-07
**Author**: Claude Code
**Reviewers**: [To be filled]
