/**
 * Forms Showcase Page
 *
 * Comprehensive demonstration of authentication forms with validation, error handling,
 * and accessibility features.
 */

"use client";

import { useState, type ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Code,
  Eye,
  BookOpen,
  User,
  Lock,
  Mail,
  Settings,
  Key,
  Shield,
  Check,
  X,
  AlertCircle,
  FormInput,
} from "lucide-react";

// Import form components and hooks
import {
  SignInForm,
  SignUpForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  ChangePasswordForm,
  UpdateProfileForm,
  useUser,
} from "@/lib/auth/setup";

/**
 * Form Documentation Interface
 */
interface FormDocProps {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  component: React.ReactNode;
  features: string[];
  validationRules: string[];
  accessibilityFeatures: string[];
  props: { name: string; type: string; description: string; default?: string }[];
  usage: string;
  errorHandling: string[];
  implementation: string;
}

/**
 * Current User Status Component
 */
function UserStatusPanel() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <Card className="border-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm">Loading user status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-500">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Current User Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Authentication:</span>
            {user ? (
              <Badge variant="default" className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Authenticated
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <X className="h-3 w-3 mr-1" />
                Not Authenticated
              </Badge>
            )}
          </div>

          {user && (
            <div className="space-y-1">
              <p className="text-sm">
                <strong>Name:</strong> {user.name || "Not provided"}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm">
                <strong>Email Verified:</strong> {user.emailVerified ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          )}

          {!user && <p className="text-xs text-muted-foreground">Test the forms below to see them in action</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Form Documentation Component
 */
function FormCard({
  id,
  name,
  description,
  icon: Icon,
  color,
  component,
  features,
  validationRules,
  errorHandling,
  accessibilityFeatures,
  implementation,
  usage,
  props,
}: FormDocProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div className="text-left">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription className="text-sm mt-1">{description}</CardDescription>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="px-0">
              <Tabs defaultValue="demo" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="demo">
                    <Eye className="h-4 w-4 mr-2" />
                    Demo
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code className="h-4 w-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="props">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Props
                  </TabsTrigger>
                  <TabsTrigger value="validation">
                    <Shield className="h-4 w-4 mr-2" />
                    Validation
                  </TabsTrigger>
                  <TabsTrigger value="accessibility">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    A11y
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Live Demo</h4>
                    <div className="border rounded-lg p-4 bg-muted/20">{component}</div>
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Key Features:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Usage Example</h4>
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{usage}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="props" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Props & Configuration</h4>
                    <div className="space-y-3">
                      {props.map((prop) => (
                        <div key={prop.name} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{prop.name}</code>
                            <Badge variant="outline" className="text-xs">
                              {prop.type}
                            </Badge>
                            {prop.default && (
                              <Badge variant="secondary" className="text-xs">
                                default: {prop.default}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{prop.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="validation" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Validation Rules</h4>
                    <ul className="space-y-2">
                      {validationRules.map((rule) => (
                        <li key={rule} className="flex items-start gap-2">
                          <Shield className="h-3 w-3 text-blue-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Error Handling</h4>
                    <ul className="space-y-2">
                      {errorHandling.map((error) => (
                        <li key={error} className="flex items-start gap-2">
                          <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="accessibility" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Accessibility Features</h4>
                    <ul className="space-y-2">
                      {accessibilityFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <User className="h-3 w-3 text-purple-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
}

/**
 * Main Forms Showcase Page Component
 */
export default function FormsShowcasePage() {
  // Form configurations for documentation
  const forms: FormDocProps[] = [
    {
      id: "signin",
      name: "SignInForm",
      description: "Complete sign-in form with email/password and social auth",
      icon: User,
      color: "text-green-600",
      component: (
        <SignInForm
          className="max-w-md mx-auto"
          showSocialAuth={true}
          socialProviders={["google"]}
          onSuccess={() => {
            // Handle success in demo
          }}
        />
      ),
      features: [
        "Email and password validation",
        "Social OAuth integration (Google, GitHub)",
        "Loading states during submission",
        "Comprehensive error handling",
        "Forgot password link integration",
        "Sign up link for new users",
        "Responsive design",
        "Auto-redirect after success",
      ],
      validationRules: [
        "Email format validation with proper regex",
        "Password minimum length requirement",
        "Required field validation",
        "Real-time form validation feedback",
      ],
      accessibilityFeatures: [
        "Screen reader compatible labels",
        "ARIA attributes for form states",
        "Keyboard navigation support",
        "Focus management",
        "Error announcements",
        "High contrast support",
      ],
      errorHandling: [
        "Invalid credentials error display",
        "Network error handling",
        "Rate limiting feedback",
        "Account locked notifications",
        "Social auth error recovery",
      ],
      props: [
        {
          name: "redirectTo",
          type: "string",
          description: "URL to redirect to after successful sign-in",
          default: "/dashboard",
        },
        { name: "onSuccess", type: "function", description: "Callback function called after successful sign-in" },
        { name: "showSocialAuth", type: "boolean", description: "Show social authentication buttons", default: "true" },
        {
          name: "socialProviders",
          type: "array",
          description: "Array of social providers to display",
          default: '["google"]',
        },
        { name: "showForgotPasswordLink", type: "boolean", description: "Show forgot password link", default: "true" },
      ],
      usage: `import { SignInForm } from "@/lib/auth/setup";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignInForm
        redirectTo="/dashboard"
        showSocialAuth={true}
        socialProviders={["google", "github"]}
        onSuccess={() => {
          console.log("Sign in successful!");
        }}
        className="w-full max-w-md"
      />
    </div>
  );
}`,
      implementation:
        "Built with React Hook Form + Better Auth. Features include real-time validation, social OAuth integration, and comprehensive error handling with loading states.",
    },
    {
      id: "signup",
      name: "SignUpForm",
      description: "User registration form with password strength and email verification",
      icon: User,
      color: "text-blue-600",
      component: (
        <SignUpForm
          className="max-w-md mx-auto"
          showSocialAuth={true}
          socialProviders={["google"]}
          showPasswordStrength={true}
          onSuccess={() => {
            // Handle success in demo
          }}
        />
      ),
      features: [
        "Name, email, and password fields",
        "Password confirmation validation",
        "Real-time password strength indicator",
        "Social OAuth registration",
        "Email verification workflow",
        "Terms of service integration",
        "Loading states and feedback",
        "Automatic sign-in after registration",
      ],
      validationRules: [
        "Name minimum 2 characters",
        "Email format validation",
        "Password strength requirements (8+ chars, mixed case, numbers)",
        "Password confirmation matching",
        "Unique email validation",
      ],
      accessibilityFeatures: [
        "Form field labels and descriptions",
        "Password strength announcements",
        "Error message associations",
        "Tab order optimization",
        "Screen reader friendly validation",
      ],
      errorHandling: [
        "Email already exists error",
        "Weak password warnings",
        "Password mismatch errors",
        "Social auth registration failures",
        "Email verification issues",
      ],
      props: [
        {
          name: "redirectTo",
          type: "string",
          description: "URL to redirect to after successful sign-up",
          default: "/dashboard",
        },
        {
          name: "showPasswordStrength",
          type: "boolean",
          description: "Show password strength indicator",
          default: "true",
        },
        { name: "showSocialAuth", type: "boolean", description: "Show social authentication buttons", default: "true" },
        {
          name: "socialProviders",
          type: "array",
          description: "Array of social providers to display",
          default: '["google"]',
        },
        { name: "onSuccess", type: "function", description: "Callback function called after successful sign-up" },
      ],
      usage: `import { SignUpForm } from "@/lib/auth/setup";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUpForm
        redirectTo="/dashboard"
        showPasswordStrength={true}
        showSocialAuth={true}
        socialProviders={["google", "github"]}
        onSuccess={() => {
          console.log("Account created successfully!");
        }}
        className="w-full max-w-md"
      />
    </div>
  );
}`,
      implementation:
        "Features comprehensive user registration with email verification, password strength indicators, and social OAuth integration. Built with React Hook Form for optimal performance.",
    },
    {
      id: "forgot-password",
      name: "ForgotPasswordForm",
      description: "Password reset request form with email verification",
      icon: Mail,
      color: "text-purple-600",
      component: (
        <ForgotPasswordForm
          className="max-w-md mx-auto"
          onSuccess={() => {
            // Handle success in demo
          }}
        />
      ),
      features: [
        "Email validation and submission",
        "Success confirmation message",
        "Rate limiting protection",
        "Email verification workflow",
        "Return to sign-in link",
        "Clear instructions for users",
      ],
      validationRules: [
        "Valid email format required",
        "Account existence verification",
        "Rate limiting (max requests per hour)",
      ],
      accessibilityFeatures: [
        "Clear form instructions",
        "Success/error message announcements",
        "Keyboard accessible",
        "Focus management",
      ],
      errorHandling: [
        "Invalid email format errors",
        "Account not found messages",
        "Rate limit exceeded warnings",
        "Email service failures",
      ],
      props: [
        { name: "onSuccess", type: "function", description: "Callback after successful password reset request" },
        { name: "onError", type: "function", description: "Callback when an error occurs" },
        { name: "signInUrl", type: "string", description: "Link back to sign-in page", default: "/login" },
        { name: "className", type: "string", description: "Additional CSS classes" },
      ],
      usage: `import { ForgotPasswordForm } from "@/lib/auth/setup";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ForgotPasswordForm
        onSuccess={() => {
          console.log("Password reset email sent!");
        }}
        signInUrl="/login"
        className="w-full max-w-md"
      />
    </div>
  );
}`,
      implementation:
        "Implements secure password reset flow with email verification. Features rate limiting, comprehensive validation, and seamless user experience with clear messaging.",
    },
    {
      id: "reset-password",
      name: "ResetPasswordForm",
      description: "Password reset form with token validation",
      icon: Lock,
      color: "text-orange-600",
      component: (
        <ResetPasswordForm
          className="max-w-md mx-auto"
          token="demo-token"
          onSuccess={() => {
            // Handle success in demo
          }}
        />
      ),
      features: [
        "Token validation",
        "Password strength checking",
        "Password confirmation",
        "Success feedback",
        "Automatic sign-in option",
        "Token expiry handling",
      ],
      validationRules: [
        "Valid reset token required",
        "Password strength requirements",
        "Password confirmation matching",
        "Token expiry validation",
      ],
      accessibilityFeatures: [
        "Password strength announcements",
        "Clear error messaging",
        "Focus management",
        "Screen reader support",
      ],
      errorHandling: [
        "Invalid or expired token",
        "Weak password warnings",
        "Password mismatch errors",
        "Network failures",
      ],
      props: [
        { name: "token", type: "string", description: "Password reset token from email link" },
        { name: "onSuccess", type: "function", description: "Callback after successful password reset" },
        { name: "redirectTo", type: "string", description: "URL to redirect to after reset", default: "/login" },
        { name: "autoSignIn", type: "boolean", description: "Automatically sign in after reset", default: "true" },
      ],
      usage: `import { ResetPasswordForm } from "@/lib/auth/setup";

export default function ResetPasswordPage({ 
  searchParams 
}: {
  searchParams: { token?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ResetPasswordForm
        token={searchParams.token || ""}
        onSuccess={() => {
          console.log("Password reset successful!");
        }}
        autoSignIn={true}
        className="w-full max-w-md"
      />
    </div>
  );
}`,
      implementation:
        "Secure password reset implementation with token validation, password strength checking, and automatic sign-in. Features comprehensive error handling and user feedback.",
    },
    {
      id: "change-password",
      name: "ChangePasswordForm",
      description: "Authenticated user password change form",
      icon: Key,
      color: "text-red-600",
      component: (
        <ChangePasswordForm
          className="max-w-md mx-auto"
          onSuccess={() => {
            // Handle success in demo
          }}
        />
      ),
      features: [
        "Current password verification",
        "New password validation",
        "Password strength indicator",
        "Success confirmation",
        "Session security options",
        "Password history checking",
      ],
      validationRules: [
        "Current password verification",
        "New password strength requirements",
        "Password confirmation matching",
        "Different from current password",
      ],
      accessibilityFeatures: [
        "Clear field labels",
        "Password strength feedback",
        "Error message associations",
        "Keyboard navigation",
      ],
      errorHandling: [
        "Incorrect current password",
        "Weak new password",
        "Password reuse detection",
        "Session authentication errors",
      ],
      props: [
        { name: "onSuccess", type: "function", description: "Callback after successful password change" },
        {
          name: "requireCurrentPassword",
          type: "boolean",
          description: "Require current password verification",
          default: "true",
        },
        {
          name: "showPasswordStrength",
          type: "boolean",
          description: "Show password strength indicator",
          default: "true",
        },
        {
          name: "logoutOtherSessions",
          type: "boolean",
          description: "Option to logout other sessions",
          default: "false",
        },
      ],
      usage: `import { ChangePasswordForm } from "@/lib/auth/setup";

export default function ChangePasswordPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>
      <ChangePasswordForm
        onSuccess={() => {
          console.log("Password changed successfully!");
        }}
        showPasswordStrength={true}
        logoutOtherSessions={true}
        className="max-w-md"
      />
    </div>
  );
}`,
      implementation:
        "Authenticated password change with current password verification, strength indicators, and session management options. Built for security and user control.",
    },
    {
      id: "update-profile",
      name: "UpdateProfileForm",
      description: "User profile update form with avatar and contact information",
      icon: Settings,
      color: "text-indigo-600",
      component: (
        <UpdateProfileForm
          className="max-w-md mx-auto"
          onSuccess={() => {
            // Handle success in demo
          }}
        />
      ),
      features: [
        "Name and email updating",
        "Avatar upload functionality",
        "Email verification workflow",
        "Profile image preview",
        "Form validation",
        "Optimistic updates",
      ],
      validationRules: [
        "Name minimum length validation",
        "Email format verification",
        "Image file type and size limits",
        "Email uniqueness checking",
      ],
      accessibilityFeatures: [
        "File upload accessibility",
        "Image alt text handling",
        "Form field labels",
        "Screen reader announcements",
      ],
      errorHandling: [
        "Image upload failures",
        "Email already taken errors",
        "File size/type errors",
        "Network upload issues",
      ],
      props: [
        { name: "onSuccess", type: "function", description: "Callback after successful profile update" },
        { name: "allowEmailChange", type: "boolean", description: "Allow email address changes", default: "true" },
        { name: "allowAvatarUpload", type: "boolean", description: "Enable avatar upload feature", default: "true" },
        {
          name: "maxFileSize",
          type: "number",
          description: "Maximum file size for avatar in bytes",
          default: "5242880",
        },
      ],
      usage: `import { UpdateProfileForm } from "@/lib/auth/setup";

export default function ProfilePage() {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      <UpdateProfileForm
        onSuccess={() => {
          console.log("Profile updated successfully!");
        }}
        allowEmailChange={true}
        allowAvatarUpload={true}
        maxFileSize={5 * 1024 * 1024} // 5MB
        className="max-w-md"
      />
    </div>
  );
}`,
      implementation:
        "Comprehensive profile management with avatar uploads, email change validation, and real-time updates. Features file upload handling and form validation.",
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Authentication Forms</h1>
        <p className="text-muted-foreground mt-2">
          Complete collection of pre-built forms with validation, accessibility, and error handling
        </p>
      </div>

      {/* User Status */}
      <UserStatusPanel />

      {/* Info Card */}
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FormInput className="h-5 w-5" />
            About Authentication Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our authentication forms are production-ready components built with React Hook Form, Zod validation, and
              comprehensive accessibility features. Each form handles loading states, error messages, and user feedback
              automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Form Features:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Real-time validation</li>
                  <li>• Loading states</li>
                  <li>• Error handling</li>
                  <li>• Social auth integration</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Accessibility:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Screen reader support</li>
                  <li>• Keyboard navigation</li>
                  <li>• ARIA attributes</li>
                  <li>• Focus management</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Validation:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Zod schema validation</li>
                  <li>• Password strength</li>
                  <li>• Email verification</li>
                  <li>• Custom error messages</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Documentation */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Forms</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Click on any form below to see live demos, implementation examples, validation rules, and accessibility
            features.
          </p>
        </div>

        {forms.map((form) => (
          <FormCard key={form.id} {...form} />
        ))}
      </div>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Implementation Guide
          </CardTitle>
          <CardDescription>Best practices for using authentication forms in your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">1. Form Integration</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Import forms from the auth setup
import { SignInForm, SignUpForm } from "@/lib/auth/setup";

// Use in your pages
export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignInForm
        redirectTo="/dashboard"
        showSocialAuth={true}
        onSuccess={() => {
          // Handle successful authentication
        }}
      />
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">2. Custom Validation</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// All forms use Zod validation schemas
import { SignUpSchema } from "@/lib/auth/validation";

// Extend or customize validation
const CustomSignUpSchema = SignUpSchema.extend({
  age: z.number().min(13, "Must be at least 13 years old"),
  acceptTerms: z.boolean().refine(val => val, {
    message: "You must accept the terms and conditions"
  })
});`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">3. Error Handling</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Forms handle errors automatically, but you can customize
<SignInForm
  onError={(error) => {
    // Custom error handling
    if (error.code === "invalid_credentials") {
      toast.error("Invalid email or password");
    } else if (error.code === "rate_limited") {
      toast.error("Too many attempts. Please try again later.");
    }
  }}
/>`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">4. Accessibility Features</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Forms include built-in accessibility features:
// - Proper ARIA labels and descriptions
// - Screen reader announcements for errors
// - Keyboard navigation support
// - Focus management
// - High contrast support

// You can enhance with custom ARIA attributes
<SignInForm
  aria-label="Sign in to your account"
  className="focus-within:ring-2 focus-within:ring-blue-500"
/>`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">✅ Do</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Provide clear success and error feedback
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Use appropriate form validation rules
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Implement loading states during submission
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Test with keyboard navigation and screen readers
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">❌ Don't</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Allow form submission without validation
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Use overly complex password requirements
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Forget to handle network failures gracefully
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Ignore accessibility requirements
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <h3 className="font-medium">Explore More Authentication Examples</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Learn about other authentication patterns and components
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/examples/guards">Guards</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/examples/hocs">HOCs</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/examples/error-handling">Error Handling</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/examples">All Examples</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
