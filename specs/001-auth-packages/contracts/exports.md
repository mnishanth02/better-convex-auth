# Package Exports Documentation

**Last Updated**: 2025-11-06

This document defines what each authentication package exports and guarantees to consuming applications.

## Package: `@repo/auth-types`

**Version**: `workspace:*`  
**Purpose**: Platform-agnostic TypeScript type definitions

### Public Exports

```json
{
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
  }
}
```

### Exported Types

```typescript
// From "."
export type { User, UserProfile } from "./user";
export type { Session, SessionContext } from "./session";
export type { Account } from "./account";
export type { VerificationToken } from "./verification";
export type { SignUpInput, SignInInput, PasswordResetInput, PasswordChangeInput } from "./auth";
export type { AuthConfig } from "./config";
export type { IStorage, ICrypto } from "./platform";
export { AuthError, AuthErrorCode } from "./errors";

// From "./web"
export type { WebUser, WebSession, WebStorage } from "./augmentations/web";

// From "./native"
export type { NativeUser, NativeSession, SecureStorage } from "./augmentations/native";
```

### Compatibility

- **TypeScript**: `>=5.9.0`
- **Runtime**: None (type-only package)
- **Platforms**: Web, React Native, Node.js

---

## Package: `@repo/auth-utils`

**Version**: `workspace:*`  
**Purpose**: Validation schemas and utility functions

### Public Exports

```json
{
  "exports": {
    "./schemas": {
      "types": "./src/schemas/index.ts",
      "import": "./src/schemas/index.ts"
    },
    "./validators": {
      "types": "./src/validators/index.ts",
      "import": "./src/validators/index.ts"
    }
  }
}
```

### Exported Schemas

```typescript
// From "./schemas"
export {
  // Primitive schemas
  emailSchema,
  passwordSchema,
  uuidSchema,
  timestampSchema,
  urlSchema,
  
  // Entity schemas
  UserSchema,
  UserProfileSchema,
  SessionSchema,
  SessionContextSchema,
  AccountSchema,
  VerificationTokenSchema,
  
  // Input schemas
  SignUpSchema,
  SignInSchema,
  PasswordResetSchema,
  PasswordChangeSchema,
  AuthConfigSchema,
  
  // Inferred types
  type User,
  type UserProfile,
  type Session,
  type SessionContext,
  type SignUpInput,
  type SignInInput,
  type PasswordResetInput,
  type PasswordChangeInput,
  type AuthConfig,
} from "./schemas";
```

### Exported Validators

```typescript
// From "./validators"
export {
  validateEmail,
  validatePassword,
  formatZodError,
  getFirstError,
  validateAndParse,
  customAuthErrorMap,
} from "./validators";
```

### Dependencies

- **Required**: `zod@^3.23.0`
- **Peer**: `@repo/auth-types@workspace:*`

### Compatibility

- **TypeScript**: `>=5.9.0`
- **Runtime**: Node.js >=20, Browser (ES2022+)
- **Platforms**: Web, React Native, Node.js

---

## Package: `@repo/auth-core`

**Version**: `workspace:*`  
**Purpose**: Platform-agnostic authentication client and logic

### Public Exports

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
    }
  }
}
```

### Exported Classes and Functions

```typescript
// From "."
export { AuthClient } from "./client";
export { SessionManager } from "./session";
export type { IAuthClient } from "./client";
export type { AuthConfig } from "@repo/auth-types";

// From "./client"
export { AuthClient } from "./client";
export type { IAuthClient, AuthClientOptions } from "./client";

// From "./session"
export { SessionManager } from "./session";
export type { SessionStorage } from "./session";
```

### AuthClient API

```typescript
class AuthClient implements IAuthClient {
  constructor(options: AuthClientOptions);
  
  signUp(input: SignUpInput): Promise<Session>;
  signIn(input: SignInInput): Promise<Session>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  getUser(): Promise<User | null>;
  requestPasswordReset(input: PasswordResetInput): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(input: PasswordChangeInput): Promise<void>;
}
```

### Dependencies

- **Required**: 
  - `@repo/auth-types@workspace:*`
  - `@repo/auth-utils@workspace:*`
- **Peer**: None

### Compatibility

- **TypeScript**: `>=5.9.0`
- **Runtime**: Node.js >=20, Browser (ES2022+)
- **Platforms**: Web, React Native, Node.js

---

## Package: `@repo/auth-web`

**Version**: `workspace:*`  
**Purpose**: React hooks and providers for web applications

### Public Exports

```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    },
    "./hooks": {
      "types": "./src/hooks/index.ts",
      "import": "./src/hooks/index.ts"
    },
    "./providers": {
      "types": "./src/providers/index.ts",
      "import": "./src/providers/index.ts"
    }
  }
}
```

### Exported Hooks

```typescript
// From "./hooks"
export { useAuthClient } from "./hooks/use-auth-client";
export { useSession } from "./hooks/use-session";
export { useUser } from "./hooks/use-user";
export { useAuth } from "./hooks/use-auth";
export { useSignIn } from "./hooks/use-sign-in";
export { useSignUp } from "./hooks/use-sign-up";
```

### Exported Providers

```typescript
// From "./providers"
export { AuthProvider } from "./providers/auth-provider";
export type { AuthProviderProps } from "./providers/auth-provider";
```

### Hook APIs

```typescript
// useSession
function useSession(): {
  session: SessionContext | null;
  isLoading: boolean;
  error: Error | null;
};

// useUser
function useUser(): {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

// useAuth
function useAuth(): {
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};
```

### Dependencies

- **Required**: 
  - `@repo/auth-core@workspace:*`
  - `@repo/auth-types@workspace:*`
  - `@repo/auth-utils@workspace:*`
- **Peer**: 
  - `react@^19.0.0`
  - `react-dom@^19.0.0`

### Compatibility

- **TypeScript**: `>=5.9.0`
- **React**: `>=19.0.0`
- **Runtime**: Browser (ES2022+)
- **Platforms**: Web only

---

## Package: `@repo/auth-native`

**Version**: `workspace:*`  
**Purpose**: React Native hooks and providers

### Public Exports

```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    },
    "./hooks": {
      "types": "./src/hooks/index.ts",
      "import": "./src/hooks/index.ts"
    },
    "./providers": {
      "types": "./src/providers/index.ts",
      "import": "./src/providers/index.ts"
    },
    "./storage": {
      "types": "./src/storage/index.ts",
      "import": "./src/storage/index.ts"
    }
  }
}
```

### Exported Components (Same API as auth-web)

```typescript
// From "./hooks"
export { useAuthClient } from "./hooks/use-auth-client";
export { useSession } from "./hooks/use-session";
export { useUser } from "./hooks/use-user";
export { useAuth } from "./hooks/use-auth";

// From "./providers"
export { AuthProvider } from "./providers/auth-provider";

// From "./storage"
export { SecureStorageAdapter } from "./storage/secure-storage";
```

### Dependencies

- **Required**: 
  - `@repo/auth-core@workspace:*`
  - `@repo/auth-types@workspace:*`
- **Peer**: 
  - `react@^19.0.0`
  - `react-native@>=0.74.0`
  - `expo-secure-store@^13.0.0`

### Compatibility

- **TypeScript**: `>=5.9.0`
- **React**: `>=19.0.0`
- **Runtime**: React Native (Expo SDK 51+)
- **Platforms**: iOS, Android

---

## Package: `@repo/auth-ui`

**Version**: `workspace:*`  
**Purpose**: Shared authentication UI components

### Public Exports

```json
{
  "exports": {
    "./components/*": {
      "types": "./src/components/*.tsx",
      "import": "./src/components/*.tsx"
    }
  }
}
```

### Exported Components

```typescript
// From "./components/login-form"
export { LoginForm } from "./components/login-form";
export type { LoginFormProps } from "./components/login-form";

// From "./components/signup-form"
export { SignupForm } from "./components/signup-form";
export type { SignupFormProps } from "./components/signup-form";

// From "./components/password-reset-form"
export { PasswordResetForm } from "./components/password-reset-form";
export type { PasswordResetFormProps } from "./components/password-reset-form";

// From "./components/password-change-form"
export { PasswordChangeForm } from "./components/password-change-form";
export type { PasswordChangeFormProps } from "./components/password-change-form";
```

### Component APIs

```typescript
interface LoginFormProps {
  onSuccess?: (session: Session) => void;
  onError?: (error: Error) => void;
  className?: string;
}

interface SignupFormProps {
  onSuccess?: (session: Session) => void;
  onError?: (error: Error) => void;
  requireName?: boolean;
  className?: string;
}
```

### Dependencies

- **Required**: 
  - `@repo/auth-web@workspace:*` OR `@repo/auth-native@workspace:*`
  - `@repo/auth-types@workspace:*`
  - `@workspace/ui@workspace:*`
- **Peer**: 
  - `react@^19.0.0`

### Compatibility

- **TypeScript**: `>=5.9.0`
- **React**: `>=19.0.0`
- **Runtime**: Browser, React Native
- **Platforms**: Web, iOS, Android

---

## Breaking Change Policy

### Major Version (1.0.0 → 2.0.0)

**Requires major bump**:
- Removing exported types, functions, or components
- Changing function signatures (parameters, return types)
- Renaming exported items
- Changing error codes or error handling behavior
- Removing package exports paths

**Example**:
```typescript
// ❌ Breaking change - requires major version
- export function signIn(email: string, password: string): Promise<Session>;
+ export function signIn(input: SignInInput): Promise<Session>;
```

### Minor Version (1.0.0 → 1.1.0)

**Allowed**:
- Adding new exported types, functions, or components
- Adding new optional parameters to functions
- Adding new optional properties to interfaces
- Adding new error codes
- Adding new package exports paths

**Example**:
```typescript
// ✅ Non-breaking change - minor version
export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
+ phoneNumber?: string; // New optional field
}
```

### Patch Version (1.0.0 → 1.0.1)

**Allowed**:
- Bug fixes that don't change public APIs
- Documentation improvements
- Internal implementation changes
- Performance optimizations

---

## Import Examples

### Using auth packages in Next.js app

```typescript
// apps/web/app/layout.tsx
import { AuthProvider } from "@repo/auth-web/providers";
import type { AuthConfig } from "@repo/auth-types";

const authConfig: AuthConfig = {
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  enableEmailVerification: false,
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider config={authConfig}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// apps/web/app/dashboard/page.tsx
import { useUser } from "@repo/auth-web/hooks";
import { LoginForm } from "@repo/auth-ui/components/login-form";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <LoginForm />;
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Using auth packages in Expo app

```typescript
// apps/mobile/app/_layout.tsx
import { AuthProvider } from "@repo/auth-native/providers";
import { SecureStorageAdapter } from "@repo/auth-native/storage";

const storage = new SecureStorageAdapter();

export default function RootLayout() {
  return (
    <AuthProvider 
      config={{ baseURL: process.env.EXPO_PUBLIC_API_URL! }}
      storage={storage}
    >
      <Stack />
    </AuthProvider>
  );
}

// apps/mobile/app/(auth)/login.tsx
import { useAuth } from "@repo/auth-native/hooks";
import { LoginForm } from "@repo/auth-ui/components/login-form";

export default function LoginScreen() {
  const { isLoading } = useAuth();
  
  return (
    <View>
      <LoginForm onSuccess={() => router.replace("/(app)/home")} />
    </View>
  );
}
```

### Using validation in Convex backend

```typescript
// packages/backend/convex/users.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { SignUpSchema } from "@repo/auth-utils/schemas";
import { validateAndParse } from "@repo/auth-utils/validators";

export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate input
    const validated = validateAndParse(SignUpSchema, args);
    
    // Business logic...
    const userId = await ctx.db.insert("users", {
      ...validated,
      emailVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return userId;
  },
});
```

---

## Compatibility Matrix

| Package | TypeScript | React | Node.js | Platforms |
|---------|-----------|-------|---------|-----------|
| `@repo/auth-types` | >=5.9 | N/A | N/A | All |
| `@repo/auth-utils` | >=5.9 | N/A | >=20 | All |
| `@repo/auth-core` | >=5.9 | N/A | >=20 | All |
| `@repo/auth-web` | >=5.9 | >=19 | >=20 | Web |
| `@repo/auth-native` | >=5.9 | >=19 | N/A | iOS, Android |
| `@repo/auth-ui` | >=5.9 | >=19 | N/A | Web, Mobile |
