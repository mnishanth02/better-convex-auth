# @auth/web

React hooks and providers for Better Auth + Convex authentication.

## Installation

This package is part of the Better Convex Auth monorepo. Install it as a workspace dependency:

```json
{
  "dependencies": {
    "@auth/web": "workspace:*"
  }
}
```

## Usage

### 1. Set Up Auth Client

First, create your Better Auth client in your web app:

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  plugins: [convexClient()],
});
```

### 2. Wrap App with Provider

```tsx
// app/layout.tsx or app/ConvexClientProvider.tsx
"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!,
  { expectAuth: true } // Pause queries until authenticated
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
```

### 3. Use Hooks in Components

#### `useSession` - Access Session Data

```tsx
import { authClient } from "@/lib/auth-client";

function UserProfile() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

#### `useAuth` - Authentication Actions

```tsx
import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return <form onSubmit={handleSignIn}>...</form>;
}
```

#### `useUser` - Simplified User Access

```tsx
import { authClient } from "@/lib/auth-client";

function useUser() {
  const { data, isPending, error, refetch } = authClient.useSession();
  return {
    user: data?.user ?? null,
    isLoading: isPending,
    error,
    refetch,
  };
}

// Usage
function UserBadge() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Skeleton />;
  if (!user) return null;

  return (
    <div>
      <img src={user.image} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}
```

## Features

### Session Management
- ✅ Real-time session synchronization via Convex
- ✅ Automatic session refresh
- ✅ Loading and error states
- ✅ Manual refetch capability

### Authentication Methods
- ✅ Email/password authentication
- ✅ Social OAuth (GitHub, Google, Apple)
- ✅ Sign up with email verification
- ✅ Sign out
- ✅ Profile updates
- ✅ Email change
- ✅ Password change

### Type Safety
- ✅ Full TypeScript support
- ✅ Inferred types from auth client
- ✅ Type-safe callbacks
- ✅ Zod schema validation (from @auth/utils)

## API Reference

### Hooks

#### `authClient.useSession()`

Access current user session data.

**Returns:**
- `data` - Session object with user and session metadata
- `isPending` - Loading state
- `error` - Error object if fetch failed
- `refetch` - Function to manually refetch session

#### `useUser()` (Custom Implementation)

Convenience wrapper around `useSession` that extracts user data.

**Implementation:**
```typescript
function useUser() {
  const { data, isPending, error, refetch } = authClient.useSession();
  return {
    user: data?.user ?? null,
    isLoading: isPending,
    error,
    refetch,
  };
}
```

#### Authentication Methods (via `authClient`)

##### `authClient.signIn.email(credentials, callbacks?)`

Sign in with email and password.

**Parameters:**
- `credentials` - `{ email: string, password: string }`
- `callbacks` - Optional callbacks: `{ onRequest?, onSuccess?, onError? }`

##### `authClient.signIn.social(options, callbacks?)`

Sign in with OAuth provider.

**Parameters:**
- `options` - `{ provider: "github" | "google" | "apple", callbackURL?: string }`
- `callbacks` - Optional callbacks

##### `authClient.signUp.email(data, callbacks?)`

Sign up with email and password.

**Parameters:**
- `data` - `{ email: string, password: string, name?: string }`
- `callbacks` - Optional callbacks

##### `authClient.signOut(callbacks?)`

Sign out current user.

**Parameters:**
- `callbacks` - Optional callbacks

##### `authClient.updateUser(data, callbacks?)`

Update user profile.

**Parameters:**
- `data` - `{ name?: string, image?: string }`
- `callbacks` - Optional callbacks

##### `authClient.changeEmail(data, callbacks?)`

Change user email address.

**Parameters:**
- `data` - `{ newEmail: string, callbackURL?: string }`
- `callbacks` - Optional callbacks

##### `authClient.changePassword(data, callbacks?)`

Change user password.

**Parameters:**
- `data` - `{ currentPassword: string, newPassword: string, revokeOtherSessions?: boolean }`
- `callbacks` - Optional callbacks

## Examples

### Protected Route

```tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {session.user.name}!</p>
    </div>
  );
}
```

### Sign In Form

```tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await authClient.signIn.email(
      { email, password },
      {
        onRequest: () => {
          // Show loading state
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (error) => {
          alert(error.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Social Authentication

```tsx
import { authClient } from "@/lib/auth-client";

function SocialAuth() {
  return (
    <div>
      <button onClick={() => authClient.signIn.social({ provider: "github" })}>
        Continue with GitHub
      </button>
      <button onClick={() => authClient.signIn.social({ provider: "google" })}>
        Continue with Google
      </button>
    </div>
  );
}
```

## Related Packages

- **@auth/types** - Shared TypeScript types for authentication
- **@auth/utils** - Validation schemas and utilities (Zod)
- **@auth/core** - Platform-agnostic auth core logic

## Documentation

- [Better Auth Documentation](https://better-auth.com)
- [Convex Better Auth Integration](https://convex-better-auth.netlify.app/)
- [Project Architecture](../../../docs/auth_module_guide.md)

## License

Private - Part of Better Convex Auth monorepo
