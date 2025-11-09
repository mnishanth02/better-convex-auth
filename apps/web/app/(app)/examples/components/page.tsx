"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  SignInForm,
  SignUpForm,
  UpdateProfileForm,
  ChangePasswordForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  UserAvatar,
  UserBadge,
  UserMenu,
  SignOutButton,
  SessionGuard,
  RoleGuard,
  EmailVerifiedGuard,
  PasswordStrengthIndicator,
} from "@auth/ui";
import { useUser } from "@auth/web";
import { Code, Copy, CheckCircle2, Component, Palette, Shield, User, Lock } from "lucide-react";

interface ComponentDemo {
  id: string;
  title: string;
  description: string;
  category: "forms" | "display" | "guards" | "utilities";
  component: React.ReactNode;
  code: string;
  props?: Array<{ name: string; type: string; description: string; default?: string }>;
}

export default function ComponentsShowcasePage() {
  const { user } = useUser();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [password, setPassword] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const components: ComponentDemo[] = [
    {
      id: "signin-form",
      title: "SignInForm",
      description: "Pre-built sign-in form with email/password and social providers",
      category: "forms",
      component: (
        <div className="max-w-md mx-auto">
          <SignInForm redirectTo="/app/dashboard" />
        </div>
      ),
      code: `import { SignInForm } from "@auth/ui";

export default function SignInPage() {
  return (
    <SignInForm 
      redirectTo="/app/dashboard"
      showSocialProviders={true}
    />
  );
}`,
      props: [
        { name: "redirectTo", type: "string", description: "URL to redirect after successful sign in", default: "/" },
        {
          name: "showSocialProviders",
          type: "boolean",
          description: "Show social OAuth buttons",
          default: "true",
        },
      ],
    },
    {
      id: "signup-form",
      title: "SignUpForm",
      description: "Complete sign-up form with email verification",
      category: "forms",
      component: (
        <div className="max-w-md mx-auto">
          <SignUpForm redirectTo="/app/dashboard" />
        </div>
      ),
      code: `import { SignUpForm } from "@auth/ui";

export default function SignUpPage() {
  return (
    <SignUpForm 
      redirectTo="/app/dashboard"
      requireEmailVerification={true}
    />
  );
}`,
      props: [
        { name: "redirectTo", type: "string", description: "URL after successful sign up", default: "/" },
        {
          name: "requireEmailVerification",
          type: "boolean",
          description: "Require email verification",
          default: "false",
        },
      ],
    },
    {
      id: "update-profile-form",
      title: "UpdateProfileForm",
      description: "Form to update user profile information",
      category: "forms",
      component: (
        <div className="max-w-md mx-auto">
          <UpdateProfileForm />
        </div>
      ),
      code: `import { UpdateProfileForm } from "@auth/ui";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  
  return (
    <UpdateProfileForm 
      onSuccess={() => router.push("/app/profile")}
      allowImageUpload={true}
    />
  );
}`,
      props: [
        { name: "onSuccess", type: "() => void", description: "Callback after successful update" },
        { name: "allowImageUpload", type: "boolean", description: "Enable avatar upload", default: "true" },
      ],
    },
    {
      id: "change-password-form",
      title: "ChangePasswordForm",
      description: "Secure password change with current password verification",
      category: "forms",
      component: (
        <div className="max-w-md mx-auto">
          <ChangePasswordForm />
        </div>
      ),
      code: `import { ChangePasswordForm } from "@auth/ui";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const router = useRouter();
  
  return (
    <ChangePasswordForm 
      onSuccess={() => router.push("/app/security")}
      showRevokeSessionsOption={true}
    />
  );
}`,
      props: [
        { name: "onSuccess", type: "() => void", description: "Callback after successful change" },
        { name: "showRevokeSessionsOption", type: "boolean", description: "Show revoke option", default: "false" },
      ],
    },
    {
      id: "forgot-password-form",
      title: "ForgotPasswordForm",
      description: "Password reset request form",
      category: "forms",
      component: (
        <div className="max-w-md mx-auto">
          <ForgotPasswordForm />
        </div>
      ),
      code: `import { ForgotPasswordForm } from "@auth/ui";

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}`,
      props: [{ name: "redirectTo", type: "string", description: "URL after email sent", default: "/auth/login" }],
    },
    {
      id: "reset-password-form",
      title: "ResetPasswordForm",
      description: "Set new password with token validation",
      category: "forms",
      component: (
        <div className="max-w-md mx-auto">
          <ResetPasswordForm token="demo-token" />
        </div>
      ),
      code: `import { ResetPasswordForm } from "@auth/ui";

export default function ResetPasswordPage({ token }: { token: string }) {
  return (
    <ResetPasswordForm 
      token={token}
      redirectTo="/auth/login"
    />
  );
}`,
      props: [
        { name: "token", type: "string", description: "Reset token from email link", default: "required" },
        { name: "redirectTo", type: "string", description: "URL after reset", default: "/auth/login" },
      ],
    },
    {
      id: "user-avatar",
      title: "UserAvatar",
      description: "User avatar with fallback initials",
      category: "display",
      component: (
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center space-y-2">
            <UserAvatar size="sm" />
            <p className="text-xs text-muted-foreground">sm</p>
          </div>
          <div className="text-center space-y-2">
            <UserAvatar size="default" />
            <p className="text-xs text-muted-foreground">default</p>
          </div>
          <div className="text-center space-y-2">
            <UserAvatar size="lg" />
            <p className="text-xs text-muted-foreground">lg</p>
          </div>
          <div className="text-center space-y-2">
            <UserAvatar size="xl" />
            <p className="text-xs text-muted-foreground">xl</p>
          </div>
        </div>
      ),
      code: `import { UserAvatar } from "@auth/ui";

export default function ProfilePage() {
  return (
    <div className="flex items-center gap-4">
      <UserAvatar size="sm" />
      <UserAvatar size="default" />
      <UserAvatar size="lg" />
      <UserAvatar size="xl" />
    </div>
  );
}`,
      props: [
        {
          name: "size",
          type: '"sm" | "default" | "lg" | "xl"',
          description: "Avatar size",
          default: '"default"',
        },
        { name: "src", type: "string", description: "Image URL (optional)" },
        { name: "alt", type: "string", description: "Alt text" },
      ],
    },
    {
      id: "user-badge",
      title: "UserBadge",
      description: "Display user roles and verification status",
      category: "display",
      component: (
        <div className="flex flex-wrap gap-3">
          <UserBadge type="role" role="admin" />
          <UserBadge type="role" role="moderator" />
          <UserBadge type="emailVerified" emailVerified={true} />
          <UserBadge type="emailVerified" emailVerified={false} />
          <UserBadge type="status" status="premium" />
        </div>
      ),
      code: `import { UserBadge } from "@auth/ui";

export default function ProfilePage() {
  return (
    <div className="flex gap-2">
      <UserBadge type="role" role="admin" />
      <UserBadge type="emailVerified" emailVerified={true} />
      <UserBadge type="status" status="premium" />
    </div>
  );
}`,
      props: [
        {
          name: "variant",
          type: '"admin" | "moderator" | "verified" | "unverified" | "premium"',
          description: "Badge style",
        },
      ],
    },
    {
      id: "user-menu",
      title: "UserMenu",
      description: "Dropdown menu with user actions",
      category: "display",
      component: (
        <div className="flex justify-center">
          <UserMenu />
        </div>
      ),
      code: `import { UserMenu } from "@auth/ui";

export default function AppLayout() {
  return (
    <header>
      <UserMenu />
    </header>
  );
}`,
      props: [{ name: "align", type: '"start" | "center" | "end"', description: "Menu alignment", default: '"end"' }],
    },
    {
      id: "signout-button",
      title: "SignOutButton",
      description: "Sign out with redirect",
      category: "display",
      component: (
        <div className="flex gap-3">
          <SignOutButton>Sign Out</SignOutButton>
          <SignOutButton variant="outline">Sign Out</SignOutButton>
          <SignOutButton variant="ghost">Sign Out</SignOutButton>
        </div>
      ),
      code: `import { SignOutButton } from "@auth/ui";

export default function Header() {
  return (
    <SignOutButton redirectTo="/auth/login">
      Sign Out
    </SignOutButton>
  );
}`,
      props: [
        { name: "redirectTo", type: "string", description: "URL after sign out", default: "/auth/login" },
        {
          name: "variant",
          type: '"default" | "outline" | "ghost" | "destructive"',
          description: "Button variant",
          default: '"default"',
        },
      ],
    },
    {
      id: "session-guard",
      title: "SessionGuard",
      description: "Protect routes requiring authentication",
      category: "guards",
      component: (
        <div className="rounded-lg border p-6 bg-muted/50">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-5 w-5 text-green-600" />
            <p className="font-semibold">Protected Content</p>
          </div>
          <p className="text-sm text-muted-foreground">
            This content is wrapped in SessionGuard and only visible to authenticated users.
          </p>
          <p className="text-sm mt-2">Current user: {user?.name || "Unknown"}</p>
        </div>
      ),
      code: `import { SessionGuard } from "@auth/ui";

export default function DashboardLayout({ children }) {
  return (
    <SessionGuard fallback="/auth/login">
      {children}
    </SessionGuard>
  );
}`,
      props: [
        {
          name: "fallback",
          type: "string",
          description: "Redirect URL for unauthenticated users",
          default: "/auth/login",
        },
        { name: "children", type: "ReactNode", description: "Protected content" },
      ],
    },
    {
      id: "role-guard",
      title: "RoleGuard",
      description: "Restrict access by user role",
      category: "guards",
      component: (
        <div className="space-y-4">
          <RoleGuard roles={["admin"]} redirectTo="/app/dashboard">
            <div className="rounded-lg border p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <p className="font-semibold text-sm">Admin Section</p>
              </div>
              <p className="text-xs text-muted-foreground">Only admins can see this</p>
            </div>
          </RoleGuard>
          <RoleGuard roles={["moderator"]} redirectTo="/app/dashboard">
            <div className="rounded-lg border p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <p className="font-semibold text-sm">Moderator Section</p>
              </div>
              <p className="text-xs text-muted-foreground">Only moderators can see this</p>
            </div>
          </RoleGuard>
        </div>
      ),
      code: `import { RoleGuard } from "@auth/ui";

export default function AdminPage() {
  return (
    <RoleGuard roles={["admin"]} redirectTo="/app/dashboard">
      <h1>Admin Dashboard</h1>
      {/* Admin-only content */}
    </RoleGuard>
  );
}`,
      props: [
        { name: "roles", type: "string[]", description: "Required roles (array)" },
        { name: "redirectTo", type: "string", description: "Redirect URL for unauthorized users" },
        { name: "children", type: "ReactNode", description: "Protected content" },
      ],
    },
    {
      id: "email-verified-guard",
      title: "EmailVerifiedGuard",
      description: "Require email verification",
      category: "guards",
      component: (
        <div className="rounded-lg border p-6 bg-muted/50">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="font-semibold">Email Verified Content</p>
          </div>
          <p className="text-sm text-muted-foreground">
            This content requires verified email. Current status:{" "}
            {user?.emailVerified ? (
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-800">Unverified</Badge>
            )}
          </p>
        </div>
      ),
      code: `import { EmailVerifiedGuard } from "@auth/ui";

export default function PremiumContent() {
  return (
    <EmailVerifiedGuard>
      <div>Premium content for verified users</div>
    </EmailVerifiedGuard>
  );
}`,
      props: [
        {
          name: "fallback",
          type: "ReactNode",
          description: "UI shown to unverified users",
          default: "Verification banner",
        },
        { name: "children", type: "ReactNode", description: "Content for verified users" },
      ],
    },
    {
      id: "password-strength-indicator",
      title: "PasswordStrengthIndicator",
      description: "Visual password strength meter",
      category: "utilities",
      component: (
        <div className="space-y-4 max-w-md">
          <input
            type="password"
            placeholder="Enter password to test strength"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <PasswordStrengthIndicator password={password} />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Weak: {"<"} 6 characters</p>
            <p>• Medium: 6-12 characters</p>
            <p>• Strong: {">"} 12 characters with mixed case, numbers, symbols</p>
          </div>
        </div>
      ),
      code: `import { PasswordStrengthIndicator } from "@auth/ui";
import { useState } from "react";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  
  return (
    <div>
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordStrengthIndicator password={password} />
    </div>
  );
}`,
      props: [
        { name: "password", type: "string", description: "Password to evaluate", default: "required" },
        { name: "showLabel", type: "boolean", description: "Show strength label", default: "true" },
      ],
    },
  ];

  const categories = [
    { id: "all", label: "All Components", icon: Component, count: components.length },
    {
      id: "forms",
      label: "Forms",
      icon: Palette,
      count: components.filter((c) => c.category === "forms").length,
    },
    {
      id: "display",
      label: "Display",
      icon: User,
      count: components.filter((c) => c.category === "display").length,
    },
    {
      id: "guards",
      label: "Guards",
      icon: Shield,
      count: components.filter((c) => c.category === "guards").length,
    },
    {
      id: "utilities",
      label: "Utilities",
      icon: Lock,
      count: components.filter((c) => c.category === "utilities").length,
    },
  ];

  const filteredComponents =
    categoryFilter === "all" ? components : components.filter((c) => c.category === categoryFilter);

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Component Showcase</h1>
        <p className="text-muted-foreground mt-1">
          Explore all authentication components from @auth/ui with live examples and code
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={categoryFilter === cat.id ? "default" : "outline"}
              onClick={() => setCategoryFilter(cat.id)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {cat.label}
              <Badge variant="secondary" className="ml-1">
                {cat.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Component Grid */}
      <div className="space-y-6">
        {filteredComponents.map((demo) => (
          <Card key={demo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{demo.title}</CardTitle>
                  <CardDescription className="mt-1">{demo.description}</CardDescription>
                </div>
                <Badge variant="secondary">{demo.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  {demo.props && <TabsTrigger value="props">Props</TabsTrigger>}
                </TabsList>

                <TabsContent value="preview" className="mt-6">
                  <div className="rounded-lg border p-8 bg-muted/30">{demo.component}</div>
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-3 right-3 z-10"
                      onClick={() => copyToClipboard(demo.code, demo.id)}
                    >
                      {copiedId === demo.id ? (
                        <>
                          <CheckCircle2 className="mr-2 h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                    <pre className="rounded-lg border bg-muted p-4 overflow-x-auto">
                      <code className="text-sm">{demo.code}</code>
                    </pre>
                  </div>
                </TabsContent>

                {demo.props && (
                  <TabsContent value="props" className="mt-6">
                    <div className="rounded-lg border">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 font-semibold text-sm">Prop</th>
                            <th className="text-left p-3 font-semibold text-sm">Type</th>
                            <th className="text-left p-3 font-semibold text-sm">Default</th>
                            <th className="text-left p-3 font-semibold text-sm">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {demo.props.map((prop, index) => (
                            <tr key={prop.name} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                              <td className="p-3">
                                <code className="text-sm font-mono">{prop.name}</code>
                              </td>
                              <td className="p-3">
                                <code className="text-sm font-mono text-blue-600">{prop.type}</code>
                              </td>
                              <td className="p-3">
                                <code className="text-sm font-mono text-muted-foreground">{prop.default || "-"}</code>
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">{prop.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>Common patterns and best practices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Import Components</h3>
            <pre className="rounded-lg border bg-muted p-3 text-sm overflow-x-auto">
              <code>{`import { SignInForm, UserAvatar, SessionGuard } from "@auth/ui";`}</code>
            </pre>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Protected Route Pattern</h3>
            <pre className="rounded-lg border bg-muted p-3 text-sm overflow-x-auto">
              <code>{`export default function DashboardLayout({ children }) {
  return (
    <SessionGuard fallback="/auth/login">
      {children}
    </SessionGuard>
  );
}`}</code>
            </pre>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Role-Based Content</h3>
            <pre className="rounded-lg border bg-muted p-3 text-sm overflow-x-auto">
              <code>{`<RoleGuard roles={["admin"]} redirectTo="/app/dashboard">
  <AdminDashboard />
</RoleGuard>`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
