# @auth/backend

Backend authentication utilities and factory functions for Better Convex Auth.

## Installation

```bash
pnpm add @auth/backend
```

## Usage

### Basic Setup

```typescript
// packages/backend/convex/auth.ts
import { createConvexAuthBackend } from "@auth/backend";
import { createClient } from "@convex-dev/better-auth";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

const authComponent = createClient<DataModel>(components.betterAuth);
const resend = new Resend(components.resend, { testMode: false });

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return createConvexAuthBackend(ctx, {
    adapter: authComponent.adapter(ctx),
    baseURL: process.env.SITE_URL!,
    
    emailPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    
    emailVerification: {
      resend,
      from: {
        email: "noreply@myapp.com",
        name: "MyApp",
      },
    },
    
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },
  });
};
```

### Custom Email Templates

```typescript
import { createConvexAuthBackend } from "@auth/backend";
import type { EmailTemplateParams } from "@auth/backend";

const customVerificationTemplate = {
  subject: "Welcome! Verify your email",
  htmlTemplate: (params: EmailTemplateParams) => {
    return `<h1>Welcome ${params.user.name}!</h1><a href="${params.url}">Verify</a>`;
  },
  textTemplate: (params: EmailTemplateParams) => {
    return `Welcome ${params.user.name}! Verify: ${params.url}`;
  },
};

export const createAuth = (ctx) => {
  return createConvexAuthBackend(ctx, {
    // ... other config
    emailVerification: {
      resend,
      from: { email: "noreply@myapp.com", name: "MyApp" },
      template: customVerificationTemplate,
    },
  });
};
```

## Configuration Options

See the [PUBLIC_API.md](./PUBLIC_API.md) for complete configuration documentation.

### Required Options

- `adapter` - Convex Better Auth adapter
- `baseURL` - Base URL of your application

### Optional Options

- `trustedOrigins` - Array of trusted origins for CORS
- `emailPassword` - Email/password authentication config
- `socialProviders` - OAuth provider credentials
- `emailVerification` - Email verification settings
- `session` - Session expiry and refresh settings
- `rateLimit` - Rate limiting configuration
- `isDevelopment` - Development mode flag

## Default Email Templates

The package includes three default email templates:

1. **Verification Email** - For email address verification
2. **Password Reset Email** - For password reset requests
3. **Magic Link Email** - For passwordless sign-in

You can use these templates directly or customize them:

```typescript
import {
  defaultVerificationEmailTemplate,
  defaultPasswordResetTemplate,
  defaultMagicLinkTemplate,
} from "@auth/backend";
```

## Development

```bash
# Build the package
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck
```

## License

MIT
