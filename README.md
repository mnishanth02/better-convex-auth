# Better Convex Auth

A comprehensive authentication solution for Next.js applications using **Better Auth + Convex** with a focus on developer experience, accessibility, and production-ready features.

## ✨ Key Features

### 🔐 **Authentication & Security**
- **Email/Password** with verification and password reset
- **Social OAuth**: Google, GitHub, Apple, Discord
- **Magic Links** for passwordless authentication  
- **Email OTP** verification
- **2FA/MFA** support with TOTP
- **Passkeys** (WebAuthn) support
- **Organizations** and role-based access control
- **Rate limiting** and security headers
- **Session management** with automatic refresh

### 🎨 **User Experience & Accessibility**
- **Empty States**: Welcome screens, profile completion tracking
- **Accessibility**: WCAG 2.1 AA compliant components with full keyboard navigation
- **Responsive Design**: Mobile-first approach with touch optimization
- **Real-time Updates**: Live session state and user data synchronization
- **Error Handling**: Graceful error states with recovery actions
- **Loading States**: Skeleton screens and progress indicators

### 🛠 **Developer Experience**
- **Single Package Install**: One `@workspace/z-auth` package replaces 7+ dependencies
- **App-Specific Backends**: Independent Convex backends using templates
- **TypeScript First**: Comprehensive type safety with built-in validation
- **Zero Config**: Works out of the box with sensible defaults
- **Flexible**: Highly customizable components and hooks
- **Modern Stack**: Next.js 16, React 19, Tailwind CSS v4

## 📦 Unified Package

| Package | Version | Description |
|---------|---------|-------------|
| [@workspace/z-auth](./packages/z-auth) | 1.0.0 | **Unified auth package** - Complete auth solution |

### Legacy Packages (Deprecated)

<details>
<summary>Old modular packages (being phased out)</summary>

| Package | Version | Description |
|---------|---------|-------------|
| @auth/core | 0.1.0 | Better Auth + Convex integration |
| @auth/web | 0.2.0 | React hooks and providers |
| @auth/ui | 0.1.0 | Pre-built form components |
| @auth/types | 0.1.0 | TypeScript type definitions |
| @auth/utils | 0.1.0 | Validation and utilities |
| @auth/quickstart | 0.1.0 | Quick setup helpers |

Use `@workspace/z-auth` instead for new projects.
</details>

## 🚀 Quick Start

### 1. Installation

```bash
pnpm add @workspace/z-auth
```

### 2. Setup Authentication

Create `lib/auth.ts`:

```typescript
import { createAuth } from "@workspace/z-auth/nextjs";

export const { auth, signIn, signOut, useAuth, AuthProvider } = createAuth({
  baseURL: "/api/auth",
});
```

### 3. Create API Route

Create `app/api/auth/[...all]/route.ts`:

```typescript
import { GET, POST } from "@workspace/z-auth/nextjs/handler";
export { GET, POST };
```

### 4. Setup Convex Backend

Initialize Convex and copy templates:

```bash
# Initialize Convex
npx convex dev

# Copy auth templates  
cp node_modules/@workspace/z-auth/templates/* convex/

# Install backend dependencies
pnpm add @auth/core @convex-dev/better-auth @convex-dev/resend convex-helpers
```

### 5. Configure Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Auth configuration
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# OAuth providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email service (optional)
RESEND_API_KEY=your-resend-api-key
```

### 6. Add Provider

Wrap your app with `AuthProvider`:

```typescript
// app/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConvexProvider client={convex}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
```

### 7. Start Development

```bash
pnpm dev        # Start Next.js
pnpm convex dev # Start Convex (separate terminal)
```

export const { 
  auth,           // Server-side auth
  signIn,         // Sign in function
  signOut,        // Sign out function
  useAuth,        // React hook
  AuthProvider    // Context provider
} = createAuth({
  baseURL: "/api/auth",
});
```

### 3. Create API Route

```typescript
// app/api/auth/[...all]/route.ts
import { GET, POST } from "@workspace/z-auth/nextjs/handler";
export { GET, POST };
```

**Done!** 🎉 Now add the AuthProvider and set up your Convex backend (see below).

## 🏗️ Backend Setup (7 Steps)

Each app creates its own Convex backend for independence and customization.

### Quick Backend Setup

```bash
# 1. Initialize Convex in your app
cd apps/your-app
npx convex dev

# 2. Copy template files
cp node_modules/@workspace/z-auth/templates/* convex/

# 3. Install backend dependencies
pnpm add @auth/core @convex-dev/better-auth @convex-dev/resend convex-helpers

# 4. Configure environment variables (.env.local)
# NEXT_PUBLIC_CONVEX_URL (auto-generated)
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# SITE_URL=http://localhost:3000
# RESEND_API_KEY=your-key (for email)
# GOOGLE_CLIENT_ID=your-id (for OAuth)

# 5. Start development
pnpm convex dev && pnpm dev
```

**Template Files** (in `convex/`):
- `convex.config.ts` - Convex app configuration
- `auth.ts` - Better Auth setup with email/OAuth
- `http.ts` - HTTP routes for auth endpoints
- `schema.ts` - Complete database schema (9 tables)

📖 **Full Guide**: [Backend Setup Guide](./docs/BACKEND_SETUP_GUIDE.md)

## 📚 Documentation

### Quick Start Guides
- **[Backend Setup](./docs/BACKEND_SETUP_GUIDE.md)** - 7-step guide to create your Convex backend
- **[Migration Guide](./docs/MIGRATION_GUIDE.md)** - Migrate from old modular packages
- **[Troubleshooting](./docs/guides/troubleshooting.md)** - Common issues and solutions
- **[Recipes](./docs/guides/recipes.md)** - Real-world code examples

### Architecture & Implementation
- **[Implementation Status](./docs/IMPLEMENTATION_STATUS.md)** - Current progress (Phases 1-2 complete)
- **[Scalability Solution](./docs/SCALABILITY_SOLUTION.md)** - Why we chose unified package
- **[Validation Report](./docs/VALIDATION_REPORT.md)** - Quality metrics and performance

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
│   ├── z-auth/                 # ⭐ Unified auth package
│   │   ├── src/
│   │   │   ├── core/           # Client factory & config
│   │   │   ├── nextjs/         # Next.js adapter & handlers
│   │   │   ├── utils/          # Env validation & utilities
│   │   │   └── backend/        # Setup guides
│   │   └── templates/          # Convex backend templates
│   ├── auth/                   # Legacy modular packages (deprecated)
│   ├── ui/                     # Shared UI components (shadcn/ui)
│   └── typescript-config/      # Shared TS configs
└── docs/                       # Comprehensive documentation
```

## 📊 Before vs After

### Package Dependencies

**Before (Old Approach)**:
```bash
pnpm add @auth/core @auth/web @auth/ui @auth/types @auth/utils @auth/quickstart @workspace/backend
# 7+ packages
```

**After (New Approach)**:
```bash
pnpm add @workspace/z-auth
# 1 package (85% reduction)
```

### Setup Complexity

**Before**: 4+ configuration files  
**After**: 1 configuration file (75% reduction)

### Backend Coupling

**Before**: Shared `@workspace/backend` for all apps (tight coupling)  
**After**: App-specific backends with templates (full independence)

## 🧪 Quality Metrics

✅ **TypeScript**: 0 compilation errors  
✅ **Linting**: All checks passed  
✅ **Security**: 0 vulnerabilities  
✅ **Build**: Successful across all packages  
✅ **Dependencies**: 85% reduction (7→1 packages)  
✅ **Setup Files**: 75% reduction (4→1 files)

**Performance**:
- **Build Time**: <2 seconds (unified package)
- **Type Check**: <5 seconds
- **Dev Server**: ~3 seconds startup

See [Implementation Status](./docs/IMPLEMENTATION_STATUS.md) for detailed metrics.

## 📖 Examples

### Basic Usage

```tsx
"use client";
import { useAuth } from "@/lib/auth";

function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Sign In/Out

```tsx
import { signIn, signOut } from "@/lib/auth";

// Client component
function AuthButtons() {
  return (
    <>
      <button onClick={() => signIn.email({ email: "user@example.com", password: "pass" })}>
        Sign In
      </button>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
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

**Status**: 🚀 Phase 2 Complete - Unified Package + Backend Decoupling  
**Version**: 1.0.0 (Unified Package)  
**Last Updated**: November 9, 2025
