# Quickstart Guide: Authentication Module Integration

**Last Updated**: 2025-11-06  
**Estimated Time**: 5 minutes

This guide will help you integrate the authentication module packages into your application in under 5 minutes.

## Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1
- Next.js 16+ (for web) or Expo SDK 51+ (for mobile)
- Convex deployment configured

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Web Application (Next.js)](#web-application-nextjs)
3. [Mobile Application (Expo)](#mobile-application-expo)
4. [Backend Configuration (Convex)](#backend-configuration-convex)
5. [Testing Your Integration](#testing-your-integration)
6. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Step 1: Install Dependencies

All auth packages are workspace packages in the monorepo. Add them to your app's `package.json`:

```json
{
  "dependencies": {
    "@repo/auth-types": "workspace:*",
    "@repo/auth-utils": "workspace:*",
    "@repo/auth-core": "workspace:*",
    "@repo/auth-web": "workspace:*",
    "@repo/auth-ui": "workspace:*"
  }
}
```

Run install:

```bash
pnpm install
```

### Step 2: Environment Variables

Create `.env.local` in your app directory:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=prod:your-deployment-123

# Authentication
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-generated-secret

# OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Generate Better Auth secret**:
```bash
openssl rand -base64 32
```

---

## Web Application (Next.js)

### Step 1: Set Up Auth Provider

Edit `apps/web/layout.tsx`:

```typescript
import { AuthProvider } from "@repo/auth-web/providers";
import type { AuthConfig } from "@repo/auth-types";

const authConfig: AuthConfig = {
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  enableEmailVerification: false, // Configure per your needs
  enablePasswordReset: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider config={authConfig}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 2: Create Login Page

Create `apps/web/(auth)/login/page.tsx`:

```typescript
import { LoginForm } from "@repo/auth-ui/components/login-form";
import { redirect } from "next/navigation";
import { useUser } from "@repo/auth-web/hooks";

export default function LoginPage() {
  const { user } = useUser();
  
  // Redirect if already authenticated
  if (user) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign in to your account</h2>
        </div>
        
        <LoginForm
          onSuccess={() => {
            window.location.href = "/dashboard";
          }}
          onError={(error) => {
            console.error("Login failed:", error);
          }}
        />
        
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Create Signup Page

Create `apps/web/(auth)/signup/page.tsx`:

```typescript
import { SignupForm } from "@repo/auth-ui/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create your account</h2>
        </div>
        
        <SignupForm
          requireName={true}
          onSuccess={() => {
            window.location.href = "/dashboard";
          }}
        />
        
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create Protected Dashboard

Create `apps/web/(app)/dashboard/page.tsx`:

```typescript
"use client";

import { useUser, useAuth } from "@repo/auth-web/hooks";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const { signOut } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    redirect("/login");
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
        
        <div className="mt-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Welcome, {user.name || user.email}!</h2>
          <p className="mt-2 text-gray-600">
            Email: {user.email}
            {user.emailVerified && (
              <span className="ml-2 text-green-600">✓ Verified</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Start Development Server

```bash
cd apps/web
pnpm dev
```

Visit `http://localhost:3000/signup` to test registration!

---

## Mobile Application (Expo)

### Step 1: Install Mobile Dependencies

```json
{
  "dependencies": {
    "@repo/auth-types": "workspace:*",
    "@repo/auth-core": "workspace:*",
    "@repo/auth-native": "workspace:*",
    "@repo/auth-ui": "workspace:*",
    "expo-secure-store": "^13.0.0"
  }
}
```

```bash
pnpm install
```

### Step 2: Set Up Auth Provider

Edit `apps/mobile/_layout.tsx`:

```typescript
import { AuthProvider } from "@repo/auth-native/providers";
import { SecureStorageAdapter } from "@repo/auth-native/storage";
import { Stack } from "expo-router";

const storage = new SecureStorageAdapter();

const authConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_URL!,
  enableEmailVerification: false,
};

export default function RootLayout() {
  return (
    <AuthProvider config={authConfig} storage={storage}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
```

### Step 3: Create Login Screen

Create `apps/mobile/(auth)/login.tsx`:

```typescript
import { View, Text, StyleSheet } from "react-native";
import { LoginForm } from "@repo/auth-ui/components/login-form";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <LoginForm
        onSuccess={() => {
          router.replace("/(app)/home");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
});
```

### Step 4: Create Protected Home Screen

Create `apps/mobile/(app)/home.tsx`:

```typescript
import { View, Text, Button, StyleSheet } from "react-native";
import { useUser, useAuth } from "@repo/auth-native/hooks";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user, isLoading } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  if (!user) {
    router.replace("/(auth)/login");
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user.name || user.email}!</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
});
```

---

## Backend Configuration (Convex)

### Step 1: Install Convex Auth Dependencies

```bash
cd packages/backend
pnpm add @convex-dev/better-auth better-auth
```

### Step 2: Configure Better Auth

Create `packages/backend/convex/auth.ts`:

```typescript
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import type { GenericCtx, DataModel } from "./_generated/dataModel";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: process.env.SITE_URL!,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex()],
  });
};
```

### Step 3: Set Up HTTP Routes

Create `packages/backend/convex/http.ts`:

```typescript
import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register Better Auth routes
authComponent.registerRoutes(http, createAuth);

export default http;
```

### Step 4: Create Auth Queries

Create `packages/backend/convex/users.ts`:

```typescript
import { query, mutation } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

/**
 * Get current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

/**
 * Get user by ID
 */
export const getById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});
```

### Step 5: Deploy Convex Backend

```bash
cd packages/backend
pnpm deploy
```

---

## Testing Your Integration

### Web Testing Checklist

1. **Sign Up**
   - Visit `http://localhost:3000/signup`
   - Enter email, password, and name
   - Submit form
   - Should redirect to dashboard

2. **Sign In**
   - Visit `http://localhost:3000/login`
   - Enter credentials
   - Should redirect to dashboard

3. **Protected Route**
   - Visit `http://localhost:3000/dashboard` while logged out
   - Should redirect to login

4. **Sign Out**
   - Click "Sign Out" button on dashboard
   - Should redirect to login page

### Mobile Testing Checklist

1. **Start Expo**
   ```bash
   cd apps/mobile
   pnpm start
   ```

2. **Test on Simulator**
   - Press `i` for iOS or `a` for Android
   - Navigate to login screen
   - Test sign up/sign in flow

### Backend Testing (Convex Dashboard)

1. Visit Convex Dashboard: `https://dashboard.convex.dev`
2. Open your deployment
3. Check "Data" tab for `users` and `sessions` tables
4. Verify user data appears after signup

---

## Troubleshooting

### Common Issues

#### "Module not found: @repo/auth-web"

**Solution**: Ensure packages are built and linked:
```bash
pnpm install
pnpm build
```

#### "Invalid authentication configuration"

**Solution**: Check environment variables are set:
```bash
echo $NEXT_PUBLIC_SITE_URL
echo $BETTER_AUTH_SECRET
```

#### "Session not persisting"

**Solution**: Check browser localStorage:
1. Open DevTools → Application → Local Storage
2. Look for auth session keys
3. Clear storage and try again

#### "CORS errors in development"

**Solution**: Ensure Next.js and Convex URLs match:
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
    ];
  },
};
```

#### "TypeScript errors in auth packages"

**Solution**: Rebuild packages:
```bash
pnpm build
pnpm typecheck
```

---

## Next Steps

### Add OAuth Providers

See [OAuth Integration Guide](./oauth-integration.md) (coming soon)

### Customize UI Components

See [UI Component Customization](./ui-customization.md) (coming soon)

### Add Email Verification

Edit `authConfig`:
```typescript
const authConfig: AuthConfig = {
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  enableEmailVerification: true, // Enable verification
};
```

Then configure email provider in `packages/backend/convex/auth.ts`:
```typescript
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    // ... other config
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendVerificationEmail: async ({ user, token }) => {
        // Send email with verification link
        await sendEmail({
          to: user.email,
          subject: "Verify your email",
          html: `Click here: ${baseURL}/verify?token=${token}`,
        });
      },
    },
  });
};
```

### Add Two-Factor Authentication

See [2FA Setup Guide](./2fa-setup.md) (coming soon)

### Add Biometric Authentication (Mobile)

See [Biometric Auth Guide](./biometric-auth.md) (coming soon)

---

## Support

- **Documentation**: See `specs/001-auth-packages/` directory
- **Issues**: Create issue in GitHub repository
- **Questions**: Check research.md for architecture details

---

## Performance Targets (from spec)

- ✅ Integration time: < 5 minutes (you're done!)
- ✅ TypeScript autocomplete: Full type safety
- ✅ Build time: < 3 minutes cold cache
- ✅ Production bundle: < 50KB gzipped (minimal auth)

**Congratulations! Your authentication is now set up.** 🎉
