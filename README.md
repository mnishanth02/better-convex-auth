# Better Convex Auth

A modern, type-safe authentication system built with Better Auth and Convex, featuring pre-built React components and comprehensive documentation.

## 🚀 Features

- ✅ **Email/Password Authentication** - Secure credential-based auth
- ✅ **Social OAuth** - Google, GitHub, Apple, Discord
- ✅ **Email Verification** - Customizable email templates
- ✅ **Password Reset** - Secure token-based password recovery
- ✅ **Session Management** - Real-time session sync with Convex
- ✅ **Pre-built UI** - Professional React forms ready to use
- ✅ **Type-Safe** - Full TypeScript support throughout
- ✅ **Monorepo** - Modular packages with Turborepo
- ✅ **Production Ready** - 0 vulnerabilities, comprehensive tests

## 📦 Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@auth/core](./packages/auth/core) | 0.1.0 | Better Auth + Convex integration |
| [@auth/web](./packages/auth/web) | 0.2.0 | React hooks and providers |
| [@auth/ui](./packages/auth/ui) | 0.1.0 | Pre-built form components |
| [@auth/backend](./packages/auth/backend) | 0.1.0 | Backend utilities and templates |
| [@auth/config](./packages/auth/config) | 0.1.0 | Configuration management |
| [@auth/types](./packages/auth/types) | 0.1.0 | TypeScript type definitions |
| [@auth/utils](./packages/auth/utils) | 0.1.0 | Validation and utility functions |
| [@auth/quickstart](./packages/auth/quickstart) | 0.1.0 | Quick setup helpers |

## 🚀 Quick Start

### Installation

```bash
pnpm add @auth/core @auth/web @auth/ui @convex-dev/better-auth convex
```

### Setup (5 minutes)

1. **Configure Convex Schema**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    // ... more fields
  }).index("by_email", ["email"]),
  // ... more tables
});
```

2. **Create Auth Config**

```typescript
// convex/auth.config.ts
import { createConvexAuth } from "@auth/core";
import { createClient } from "@convex-dev/better-auth";

export const authComponent = createClient({
  convexUrl: process.env.CONVEX_URL!,
});

export const auth = createConvexAuth(authComponent, {
  adapter: authComponent.adapter(),
  baseURL: process.env.SITE_URL || "http://localhost:3000",
  emailPassword: { enabled: true },
});
```

3. **Set Up Client**

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

4. **Use Pre-Built Forms**

```tsx
// app/login/page.tsx
import { SignInForm } from "@auth/ui";

export default function LoginPage() {
  return <SignInForm redirectTo="/dashboard" />;
}
```

Done! 🎉

## 📚 Documentation

### Guides
- **[Migration Guide](./docs/guides/migration-from-better-auth.md)** - Move from standard Better Auth
- **[Troubleshooting](./docs/guides/troubleshooting.md)** - Common issues and solutions
- **[Recipes](./docs/guides/recipes.md)** - 15+ real-world code examples

### Technical
- **[Validation Report](./docs/VALIDATION_REPORT.md)** - Quality metrics and performance
- **[CHANGELOG](./CHANGELOG.md)** - Version history and changes
- **[Release Notes](./RELEASE_NOTES.md)** - v0.2.0 highlights

### Architecture
- **[Implementation Plan](./docs/impl-plan/)** - Detailed development phases
- **[Spec](./specs/001-auth-packages/)** - Technical specifications

## 🎨 UI Components

All components are built with [shadcn/ui](https://ui.shadcn.com) and Tailwind CSS:

- `<SignInForm>` - Email/password + social OAuth sign-in
- `<SignUpForm>` - User registration with validation
- `<ForgotPasswordForm>` - Password reset request
- `<ResetPasswordForm>` - Password reset with token
- `<ChangePasswordForm>` - Update user password
- `<UpdateProfileForm>` - Edit user profile
- `<SocialAuthButtons>` - Configurable OAuth buttons

### Adding UI Components

To add shadcn/ui components to your app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are placed in `packages/ui/src/components/` for workspace-wide reuse.

### Usage

```tsx
import { Button } from "@workspace/ui/components/button";
import { SignInForm } from "@auth/ui";

export default function Page() {
  return (
    <div>
      <SignInForm />
      <Button>Click me</Button>
    </div>
  );
}
```

## 🔧 Development

### Prerequisites
- Node.js 20+
- pnpm 10.4.1+

### Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build

# Type check
pnpm typecheck

# Lint and format
pnpm check

# Auto-fix issues
pnpm format
```

### Performance

- **Cold build**: ~45-60 seconds
- **Warm build**: 17.8 seconds (87.5% cached)
- **Type check**: < 7 seconds
- **Dev server**: ~5 seconds startup

## 🏗️ Monorepo Structure

```
better-convex-auth/
├── apps/
│   └── web/                    # Next.js application
├── packages/
│   ├── auth/                   # Authentication packages
│   │   ├── backend/            # Backend utilities
│   │   ├── config/             # Configuration
│   │   ├── core/               # Core auth logic
│   │   ├── quickstart/         # Quick setup
│   │   ├── types/              # Type definitions
│   │   ├── ui/                 # React components
│   │   ├── utils/              # Utilities
│   │   └── web/                # React hooks
│   ├── backend/                # Convex backend
│   ├── ui/                     # Shared UI components
│   └── typescript-config/      # Shared TS configs
└── docs/                       # Documentation
```

## 🧪 Quality Metrics

✅ **TypeScript**: 0 compilation errors  
✅ **Linting**: All checks passed  
✅ **Security**: 0 vulnerabilities  
✅ **Documentation**: 100% JSDoc coverage  
✅ **Build**: Successful across all packages  

See [Validation Report](./docs/VALIDATION_REPORT.md) for details.

## 📖 Examples

### Using Hooks

```tsx
import { useAuth, useSession } from "@auth/web";

function Dashboard() {
  const { data: session, isPending } = useSession();
  const { signOut } = useAuth();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

More examples in the [Recipes Guide](./docs/guides/recipes.md).

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT - See [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built with:
- [Better Auth](https://better-auth.com) - Authentication framework
- [Convex](https://convex.dev) - Serverless database
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Turborepo](https://turbo.build) - Monorepo tooling
- [Biome](https://biomejs.dev) - Linting and formatting

## 📞 Support

- **Documentation**: [/docs/guides](./docs/guides)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Status**: 🚀 Production Ready (v0.2.0)  
**Last Updated**: November 8, 2025
