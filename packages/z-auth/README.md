# @workspace/auth

**One package to rule them all** - Unified Better Convex Auth for turborepo applications.

## Installation

```bash
pnpm add @workspace/auth
```

That's it! No need to install multiple packages.

## Quick Start

### 1. Create auth setup (one file!)

```typescript
// lib/auth.ts
import { createAuth } from "@workspace/auth/nextjs";

export const auth = createAuth({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
});

// Re-export everything for easy imports
export const {
  AuthProvider,
  useAuth,
  useSession,
  useUser,
  components: { SignInForm, SignUpForm, SessionGuard, SignOutButton },
} = auth;
```

### 2. Setup API routes (one line!)

```typescript
// app/api/auth/[...all]/route.ts
export { GET, POST } from "@workspace/auth/nextjs/handler";
```

### 3. Wrap your app

```typescript
// app/layout.tsx
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

### 4. Use authentication

```typescript
// Any component
import { useUser, SignOutButton } from "@/lib/auth";

export default function Profile() {
  const { user, isPending } = useUser();

  if (isPending) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <SignOutButton />
    </div>
  );
}
```

## What's Included

### Hooks
- `useAuth()` - Full auth state and methods
- `useSession()` - Current session
- `useUser()` - Current user (convenience)
- `useSignIn()` - Sign in methods
- `useSignUp()` - Sign up methods
- `useSignOut()` - Sign out method

### Components

#### Forms
- `SignInForm` - Complete sign in form
- `SignUpForm` - Complete sign up form
- `ForgotPasswordForm` - Password reset request
- `ResetPasswordForm` - Password reset completion
- `UpdateProfileForm` - Update user profile
- `ChangePasswordForm` - Change password

#### Guards
- `SessionGuard` - Protect routes requiring auth
- `RoleGuard` - Protect routes by role
- `EmailVerifiedGuard` - Require email verification

#### Display
- `UserAvatar` - User avatar component
- `UserBadge` - User badge with role
- `UserMenu` - User menu dropdown

#### Actions
- `SignOutButton` - Sign out button
- `SocialAuthButtons` - OAuth provider buttons

#### Utilities
- `OAuthRedirectHandler` - Handle OAuth callbacks
- `PasswordStrengthIndicator` - Password strength meter

### Higher-Order Components
- `withAuth()` - Protect page components
- `withSession()` - Inject session props
- `withEmailVerified()` - Require email verification

### Utils
- `validateClientEnv()` - Validate client env vars
- `validateServerEnv()` - Validate server env vars
- `isOAuthProviderConfigured()` - Check OAuth config
- `isEmailServiceConfigured()` - Check email config

## Environment Variables

```env
# Required
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Exports

```typescript
import { createAuth } from "@workspace/auth/nextjs";          // Next.js adapter
import { GET, POST } from "@workspace/auth/nextjs/handler";   // API handlers
import { validateClientEnv } from "@workspace/auth/utils";    // Utilities
import { createAuthClient } from "@workspace/auth/core";      // Core client
import type { AuthConfig } from "@workspace/auth/types";      // Types
```

## Comparison

### Before (Complex)
```json
{
  "dependencies": {
    "@auth/quickstart": "workspace:*",
    "@auth/web": "workspace:*",
    "@auth/ui": "workspace:*",
    "@auth/types": "workspace:*",
    "@auth/backend": "workspace:*",
    "@workspace/backend": "workspace:*"
  }
}
```

### After (Simple)
```json
{
  "dependencies": {
    "@workspace/auth": "workspace:*"
  }
}
```

## Features

✅ **Single package install** - No more juggling 7+ packages  
✅ **One-file setup** - Everything configured in one place  
✅ **Auto API routes** - One-line export  
✅ **Built-in validation** - Env var checking included  
✅ **Type-safe** - Full TypeScript support  
✅ **Framework adapters** - Next.js, Remix (coming soon)  
✅ **Zero boilerplate** - Minimal configuration  

## License

MIT
