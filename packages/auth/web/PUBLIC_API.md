# @auth/web - Public API Surface

This document defines the **official public API** for `@auth/web`. Only these exports are guaranteed to remain stable across minor versions.

## Package Exports

### Main Export (`@auth/web`)

All hooks, factories, and HOCs are re-exported from the main entry point:

```typescript
import {
  createAuthClient,
  createAuthProvider,
  useAuth,
  useSession,
  useUser,
  withAuth,
} from "@auth/web";
```

## ⚠️ Import Restrictions

The following imports are **explicitly blocked**:

```typescript
// ❌ BLOCKED - Internal implementation
import { createAuthClient } from "@auth/web/src/client/create-auth-client";
import { useAuth } from "@auth/web/src/hooks/use-auth";
import { AuthClientContext } from "@auth/web/src/context/auth-client-context";
import { internal } from "@auth/web/internal/hooks";

// ✅ ALLOWED - Public API
import { createAuthClient, useAuth } from "@auth/web";
```

## Public API Reference

### Factory Functions

#### `createAuthClient`

Creates a Better Auth client for React applications.

```typescript
function createAuthClient(options: CreateAuthClientOptions): AuthClient;

interface CreateAuthClientOptions {
  baseURL: string;
  convexUrl?: string;
  storagePrefix?: string;
  disableDefaultCache?: boolean;
  fetchOptions?: RequestInit;
}

interface AuthClient {
  signIn: SignInMethods;
  signUp: SignUpMethods;
  signOut: () => Promise<void>;
  session: SessionMethods;
  user: UserMethods;
  // ... Better Auth client methods
}
```

**Usage:**
```typescript
import { createAuthClient } from "@auth/web";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
  storagePrefix: "myapp-auth",
});
```

---

#### `createAuthProvider`

Creates a React provider component for auth context.

```typescript
function createAuthProvider(
  options: CreateAuthProviderOptions
): React.FC<{ children: ReactNode }>;

interface CreateAuthProviderOptions {
  authClient: AuthClient;
  convexClient: ConvexClient;
  expectAuth?: boolean;
  onAuthChange?: (session: Session | null) => void;
}
```

**Usage:**
```typescript
import { createAuthProvider } from "@auth/web";
import { authClient } from "./auth-client";
import { convex } from "./convex-client";

export const AuthProvider = createAuthProvider({
  authClient,
  convexClient: convex,
  expectAuth: false,
});

// In your app
<AuthProvider>
  <App />
</AuthProvider>
```

---

### React Hooks

#### Authentication Hooks

##### `useAuth`

Access the auth client and authentication methods.

```typescript
function useAuth(): {
  client: AuthClient;
  signIn: SignInMethods;
  signUp: SignUpMethods;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};
```

**Usage:**
```typescript
import { useAuth } from "@auth/web";

function LoginButton() {
  const { signIn, isAuthenticated } = useAuth();
  
  if (isAuthenticated) return null;
  
  return (
    <button onClick={() => signIn.email({ 
      email: "user@example.com", 
      password: "password" 
    })}>
      Sign In
    </button>
  );
}
```

---

##### `useSession`

Access current session data with real-time updates.

```typescript
function useSession(): {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};
```

**Usage:**
```typescript
import { useSession } from "@auth/web";

function SessionInfo() {
  const { data: session, status, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not logged in</div>;
  
  return <div>Session expires: {new Date(session.expiresAt)}</div>;
}
```

---

##### `useUser`

Access current user data with real-time updates.

```typescript
function useUser(): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};
```

**Usage:**
```typescript
import { useUser } from "@auth/web";

function UserProfile() {
  const { user, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

#### Action Hooks

##### `useSignIn`

Hook for signing in users.

```typescript
function useSignIn(): {
  signInEmail: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  signInSocial: (provider: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
};
```

**Usage:**
```typescript
import { useSignIn } from "@auth/web";

function SignInForm() {
  const { signInEmail, isLoading, error } = useSignIn();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await signInEmail({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rememberMe: formData.get("rememberMe") === "on",
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error.message}</div>}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

---

##### `useSignUp`

Hook for registering new users.

```typescript
function useSignUp(): {
  signUpEmail: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
};
```

**Usage:**
```typescript
import { useSignUp } from "@auth/web";

function SignUpForm() {
  const { signUpEmail, isLoading, error } = useSignUp();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    await signUpEmail({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    });
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

---

##### `useSignOut`

Hook for signing out users.

```typescript
function useSignOut(): {
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};
```

**Usage:**
```typescript
import { useSignOut } from "@auth/web";

function SignOutButton() {
  const { signOut, isLoading } = useSignOut();
  
  return (
    <button onClick={signOut} disabled={isLoading}>
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
```

---

##### `useAuthClient`

Access the raw auth client instance.

```typescript
function useAuthClient(): AuthClient;
```

**Usage:**
```typescript
import { useAuthClient } from "@auth/web";

function AdvancedAuthComponent() {
  const client = useAuthClient();
  
  const handleMagicLink = async () => {
    await client.signIn.magicLink({ email: "user@example.com" });
  };
  
  return <button onClick={handleMagicLink}>Send Magic Link</button>;
}
```

---

### Higher-Order Components (HOCs)

#### `withAuth`

Requires authentication to render the component.

```typescript
function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    loadingComponent?: React.ComponentType;
  }
): React.FC<P>;
```

**Usage:**
```typescript
import { withAuth } from "@auth/web";

function DashboardPage() {
  return <div>Protected Dashboard</div>;
}

export default withAuth(DashboardPage, {
  redirectTo: "/login",
});
```

---

#### `withSession`

Injects session data as props.

```typescript
function withSession<P extends object>(
  Component: React.ComponentType<P & { session: Session }>
): React.FC<P>;
```

**Usage:**
```typescript
import { withSession } from "@auth/web";
import type { Session } from "@auth/types";

interface Props {
  session: Session;
}

function SessionInfo({ session }: Props) {
  return <div>Expires: {new Date(session.expiresAt).toLocaleString()}</div>;
}

export default withSession(SessionInfo);
```

---

#### `withEmailVerified`

Requires email verification to render the component.

```typescript
function withEmailVerified<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    warningComponent?: React.ComponentType;
  }
): React.FC<P>;
```

**Usage:**
```typescript
import { withEmailVerified } from "@auth/web";

function VerifiedOnlyPage() {
  return <div>This page requires email verification</div>;
}

export default withEmailVerified(VerifiedOnlyPage, {
  redirectTo: "/verify-email",
});
```

---

### Context

#### `AuthClientContext`

React context for auth client (rarely used directly).

```typescript
const AuthClientContext: React.Context<AuthClient | null>;
```

**Note:** Prefer using `useAuth()` hook instead of consuming context directly.

---

## Type Exports

The following types are re-exported:

```typescript
export type {
  User,
  Session,
  AuthClient,
  SignInMethods,
  SignUpMethods,
  SessionMethods,
  UserMethods,
} from "better-auth/react";

export type {
  CreateAuthClientOptions,
  CreateAuthProviderOptions,
} from "./types";
```

---

## Versioning Policy

This package follows [Semantic Versioning 2.0.0](https://semver.org/).

### Stability Guarantees

✅ **Stable** - These exports are guaranteed stable:
- All factory functions
- All React hooks
- All HOCs
- Public context exports

⚠️ **Experimental** - May change without major version bump:
- Hooks/components marked with `@experimental` JSDoc tag
- Internal utilities not listed in this document

❌ **Internal** - Explicitly blocked:
- Anything under `/src/client/*`, `/src/context/*`, `/src/hooks/*`, `/src/providers/*`, `/internal/*`
- Any import paths not listed in this document

### Platform Requirements

- **React**: ≥18.0.0 or ≥19.0.0
- **Next.js**: ≥14.0.0, ≥15.0.0, or ≥16.0.0
- **Convex**: ≥1.28.0

## License

MIT
