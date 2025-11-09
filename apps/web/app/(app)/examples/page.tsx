"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Code, Palette, Zap, Calculator, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

export default function ExamplesPage() {
  const examples = [
    {
      title: "Components Showcase",
      description:
        "Interactive demonstrations of all 14 @auth/ui components with live previews, code snippets, and props documentation",
      href: "/examples/components",
      icon: Palette,
      badge: "14 Components",
      features: [
        "6 Form components (SignIn, SignUp, Profile, Password, etc.)",
        "4 Display components (Avatar, Badge, Menu, SignOut)",
        "3 Guard components (Session, Role, Email verification)",
        "1 Utility component (Password strength indicator)",
        "Tabbed interface (Preview / Code / Props)",
        "Category filtering and search",
        "Copy-to-clipboard code examples",
      ],
    },
    {
      title: "Hooks Demo",
      description: "Live demonstrations of @auth/web hooks with real-time data and interactive examples",
      href: "/examples/hooks",
      icon: Zap,
      badge: "5 Hooks",
      features: [
        "useSession() - Access current session data",
        "useUser() - Get user profile and verification status",
        "useSignIn() - Build custom sign-in forms",
        "useSignUp() - Build custom sign-up forms",
        "useSignOut() - Sign out with redirect control",
        "Live authentication state integration",
        "Complete implementation examples",
      ],
    },
    {
      title: "Utility Functions",
      description: "Interactive testing of @auth/core utility functions with custom inputs and visual feedback",
      href: "/examples/utilities",
      icon: Calculator,
      badge: "7 Utilities",
      features: [
        "getUserDisplayName() - User-friendly display names",
        "getUserInitials() - Extract initials for avatars",
        "hasRole() / isAdmin() / isModerator() - Role checks",
        "isEmailVerified() - Email verification status",
        "isSessionExpired() - Session expiry validation",
        "Interactive testing with live inputs",
        "Visual feedback and results",
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-2">
          <BookOpen className="h-4 w-4" />
          Developer Documentation
        </div>
        <h1 className="text-4xl font-bold">Auth Module Examples</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive demonstrations of all authentication components, hooks, and utilities with live code examples
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">14</div>
              <p className="text-sm text-muted-foreground">UI Components</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">React Hooks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">7</div>
              <p className="text-sm text-muted-foreground">Utility Functions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Cards */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {examples.map((example) => {
          const Icon = example.icon;
          return (
            <Card key={example.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{example.title}</CardTitle>
                      <CardDescription className="mt-1">{example.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{example.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    What You'll Find:
                  </h3>
                  <ul className="space-y-2">
                    {example.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <Link href={example.href}>
                    <Button className="w-full group">
                      View Examples
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Start */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Get started with the auth module in 3 simple steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
                  1
                </div>
                <h3 className="font-semibold">Import Components</h3>
              </div>
              <pre className="rounded-lg border bg-muted p-3 text-xs overflow-x-auto">
                <code>{`import { SignInForm } from "@auth/ui";`}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-800 font-bold">
                  2
                </div>
                <h3 className="font-semibold">Use Hooks</h3>
              </div>
              <pre className="rounded-lg border bg-muted p-3 text-xs overflow-x-auto">
                <code>{`const { user } = useUser();`}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-bold">
                  3
                </div>
                <h3 className="font-semibold">Add Utilities</h3>
              </div>
              <pre className="rounded-lg border bg-muted p-3 text-xs overflow-x-auto">
                <code>{`isAdmin(user)`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Available Packages</CardTitle>
          <CardDescription>Import from these workspace packages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@auth/ui</code>
                <p className="text-xs text-muted-foreground mt-1">Pre-built UI components for auth flows</p>
              </div>
              <Badge variant="secondary">14 Components</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@auth/web</code>
                <p className="text-xs text-muted-foreground mt-1">React hooks for authentication state</p>
              </div>
              <Badge variant="secondary">5 Hooks</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@auth/core</code>
                <p className="text-xs text-muted-foreground mt-1">Utility functions for common auth tasks</p>
              </div>
              <Badge variant="secondary">7 Utilities</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@auth/types</code>
                <p className="text-xs text-muted-foreground mt-1">TypeScript types and interfaces</p>
              </div>
              <Badge variant="secondary">Types</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
