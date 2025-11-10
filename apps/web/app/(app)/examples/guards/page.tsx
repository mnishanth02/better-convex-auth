"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { CheckCircle2, Code, Eye, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { EmailVerifiedGuard, getUserRole, RoleGuard, SessionGuard, useUser } from "@/lib/auth/setup";
import { generateUniqueId } from "@/lib/utils";

export default function GuardsExamplePage() {
  const { user } = useUser();
  const [activeDemo, setActiveDemo] = useState<string>("session");

  const guards = [
    {
      id: "session",
      name: "SessionGuard",
      description: "Protects routes that require authentication",
      icon: Lock,
      color: "text-blue-600",
      usage: `<SessionGuard
  fallback={<LoginPrompt />}
  redirectTo="/login"
>
  <ProtectedContent />
</SessionGuard>`,
      demo: (
        <SessionGuard
          unauthorizedComponent={
            <Card className="border-yellow-500">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <Lock className="h-8 w-8 text-yellow-600 mx-auto" />
                  <p className="text-yellow-600 font-medium">🔐 Authentication Required</p>
                  <p className="text-sm text-muted-foreground">You must be signed in to view this content</p>
                  <Button size="sm" variant="outline">
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          }
        >
          <Card className="border-green-500">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                <p className="text-green-600 font-semibold">✅ You are authenticated!</p>
                <p className="text-sm text-muted-foreground">
                  Welcome, {user?.name || "User"}. This content is protected.
                </p>
              </div>
            </CardContent>
          </Card>
        </SessionGuard>
      ),
      props: [
        { name: "children", type: "ReactNode", description: "Protected content to render when authenticated" },
        { name: "redirectTo", type: "string", description: "URL to redirect unauthenticated users", default: "/login" },
        {
          name: "requireEmailVerified",
          type: "boolean",
          description: "Also require email verification",
          default: "false",
        },
        { name: "unauthorizedComponent", type: "ReactNode", description: "Custom component for unauthenticated state" },
        { name: "loadingComponent", type: "ReactNode", description: "Custom loading component" },
      ],
    },
    {
      id: "role",
      name: "RoleGuard",
      description: "Restricts access based on user roles",
      icon: Shield,
      color: "text-purple-600",
      usage: `<RoleGuard
  roles={["admin", "moderator"]}
  unauthorizedComponent={<AccessDenied />}
>
  <AdminPanel />
</RoleGuard>`,
      demo: (
        <div className="space-y-4">
          <RoleGuard
            roles={["admin"]}
            unauthorizedComponent={
              <Card className="border-red-500">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <Shield className="h-8 w-8 text-red-600 mx-auto" />
                    <p className="text-red-600 font-medium">⛔ Admin Access Required</p>
                    <p className="text-xs text-muted-foreground">Your role: {getUserRole(user) || "user"}</p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <Card className="border-green-500">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 text-green-600 mx-auto" />
                  <p className="text-green-600 font-semibold">✅ Admin Panel Access Granted</p>
                  <Badge className="bg-purple-100 text-purple-800">Role: {getUserRole(user) || "user"}</Badge>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          <RoleGuard
            roles={["moderator", "admin"]}
            unauthorizedComponent={
              <Card className="border-yellow-500">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <Shield className="h-8 w-8 text-yellow-600 mx-auto" />
                    <p className="text-yellow-600 font-medium">⚠️ Moderator+ Access Required</p>
                    <p className="text-xs text-muted-foreground">Need moderator or admin role</p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <Card className="border-green-500">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-green-600 font-semibold">✅ Moderator Panel Access</p>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>
        </div>
      ),
      props: [
        { name: "roles", type: "string | string[]", description: "Required role(s) - user must have at least one" },
        {
          name: "requireAll",
          type: "boolean",
          description: "If true, user must have ALL specified roles",
          default: "false",
        },
        { name: "children", type: "ReactNode", description: "Content to render if user has required role(s)" },
        { name: "redirectTo", type: "string", description: "URL to redirect unauthorized users" },
        { name: "unauthorizedComponent", type: "ReactNode", description: "Custom component for unauthorized state" },
        { name: "loadingComponent", type: "ReactNode", description: "Custom loading component" },
      ],
    },
    {
      id: "email",
      name: "EmailVerifiedGuard",
      description: "Ensures user has verified their email",
      icon: Mail,
      color: "text-green-600",
      usage: `<EmailVerifiedGuard
  showResendButton={true}
  title="Verify Your Email"
>
  <SensitiveContent />
</EmailVerifiedGuard>`,
      demo: (
        <EmailVerifiedGuard
          unverifiedComponent={
            <Card className="border-yellow-500">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <Mail className="h-8 w-8 text-yellow-600 mx-auto" />
                  <p className="text-yellow-600 font-medium">📧 Email Verification Required</p>
                  <p className="text-sm text-muted-foreground">Please verify your email to access this content</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                      {user?.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Resend Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          }
        >
          <Card className="border-green-500">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                <p className="text-green-600 font-semibold">✅ Email Verified Content</p>
                <Badge className="bg-green-100 text-green-800">Email Status: Verified</Badge>
              </div>
            </CardContent>
          </Card>
        </EmailVerifiedGuard>
      ),
      props: [
        { name: "children", type: "ReactNode", description: "Content to render if email is verified" },
        { name: "redirectTo", type: "string", description: "URL to redirect if email is not verified" },
        {
          name: "showResendButton",
          type: "boolean",
          description: "Show resend verification email button",
          default: "true",
        },
        {
          name: "resendEndpoint",
          type: "string",
          description: "API endpoint for resending verification email",
          default: "/api/auth/resend-verification",
        },
        {
          name: "title",
          type: "string",
          description: "Custom title for unverified message",
          default: "Email Verification Required",
        },
        { name: "description", type: "string", description: "Custom description for unverified message" },
        { name: "unverifiedComponent", type: "ReactNode", description: "Custom component for unverified state" },
        { name: "loadingComponent", type: "ReactNode", description: "Custom loading component" },
      ],
    },
  ];

  const selectedGuard = guards.find((g) => g.id === activeDemo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Authentication Guards</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive route protection and access control components with live demonstrations
        </p>
      </div>

      {/* Current User Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Current User Status
          </CardTitle>
          <CardDescription>This shows your current authentication state for testing the guards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication:</span>
              <Badge variant={user ? "default" : "secondary"}>{user ? "Signed In" : "Not Signed In"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Status:</span>
              <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                {user?.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Role:</span>
              <Badge variant="outline">{getUserRole(user) || "user"}</Badge>
            </div>
          </div>
          {user && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Welcome, {user.name || "User"}!</strong>
                {user.email && ` (${user.email})`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Guard Demos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Interactive Guard Demonstrations
          </CardTitle>
          <CardDescription>
            Click on each guard type to see live demonstrations with your current user state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {guards.map((guard) => {
              const Icon = guard.icon;
              return (
                <Button
                  key={guard.id}
                  variant={activeDemo === guard.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setActiveDemo(guard.id)}
                >
                  <Icon className={`h-6 w-6 ${guard.color}`} />
                  <div className="text-center">
                    <div className="font-medium">{guard.name}</div>
                    <div className="text-xs text-muted-foreground">{guard.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          {selectedGuard && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedGuard.name}</h3>
                <p className="text-muted-foreground">{selectedGuard.description}</p>
              </div>

              <Tabs defaultValue="demo" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="demo">Live Demo</TabsTrigger>
                  <TabsTrigger value="code">Code Example</TabsTrigger>
                  <TabsTrigger value="props">Props</TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/20">{selectedGuard.demo}</div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Usage Example</h4>
                    <pre className="rounded-lg border bg-muted p-4 text-sm overflow-x-auto">
                      <code>{selectedGuard.usage}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="props" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Component Props</h4>
                    <div className="grid gap-4">
                      {selectedGuard.props.map((prop) => (
                        <div key={generateUniqueId()} className="flex items-start justify-between p-3 border rounded">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono bg-muted px-1 rounded">{prop.name}</code>
                              <Badge variant="outline" className="text-xs">
                                {prop.type}
                              </Badge>
                              {prop.default && (
                                <Badge variant="secondary" className="text-xs">
                                  Default: {prop.default}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{prop.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Combination Examples */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Combining Guards
          </CardTitle>
          <CardDescription>Guards can be nested to create complex access control scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Nested Guard Example</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This example shows how to combine multiple guards for maximum security
            </p>
            <pre className="rounded-lg border bg-muted p-4 text-sm overflow-x-auto">
              <code>{`<SessionGuard>
  <EmailVerifiedGuard>
    <RoleGuard roles={["admin"]}>
      <SuperSecretContent />
    </RoleGuard>
  </EmailVerifiedGuard>
</SessionGuard>`}</code>
            </pre>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Conditional Guard Example</h4>
            <p className="text-sm text-muted-foreground mb-4">
              You can also use guards conditionally based on business logic
            </p>
            <pre className="rounded-lg border bg-muted p-4 text-sm overflow-x-auto">
              <code>{`function ProtectedPage() {
  const { user } = useUser();
  const isVIP = user?.subscriptionTier === 'vip';
  
  return (
    <SessionGuard>
      {isVIP ? (
        <VIPContent />
      ) : (
        <EmailVerifiedGuard>
          <RegularContent />
        </EmailVerifiedGuard>
      )}
    </SessionGuard>
  );
}`}</code>
            </pre>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Layout Guard Pattern</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Apply guards at the layout level to protect entire route groups
            </p>
            <pre className="rounded-lg border bg-muted p-4 text-sm overflow-x-auto">
              <code>{`// app/(app)/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <SessionGuard>
      <RoleGuard roles={["admin"]} redirectTo="/dashboard">
        <AdminShell>
          {children}
        </AdminShell>
      </RoleGuard>
    </SessionGuard>
  );
}`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Implementation Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">✅ Best Practices</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Use guards at layout level for route group protection
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Provide meaningful fallback components for better UX
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Use redirectTo for seamless authentication flow
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Test guards with different user states
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-600">❌ Common Pitfalls</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">✗</span>
                  Don't rely solely on client-side guards for security
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">✗</span>
                  Avoid complex nested conditions inside guards
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">✗</span>
                  Don't forget to handle loading states properly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">✗</span>
                  Don't use guards without server-side validation
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
