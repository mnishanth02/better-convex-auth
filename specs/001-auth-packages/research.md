# Authentication Packages Research

Research findings for implementing authentication packages in a monorepo structure with Better Auth and Convex backend.

---

## 1. Better Auth + Convex Integration

### Decision
Use the official **`@convex-dev/better-auth`** package as the primary integration layer between Better Auth and Convex.

### Rationale
- **Official Support**: Convex provides a first-party Better Auth integration package, ensuring compatibility and ongoing maintenance
- **Convex Components Architecture**: Uses Convex's component system for seamless database adapter integration
- **Real-time Capabilities**: Leverages Convex's real-time subscriptions for auth state synchronization
- **Type Safety**: Full TypeScript support with generated types from Convex schema
- **Session Management**: Built-in session storage in Convex database tables managed by the adapter

### Implementation Pattern

#### Architecture Overview
```
Next.js App → Better Auth Client → Proxy Route Handler → Convex Deployment
                                                              ↓
                                                     Better Auth Component
                                                              ↓
                                                     Convex Database
```

#### Key Components

**1. Convex Auth Configuration** (`packages/backend/convex/auth.ts`)
```typescript
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex(), // Required for Convex compatibility
    ],
  });
};
```

**2. HTTP Route Handlers** (`packages/backend/convex/http.ts`)
```typescript
import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();
authComponent.registerRoutes(http, createAuth);
export default http;
```

**3. Client Provider** (`apps/web/components/providers.tsx`)
```typescript
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  expectAuth: true, // Pause queries until authenticated
});

export function ConvexClientProvider({ children }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
```

#### Session Storage Patterns

**Convex Database Tables**:
- `users`: Core user data (email, password hash, etc.)
- `sessions`: Active sessions with tokens and expiration
- `accounts`: OAuth provider accounts linked to users
- `verificationTokens`: Email verification and password reset tokens

**Session Access in Convex Functions**:
```typescript
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

export const updateUserPassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.changePassword({
      body: {
        currentPassword: args.currentPassword,
        newPassword: args.newPassword,
      },
      headers,
    });
  },
});
```

#### Real-time Auth State Sync

**Leveraging Convex Subscriptions**:
```typescript
// Client-side auth state automatically syncs via Convex subscriptions
const { data: session } = useSession();
const user = useQuery(api.auth.getCurrentUser);

// Session updates propagate in real-time to all connected clients
// No polling or manual refresh needed
```

### Alternatives Considered

1. **Native Convex Auth Library**
   - Pros: First-party, deeply integrated
   - Cons: Beta status, fewer features than Better Auth, limited provider support
   - Verdict: Not production-ready for complex auth requirements

2. **Better Auth Kit (@better-auth-kit/convex)**
   - Pros: Community-driven adapter
   - Cons: Third-party maintenance, less documentation, potential version lag
   - Verdict: Less reliable than official Convex integration

3. **Custom Auth Implementation**
   - Pros: Full control
   - Cons: Reinventing the wheel, security risks, maintenance burden
   - Verdict: Not worth the effort when good solutions exist

### Implementation Notes

**Environment Variables Required**:
```bash
# Convex deployment
CONVEX_DEPLOYMENT=dev:adjective-animal-123
NEXT_PUBLIC_CONVEX_URL=https://adjective-animal-123.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://adjective-animal-123.convex.site

# Better Auth
BETTER_AUTH_SECRET=<generated-secret>
SITE_URL=http://localhost:3000

# OAuth providers (example)
GITHUB_CLIENT_ID=<your-client-id>
GITHUB_CLIENT_SECRET=<your-client-secret>
```

**Package Dependencies**:
```json
{
  "dependencies": {
    "better-auth": "1.3.27", // Pinned version for stability
    "convex": "^1.25.0",     // Minimum version required
    "@convex-dev/better-auth": "latest"
  }
}
```

**Proxy Route Setup** (`apps/web/app/api/auth/[...all]/route.ts`):
```typescript
import { nextJsHandler } from "@convex-dev/better-auth/nextjs";
export const { GET, POST } = nextJsHandler();
```

**Server-Side Token Helper**:
```typescript
// For Next.js server actions/components
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { createAuth } from "@/convex/auth";

export const getToken = () => getTokenNextjs(createAuth);
```

**Best Practices**:
- Use Convex components for database adapter (automatic schema management)
- Enable `expectAuth: true` to prevent unauthorized queries
- Implement auth checks at both Convex function and Next.js route levels
- Store sensitive auth configuration in environment variables
- Use Better Auth's built-in CSRF protection
- Implement rate limiting for auth endpoints
- Monitor session expiration and implement refresh token logic

---

## 2. Monorepo Auth Package Patterns

### Decision
Adopt a **modular layered architecture** with clear separation between core logic, platform adapters, UI components, and type definitions.

### Rationale
- **Separation of Concerns**: Each package has a single responsibility
- **Reusability**: Core logic can be shared across web and React Native
- **Maintainability**: Easier to update and test isolated packages
- **Tree-shaking**: Consumers only import what they need
- **Parallel Development**: Teams can work on different packages independently

### Package Structure

```
packages/
├── auth-core/              # Platform-agnostic authentication logic
│   ├── src/
│   │   ├── index.ts        # Main exports
│   │   ├── client.ts       # Auth client abstraction
│   │   ├── session.ts      # Session management
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── auth-web/               # Web-specific auth hooks and components
│   ├── src/
│   │   ├── index.ts
│   │   ├── hooks/          # React hooks (useSession, useAuth)
│   │   └── providers/      # Context providers
│   └── package.json
│
├── auth-native/            # React Native-specific implementations
│   ├── src/
│   │   ├── index.ts
│   │   ├── hooks/
│   │   └── providers/
│   └── package.json
│
├── auth-ui/                # Shared UI components
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── PasswordReset.tsx
│   │   └── index.ts
│   └── package.json
│
├── auth-types/             # Shared TypeScript types
│   ├── src/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── session.ts
│   │   └── errors.ts
│   └── package.json
│
└── auth-utils/             # Platform-agnostic utilities
    ├── src/
    │   ├── index.ts
    │   ├── validation.ts   # Input validation (Zod schemas)
    │   ├── crypto.ts       # Token generation, hashing
    │   └── errors.ts       # Custom error classes
    └── package.json
```

### Dependency Management

**Dependency Graph** (following one-direction flow):
```
apps/web → auth-web → auth-core → auth-types
                    ↘           ↗
                     auth-utils

apps/mobile → auth-native → auth-core → auth-types
                          ↘           ↗
                           auth-utils

           auth-ui → auth-types
```

**Package.json Configuration Pattern**:
```json
{
  "name": "@repo/auth-core",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    },
    "./client": {
      "types": "./src/client.ts",
      "import": "./src/client.ts"
    }
  },
  "dependencies": {
    "@repo/auth-types": "workspace:*",
    "@repo/auth-utils": "workspace:*"
  }
}
```

**Using pnpm Workspace Protocol**:
```json
{
  "dependencies": {
    "@repo/auth-core": "workspace:*",
    "@repo/auth-types": "workspace:*"
  }
}
```

### Avoiding Circular Dependencies

**Rules**:
1. **Never** import from packages at the same layer
2. **Always** flow dependencies downward (app → platform → core → types)
3. **Extract** shared code to lower layers (types/utils)
4. **Use** interfaces for dependency inversion when needed

**Example - Avoiding Circular Import**:
```typescript
// ❌ BAD: auth-web importing from auth-native
import { SecureStorage } from "@repo/auth-native";

// ✅ GOOD: Extract to auth-core with platform adapters
// auth-types/src/storage.ts
export interface IStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

// auth-core/src/client.ts
export class AuthClient {
  constructor(private storage: IStorage) {}
}

// auth-web/src/storage.ts
export class LocalStorageAdapter implements IStorage {
  async get(key: string) {
    return localStorage.getItem(key);
  }
  // ... other methods
}

// auth-native/src/storage.ts
export class SecureStorageAdapter implements IStorage {
  async get(key: string) {
    return SecureStore.getItemAsync(key);
  }
  // ... other methods
}
```

### Public API Surface Design

**Principles**:
1. **Explicit Exports**: Don't use barrel exports with `export *`
2. **Granular Exports**: Use package.json `exports` field for subpath exports
3. **Type-First**: Export types separately from implementations
4. **Versioned Exports**: Plan for future breaking changes

**Example - auth-core/package.json**:
```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    },
    "./client": {
      "types": "./src/client.ts",
      "import": "./src/client.ts"
    },
    "./session": {
      "types": "./src/session.ts",
      "import": "./src/session.ts"
    },
    "./types": {
      "types": "./src/types/index.ts",
      "import": "./src/types/index.ts"
    }
  }
}
```

**Example - Explicit Index Exports**:
```typescript
// auth-core/src/index.ts
export { AuthClient } from "./client";
export { SessionManager } from "./session";
export type { AuthConfig, AuthOptions } from "./types";

// Not recommended:
// export * from "./client";  // Too implicit
```

### Alternatives Considered

1. **Monolithic Auth Package**
   - Pros: Simpler to start, fewer dependencies
   - Cons: Bundle size bloat, tight coupling, harder to maintain
   - Verdict: Doesn't scale for multi-platform support

2. **Feature-Based Packages** (auth-social, auth-email, etc.)
   - Pros: Fine-grained imports
   - Cons: Too many packages, complex dependency graph
   - Verdict: Over-engineered for most use cases

3. **Platform Monoliths** (auth-web-all, auth-native-all)
   - Pros: Simple for consumers
   - Cons: No code sharing between platforms
   - Verdict: Defeats purpose of monorepo

### Implementation Notes

**TypeScript Project References**:
```json
// tsconfig.json (root)
{
  "references": [
    { "path": "./packages/auth-types" },
    { "path": "./packages/auth-utils" },
    { "path": "./packages/auth-core" },
    { "path": "./packages/auth-web" }
  ]
}

// packages/auth-core/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "references": [
    { "path": "../auth-types" },
    { "path": "../auth-utils" }
  ]
}
```

**Turborepo Task Configuration**:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Best Practices**:
- Use `workspace:*` protocol in pnpm for internal dependencies
- Enable TypeScript `composite: true` for project references
- Keep each package focused on single responsibility
- Document public API in README for each package
- Use consistent naming convention (e.g., `@repo/auth-*`)
- Avoid default exports (use named exports)
- Create a dependency diagram in documentation
- Use Turborepo's dependency graph visualization

---

## 3. Cross-Platform Type Sharing

### Decision
Use a **dedicated type-only package** (`@repo/auth-types`) with platform-agnostic types and platform-specific type augmentation when needed.

### Rationale
- **Single Source of Truth**: All shared types in one package prevents drift
- **Zero Runtime Cost**: Type-only imports are stripped at compile time
- **Platform Flexibility**: Allows platform-specific augmentation without breaking core types
- **Better IDE Support**: Centralized types improve autocomplete and IntelliSense
- **Easier Refactoring**: Changes to types propagate across all platforms

### Type Package Structure

```
packages/auth-types/
├── src/
│   ├── index.ts           # Main type exports
│   ├── user.ts            # User-related types
│   ├── session.ts         # Session types
│   ├── auth.ts            # Auth configuration types
│   ├── errors.ts          # Error types
│   ├── api.ts             # API request/response types
│   ├── platform.ts        # Platform abstractions
│   └── augmentations/     # Platform-specific augmentations
│       ├── web.ts
│       └── native.ts
├── package.json
└── tsconfig.json
```

### Core Shared Types

```typescript
// packages/auth-types/src/user.ts
export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  image?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile extends User {
  bio?: string;
  phoneNumber?: string;
}

// packages/auth-types/src/session.ts
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionContext {
  user: User;
  session: Session;
  isAuthenticated: boolean;
}

// packages/auth-types/src/auth.ts
export interface AuthConfig {
  baseURL: string;
  sessionDuration: number;
  enablePasswordReset: boolean;
  enableEmailVerification: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

// packages/auth-types/src/platform.ts
export interface IStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface ICrypto {
  hash(value: string): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
  generateToken(): string;
}
```

### Platform-Specific Type Augmentation

**Web Platform**:
```typescript
// packages/auth-types/src/augmentations/web.ts
import type { User, Session } from "../user";

// Augment with web-specific properties
export interface WebUser extends User {
  browserFingerprint?: string;
}

export interface WebSession extends Session {
  refreshToken?: string;
  csrfToken: string;
}

// Web-specific storage using localStorage
export interface WebStorage extends IStorage {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON<T>(key: string, value: T): Promise<void>;
}
```

**React Native Platform**:
```typescript
// packages/auth-types/src/augmentations/native.ts
import type { User, Session } from "../user";

// Augment with native-specific properties
export interface NativeUser extends User {
  deviceId?: string;
  pushToken?: string;
}

export interface NativeSession extends Session {
  biometricEnabled?: boolean;
  deviceTrusted?: boolean;
}

// Native-specific storage using SecureStore
export interface SecureStorage extends IStorage {
  getSecure(key: string): Promise<string | null>;
  setSecure(key: string, value: string): Promise<void>;
  getBiometric(key: string): Promise<string | null>;
}
```

### Type-Only Imports

**Configuration**:
```json
// packages/auth-types/package.json
{
  "name": "@repo/auth-types",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts"
    },
    "./web": {
      "types": "./src/augmentations/web.ts"
    },
    "./native": {
      "types": "./src/augmentations/native.ts"
    }
  },
  "sideEffects": false
}
```

**Usage in Packages**:
```typescript
// Web package
import type { User, Session } from "@repo/auth-types";
import type { WebUser, WebSession } from "@repo/auth-types/web";

// React Native package
import type { User, Session } from "@repo/auth-types";
import type { NativeUser, NativeSession } from "@repo/auth-types/native";

// Core package (platform-agnostic)
import type { User, Session, IStorage } from "@repo/auth-types";
```

### Runtime Type Validation with Zod

**Bridge Between Static and Runtime**:
```typescript
// packages/auth-types/src/schemas.ts
import { z } from "zod";

// Zod schemas for runtime validation
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  emailVerified: z.boolean(),
  image: z.string().url().nullable().optional(),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
});

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  token: z.string(),
  expiresAt: z.number().int().positive(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
});

// Infer TypeScript types from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type Session = z.infer<typeof SessionSchema>;

// Validation functions
export const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};

export const validateSession = (data: unknown): Session => {
  return SessionSchema.parse(data);
};
```

**Usage in API Boundaries**:
```typescript
// Validate API responses
const response = await fetch("/api/auth/session");
const data = await response.json();
const session = validateSession(data); // Runtime validation + type narrowing
```

### Conditional Types for Platform Detection

```typescript
// packages/auth-types/src/platform.ts
export type Platform = "web" | "native";

export type PlatformUser<P extends Platform> = 
  P extends "web" ? WebUser :
  P extends "native" ? NativeUser :
  User;

export type PlatformSession<P extends Platform> = 
  P extends "web" ? WebSession :
  P extends "native" ? NativeSession :
  Session;

// Usage
export interface AuthClient<P extends Platform = "web"> {
  getUser(): Promise<PlatformUser<P>>;
  getSession(): Promise<PlatformSession<P>>;
}
```

### Alternatives Considered

1. **Duplicated Types per Platform**
   - Pros: Complete isolation, no shared dependencies
   - Cons: Type drift, maintenance nightmare, duplication
   - Verdict: Violates DRY principle

2. **Runtime Type Checking Only (Zod/Yup)**
   - Pros: Single source for validation
   - Cons: Loses static type checking, runtime overhead
   - Verdict: Use both (Zod schemas + inferred types)

3. **Shared Types in Core Package**
   - Pros: Fewer packages
   - Cons: Core package has runtime dependency on type changes
   - Verdict: Type-only package is better for tree-shaking

### Implementation Notes

**TypeScript Configuration**:
```json
// packages/auth-types/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Build Setup**:
```json
// packages/auth-types/package.json
{
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit"
  }
}
```

**Best Practices**:
- Keep types platform-agnostic in core type package
- Use type augmentation for platform-specific additions
- Generate TypeScript types from Zod schemas when possible
- Use `type` imports (`import type {}`) for type-only dependencies
- Document type usage patterns in package README
- Use strict TypeScript configuration (`strict: true`)
- Avoid `any` types (use `unknown` for truly unknown data)
- Use branded types for IDs (`type UserId = string & { __brand: "UserId" }`)

---

## 4. Runtime Validation

### Decision
Use **Zod schemas as the single source of truth** for both TypeScript types and runtime validation across all auth package boundaries.

### Rationale
- **Type Safety**: Zod provides automatic TypeScript type inference from schemas
- **Runtime Safety**: Validates data at package boundaries and API calls
- **Developer Experience**: Excellent error messages with customization support
- **Composability**: Schemas can be composed and extended easily
- **Zero Dependencies**: No additional type generation tools needed
- **Better Auth Compatibility**: Better Auth uses similar validation patterns

### Validation Architecture

```
API Response → Zod Validation → Type-Safe Data → Application
External Input → Zod Validation → Validated Types → Auth Core
User Forms → Zod Validation → Validated Input → Mutations
```

### Schema Organization

```
packages/auth-utils/
├── src/
│   ├── schemas/
│   │   ├── index.ts        # Export all schemas
│   │   ├── user.ts         # User schemas
│   │   ├── session.ts      # Session schemas
│   │   ├── auth.ts         # Auth input schemas
│   │   └── common.ts       # Reusable schema primitives
│   └── validators/
│       ├── index.ts
│       └── custom.ts       # Custom validation functions
└── package.json
```

### Core Schemas

```typescript
// packages/auth-utils/src/schemas/common.ts
import { z } from "zod";

// Reusable primitives
export const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email("Please enter a valid email address")
  .min(1, "Email cannot be empty")
  .max(255, "Email is too long");

export const passwordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  );

export const uuidSchema = z.string().uuid("Invalid ID format");

export const timestampSchema = z.number().int().positive();

// packages/auth-utils/src/schemas/user.ts
import { z } from "zod";
import { emailSchema, uuidSchema, timestampSchema } from "./common";

export const UserSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  name: z.string().nullable().optional(),
  emailVerified: z.boolean(),
  image: z.string().url().nullable().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const UserProfileSchema = UserSchema.extend({
  bio: z.string().max(500).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
});

// Type inference
export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

// packages/auth-utils/src/schemas/auth.ts
import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

export const SignUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(100).optional(),
});

export const SignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const PasswordResetSchema = z.object({
  email: emailSchema,
});

export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

// Type inference
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;

// packages/auth-utils/src/schemas/session.ts
import { z } from "zod";
import { uuidSchema, timestampSchema } from "./common";

export const SessionSchema = z.object({
  id: z.string(),
  userId: uuidSchema,
  token: z.string(),
  expiresAt: timestampSchema,
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
});

export type Session = z.infer<typeof SessionSchema>;
```

### Validation at Package Boundaries

**1. API Response Validation** (auth-core package):
```typescript
// packages/auth-core/src/client.ts
import { UserSchema, SessionSchema } from "@repo/auth-utils/schemas";

export class AuthClient {
  async signIn(input: SignInInput): Promise<Session> {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(input),
    });
    
    const data = await response.json();
    
    // Validate API response
    const result = SessionSchema.safeParse(data);
    
    if (!result.success) {
      throw new AuthError("Invalid session data received", {
        cause: result.error,
      });
    }
    
    return result.data; // Type-safe session
  }

  async getUser(): Promise<User | null> {
    const response = await fetch("/api/auth/user");
    
    if (response.status === 401) {
      return null;
    }
    
    const data = await response.json();
    
    // Runtime validation ensures type safety
    return UserSchema.parse(data);
  }
}
```

**2. Form Input Validation** (auth-web package):
```typescript
// packages/auth-web/src/hooks/use-sign-up.ts
import { SignUpSchema, type SignUpInput } from "@repo/auth-utils/schemas";
import { useAuthClient } from "./use-auth-client";

export function useSignUp() {
  const client = useAuthClient();
  
  const signUp = async (input: unknown) => {
    // Validate form input
    const result = SignUpSchema.safeParse(input);
    
    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten(),
      };
    }
    
    // Type-safe after validation
    const validInput: SignUpInput = result.data;
    
    try {
      await client.signUp(validInput);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };
  
  return { signUp };
}
```

**3. Convex Mutation Validation**:
```typescript
// packages/backend/convex/users.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { PasswordChangeSchema } from "@repo/auth-utils/schemas";

export const changePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
    confirmPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate with Zod for additional business logic
    const result = PasswordChangeSchema.safeParse(args);
    
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }
    
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    
    await auth.api.changePassword({
      body: {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      },
      headers,
    });
  },
});
```

### Custom Error Messages

```typescript
// packages/auth-utils/src/schemas/auth.ts
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string") {
      return { message: "This field must be text" };
    }
  }
  
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.minimum === 8 && issue.type === "string") {
      return { message: "Password is too short. Use at least 8 characters." };
    }
  }
  
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

// Or per-schema custom messages
export const SignUpSchema = z.object({
  email: z.string().email({
    message: "Please check your email address - it doesn't look quite right",
  }),
  password: z.string().min(8, {
    message: "Your password needs to be stronger - at least 8 characters",
  }),
});
```

### Error Handling Utilities

```typescript
// packages/auth-utils/src/validators/errors.ts
import { z } from "zod";

export function formatZodError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });
  
  return formatted;
}

export function getFirstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? "Validation failed";
}

// Usage in UI
const result = SignInSchema.safeParse(formData);
if (!result.success) {
  const fieldErrors = formatZodError(result.error);
  // { email: "Invalid email", password: "Password is required" }
}
```

### Better Auth Integration

```typescript
// packages/backend/convex/auth.ts
import { betterAuth } from "better-auth";
import { SignUpSchema } from "@repo/auth-utils/schemas";

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    // ... other config
    emailAndPassword: {
      enabled: true,
      async signup(data) {
        // Validate signup data with Zod
        const validated = SignUpSchema.parse(data);
        
        // Better Auth handles the rest
        return validated;
      },
    },
  });
};
```

### Alternatives Considered

1. **Yup Validation**
   - Pros: Similar API to Zod, widely used
   - Cons: Less TypeScript-first, weaker type inference
   - Verdict: Zod has better DX for TypeScript projects

2. **Joi Validation**
   - Pros: Mature, feature-rich
   - Cons: Not designed for TypeScript, manual type definitions
   - Verdict: Too much boilerplate for TypeScript

3. **TypeBox**
   - Pros: Fast, JSON Schema-based
   - Cons: Smaller ecosystem, less documentation
   - Verdict: Zod's ecosystem and DX wins

4. **Manual Validation Functions**
   - Pros: No dependencies, full control
   - Cons: Repetitive, error-prone, no type inference
   - Verdict: Reinventing the wheel

### Implementation Notes

**Package Configuration**:
```json
// packages/auth-utils/package.json
{
  "name": "@repo/auth-utils",
  "exports": {
    "./schemas": {
      "types": "./src/schemas/index.ts",
      "import": "./src/schemas/index.ts"
    },
    "./validators": {
      "types": "./src/validators/index.ts",
      "import": "./src/validators/index.ts"
    }
  },
  "dependencies": {
    "zod": "^3.23.0"
  }
}
```

**Best Practices**:
- Always use `.safeParse()` at boundaries, `.parse()` for internal code
- Create reusable schema primitives (email, password, uuid)
- Use `z.infer<>` for type generation, never manual types
- Implement custom error maps for user-friendly messages
- Validate early (at input boundaries) and trust data internally
- Use `.transform()` for data normalization (e.g., trim emails)
- Use `.refine()` and `.superRefine()` for complex validation
- Cache schemas in variables (don't recreate on every validation)
- Test validation schemas separately from business logic
- Document validation rules in schema comments

**Performance Considerations**:
- Zod validation is fast but not free (~1-5ms per validation)
- Cache parsed schemas for repeated use
- Consider lazy validation for large objects
- Use `.strict()` to reject unknown keys
- Profile validation in hot paths (e.g., real-time APIs)

---

## 5. Testing Auth Packages

### Decision
Implement a **layered testing strategy** combining unit tests, contract tests, and integration tests, with clear boundaries and minimal mocking for critical security paths.

### Rationale
- **Test Pyramid**: Most tests are fast unit tests, fewer integration tests
- **Contract Testing**: Ensures package interfaces remain stable
- **Minimal Mocking**: Auth security logic should use real implementations
- **Fast CI**: Unit and contract tests run quickly, integration tests on-demand
- **Confidence**: Integration tests with real Convex/Better Auth catch real issues

### Testing Architecture

```
┌─────────────────────────────────────────┐
│      E2E Tests (Playwright)             │  ← Slow, few tests
│  Full auth flows in real browser        │
├─────────────────────────────────────────┤
│   Integration Tests (Vitest)            │  ← Medium speed, moderate coverage
│  Real Convex + Better Auth instances    │
├─────────────────────────────────────────┤
│   Contract Tests (Vitest)               │  ← Fast, interface validation
│  Package boundary verification          │
├─────────────────────────────────────────┤
│      Unit Tests (Vitest)                │  ← Fast, high coverage
│  Pure functions, components, hooks      │
└─────────────────────────────────────────┘
```

### Test Organization

```
packages/
├── auth-core/
│   ├── src/
│   └── __tests__/
│       ├── unit/
│       │   ├── client.test.ts
│       │   ├── session.test.ts
│       │   └── utils.test.ts
│       ├── contract/
│       │   └── api-contract.test.ts
│       └── integration/
│           └── client-integration.test.ts
│
├── auth-web/
│   ├── src/
│   └── __tests__/
│       ├── unit/
│       │   ├── hooks/
│       │   │   ├── use-session.test.tsx
│       │   │   └── use-auth.test.tsx
│       │   └── providers/
│       │       └── auth-provider.test.tsx
│       └── integration/
│           └── auth-flow.test.tsx
│
└── auth-utils/
    ├── src/
    └── __tests__/
        ├── schemas.test.ts
        └── validators.test.ts
```

### Unit Testing

**Pure Function Tests**:
```typescript
// packages/auth-utils/__tests__/schemas.test.ts
import { describe, it, expect } from "vitest";
import { SignUpSchema, UserSchema } from "../src/schemas";

describe("SignUpSchema", () => {
  it("validates correct signup data", () => {
    const validData = {
      email: "user@example.com",
      password: "SecurePass123",
      name: "John Doe",
    };
    
    const result = SignUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const invalidData = {
      email: "not-an-email",
      password: "SecurePass123",
    };
    
    const result = SignUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors[0].path).toEqual(["email"]);
      expect(result.error.errors[0].message).toContain("valid email");
    }
  });

  it("enforces password requirements", () => {
    const weakPassword = {
      email: "user@example.com",
      password: "weak",
    };
    
    const result = SignUpSchema.safeParse(weakPassword);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors[0].path).toEqual(["password"]);
      expect(result.error.errors[0].message).toContain("8 characters");
    }
  });
});

describe("UserSchema", () => {
  it("validates complete user object", () => {
    const user = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      name: "John Doe",
      emailVerified: true,
      image: "https://example.com/avatar.jpg",
      createdAt: 1672531200000,
      updatedAt: 1672531200000,
    };
    
    expect(() => UserSchema.parse(user)).not.toThrow();
  });

  it("rejects invalid UUID", () => {
    const invalidUser = {
      id: "not-a-uuid",
      email: "user@example.com",
      name: null,
      emailVerified: false,
      createdAt: 1672531200000,
      updatedAt: 1672531200000,
    };
    
    expect(() => UserSchema.parse(invalidUser)).toThrow();
  });
});
```

**React Hook Tests**:
```typescript
// packages/auth-web/__tests__/unit/hooks/use-session.test.tsx
import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSession } from "../../../src/hooks/use-session";
import { AuthProvider } from "../../../src/providers/auth-provider";

// Mock auth client
const mockAuthClient = {
  getSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider client={mockAuthClient}>{children}</AuthProvider>
);

describe("useSession", () => {
  it("returns null session initially", () => {
    mockAuthClient.getSession.mockResolvedValue(null);
    
    const { result } = renderHook(() => useSession(), { wrapper });
    
    expect(result.current.session).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("fetches and returns session", async () => {
    const mockSession = {
      id: "session-1",
      userId: "user-1",
      token: "token-123",
      expiresAt: Date.now() + 3600000,
    };
    
    mockAuthClient.getSession.mockResolvedValue(mockSession);
    
    const { result } = renderHook(() => useSession(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.session).toEqual(mockSession);
  });

  it("handles session fetch error", async () => {
    mockAuthClient.getSession.mockRejectedValue(new Error("Network error"));
    
    const { result } = renderHook(() => useSession(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.error).toBeDefined();
    expect(result.current.session).toBeNull();
  });
});
```

### Contract Testing

**Package Interface Validation**:
```typescript
// packages/auth-core/__tests__/contract/api-contract.test.ts
import { describe, it, expect } from "vitest";
import { AuthClient } from "../../src/client";
import type { SignInInput, SignUpInput, User, Session } from "@repo/auth-types";

describe("AuthClient Contract", () => {
  // Contract: AuthClient must implement these methods
  it("has required public methods", () => {
    const client = new AuthClient({ baseURL: "http://test" });
    
    expect(typeof client.signIn).toBe("function");
    expect(typeof client.signUp).toBe("function");
    expect(typeof client.signOut).toBe("function");
    expect(typeof client.getSession).toBe("function");
    expect(typeof client.getUser).toBe("function");
  });

  // Contract: Method signatures must match types
  it("signIn accepts SignInInput and returns Promise<Session>", async () => {
    const client = new AuthClient({ baseURL: "http://test" });
    
    const input: SignInInput = {
      email: "test@example.com",
      password: "password123",
    };
    
    // Type check - this will fail at compile time if contract breaks
    const result: Promise<Session> = client.signIn(input);
    expect(result).toBeInstanceOf(Promise);
  });

  // Contract: Error types must be consistent
  it("throws AuthError on authentication failure", async () => {
    const client = new AuthClient({ baseURL: "http://invalid" });
    
    await expect(
      client.signIn({
        email: "test@example.com",
        password: "wrong",
      })
    ).rejects.toThrow("AuthError");
  });
});

// Test package exports contract
describe("Package Exports Contract", () => {
  it("exports expected types from @repo/auth-types", () => {
    // This test ensures breaking changes to exports are caught
    const imports = require("@repo/auth-types");
    
    expect(imports).toHaveProperty("User");
    expect(imports).toHaveProperty("Session");
    expect(imports).toHaveProperty("SignInInput");
    expect(imports).toHaveProperty("SignUpInput");
  });

  it("exports expected functions from @repo/auth-utils", () => {
    const imports = require("@repo/auth-utils/schemas");
    
    expect(imports).toHaveProperty("UserSchema");
    expect(imports).toHaveProperty("SessionSchema");
    expect(imports).toHaveProperty("SignInSchema");
    expect(imports).toHaveProperty("SignUpSchema");
  });
});
```

### Integration Testing

**Setup Test Environment**:
```typescript
// packages/auth-core/__tests__/setup.ts
import { beforeAll, afterAll, afterEach } from "vitest";
import { ConvexTestClient } from "convex/testing";
import { api } from "@repo/backend/convex/_generated/api";

let convexClient: ConvexTestClient;

beforeAll(async () => {
  // Start local Convex instance for testing
  convexClient = new ConvexTestClient(process.env.CONVEX_URL_TEST!);
  await convexClient.connect();
});

afterAll(async () => {
  await convexClient.close();
});

afterEach(async () => {
  // Clean up test data
  await convexClient.mutation(api.testing.clearAllUsers);
});

export { convexClient };
```

**Integration Tests with Real Services**:
```typescript
// packages/auth-core/__tests__/integration/auth-flow.test.ts
import { describe, it, expect } from "vitest";
import { convexClient } from "../setup";
import { AuthClient } from "../../src/client";
import { api } from "@repo/backend/convex/_generated/api";

describe("Authentication Flow Integration", () => {
  it("completes full signup and signin flow", async () => {
    const client = new AuthClient({
      baseURL: process.env.TEST_BASE_URL!,
    });

    // 1. Sign up
    const signupData = {
      email: "newuser@example.com",
      password: "SecurePass123",
      name: "New User",
    };

    const session = await client.signUp(signupData);
    expect(session).toBeDefined();
    expect(session.userId).toBeTruthy();

    // 2. Verify user created in Convex
    const user = await convexClient.query(api.users.getByEmail, {
      email: signupData.email,
    });
    expect(user).toBeDefined();
    expect(user?.email).toBe(signupData.email);

    // 3. Sign out
    await client.signOut();

    // 4. Sign in again
    const newSession = await client.signIn({
      email: signupData.email,
      password: signupData.password,
    });
    expect(newSession).toBeDefined();
    expect(newSession.userId).toBe(session.userId);
  });

  it("handles password reset flow", async () => {
    const client = new AuthClient({
      baseURL: process.env.TEST_BASE_URL!,
    });

    // 1. Create user
    const email = "reset@example.com";
    await client.signUp({
      email,
      password: "OldPass123",
    });

    // 2. Request password reset
    await client.requestPasswordReset({ email });

    // 3. Verify reset token created in database
    const tokens = await convexClient.query(api.auth.getResetTokens, {
      email,
    });
    expect(tokens.length).toBeGreaterThan(0);

    // 4. Reset password with token
    const token = tokens[0].token;
    await client.resetPassword({
      token,
      newPassword: "NewPass123",
    });

    // 5. Sign in with new password
    const session = await client.signIn({
      email,
      password: "NewPass123",
    });
    expect(session).toBeDefined();
  });
});
```

### Mocking Strategy

**When to Mock**:
✅ **Mock These**:
- External third-party APIs (GitHub OAuth, email services)
- Network requests in unit tests
- Browser APIs (localStorage, cookies) in unit tests
- Time-dependent functions (Date.now, timers)

❌ **Don't Mock These**:
- Password hashing/verification (use real bcrypt)
- Token generation (use real crypto)
- JWT signature verification (use real libraries)
- Convex queries/mutations in integration tests
- Better Auth core logic

**Mock Examples**:
```typescript
// Good mocking - external service
vi.mock("@octokit/rest", () => ({
  Octokit: vi.fn(() => ({
    users: {
      getAuthenticated: vi.fn().mockResolvedValue({
        data: { id: 123, email: "user@example.com" },
      }),
    },
  })),
}));

// Good mocking - browser API
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock as any;

// Bad mocking - don't mock auth security
// ❌ Don't do this:
vi.mock("bcrypt", () => ({
  hash: vi.fn().mockResolvedValue("fake-hash"),
  compare: vi.fn().mockResolvedValue(true),
}));

// ✅ Do this instead - use real bcrypt in tests
import bcrypt from "bcrypt";
const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);
```

### Test Configuration

**Vitest Config** (monorepo root):
```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.config.*",
        "**/__tests__/**",
      ],
    },
    testMatch: [
      "packages/**/__tests__/unit/**/*.test.ts",
      "packages/**/__tests__/contract/**/*.test.ts",
    ],
  },
});

// vitest.integration.config.ts (for integration tests)
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/integration-setup.ts"],
    testMatch: ["packages/**/__tests__/integration/**/*.test.ts"],
    testTimeout: 30000, // Longer timeout for real API calls
  },
});
```

**Package Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### Alternatives Considered

1. **Jest Instead of Vitest**
   - Pros: More mature, larger ecosystem
   - Cons: Slower, requires more configuration for ESM
   - Verdict: Vitest is faster and better for Vite-based monorepos

2. **Mocking Everything**
   - Pros: Tests run faster
   - Cons: False confidence, misses integration bugs
   - Verdict: Dangerous for auth - use real implementations

3. **Only E2E Tests**
   - Pros: Tests real user flows
   - Cons: Slow, hard to debug, expensive in CI
   - Verdict: Need test pyramid - mostly unit tests

4. **No Contract Tests**
   - Pros: Less test code
   - Cons: Breaking changes to package interfaces go unnoticed
   - Verdict: Contract tests are essential for monorepos

### Implementation Notes

**Best Practices**:
- Run unit tests on every commit (pre-commit hook)
- Run integration tests in CI on PRs
- Run E2E tests nightly or before releases
- Use test coverage to find gaps (aim for 80%+ on critical paths)
- Test error paths, not just happy paths
- Use descriptive test names (`it("rejects invalid email format")`)
- Group related tests with `describe()` blocks
- Use `beforeEach()` for test setup, `afterEach()` for cleanup
- Avoid test interdependence (each test should be isolated)
- Use factories/fixtures for test data generation

**CI Configuration** (GitHub Actions):
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  integration-tests:
    runs-on: ubuntu-latest
    env:
      CONVEX_URL_TEST: ${{ secrets.CONVEX_URL_TEST }}
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:integration
```

**Performance Considerations**:
- Unit tests should run in <1s per package
- Integration tests budget: <30s per package
- Use test sharding in CI for large test suites
- Cache dependencies between test runs
- Run tests in parallel when possible
- Skip slow tests in watch mode during development

---

## Summary & Recommendations

### Recommended Implementation Order

1. **Phase 1 - Foundation** (Week 1)
   - Create `@repo/auth-types` package with core types
   - Set up `@repo/auth-utils` with Zod schemas
   - Configure Better Auth in Convex backend

2. **Phase 2 - Core Logic** (Week 2)
   - Build `@repo/auth-core` with platform-agnostic client
   - Implement session management
   - Write unit tests for validation and core logic

3. **Phase 3 - Platform Adapters** (Week 3)
   - Implement `@repo/auth-web` with React hooks
   - Create storage adapters for web (localStorage)
   - Write contract tests for package boundaries

4. **Phase 4 - UI Components** (Week 4)
   - Build `@repo/auth-ui` components
   - Integrate with web app
   - Add integration tests with real Convex

5. **Phase 5 - React Native** (Future)
   - Create `@repo/auth-native` package
   - Implement SecureStore adapter
   - Reuse core logic and types

### Key Success Factors

- **Documentation**: Each package needs clear README with examples
- **Type Safety**: Never use `any`, always validate at boundaries
- **Testing**: Maintain >80% coverage on critical auth paths
- **Security**: Never mock password hashing or token verification
- **Performance**: Monitor bundle sizes and validation overhead

### Anti-Patterns to Avoid

❌ Circular dependencies between packages  
❌ Mocking security-critical code in tests  
❌ Type-only packages with runtime code  
❌ Duplicating validation logic across packages  
❌ Platform-specific code in core packages  

### Further Reading

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Convex Better Auth Integration](https://convex-better-auth.netlify.app/)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Monorepo Best Practices](https://nx.dev/blog/managing-ts-packages-in-monorepos)
- [Testing Authentication Systems](https://fusionauth.io/blog/to-mock-or-not-mock-auth)
