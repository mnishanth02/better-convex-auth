# Recipes & Best Practices

Code examples and patterns for common authentication scenarios with Better Convex Auth.

## Table of Contents

- [Quick Start Setup](#quick-start-setup)
- [Custom Authentication Flow](#custom-authentication-flow)
- [Protected Routes](#protected-routes)
- [Email Verification](#email-verification)
- [Password Reset](#password-reset)
- [User Profile Management](#user-profile-management)
- [Organizations & Multi-Tenancy](#organizations--multi-tenancy)
- [Rate Limiting](#rate-limiting)
- [Custom Validators](#custom-validators)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## Quick Start Setup

### Minimal Configuration

```typescript
// convex/auth.config.ts
import { createClient } from "@convex-dev/better-auth";
import { createConvexAuth } from "@auth/core";

export const authComponent = createClient({
  convexUrl: process.env.CONVEX_URL!,
});

export const auth = createConvexAuth(authComponent, {
  adapter: authComponent.adapter(),
  baseURL: process.env.SITE_URL || "http://localhost:3000",
  emailPassword: { enabled: true },
});
```

### Client Setup

```tsx
// app/providers.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createAuthClient, AuthClientProvider } from "@auth/web";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const authClient = createAuthClient({ baseURL: "/api/auth" });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AuthClientProvider client={authClient}>
        {children}
      </AuthClientProvider>
    </ConvexProvider>
  );
}
```

---

## Custom Authentication Flow

### Custom Sign-In Form

```tsx
"use client";

import { useSignIn } from "@auth/web";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";

export function CustomSignInForm() {
  const { signInEmail, isLoading, error } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInEmail({ email, password });
      // Redirect handled by provider
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}
      
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
```

### Social Authentication Only

```tsx
import { SocialAuthButtons } from "@auth/ui";

export function SocialSignIn() {
  return (
    <div className="space-y-4">
      <h2>Sign in with</h2>
      <SocialAuthButtons
        providers={["google", "github", "apple"]}
        redirectTo="/dashboard"
      />
    </div>
  );
}
```

---

## Protected Routes

### Middleware Protection (Next.js)

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/settings", "/profile"];
const authRoutes = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("better-auth.session_token");

  const isAuthenticated = !!sessionCookie?.value;
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => 
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Client-Side Protection

```tsx
"use client";

import { useSession } from "@auth/web";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
```

### Server Component Protection

```tsx
// app/dashboard/page.tsx
import { auth } from "@/convex/auth.config";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
    </div>
  );
}
```

---

## Email Verification

### Configure Email Service (Resend)

```typescript
// convex/auth.config.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = createConvexAuth(authComponent, {
  // ... other config
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      await resend.emails.send({
        from: "Auth <auth@yourdomain.com>",
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h1>Verify your email</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${url}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 86400, // 24 hours
  },
});
```

### Verification Page

```tsx
// app/verify-email/page.tsx
"use client";

import { useAuth } from "@auth/web";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail({ token })
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    }
  }, [searchParams, verifyEmail]);

  if (status === "loading") {
    return <div>Verifying your email...</div>;
  }

  if (status === "success") {
    return (
      <div>
        <h1>Email Verified!</h1>
        <p>Your email has been successfully verified.</p>
        <a href="/dashboard">Go to Dashboard</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Verification Failed</h1>
      <p>The verification link is invalid or has expired.</p>
      <a href="/resend-verification">Resend Verification Email</a>
    </div>
  );
}
```

---

## Password Reset

### Forgot Password Form

```tsx
"use client";

import { ForgotPasswordForm } from "@auth/ui";

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <ForgotPasswordForm 
        onSuccess={() => {
          // Show success message
          alert("Password reset email sent!");
        }}
      />
    </div>
  );
}
```

### Custom Reset Flow

```typescript
// convex/auth.config.ts
emailVerification: {
  sendVerificationEmail: async ({ user, url, type }) => {
    if (type === "password-reset") {
      await resend.emails.send({
        from: "Auth <auth@yourdomain.com>",
        to: user.email,
        subject: "Reset your password",
        html: `
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${url}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    }
  },
  resetExpiresIn: 3600, // 1 hour
}
```

---

## User Profile Management

### Update Profile

```tsx
"use client";

import { useAuth, useUser } from "@auth/web";
import { useState } from "react";

export function ProfileEditor() {
  const { user, refetch } = useUser();
  const { updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUser({ name });
      await refetch(); // Refresh user data
      alert("Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
```

### Change Password

```tsx
import { ChangePasswordForm } from "@auth/ui";

export function ChangePassword() {
  return (
    <ChangePasswordForm
      onSuccess={() => {
        alert("Password changed successfully!");
      }}
      onError={(error) => {
        alert(`Error: ${error.message}`);
      }}
    />
  );
}
```

---

## Organizations & Multi-Tenancy

### Organization Schema

```typescript
// convex/schema.ts
export default defineSchema({
  // ... auth tables
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.string(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_org", ["organizationId"])
    .index("by_user", ["userId"]),
});
```

### Organization Context

```tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface OrganizationContext {
  organizationId: Id<"organizations"> | null;
  organization: any;
  isLoading: boolean;
}

const OrgContext = createContext<OrganizationContext | undefined>(undefined);

export function OrganizationProvider({
  organizationId,
  children,
}: {
  organizationId: Id<"organizations">;
  children: ReactNode;
}) {
  const organization = useQuery(
    api.organizations.get,
    { id: organizationId }
  );

  return (
    <OrgContext.Provider
      value={{
        organizationId,
        organization,
        isLoading: organization === undefined,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
}
```

---

## Rate Limiting

### Configure Rate Limits

```typescript
// convex/auth.config.ts
export const auth = createConvexAuth(authComponent, {
  // ... other config
  rateLimit: {
    enabled: true,
    window: 60,  // 60 seconds
    max: 10,     // 10 requests per window
    custom: {
      // Stricter limits for specific endpoints
      "/api/auth/signin": { window: 60, max: 5 },
      "/api/auth/signup": { window: 300, max: 3 }, // 3 per 5 min
    },
  },
});
```

### Custom Rate Limiting Logic

```typescript
// convex/rateLimit.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const checkRateLimit = mutation({
  args: {
    key: v.string(),
    maxRequests: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, { key, maxRequests, windowMs }) => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get recent requests
    const requests = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", key))
      .filter((q) => q.gte(q.field("timestamp"), windowStart))
      .collect();

    if (requests.length >= maxRequests) {
      throw new Error("Rate limit exceeded");
    }

    // Record this request
    await ctx.db.insert("rateLimits", {
      key,
      timestamp: now,
    });

    return { allowed: true };
  },
});
```

---

## Custom Validators

### Email Domain Whitelist

```typescript
// @auth/utils/validators.ts
import { z } from "zod";

const allowedDomains = ["company.com", "subsidiary.com"];

export const WhitelistedEmailSchema = z
  .string()
  .email()
  .refine(
    (email) => {
      const domain = email.split("@")[1];
      return allowedDomains.includes(domain);
    },
    { message: "Email must be from an approved domain" }
  );
```

### Strong Password Validation

```typescript
export const StrongPasswordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[a-z]/, "Password must contain lowercase letter")
  .regex(/[0-9]/, "Password must contain number")
  .regex(/[^A-Za-z0-9]/, "Password must contain special character");
```

### Usage in Forms

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StrongPasswordSchema } from "@auth/utils";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: StrongPasswordSchema,
});

export function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  // ... rest of form
}
```

---

## Error Handling

### Global Error Boundary

```tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Log to error reporting service
    console.error("Auth error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Authentication Error</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Typed Error Handling

```typescript
// @auth/types/errors.ts
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("Invalid email or password", "INVALID_CREDENTIALS", 401);
  }
}

export class EmailNotVerifiedError extends AuthError {
  constructor() {
    super("Email not verified", "EMAIL_NOT_VERIFIED", 403);
  }
}
```

---

## Testing

### Test Auth Hooks

```tsx
// __tests__/useAuth.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@auth/web";
import { AuthClientProvider } from "@auth/web";

const wrapper = ({ children }) => (
  <AuthClientProvider client={mockAuthClient}>
    {children}
  </AuthClientProvider>
);

describe("useAuth", () => {
  it("signs in user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signIn.email({
      email: "test@example.com",
      password: "password123",
    });

    await waitFor(() => {
      expect(result.current.session).toBeDefined();
    });
  });
});
```

### E2E Testing

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can sign in", async ({ page }) => {
  await page.goto("/signin");

  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("text=Welcome")).toBeVisible();
});
```

---

## Additional Resources

- [Migration Guide](./migration-from-better-auth.md)
- [Troubleshooting](./troubleshooting.md)
- [Better Auth Docs](https://better-auth.com)
- [Convex Docs](https://docs.convex.dev)
