# API Reference

Complete API documentation for Better Convex Auth components, hooks, and utilities.

## Table of Contents

- [Authentication Hooks](#authentication-hooks)
- [Form Components](#form-components)
- [UI Components](#ui-components)
- [Accessibility Components](#accessibility-components)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)

## Authentication Hooks

### `useAuth()`

Primary hook for accessing authentication state and methods.

```typescript
const { 
  user,           // Current user object | null
  isLoading,      // boolean - Authentication loading state
  isSignedIn,     // boolean - User authentication status
  session,        // Session object | null
  error          // Error object | null
} = useAuth();
```

**Return Values:**

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user object |
| `isLoading` | `boolean` | True while authentication state is loading |
| `isSignedIn` | `boolean` | True if user is authenticated |
| `session` | `Session \| null` | Current session object |
| `error` | `Error \| null` | Authentication error if any |

**Example:**

```typescript
function UserProfile() {
  const { user, isLoading, isSignedIn } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

### `useSession()`

Hook for accessing and managing session data.

```typescript
const { 
  data: session,    // Session data
  status,          // Session status
  update          // Update session function
} = useSession();
```

**Status Values:**
- `"loading"` - Session is being loaded
- `"authenticated"` - User is signed in
- `"unauthenticated"` - User is not signed in

**Example:**

```typescript
function SessionManager() {
  const { data: session, status, update } = useSession();

  const updateSession = async () => {
    await update({ name: "Updated Name" });
  };

  if (status === "loading") return <div>Loading session...</div>;

  return (
    <div>
      <p>Status: {status}</p>
      {session && (
        <button onClick={updateSession}>
          Update Session
        </button>
      )}
    </div>
  );
}
```

## Form Components

### `<FormProvider>`

Provides form context for error handling and validation state.

```typescript
interface FormProviderProps {
  children: React.ReactNode;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
  touched?: Record<string, boolean>;
}
```

**Example:**

```typescript
function MyForm() {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <FormProvider 
      errors={errors} 
      touched={touched} 
      isSubmitting={isSubmitting}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

### `<AccessibleInput>`

Enhanced input component with full accessibility support.

```typescript
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  description?: string;
  showPasswordToggle?: boolean;
  success?: boolean;
  errorMessage?: string;
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Field name (required) |
| `label` | `string` | - | Field label |
| `description` | `string` | - | Help text |
| `showPasswordToggle` | `boolean` | `false` | Show password visibility toggle |
| `success` | `boolean` | `false` | Show success state |
| `errorMessage` | `string` | - | Override error message |

**Example:**

```typescript
<AccessibleInput
  name="email"
  type="email"
  label="Email Address"
  description="We'll never share your email"
  required
  placeholder="john@example.com"
/>

<AccessibleInput
  name="password"
  type="password"
  label="Password"
  showPasswordToggle
  required
/>
```

### `<AccessibleTextarea>`

Enhanced textarea component with character counting and validation.

```typescript
interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}
```

**Example:**

```typescript
<AccessibleTextarea
  name="message"
  label="Message"
  description="Tell us how we can help"
  maxLength={500}
  showCharacterCount
  rows={4}
  required
/>
```

## UI Components

### `<AccessibleButton>`

Enhanced button with loading states and accessibility features.

```typescript
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  announceOnClick?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}
```

**Variants:**
- `default` - Primary button style
- `destructive` - Red button for dangerous actions
- `outline` - Outlined button
- `secondary` - Secondary button style
- `ghost` - Minimal button style
- `link` - Link-styled button

**Example:**

```typescript
<AccessibleButton
  loading={isSubmitting}
  loadingText="Saving changes..."
  announceOnClick="Form submitted successfully"
  variant="default"
  size="lg"
>
  Submit Form
</AccessibleButton>
```

### `<SkipLinks>`

Navigation shortcuts for keyboard users.

```typescript
interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

interface SkipLink {
  id: string;
  label: string;
  href: string;
}
```

**Example:**

```typescript
<SkipLinks 
  links={[
    { id: "main", label: "Skip to main content", href: "#main" },
    { id: "nav", label: "Skip to navigation", href: "#navigation" },
  ]}
/>
```

### `<AccessibleNavigation>`

Navigation component with keyboard support and mobile menu.

```typescript
interface AccessibleNavigationProps {
  items: NavigationItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
  label?: string;
  showMobileMenu?: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  external?: boolean;
}
```

**Example:**

```typescript
const navItems = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "profile", label: "Profile", href: "/profile", icon: User },
];

<AccessibleNavigation 
  items={navItems}
  label="Main navigation"
  showMobileMenu
/>
```

## Empty State Components

### `<EmptyDashboard>`

Welcome screen for new users with onboarding guidance.

```typescript
interface EmptyDashboardProps {
  userName?: string;
  onGetStarted?: () => void;
  showQuickActions?: boolean;
  className?: string;
}
```

**Example:**

```typescript
<EmptyDashboard
  userName="John Doe"
  onGetStarted={() => router.push("/onboarding")}
  showQuickActions
/>
```

### `<EmptyProfile>`

Profile completion tracking with progress indicators.

```typescript
interface EmptyProfileProps {
  onEditProfile?: () => void;
  onUploadPhoto?: () => void;
  completionItems?: Array<{ label: string; completed: boolean }>;
  className?: string;
}
```

**Example:**

```typescript
<EmptyProfile
  onEditProfile={() => router.push("/profile/edit")}
  onUploadPhoto={() => openUploadDialog()}
  completionItems={[
    { label: "Add profile photo", completed: false },
    { label: "Update display name", completed: true },
  ]}
/>
```

### `<EmptyAdmin>`

Admin panel states for access control scenarios.

```typescript
interface EmptyAdminProps {
  type: "no-access" | "no-data" | "setup-required";
  userRole?: string;
  onRequestAccess?: () => void;
  onSetupAdmin?: () => void;
  className?: string;
}
```

**Example:**

```typescript
<EmptyAdmin
  type="no-access"
  userRole="user"
  onRequestAccess={() => requestAdminAccess()}
/>
```

## Accessibility Hooks

### `useFocusManagement()`

Hook for managing focus states and trapping.

```typescript
const {
  setFocus,      // (element?: HTMLElement) => void
  restoreFocus,  // () => void
  trapFocus,     // (container: HTMLElement) => cleanup
  focusableRef   // React.RefObject<HTMLElement>
} = useFocusManagement();
```

**Example:**

```typescript
function Modal({ isOpen, onClose }) {
  const { trapFocus, restoreFocus } = useFocusManagement();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      return cleanup;
    }
  }, [isOpen, trapFocus]);

  return (
    <div ref={modalRef} role="dialog">
      {/* Modal content */}
    </div>
  );
}
```

### `useAriaLive()`

Hook for screen reader announcements.

```typescript
const { 
  announce  // (message: string, options?: AriaLiveOptions) => void
} = useAriaLive();

interface AriaLiveOptions {
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: string;
}
```

**Example:**

```typescript
function FormSubmit() {
  const { announce } = useAriaLive();

  const handleSubmit = async () => {
    try {
      await submitForm();
      announce("Form submitted successfully!", { politeness: "polite" });
    } catch (error) {
      announce("Failed to submit form", { politeness: "assertive" });
    }
  };
}
```

### `useKeyboardNavigation()`

Hook for keyboard event handling.

```typescript
const { handleKeyDown } = useKeyboardNavigation(
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
);
```

**Example:**

```typescript
function MenuItems() {
  const { handleKeyDown } = useKeyboardNavigation(
    () => selectItem(),      // Enter
    () => closeMenu(),       // Escape
    () => navigateUp(),      // Arrow Up
    () => navigateDown()     // Arrow Down
  );

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Menu items */}
    </div>
  );
}
```

## Utility Functions

### Authentication Functions

#### `signIn(provider, options?)`

Initiate sign-in process.

```typescript
// Social providers
await signIn("google");
await signIn("github");
await signIn("apple");
await signIn("discord");

// Email/password
await signIn("credentials", {
  email: "user@example.com",
  password: "password123"
});

// Magic link
await signIn("email", {
  email: "user@example.com"
});

// With redirect
await signIn("google", { 
  callbackUrl: "/dashboard" 
});
```

#### `signOut(options?)`

Sign out the current user.

```typescript
// Simple sign out
await signOut();

// With redirect
await signOut({ callbackUrl: "/" });

// Without redirect
await signOut({ redirect: false });
```

### Utility Functions

#### `getFocusableElements(container)`

Get all focusable elements within a container.

```typescript
const focusableElements = getFocusableElements(containerElement);
```

#### `generateId(prefix?)`

Generate a unique ID for accessibility purposes.

```typescript
const uniqueId = generateId("input"); // "input-abc123def"
```

#### `buildAriaAttributes(config)`

Build ARIA attributes object.

```typescript
const ariaAttrs = buildAriaAttributes({
  "aria-label": "Close dialog",
  "aria-expanded": isExpanded,
  "aria-describedby": descriptionId
});
```

## Type Definitions

### User Types

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: boolean;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Session Types

```typescript
interface Session {
  user: User;
  expires: string;
  accessToken?: string;
  refreshToken?: string;
}
```

### Auth Configuration

```typescript
interface AuthConfig {
  baseURL: string;
  pages?: {
    signIn?: string;
    signUp?: string;
    error?: string;
    verifyRequest?: string;
    newUser?: string;
  };
  callbacks?: {
    jwt?: (params: JWTParams) => Promise<JWT>;
    session?: (params: SessionParams) => Promise<Session>;
    signIn?: (params: SignInParams) => Promise<boolean>;
  };
  events?: {
    signIn?: (message: SignInEventMessage) => Promise<void>;
    signOut?: (message: SignOutEventMessage) => Promise<void>;
  };
}
```

### Component Props

```typescript
// Accessibility component props
interface AriaAttributes {
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-hidden"?: boolean;
  "aria-live"?: "off" | "polite" | "assertive";
  "aria-atomic"?: boolean;
  "aria-busy"?: boolean;
  "aria-disabled"?: boolean;
  "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
  "aria-required"?: boolean;
  tabIndex?: number;
}

// Form validation types
interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Empty state types
interface EmptyStateConfig {
  title: string;
  description: string;
  icon?: React.ComponentType;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}
```

## Error Handling

### Error Types

```typescript
interface AuthError extends Error {
  code: string;
  type: "AuthError";
  cause?: Error;
}

// Common error codes
type ErrorCode = 
  | "Configuration"
  | "AccessDenied" 
  | "Verification"
  | "Default"
  | "SignIn"
  | "OAuthSignIn"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "SessionRequired"
  | "MissingAdapter"
  | "MissingSecret";
```

### Error Handling Examples

```typescript
// Catch authentication errors
try {
  await signIn("credentials", { email, password });
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case "SignIn":
        setError("Invalid credentials");
        break;
      case "OAuthSignIn":
        setError("OAuth provider error");
        break;
      default:
        setError("Authentication failed");
    }
  }
}

// Handle session errors
const { data: session, error } = useSession();
if (error) {
  console.error("Session error:", error);
}
```

## Testing

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { AccessibleButton } from "@workspace/z-auth/components";

test("accessible button announces loading state", () => {
  render(
    <AccessibleButton loading loadingText="Saving...">
      Save
    </AccessibleButton>
  );

  expect(screen.getByText("Loading")).toBeInTheDocument();
  expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
});
```

### Hook Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@workspace/z-auth/hooks";

test("useAuth returns loading state initially", () => {
  const { result } = renderHook(() => useAuth());
  
  expect(result.current.isLoading).toBe(true);
  expect(result.current.user).toBe(null);
});
```

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

test("form has no accessibility violations", async () => {
  const { container } = render(<AccessibleForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```