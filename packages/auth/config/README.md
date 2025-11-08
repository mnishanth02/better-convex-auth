# @auth/config

Centralized configuration package for the authentication system.

## Overview

This package provides:
- **Type-safe configuration** with TypeScript interfaces
- **Sensible defaults** for all auth settings
- **Runtime validation** with Zod schemas
- **Easy customization** without boilerplate

## Installation

```bash
pnpm add @auth/config
```

## Usage

### Using Default Configuration

```typescript
import { getAuthConfig } from "@auth/config";

const config = getAuthConfig();
// Uses all default values
```

### Custom Configuration

```typescript
import { getAuthConfig, type AuthConfig } from "@auth/config";

const customConfig: Partial<AuthConfig> = {
  routes: {
    login: "/login",
    signup: "/register",
    dashboard: "/app",
  },
  password: {
    minLength: 12,
    requireSpecialChars: true,
  },
};

const config = getAuthConfig(customConfig);
```

### Configuration Validation

```typescript
import { validateAuthConfig } from "@auth/config/validators";

try {
  const validatedConfig = validateAuthConfig(userConfig);
  // Config is valid and type-safe
} catch (error) {
  // Handle validation errors
  console.error(error.errors);
}
```

## Configuration Options

### Routes

Configure authentication-related routes:

```typescript
routes: {
  login: string;          // Default: "/sign-in"
  signup: string;         // Default: "/sign-up"
  dashboard: string;      // Default: "/dashboard"
  forgotPassword: string; // Default: "/forgot-password"
  resetPassword: string;  // Default: "/reset-password"
  verifyEmail: string;    // Default: "/verify-email"
}
```

### Session

Configure session behavior:

```typescript
session: {
  expiresIn: number;        // Default: 30 days (in ms)
  updateAge: number;        // Default: 24 hours (in ms)
  cleanupInterval: number;  // Default: 24 hours (in ms)
}
```

### Password

Configure password requirements:

```typescript
password: {
  minLength: number;            // Default: 8
  maxLength: number;            // Default: 128
  requireUppercase: boolean;    // Default: true
  requireLowercase: boolean;    // Default: true
  requireNumbers: boolean;      // Default: true
  requireSpecialChars: boolean; // Default: false
}
```

### Email

Configure email verification:

```typescript
email: {
  verificationRequired: boolean;  // Default: true
  verificationExpiresIn: number;  // Default: 24 hours (in ms)
  resetExpiresIn: number;         // Default: 1 hour (in ms)
}
```

### OAuth

Configure OAuth providers:

```typescript
oauth: {
  google?: {
    clientId: string;
    clientSecret: string;
  };
  github?: {
    clientId: string;
    clientSecret: string;
  };
  apple?: {
    clientId: string;
    clientSecret: string;
  };
}
```

### Rate Limiting

Configure rate limiting:

```typescript
rateLimit: {
  enabled: boolean;  // Default: true
  window: number;    // Default: 60 seconds (in ms)
  max: number;       // Default: 10 requests
}
```

## API Reference

### `getAuthConfig(custom?: Partial<AuthConfig>): AuthConfig`

Returns merged configuration with defaults.

### `validateAuthConfig(config: unknown): AuthConfig`

Validates configuration at runtime using Zod.

### `DEFAULT_AUTH_CONFIG`

The default configuration object.

## License

MIT
