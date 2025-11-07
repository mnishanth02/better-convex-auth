# Complete Better Auth + Convex Reusable Module Guide

## Executive Summary

This guide shows you how to build a **production-ready, reusable authentication module** in a turborepo that works across **Next.js (web)**, **React Native/Expo (mobile)**, and a **Convex backend**. You'll create an enterprise-grade authentication system that can be imported into any project with minimal configuration.

---

## Architecture Overview

### Technology Stack
- **Turborepo**: Monorepo management
- **Better Auth**: TypeScript authentication framework
- **Convex**: Real-time database + serverless functions
- **Next.js**: Web framework
- **Expo/React Native**: Mobile framework
- **Resend**: Email service
- **Google/Apple OAuth**: Social authentication
- **reCAPTCHA v3**: Bot protection
- **WebAuthn**: Passkeys (passwordless)

### Core Authentication Features
✅ Email/Password with verification
✅ Social OAuth (Google, Apple, GitHub, Discord, Twitter)
✅ Magic Links (passwordless via email)
✅ Email OTP (one-time passwords)
✅ 2FA/MFA (TOTP)
✅ Passkeys (WebAuthn/FIDO2)
✅ Phone number auth (with SMS)
✅ Anonymous/Guest login
✅ Organizations (multi-tenant)
✅ Role-based access control
✅ Session management
✅ Rate limiting
✅ Email verification
✅ Password reset
✅ Account recovery

---

## Directory Structure

```
project-root/
├── apps/
│   ├── web/                          # Next.js web application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── sign-in/
│   │   │   │   │   ├── sign-up/
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   └── verify-email/
│   │   │   │   └── dashboard/
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   ├── mobile/                       # Expo/React Native app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── auth/
│   │   │   │   └── home/
│   │   │   ├── navigation/
│   │   │   └── lib/
│   │   └── package.json
│   └── admin-dashboard/              # Optional: Admin panel
│
├── packages/
│   ├── @auth/
│   │   ├── core/                    # Better Auth + Convex integration
│   │   │   ├── src/
│   │   │   │   ├── auth.ts         # Main auth instance
│   │   │   │   ├── client.ts       # Client instance
│   │   │   │   ├── config.ts       # Configuration types
│   │   │   │   ├── handlers/
│   │   │   │   ├── middleware/
│   │   │   │   └── utils/
│   │   │   └── package.json
│   │   │
│   │   ├── ui/                      # Auth UI components
│   │   │   ├── src/
│   │   │   │   ├── components/
│   │   │   │   │   ├── SignInForm.tsx
│   │   │   │   │   ├── SignUpForm.tsx
│   │   │   │   │   ├── VerifyEmail.tsx
│   │   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   │   ├── ResetPassword.tsx
│   │   │   │   │   ├── TwoFactor.tsx
│   │   │   │   │   ├── OrgSwitcher.tsx
│   │   │   │   │   └── AuthProvider.tsx
│   │   │   │   ├── hooks/
│   │   │   │   └── styles/
│   │   │   └── package.json
│   │   │
│   │   ├── hooks/                   # React hooks
│   │   │   ├── src/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useSignIn.ts
│   │   │   │   ├── useSignUp.ts
│   │   │   │   ├── useOAuth.ts
│   │   │   │   ├── useTwoFactor.ts
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useOrganization.ts
│   │   │   │   ├── useSession.ts
│   │   │   │   └── index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── types/                   # Shared TypeScript types
│   │   │   ├── src/
│   │   │   │   ├── user.ts
│   │   │   │   ├── session.ts
│   │   │   │   ├── organization.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── index.ts
│   │   │   └── package.json
│   │   │
│   │   └── utils/                   # Utility functions
│   │       ├── src/
│   │       │   ├── validators.ts    # Email, password, phone validation
│   │       │   ├── encryption.ts
│   │       │   ├── token-gen.ts
│   │       │   ├── rate-limit.ts
│   │       │   ├── email-templates.ts
│   │       │   └── index.ts
│   │       └── package.json
│   │
│   └── @shared/
│       ├── config/
│       │   ├── src/
│       │   │   ├── auth-config.ts
│       │   │   ├── oauth-config.ts
│       │   │   ├── email-config.ts
│       │   │   └── index.ts
│       │   └── package.json
│       └── ui/
│           └── ... (shared UI components)
│
├── convex/
│   ├── auth.config.ts               # Better Auth config
│   ├── auth.ts                      # Better Auth instance
│   ├── http.ts                      # HTTP handlers
│   ├── schema.ts                    # Database schema
│   ├── functions/
│   │   ├── auth/
│   │   │   ├── getUser.ts
│   │   │   ├── getSession.ts
│   │   │   ├── updateProfile.ts
│   │   │   └── deleteAccount.ts
│   │   ├── organization/
│   │   │   ├── createOrg.ts
│   │   │   ├── addMember.ts
│   │   │   ├── updateRole.ts
│   │   │   └── leaveOrg.ts
│   │   ├── email/
│   │   │   ├── sendVerification.ts
│   │   │   ├── sendPasswordReset.ts
│   │   │   └── sendOTP.ts
│   │   └── rate-limit.ts
│   ├── middleware/
│   │   ├── auth-middleware.ts
│   │   └── rate-limit-middleware.ts
│   └── db.ts
│
├── turbo.json                       # Turborepo config
├── package.json                     # Root package.json
├── pnpm-workspace.yaml             # PNPM workspace config
└── .env.local                      # Environment variables
```

---

## Step 1: Initialize the Turborepo Project

### 1.1 Create the Turborepo Structure

```bash
npx create-turbo@latest auth-system
cd auth-system

# Create the folders
mkdir -p apps/{web,mobile} packages/@auth/{core,ui,hooks,types,utils} packages/@shared/{config,ui}
```

### 1.2 Configure pnpm Workspaces

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'apps/*'
  - 'packages/**'
  - 'convex'
```

### 1.3 Root package.json

**package.json:**
```json
{
  "name": "@company/auth-system",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@8.0.0",
  "workspaces": [
    "apps/*",
    "packages/**",
    "convex"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "db:migrate": "convex dev"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "turbo": "^1.10.0"
  }
}
```

### 1.4 Configure Convex (Root Level)

```bash
npm install -g convex-dev
npx convex init
```

**convex.json:**
```json
{
  "authorizationHeader": "Authorization",
  "functions": ["convex/*.ts"]
}
```

---

## Step 2: Build the Core Auth Package (@auth/core)

This is the heart of your system - it integrates Better Auth with Convex.

### 2.1 packages/@auth/core/package.json

```json
{
  "name": "@auth/core",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./server": "./dist/server.js",
    "./client": "./dist/client.js",
    "./config": "./dist/config.js"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "better-auth": "^1.2.0",
    "convex": "^1.25.0",
    "@auth/types": "workspace:*",
    "@auth/utils": "workspace:*",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 2.2 packages/@auth/core/src/config.ts

```typescript
import { z } from "zod";

export const AuthConfigSchema = z.object({
  // Email & Password
  emailPassword: z.object({
    enabled: z.boolean().default(true),
    minPasswordLength: z.number().default(8),
    maxPasswordLength: z.number().default(128),
    requireEmailVerification: z.boolean().default(true),
    autoSignIn: z.boolean().default(true),
  }).optional(),

  // Email Verification
  emailVerification: z.object({
    sendOnSignUp: z.boolean().default(true),
    autoSignInAfterVerification: z.boolean().default(true),
  }).optional(),

  // OAuth Providers
  socialProviders: z.object({
    google: z.object({
      clientId: z.string(),
      clientSecret: z.string(),
      redirectURI: z.string().optional(),
    }).optional(),
    github: z.object({
      clientId: z.string(),
      clientSecret: z.string(),
      redirectURI: z.string().optional(),
    }).optional(),
    apple: z.object({
      clientId: z.string(),
      clientSecret: z.string(),
      redirectURI: z.string().optional(),
    }).optional(),
    discord: z.object({
      clientId: z.string(),
      clientSecret: z.string(),
      redirectURI: z.string().optional(),
    }).optional(),
  }).optional(),

  // 2FA
  twoFactor: z.object({
    enabled: z.boolean().default(false),
    otpOptions: z.object({
      sendOTP: z.function().optional(),
    }).optional(),
  }).optional(),

  // Magic Link
  magicLink: z.object({
    enabled: z.boolean().default(false),
  }).optional(),

  // Passkeys
  passkey: z.object({
    enabled: z.boolean().default(false),
  }).optional(),

  // Rate Limiting
  rateLimit: z.object({
    enabled: z.boolean().default(true),
    maxRequestsPerMinute: z.number().default(60),
    windowMs: z.number().default(60000),
  }).optional(),

  // Email Service
  email: z.object({
    provider: z.enum(["resend", "sendgrid", "nodemailer"]),
    apiKey: z.string(),
    fromEmail: z.string().email(),
    fromName: z.string().default("Auth System"),
  }).optional(),

  // Organization
  organization: z.object({
    enabled: z.boolean().default(false),
  }).optional(),

  // Security
  security: z.object({
    useSecureCookies: z.boolean().default(false),
    sessionExpiryInDays: z.number().default(30),
    refreshTokenExpiryInDays: z.number().default(60),
  }).optional(),
});

export type AuthConfig = z.infer<typeof AuthConfigSchema>;
```

### 2.3 packages/@auth/core/src/auth.ts

```typescript
import { betterAuth } from "better-auth";
import { organization, twoFactor, passkey, magicLink } from "better-auth/plugins";
import { ConvexAdapter } from "better-auth/adapters/convex";
import type { AuthConfig } from "./config";
import { resendEmailProvider } from "./providers/resend";

export function createAuthInstance(
  config: AuthConfig,
  convexUrl: string,
  convexApiKey: string
) {
  const plugins = [];

  if (config.organization?.enabled) {
    plugins.push(organization());
  }

  if (config.twoFactor?.enabled) {
    plugins.push(
      twoFactor({
        otpOptions: config.twoFactor?.otpOptions,
      })
    );
  }

  if (config.passkey?.enabled) {
    plugins.push(passkey());
  }

  if (config.magicLink?.enabled) {
    plugins.push(
      magicLink({
        sendMagicLinkEmail: resendEmailProvider(config.email),
      })
    );
  }

  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    appName: "Auth System",
    
    // Convex Database Adapter
    database: new ConvexAdapter({
      url: convexUrl,
      apiKey: convexApiKey,
    }),

    // Email & Password
    emailAndPassword: config.emailPassword?.enabled
      ? {
          enabled: true,
          minPasswordLength: config.emailPassword.minPasswordLength,
          maxPasswordLength: config.emailPassword.maxPasswordLength,
          requireEmailVerification: config.emailPassword.requireEmailVerification,
          autoSignIn: config.emailPassword.autoSignIn,
        }
      : undefined,

    // Email Verification
    emailVerification: config.emailVerification?.enabled !== false
      ? {
          sendOnSignUp: config.emailVerification?.sendOnSignUp,
          autoSignInAfterVerification:
            config.emailVerification?.autoSignInAfterVerification,
          sendVerificationEmail: resendEmailProvider(config.email),
        }
      : undefined,

    // Social Providers
    socialProviders: {
      google:
        config.socialProviders?.google &&
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET
          ? {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }
          : undefined,
      github:
        config.socialProviders?.github &&
        process.env.GITHUB_CLIENT_ID &&
        process.env.GITHUB_CLIENT_SECRET
          ? {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
            }
          : undefined,
      apple:
        config.socialProviders?.apple &&
        process.env.APPLE_CLIENT_ID &&
        process.env.APPLE_CLIENT_SECRET
          ? {
              clientId: process.env.APPLE_CLIENT_ID,
              clientSecret: process.env.APPLE_CLIENT_SECRET,
            }
          : undefined,
      discord:
        config.socialProviders?.discord &&
        process.env.DISCORD_CLIENT_ID &&
        process.env.DISCORD_CLIENT_SECRET
          ? {
              clientId: process.env.DISCORD_CLIENT_ID,
              clientSecret: process.env.DISCORD_CLIENT_SECRET,
            }
          : undefined,
    },

    // Cookies
    session: {
      expiresIn: (config.security?.sessionExpiryInDays || 30) * 24 * 60 * 60,
      updateAgeUntil:
        (config.security?.sessionExpiryInDays || 30) * 24 * 60 * 60 * 0.5,
      cookie: {
        httpOnly: config.security?.useSecureCookies,
        secure: config.security?.useSecureCookies,
        sameSite: "lax",
      },
    },

    // Plugins
    plugins,

    // Advanced options
    rateLimit: {
      enabled: config.rateLimit?.enabled,
      window: config.rateLimit?.windowMs,
      max: config.rateLimit?.maxRequestsPerMinute,
    },
  });
}

export type Auth = ReturnType<typeof createAuthInstance>;
```

### 2.4 packages/@auth/core/src/client.ts

```typescript
import { createAuthClient } from "better-auth/client";
import {
  organization,
  twoFactorClient,
  passkeyClient,
  magicLinkClient,
} from "better-auth/plugins";
import type { Auth } from "./auth";

export function createClientAuthInstance(
  baseURL: string,
  enabledPlugins: {
    organization?: boolean;
    twoFactor?: boolean;
    passkey?: boolean;
    magicLink?: boolean;
  } = {}
) {
  const plugins = [];

  if (enabledPlugins.organization) {
    plugins.push(organizationClient());
  }

  if (enabledPlugins.twoFactor) {
    plugins.push(twoFactorClient());
  }

  if (enabledPlugins.passkey) {
    plugins.push(passkeyClient());
  }

  if (enabledPlugins.magicLink) {
    plugins.push(magicLinkClient());
  }

  return createAuthClient({
    baseURL,
    plugins,
  });
}

export type AuthClient = ReturnType<typeof createClientAuthInstance>;
```

### 2.5 packages/@auth/core/src/providers/resend.ts

```typescript
import type { AuthConfig } from "../config";

export function resendEmailProvider(emailConfig?: AuthConfig["email"]) {
  return async (params: {
    user: { email: string; name?: string };
    url: string;
    token?: string;
  }) => {
    if (!emailConfig || emailConfig.provider !== "resend") {
      throw new Error("Resend not configured");
    }

    const { Resend } = await import("resend");
    const resend = new Resend(emailConfig.apiKey);

    const result = await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      to: params.user.email,
      subject: "Verify your email",
      html: `
        <p>Click the link below to verify your email:</p>
        <a href="${params.url}">Verify Email</a>
      `,
    });

    if (result.error) {
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  };
}
```

---

## Step 3: Build UI Components Package (@auth/ui)

### 3.1 packages/@auth/ui/src/components/SignInForm.tsx

```typescript
"use client";

import { useState } from "react";
import { useAuth } from "@auth/hooks";
import type { AuthConfig } from "@auth/core/config";

interface SignInFormProps {
  config: AuthConfig;
  onSuccess?: () => void;
  redirectUrl?: string;
}

export function SignInForm({ config, onSuccess, redirectUrl }: SignInFormProps) {
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (config.emailPassword?.enabled) {
        await signIn("email", {
          email,
          password,
        });

        if (onSuccess) onSuccess();
        if (redirectUrl) window.location.href = redirectUrl;
      }
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      {config.socialProviders?.google && (
        <GoogleOAuthButton config={config} />
      )}
    </form>
  );
}

// OAuth button components would go here...
```

### 3.2 packages/@auth/ui/package.json

```json
{
  "name": "@auth/ui",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    "./components": "./dist/components/index.js",
    "./hooks": "./dist/hooks/index.js"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@auth/core": "workspace:*",
    "@auth/hooks": "workspace:*",
    "@auth/types": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

---

## Step 4: Setup Convex Backend

### 4.1 convex/schema.ts

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User table (Better Auth manages this)
  users: defineTable({
    id: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_id", ["id"]),

  // Session table (Better Auth manages this)
  sessions: defineTable({
    id: v.string(),
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_token", ["token"]),

  // Organization table
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    ownerId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"]),

  // Organization Members
  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member")
    ),
    joinedAt: v.number(),
  })
    .index("by_org", ["organizationId"])
    .index("by_user", ["userId"]),

  // Two-Factor table
  twoFactorMethods: defineTable({
    userId: v.string(),
    method: v.union(v.literal("totp"), v.literal("email")),
    enabled: v.boolean(),
    verifiedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
```

### 4.2 convex/auth.config.ts

```typescript
import { getEnvOrThrow } from "convex/server";
import { password } from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { organization, twoFactor, passkey } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: getEnvOrThrow("BETTER_AUTH_URL"),
  secret: getEnvOrThrow("BETTER_AUTH_SECRET"),
  appName: "Auth System",

  plugins: [
    organization(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          // Send OTP via Resend
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getEnvOrThrow("RESEND_API_KEY")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "auth@example.com",
              to: user.email,
              subject: "Your OTP",
              html: `Your OTP is: ${otp}`,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send OTP");
          }
        },
      },
    }),
    passkey(),
  ],

  rateLimit: {
    enabled: true,
    window: 60000,
    max: 100,
  },

  socialProviders: {
    google: {
      clientId: getEnvOrThrow("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvOrThrow("GOOGLE_CLIENT_SECRET"),
    },
    github: {
      clientId: getEnvOrThrow("GITHUB_CLIENT_ID"),
      clientSecret: getEnvOrThrow("GITHUB_CLIENT_SECRET"),
    },
    apple: {
      clientId: getEnvOrThrow("APPLE_CLIENT_ID"),
      clientSecret: getEnvOrThrow("APPLE_CLIENT_SECRET"),
      teamId: getEnvOrThrow("APPLE_TEAM_ID"),
      keyId: getEnvOrThrow("APPLE_KEY_ID"),
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getEnvOrThrow("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "auth@example.com",
          to: user.email,
          subject: "Verify your email",
          html: `Click here to verify: ${url}`,
        }),
      });
    },
  },
});
```

### 4.3 convex/http.ts

```typescript
import { httpRouter } from "convex/server";
import { auth } from "./auth.config";

const http = httpRouter();

// Mount Better Auth routes
http.route({
  path: "/auth",
  method: "GET",
  handler: auth.handler,
});

http.route({
  path: "/auth",
  method: "POST",
  handler: auth.handler,
});

export default http;
```

---

## Step 5: Setup Next.js Web App

### 5.1 apps/web/app/auth-provider.tsx

```typescript
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export function AuthProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

### 5.2 apps/web/app/layout.tsx

```typescript
import { AuthProvider } from "./auth-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 5.3 apps/web/app/(auth)/sign-in/page.tsx

```typescript
"use client";

import { SignInForm } from "@auth/ui";
import { authConfig } from "@/config/auth";

export default function SignInPage() {
  return <SignInForm config={authConfig} redirectUrl="/dashboard" />;
}
```

---

## Step 6: Setup React Native Mobile App

### 6.1 apps/mobile/src/navigation/AuthStack.tsx

```typescript
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
```

### 6.2 apps/mobile/src/screens/auth/SignInScreen.tsx

```typescript
import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useAuth } from "@auth/hooks";
import { authConfig } from "@/config/auth";

export default function SignInScreen({ navigation }: any) {
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      if (authConfig.emailPassword?.enabled) {
        await signIn("email", { email, password });
      }
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-3 rounded mb-4"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 p-3 rounded mb-4"
      />

      {error && <Text className="text-red-600 mb-4">{error}</Text>}

      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        className="bg-blue-600 p-3 rounded"
      >
        <Text className="text-white text-center font-semibold">
          {isLoading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        className="mt-4"
      >
        <Text className="text-center text-blue-600">
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Step 7: Environment Configuration

### 7.1 .env.local

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud
CONVEX_DEPLOYMENT=prod

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth - Apple
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id

# Email Service - Resend
RESEND_API_KEY=your-resend-api-key

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Step 8: Testing & Deployment

### 8.1 Development

```bash
# Terminal 1: Convex
npx convex dev

# Terminal 2: Turborepo
pnpm dev
```

### 8.2 Build

```bash
turbo run build
```

### 8.3 Deployment

**Next.js Web:**
```bash
vercel deploy apps/web
```

**Expo Mobile:**
```bash
eas build
eas submit
```

**Convex:**
```bash
convex deploy
```

---

## Best Practices & Recommendations

### 1. **Security**
- ✅ Always use HTTPS in production
- ✅ Store secrets in environment variables
- ✅ Use secure cookies (httpOnly, sameSite)
- ✅ Implement rate limiting
- ✅ Add CSRF protection
- ✅ Validate all user input on server-side

### 2. **Performance**
- ✅ Cache authentication tokens locally
- ✅ Use session tokens for stateless auth
- ✅ Implement token refresh logic
- ✅ Use Convex subscriptions for real-time updates

### 3. **User Experience**
- ✅ Implement graceful error handling
- ✅ Show clear, actionable error messages
- ✅ Implement smooth transitions between auth states
- ✅ Support "remember me" functionality
- ✅ Implement social login buttons prominently

### 4. **Maintainability**
- ✅ Keep auth logic centralized in packages
- ✅ Document configuration options
- ✅ Write unit tests for auth functions
- ✅ Create clear separation of concerns
- ✅ Version your auth packages for breaking changes

### 5. **Scalability**
- ✅ Make the auth module configurable
- ✅ Support multiple identity providers
- ✅ Design for multi-tenancy (organizations)
- ✅ Allow for custom extensions via plugins
- ✅ Monitor and log auth events

---

## Common Features Implementation

### SMS/Phone Authentication

Add to convex/auth.config.ts:
```typescript
import { sms } from "better-auth/plugins";

plugins: [
  sms({
    sendSMS: async ({ phone, code }) => {
      // Integrate with Twilio, SNS, or similar
    },
  }),
]
```

### Email OTP

```typescript
import { emailOTP } from "better-auth/plugins";

plugins: [
  emailOTP(),
]
```

### Magic Links

```typescript
import { magicLink } from "better-auth/plugins";

plugins: [
  magicLink(),
]
```

### Anonymous/Guest Login

```typescript
import { anonymous } from "better-auth/plugins";

plugins: [
  anonymous(),
]
```

---

## Troubleshooting

### Issue: "Convex is not configured"
**Solution**: Make sure `convex/auth.config.ts` exists and Better Auth is properly initialized.

### Issue: "Email verification not working"
**Solution**: Check Resend API key and ensure email is properly configured in auth.config.ts.

### Issue: "OAuth redirect failing"
**Solution**: Verify redirect URIs match exactly in OAuth provider settings.

### Issue: "Session not persisting in mobile"
**Solution**: Use secure storage (SecureStore in Expo) for tokens.

---

## What's Next?

1. **Add Admin Dashboard** - Manage users, organizations, roles
2. **Implement Audit Logs** - Track authentication events
3. **Add Email Templates** - Beautiful, branded verification emails
4. **Setup Monitoring** - Track auth failures and anomalies
5. **Create Migration Guides** - Help users set up in their projects
6. **Publish to NPM** - Make your packages publicly available
7. **Add E2E Tests** - Test full authentication flows
8. **Create Documentation Site** - Comprehensive guides and API docs

---

## Resources

- [Better Auth Documentation](https://www.better-auth.com)
- [Convex Documentation](https://docs.convex.dev)
- [Turborepo Documentation](https://turbo.build)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [React Native Auth Best Practices](https://reactnative.dev/docs/security)

---

This guide provides a solid foundation for building an enterprise-grade, reusable authentication system. Remember to adapt it to your specific needs and always prioritize security!