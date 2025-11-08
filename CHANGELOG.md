# Changelog

All notable changes to the Better Convex Auth project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-11-08

### Added - Phase 8: Web Integration & Testing

#### Authentication Client Package (@auth/web v0.2.0)
- **Client Factory Pattern**: Created `createAuthClient` for Better Auth browser client initialization
- **Provider Components**: Implemented `AuthClientProvider` for React context management
- **React Hooks Suite**:
  - `useAuth`: Access authentication actions (signIn, signOut, signUp)
  - `useSession`: Reactive session state with loading/error handling
  - `useUser`: Simplified user data access
  - `useSignIn`: Sign-in with built-in state management
  - `useSignUp`: Sign-up with built-in state management
  - `useSignOut`: Sign-out with built-in state management
- **TypeScript Support**: Full type safety with Better Auth + Convex integration

#### UI Components Package (@auth/ui v0.1.0)
- **Pre-built Form Components**:
  - `SignInForm`: Email/password + social OAuth sign-in
  - `SignUpForm`: User registration with validation
  - `ForgotPasswordForm`: Password reset request
  - `ResetPasswordForm`: Password reset with token
  - `ChangePasswordForm`: Update user password
  - `UpdateProfileForm`: Edit user profile information
- **Social Authentication**:
  - `SocialAuthButtons`: Configurable OAuth provider buttons
  - Support for Google, GitHub, Apple, Discord
- **Features**:
  - Built-in form validation using Zod
  - Loading states and error handling
  - Responsive design with Tailwind CSS
  - Customizable styling and behavior
  - Integration with shadcn/ui components

#### Backend Package (@auth/backend v0.1.0)
- **Convex Auth Factory**: `createConvexAuthBackend` for server-side initialization
- **Email Templates**: Pre-built templates for verification, password reset, magic links
- **Template System**: Customizable email templates with type safety
- **Configuration**: Flexible backend configuration options

#### Next.js Integration (web app)
- **Authentication Routes**:
  - `/login` - Sign-in page with pre-built form
  - `/signup` - User registration page
  - `/forgot-password` - Password reset request
  - `/reset-password` - Password reset with token validation
  - `/dashboard` - Protected dashboard with session display
- **API Routes**: Better Auth HTTP handler at `/api/auth/[...all]`
- **Session Management**:
  - Real-time session display component
  - Active sessions list with device information
  - Session invalidation (single/all other sessions)
- **Protected Routes**: Middleware-based authentication

#### Developer Experience
- **Monorepo Optimization**: Turborepo caching for 60-80% faster builds
- **Build Performance**: Cold build ~45-60s, warm build ~18s
- **Type Safety**: Zero TypeScript errors across all packages
- **Hot Module Replacement**: Fast refresh in development

### Added - Phase 9: Documentation & Polish

#### Comprehensive Documentation
- **Migration Guide** (`docs/guides/migration-from-better-auth.md`):
  - Step-by-step migration from standard Better Auth
  - Convex schema setup instructions
  - Breaking changes documentation
  - Environment variable configuration
  - Validation checklist
- **Troubleshooting Guide** (`docs/guides/troubleshooting.md`):
  - Session persistence issues and solutions
  - OAuth redirect problems
  - Email verification debugging
  - Build and TypeScript errors
  - Performance optimization tips
  - Security audit guidance
- **Recipes & Best Practices** (`docs/guides/recipes.md`):
  - Quick start setup examples
  - Custom authentication flows
  - Protected route patterns (middleware, client, server)
  - Email verification setup
  - Password reset implementation
  - User profile management
  - Multi-tenant organizations
  - Rate limiting configuration
  - Custom validators
  - Error handling patterns
  - Testing examples (unit & E2E)

#### API Documentation
- **100% JSDoc Coverage**: All exported functions documented with:
  - Detailed descriptions
  - Parameter documentation
  - Return type documentation
  - Usage examples
  - Error documentation
  - @public/@internal tags
- **Packages Documented**:
  - @auth/core: Authentication factories and utilities
  - @auth/web: React hooks and providers
  - @auth/ui: Form components and actions
  - @auth/config: Configuration types and validators
  - @auth/backend: Backend setup and templates

#### Quality Assurance
- **Validation Report** (`docs/VALIDATION_REPORT.md`):
  - TypeScript compilation: ✅ 0 errors
  - Biome linting: ✅ Passed (4 acceptable warnings)
  - Build performance: ✅ 17.8s (87.5% cache hit)
  - Security audit: ✅ 0 vulnerabilities
  - Documentation: ✅ 100% coverage
- **Code Quality**:
  - Fixed all linting issues
  - Organized imports consistently
  - Removed unused imports
  - Improved type safety
- **Build Optimization**:
  - Turborepo cache working efficiently
  - Fast incremental builds
  - Type checking under 30 seconds

### Changed

#### Configuration Structure
- Moved from single config file to modular package system
- Better separation of concerns (core, web, ui, backend, config)
- Workspace-based package imports (`@auth/*` namespace)

#### Session Management
- Enhanced real-time session synchronization with Convex
- Improved session state management in React hooks
- Better loading and error states

#### Type System
- Strengthened type safety across all packages
- Better inference for authentication actions
- Improved error type definitions

### Fixed

#### Build Issues
- Fixed TypeScript errors in UI components
- Resolved import path issues with `.js` extensions
- Fixed non-null assertion warnings in session list
- Removed unused imports

#### Code Quality
- Applied Biome auto-fixes for formatting
- Organized imports alphabetically
- Fixed optional chaining in session components

### Performance

#### Build Times
- **Cold Build**: ~45-60 seconds (first time)
- **Warm Build**: 17.8 seconds (87.5% cached)
- **Type Check**: 6.6 seconds
- **Dev Server**: ~5 seconds startup

#### Bundle Sizes (Production)
- @auth/core: < 50KB
- @auth/web: < 30KB
- @auth/ui: < 100KB (with components)
- @auth/config: < 10KB

### Security

- ✅ **0 vulnerabilities** in production dependencies
- Secure session token handling
- CSRF protection via Better Auth
- Rate limiting configuration support
- Email verification with token expiration
- Password validation with configurable requirements

### Documentation

#### New Files
- `docs/guides/migration-from-better-auth.md` (230 lines)
- `docs/guides/troubleshooting.md` (350 lines)
- `docs/guides/recipes.md` (620 lines)
- `docs/VALIDATION_REPORT.md` (200 lines)

#### Updated Files
- Enhanced JSDoc comments in all packages
- Updated README with new features
- Added PUBLIC_API.md for key packages

## [0.1.0] - 2025-11-01

### Added - Initial Release (Phases 1-7)

#### Core Packages
- **@auth/types**: Comprehensive TypeScript type definitions
- **@auth/utils**: Validation, encryption, and utility functions
- **@auth/config**: Centralized configuration management
- **@auth/core**: Better Auth + Convex integration
- **@auth/quickstart**: Quick setup utilities

#### Convex Backend
- Authentication schema (users, sessions, accounts, tokens)
- Convex adapter for Better Auth
- Session management utilities
- User management utilities

#### Development Tools
- Monorepo structure with Turborepo
- Biome for linting and formatting
- TypeScript strict mode
- pnpm workspace configuration

#### Documentation
- Initial README
- Architecture documentation
- Development setup guide

---

## Version History

- **0.2.0** (2025-11-08): Phase 8 & 9 - Web Integration, UI Components, Documentation
- **0.1.0** (2025-11-01): Phases 1-7 - Core packages, Convex integration, initial setup

---

## Upgrade Guide

### From 0.1.0 to 0.2.0

1. **Install new packages**:
   ```bash
   pnpm add @auth/web @auth/ui @auth/backend
   ```

2. **Update imports**:
   ```typescript
   // Old
   import { useAuth } from "@auth/core";
   
   // New
   import { useAuth } from "@auth/web";
   ```

3. **Wrap app with provider**:
   ```tsx
   import { AuthClientProvider } from "@auth/web";
   
   <AuthClientProvider client={authClient}>
     {children}
   </AuthClientProvider>
   ```

4. **Use pre-built UI components**:
   ```tsx
   import { SignInForm } from "@auth/ui";
   
   <SignInForm redirectTo="/dashboard" />
   ```

See [Migration Guide](./docs/guides/migration-from-better-auth.md) for detailed instructions.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](./LICENSE) for details.
