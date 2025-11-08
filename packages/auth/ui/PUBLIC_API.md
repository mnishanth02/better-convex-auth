# @auth/ui - Public API Surface

This document defines the **official public API** for `@auth/ui`. Only these exports are guaranteed to remain stable across minor versions.

## Package Exports

### Main Export (`@auth/ui`)

All components are re-exported from the main entry point:

```typescript
import {
  SignInForm,
  SignUpForm,
  SessionGuard,
  UserAvatar,
  SignOutButton,
} from "@auth/ui";
```

### Category Exports

Components can also be imported by category:

```typescript
// Forms
import { SignInForm, SignUpForm } from "@auth/ui/forms";

// Guards
import { SessionGuard, RoleGuard } from "@auth/ui/guards";

// Display components
import { UserAvatar, UserBadge, UserMenu } from "@auth/ui/display";

// Action components
import { SignOutButton, SocialAuthButtons } from "@auth/ui/actions";

// Feedback components
import { PasswordStrengthIndicator } from "@auth/ui/feedback";
```

## ⚠️ Import Restrictions

The following imports are **explicitly blocked**:

```typescript
// ❌ BLOCKED - Internal implementation
import { SignInForm } from "@auth/ui/src/forms/sign-in-form";
import { SessionGuard } from "@auth/ui/src/guards/session-guard";
import { internal } from "@auth/ui/internal/forms";

// ✅ ALLOWED - Public API
import { SignInForm } from "@auth/ui";
import { SignInForm } from "@auth/ui/forms";
import { SessionGuard } from "@auth/ui/guards";
```

## Public API Reference

### Forms (`@auth/ui/forms`)

#### `SignInForm`

Email/password sign-in form with social auth support.

```typescript
interface SignInFormProps {
  redirectTo?: string;
  showSocialAuth?: boolean;
  socialProviders?: Array<"google" | "github" | "apple" | "discord">;
  signUpUrl?: string;
  forgotPasswordUrl?: string;
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
  className?: string;
}

function SignInForm(props: SignInFormProps): JSX.Element;
```

**Usage:**
```typescript
<SignInForm
  redirectTo="/dashboard"
  showSocialAuth={true}
  socialProviders={["google", "github"]}
  signUpUrl="/signup"
  forgotPasswordUrl="/forgot-password"
  onSuccess={(user) => console.log("Logged in:", user)}
/>
```

---

#### `SignUpForm`

User registration form with email/password.

```typescript
interface SignUpFormProps {
  redirectTo?: string;
  showSocialAuth?: boolean;
  socialProviders?: Array<"google" | "github" | "apple" | "discord">;
  signInUrl?: string;
  requireTerms?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
  className?: string;
}

function SignUpForm(props: SignUpFormProps): JSX.Element;
```

**Usage:**
```typescript
<SignUpForm
  redirectTo="/dashboard"
  showSocialAuth={true}
  socialProviders={["google"]}
  signInUrl="/login"
  requireTerms={true}
  termsUrl="/terms"
  privacyUrl="/privacy"
/>
```

---

#### `ForgotPasswordForm`

Password reset request form.

```typescript
interface ForgotPasswordFormProps {
  redirectTo?: string;
  signInUrl?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

function ForgotPasswordForm(props: ForgotPasswordFormProps): JSX.Element;
```

**Usage:**
```typescript
<ForgotPasswordForm
  redirectTo="/login"
  signInUrl="/login"
  onSuccess={() => alert("Check your email!")}
/>
```

---

#### `ResetPasswordForm`

Password reset form with token validation.

```typescript
interface ResetPasswordFormProps {
  token: string;
  redirectTo?: string;
  signInUrl?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

function ResetPasswordForm(props: ResetPasswordFormProps): JSX.Element;
```

**Usage:**
```typescript
<ResetPasswordForm
  token={searchParams.get("token")}
  redirectTo="/login"
  signInUrl="/login"
/>
```

---

#### `ChangePasswordForm`

Password change form for authenticated users.

```typescript
interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

function ChangePasswordForm(props: ChangePasswordFormProps): JSX.Element;
```

**Usage:**
```typescript
<ChangePasswordForm
  onSuccess={() => alert("Password changed successfully!")}
/>
```

---

#### `UpdateProfileForm`

User profile update form.

```typescript
interface UpdateProfileFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
  className?: string;
}

function UpdateProfileForm(props: UpdateProfileFormProps): JSX.Element;
```

**Usage:**
```typescript
<UpdateProfileForm
  onSuccess={(user) => console.log("Profile updated:", user)}
/>
```

---

### Guards (`@auth/ui/guards`)

#### `SessionGuard`

Requires active session to render children.

```typescript
interface SessionGuardProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
  fallbackComponent?: ReactNode;
}

function SessionGuard(props: SessionGuardProps): JSX.Element;
```

**Usage:**
```typescript
<SessionGuard redirectTo="/login" loadingComponent={<Spinner />}>
  <Dashboard />
</SessionGuard>
```

---

#### `EmailVerifiedGuard`

Requires verified email to render children.

```typescript
interface EmailVerifiedGuardProps {
  children: ReactNode;
  redirectTo?: string;
  warningComponent?: ReactNode;
  allowUnverified?: boolean;
}

function EmailVerifiedGuard(props: EmailVerifiedGuardProps): JSX.Element;
```

**Usage:**
```typescript
<EmailVerifiedGuard redirectTo="/verify-email">
  <SensitiveContent />
</EmailVerifiedGuard>
```

---

#### `RoleGuard`

Requires specific role to render children.

```typescript
interface RoleGuardProps {
  children: ReactNode;
  role: UserRole | UserRole[];
  redirectTo?: string;
  fallbackComponent?: ReactNode;
}

function RoleGuard(props: RoleGuardProps): JSX.Element;
```

**Usage:**
```typescript
<RoleGuard role="admin" redirectTo="/dashboard" fallbackComponent={<AccessDenied />}>
  <AdminPanel />
</RoleGuard>

{/* Multiple roles */}
<RoleGuard role={["admin", "moderator"]} redirectTo="/dashboard">
  <ModeratorPanel />
</RoleGuard>
```

---

### Display Components (`@auth/ui/display`)

#### `UserAvatar`

User profile picture with fallback initials.

```typescript
interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackClassName?: string;
}

function UserAvatar(props: UserAvatarProps): JSX.Element;
```

**Usage:**
```typescript
<UserAvatar
  name={user.name}
  email={user.email}
  image={user.image}
  size="lg"
/>
```

---

#### `UserBadge`

Compact user info display.

```typescript
interface UserBadgeProps {
  user: User | PublicUser;
  showEmail?: boolean;
  showRole?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function UserBadge(props: UserBadgeProps): JSX.Element;
```

**Usage:**
```typescript
<UserBadge
  user={user}
  showEmail={true}
  showRole={true}
  size="md"
/>
```

---

#### `UserMenu`

Dropdown menu with user actions.

```typescript
interface UserMenuProps {
  user: User;
  profileUrl?: string;
  settingsUrl?: string;
  showSignOut?: boolean;
  onSignOut?: () => void;
  additionalItems?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
  }>;
  className?: string;
}

function UserMenu(props: UserMenuProps): JSX.Element;
```

**Usage:**
```typescript
<UserMenu
  user={user}
  profileUrl="/profile"
  settingsUrl="/settings"
  showSignOut={true}
  additionalItems={[
    { label: "Billing", href: "/billing", icon: <CreditCard /> },
    { label: "Help", href: "/help", icon: <HelpCircle /> },
  ]}
/>
```

---

### Action Components (`@auth/ui/actions`)

#### `SignOutButton`

Sign out button with optional confirmation.

```typescript
interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
  className?: string;
}

function SignOutButton(props: SignOutButtonProps): JSX.Element;
```

**Usage:**
```typescript
<SignOutButton
  variant="destructive"
  showConfirmation={true}
  redirectTo="/"
  onSuccess={() => console.log("Signed out")}
>
  Sign Out
</SignOutButton>
```

---

#### `SocialAuthButtons`

OAuth provider buttons.

```typescript
interface SocialAuthButtonsProps {
  providers: Array<"google" | "github" | "apple" | "discord">;
  redirectTo?: string;
  mode?: "signin" | "signup";
  layout?: "vertical" | "horizontal";
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
  className?: string;
}

function SocialAuthButtons(props: SocialAuthButtonsProps): JSX.Element;
```

**Usage:**
```typescript
<SocialAuthButtons
  providers={["google", "github", "apple"]}
  redirectTo="/dashboard"
  mode="signin"
  layout="vertical"
/>
```

---

### Feedback Components (`@auth/ui/feedback`)

#### `PasswordStrengthIndicator`

Real-time password strength visualization.

```typescript
interface PasswordStrengthIndicatorProps {
  password: string;
  showLabel?: boolean;
  showRequirements?: boolean;
  className?: string;
}

function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps): JSX.Element;
```

**Usage:**
```typescript
const [password, setPassword] = useState("");

<>
  <Input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <PasswordStrengthIndicator
    password={password}
    showLabel={true}
    showRequirements={true}
  />
</>
```

---

## Styling

All components use shadcn/ui and Tailwind CSS v4. They accept `className` prop for custom styling:

```typescript
<SignInForm className="w-full max-w-md mx-auto" />
<UserAvatar className="border-2 border-primary" />
```

## Versioning Policy

This package follows [Semantic Versioning 2.0.0](https://semver.org/).

### Stability Guarantees

✅ **Stable** - These exports are guaranteed stable:
- All component interfaces listed above
- All component props
- Category exports (`/forms`, `/guards`, `/display`, `/actions`, `/feedback`)

⚠️ **Experimental** - May change without major version bump:
- Components marked with `@experimental` JSDoc tag
- Internal utilities and helpers

❌ **Internal** - Explicitly blocked:
- Anything under `/src/*` subdirectories
- Internal helper functions
- Any import paths not listed in this document

### Platform Requirements

- **React**: ≥18.0.0 or ≥19.0.0
- **Next.js**: ≥14.0.0, ≥15.0.0, or ≥16.0.0
- **Tailwind CSS**: v4.x

## License

MIT
