# Changelog

All notable changes to `@workspace/z-auth` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Error boundary component (`AuthErrorBoundary`) for handling authentication errors
- Backend factory function (`createConvexBackend`) for easier Convex backend setup
- Comprehensive component props type exports for all UI components
- Updated backend templates to use `@convex-dev/better-auth` instead of `@convex-dev/auth`
- Migration guide from old `@auth/*` packages to unified `@workspace/z-auth`

### Fixed
- Backend template confusion - all templates now correctly use `@convex-dev/better-auth`
- Backend setup guide examples updated to match current architecture

## [1.0.0] - 2024-11-09

### Added
- Initial release of unified auth package
- Single package consolidating all authentication functionality
- Core authentication client factory (`createAuthClient`)
- Next.js adapter with `createAuth` factory
- Pre-built API route handlers (GET/POST)
- Complete React hooks suite:
  - `useAuth()` - Full auth client access
  - `useSession()` - Session state management
  - `useUser()` - User convenience hook
  - `useSignIn()` - Sign-in methods
  - `useSignUp()` - Sign-up methods
  - `useSignOut()` - Sign-out method
  - `useAuthClient()` - Direct client access
- 16 pre-built UI components:
  - **Forms**: SignInForm, SignUpForm, UpdateProfileForm, ChangePasswordForm, ForgotPasswordForm, ResetPasswordForm
  - **Guards**: SessionGuard, RoleGuard, EmailVerifiedGuard
  - **Display**: UserAvatar, UserBadge, UserMenu
  - **Actions**: SignOutButton, SocialAuthButtons
  - **Feedback**: PasswordStrengthIndicator
  - **Utils**: OAuthRedirectHandler
- 3 Higher-Order Components (HOCs):
  - `withAuth()` - Route protection
  - `withSession()` - Session injection
  - `withEmailVerified()` - Email verification requirement
- Comprehensive utilities:
  - Environment validation (`validateClientEnv`, `validateServerEnv`)
  - Error handling (`createAuthError`, `getErrorMessage`, `formatZodError`)
  - Token utilities
  - Validation schemas (Zod-based)
- Type-safe TypeScript support throughout
- Backend setup templates and guides
- Comprehensive JSDoc documentation

### Features
- ✅ Single package install - no more juggling 7+ packages
- ✅ One-file setup - everything configured in one place
- ✅ Auto API routes - one-line export
- ✅ Built-in validation - env var checking included
- ✅ Type-safe - full TypeScript support
- ✅ Framework adapters - Next.js (Remix coming soon)
- ✅ Zero boilerplate - minimal configuration

### Dependencies
- `@convex-dev/better-auth`: ^0.9.7
- `better-auth`: ^1.3.34
- `convex`: ^1.28.2
- `zod`: ^4.1.12

### Peer Dependencies
- `@hookform/resolvers`: ^3.0.0
- `@workspace/ui`: workspace:*
- `lucide-react`: ^0.400.0
- `next`: ^14.0.0 || ^15.0.0 || ^16.0.0
- `react`: ^18.0.0 || ^19.0.0
- `react-hook-form`: ^7.0.0

---

## Release Notes

### What's Changed in 1.0.0

This is the first stable release of the unified Better Convex Auth package. It consolidates the previous multi-package architecture (`@auth/core`, `@auth/web`, `@auth/ui`, etc.) into a single, cohesive package with improved developer experience.

**Migration from old packages**: See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

**Breaking Changes from old packages**:
- Import paths have changed (e.g., `@auth/web` → `@workspace/z-auth/react`)
- Setup is now done via single `createAuth()` call instead of multiple imports
- Backend configuration uses new factory function

**Upgrade Path**:
1. Remove old `@auth/*` dependencies
2. Install `@workspace/z-auth`
3. Update imports to new paths
4. Use `createAuth()` for setup
5. Update backend to use `createConvexBackend()` (optional but recommended)

See [MIGRATION.md](./MIGRATION.md) for complete upgrade instructions.

---

## Version History

- **1.0.0** (2024-11-09) - Initial stable release
- **Unreleased** - Current development version

---

## Contributing

When adding entries to this changelog:
1. Add new entries under `[Unreleased]` section
2. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. Link to relevant issues/PRs when applicable
4. Keep descriptions clear and user-focused

When releasing a new version:
1. Move unreleased changes to new version section
2. Add release date
3. Update version in package.json
4. Create git tag
