# Quick Start Guide - Better Convex Auth

**5-Minute Authentication Setup** ⚡

This guide shows you how to add authentication to your Next.js app using the Better Convex Auth packages.

---

## Prerequisites

✅ Next.js 16+ with App Router  
✅ Convex backend configured  
✅ pnpm installed

---

## Step 1: Install Packages (30 seconds)

Add the auth packages to your `package.json`:

```bash
pnpm add @auth/types@workspace:* @auth/web@workspace:*
```

Or manually in `apps/web/package.json`:

```json
{
  "dependencies": {
    "@auth/types": "workspace:*",
    "@auth/web": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

---

## Step 2: Configure Auth Client (1 minute)

Create `apps/web/lib/auth/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  plugins: [
    convexClient({
      url: process.env.NEXT_PUBLIC_CONVEX_URL!,
    }),
    crossDomainClient(),
  ],
});
```

---

## Step 3: Wrap Your App (30 seconds)

Update `apps/web/components/providers/convex-client-provider.tsx`:

```tsx
"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
```

Add to your `apps/web/app/layout.tsx`:

```tsx
import { Providers } from "@/components/providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Step 4: Use Authentication (2 minutes)

### Get Current User Session

```tsx
"use client";
import { authClient } from "@/lib/auth/auth-client";

export default function Component() {
  const { data: session, isPending } = authClient.useSession();
  
  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;
  
  return <div>Welcome {session.user.name}!</div>;
}
```

### Sign In with Email/Password

```tsx
"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (ctx) => alert(ctx.error?.message),
      }
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Sign Up with Email/Password

```tsx
await authClient.signUp.email(
  { email, password, name },
  {
    onSuccess: () => router.push("/dashboard"),
    onError: (ctx) => alert(ctx.error?.message),
  }
);
```

### Sign Out

```tsx
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => router.push("/login"),
  },
});
```

### Social Authentication (GitHub, Google, etc.)

```tsx
await authClient.signIn.social({
  provider: "github",
  callbackURL: "/dashboard",
});
```

---

## Step 5: Create Protected Routes (1 minute)

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";

export default function ProtectedPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);
  
  if (isPending) return <div>Loading...</div>;
  if (!session) return null; // Will redirect
  
  return <div>Protected content for {session.user.email}</div>;
}
```

---

## Complete Example Pages

### Login Page

See `apps/web/app/(auth)/login/page.tsx` for a complete example with:
- Email/password form
- GitHub OAuth button
- Loading states
- Error handling
- Responsive UI with shadcn/ui

### Signup Page

See `apps/web/app/(auth)/signup/page.tsx` for a complete example with:
- Name, email, password fields
- Password confirmation
- Password strength validation
- GitHub OAuth integration

### Dashboard Page

See `apps/web/app/(app)/dashboard/page.tsx` for a complete example with:
- Protected route logic
- Session information display
- Sign out functionality

---

## Environment Variables

Add to `.env.local`:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Better Auth
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars

# OAuth Providers (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## TypeScript Autocomplete

You get full IntelliSense for:

```typescript
authClient.
  ├── signIn.email()
  ├── signIn.social()
  ├── signUp.email()
  ├── signOut()
  ├── useSession()
  ├── updateUser()
  ├── changeEmail()
  └── changePassword()
```

All methods have complete type definitions and JSDoc documentation!

---

## Available Hooks

| Hook | Purpose | Return Type |
|------|---------|-------------|
| `authClient.useSession()` | Get current session | `{ data, isPending, error }` |
| `authClient.useUser()` | Get current user (convenience) | Same as useSession |

---

## Available Methods

| Method | Purpose |
|--------|---------|
| `authClient.signIn.email()` | Sign in with email/password |
| `authClient.signIn.social()` | Sign in with OAuth provider |
| `authClient.signUp.email()` | Create account with email/password |
| `authClient.signOut()` | Sign out current user |
| `authClient.updateUser()` | Update user profile |
| `authClient.changeEmail()` | Change user email |
| `authClient.changePassword()` | Change user password |

---

## Testing Your Setup

1. **Start Convex backend**:
   ```bash
   pnpm --filter @workspace/backend dev
   ```

2. **Start Next.js dev server**:
   ```bash
   pnpm --filter web dev
   ```

3. **Visit pages**:
   - Homepage: http://localhost:3000
   - Login: http://localhost:3000/login
   - Signup: http://localhost:3000/signup
   - Dashboard: http://localhost:3000/dashboard (redirects if not logged in)

---

## Next Steps

- **Phase 4**: Security boundary enforcement and input validation
- **Phase 5**: Cross-platform support (React Native)
- **Advanced Features**: 2FA, passkeys, magic links, organizations

---

## Documentation

- **@auth/web Package**: See `packages/auth/web/README.md`
- **Better Auth Docs**: https://www.better-auth.com/docs
- **Convex Auth Docs**: https://docs.convex.dev/auth/better-auth

---

## Support

For issues or questions:
- Check `docs/auth_module_guide.md`
- Check `docs/implementation_patterns.md`
- Review example pages in `apps/web/app/(auth)/`

---

**Total Setup Time**: Under 5 minutes ✨  
**TypeScript Support**: Full autocomplete ✅  
**Build Errors**: Zero 🎉
