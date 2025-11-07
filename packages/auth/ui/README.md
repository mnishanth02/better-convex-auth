# @auth/ui

Pre-built React components for Better Auth + Convex authentication.

## Features

- 🎨 **Pre-built Components** - Ready-to-use auth UI components
- 🔒 **Type-Safe** - Full TypeScript support
- 🎯 **Customizable** - Easy to style and extend
- 📱 **Responsive** - Mobile-friendly design
- ♿ **Accessible** - WCAG 2.1 AA compliant

## Installation

```bash
pnpm add @auth/ui @auth/web @workspace/ui
```

## Components

### Forms
- `SignInForm` - Email/password + social sign-in
- `SignUpForm` - User registration with validation
- `ForgotPasswordForm` - Password reset request
- `ResetPasswordForm` - Set new password
- `ChangePasswordForm` - Change password (authenticated)
- `UpdateProfileForm` - Update user profile

### Guards
- `SessionGuard` - Require authentication
- `EmailVerifiedGuard` - Require verified email
- `RoleGuard` - Require specific role

### Actions
- `SignOutButton` - Sign out with confirmation
- `SocialAuthButtons` - OAuth provider buttons

### Display
- `UserAvatar` - User profile picture
- `UserBadge` - Compact user display
- `UserMenu` - Dropdown with profile/sign out

### Feedback
- `PasswordStrengthIndicator` - Visual password strength
- `EmailVerificationBanner` - Email verification prompt

## Usage

```tsx
import { SignInForm } from "@auth/ui/forms";

export default function LoginPage() {
  return (
    <SignInForm
      redirectTo="/dashboard"
      showSocialAuth={true}
      socialProviders={["github", "google"]}
    />
  );
}
```

## Documentation

See the [main documentation](../../../docs/) for detailed usage examples.
