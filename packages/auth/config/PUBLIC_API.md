# @auth/config - Public API

## Exports

### Main Export (`@auth/config`)

```typescript
export { getAuthConfig, DEFAULT_AUTH_CONFIG } from "./auth-config";
export type { AuthConfig, RouteConfig, SessionConfig, PasswordConfig, EmailConfig, OAuthConfig, RateLimitConfig } from "./auth-config";
```

### Defaults Export (`@auth/config/defaults`)

```typescript
export { DEFAULT_AUTH_CONFIG } from "./defaults";
```

### Validators Export (`@auth/config/validators`)

```typescript
export { validateAuthConfig, authConfigSchema } from "./validators";
```

## Types

### `AuthConfig`

The main configuration interface for the authentication system.

```typescript
interface AuthConfig {
  routes: RouteConfig;
  session: SessionConfig;
  password: PasswordConfig;
  email: EmailConfig;
  oauth: OAuthConfig;
  rateLimit: RateLimitConfig;
}
```

### `RouteConfig`

Authentication route configuration.

```typescript
interface RouteConfig {
  login: string;
  signup: string;
  dashboard: string;
  forgotPassword: string;
  resetPassword: string;
  verifyEmail: string;
}
```

### `SessionConfig`

Session management configuration.

```typescript
interface SessionConfig {
  expiresIn: number;
  updateAge: number;
  cleanupInterval: number;
}
```

### `PasswordConfig`

Password requirements configuration.

```typescript
interface PasswordConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}
```

### `EmailConfig`

Email verification configuration.

```typescript
interface EmailConfig {
  verificationRequired: boolean;
  verificationExpiresIn: number;
  resetExpiresIn: number;
}
```

### `OAuthConfig`

OAuth providers configuration.

```typescript
interface OAuthConfig {
  google?: OAuthProvider;
  github?: OAuthProvider;
  apple?: OAuthProvider;
}

interface OAuthProvider {
  clientId: string;
  clientSecret: string;
}
```

### `RateLimitConfig`

Rate limiting configuration.

```typescript
interface RateLimitConfig {
  enabled: boolean;
  window: number;
  max: number;
}
```

## Functions

### `getAuthConfig(custom?: Partial<AuthConfig>): AuthConfig`

Returns a complete auth configuration by merging custom values with defaults.

**Parameters:**
- `custom` (optional): Partial configuration to override defaults

**Returns:** Complete `AuthConfig` object

**Example:**
```typescript
const config = getAuthConfig({
  password: { minLength: 12 },
  routes: { login: "/auth/login" }
});
```

### `validateAuthConfig(config: unknown): AuthConfig`

Validates and parses a configuration object at runtime.

**Parameters:**
- `config`: The configuration object to validate

**Returns:** Validated `AuthConfig` object

**Throws:** `ZodError` if validation fails

**Example:**
```typescript
try {
  const config = validateAuthConfig(userConfig);
} catch (error) {
  console.error("Invalid config:", error.errors);
}
```

## Constants

### `DEFAULT_AUTH_CONFIG`

The default configuration object with sensible defaults for all settings.

## Version

Current version: 0.1.0
