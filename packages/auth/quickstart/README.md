# @auth/quickstart

One-function setup for Better Convex Auth in your Next.js application.

## Installation

```bash
pnpm add @auth/quickstart @auth/web @auth/ui
```

## Quick Start

### 1. Set up authentication in 3 steps

```typescript
// lib/auth/setup.ts
import { setupAuth } from "@auth/quickstart";

export const auth = setupAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
});

export const { 
  AuthProvider, 
  useAuth, 
  useSession, 
  useUser,
  components: { SignInForm, SignUpForm, SessionGuard, SignOutButton }
} = auth;
```

### 2. Wrap your app with the provider

```typescript
// app/layout.tsx
import { AuthProvider } from "@/lib/auth/setup";

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

### 3. Use pre-built components

```typescript
// app/(auth)/login/page.tsx
import { SignInForm } from "@/lib/auth/setup";

export default function LoginPage() {
  return <SignInForm redirectTo="/dashboard" />;
}
```

## Features

- **One-function setup**: Get everything configured in seconds
- **Pre-built UI components**: Sign in, sign up, password reset, and more
- **Type-safe hooks**: Full TypeScript support
- **Session management**: Built-in guards and HOCs
- **Social auth**: GitHub, Google, Apple support
- **Customizable**: Override any component or hook

## API

### `setupAuth(config)`

Main setup function that returns everything you need.

```typescript
interface SetupAuthConfig {
  convexUrl: string;
  baseURL: string;
  storagePrefix?: string;
  expectAuth?: boolean;
}
```

Returns:
- `authClient` - Better Auth client instance
- `AuthProvider` - React provider component
- `useAuth`, `useSession`, `useUser` - Auth hooks
- `components` - All UI components
- `withAuth`, `withSession` - HOCs

## Examples

See the [web app](../../apps/web) for a complete example.

## License

MIT
