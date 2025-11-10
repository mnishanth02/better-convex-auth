"use client";

import { generateUniqueId } from "@/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Code,
  Layers,
  Palette,
  Shield,
  Zap,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Users,
  Gauge,
} from "lucide-react";
import Link from "next/link";

export default function ExamplesPage() {
  const examples = [
    {
      title: "Components Showcase",
      description:
        "Interactive demonstrations of all @workspace/z-auth components with live previews, code snippets, and props documentation",
      href: "/examples/components",
      icon: Palette,
      badge: "All Components",
      features: [
        "Form components (SignIn, SignUp, Profile, Password, etc.)",
        "Display components (Avatar, Badge, Menu, SignOut)",
        "Guard components (Session, Role, Email verification)",
        "Utility components (Password strength indicator)",
        "Tabbed interface (Preview / Code / Props)",
        "Category filtering and search",
        "Copy-to-clipboard code examples",
      ],
    },
    {
      title: "Guards Showcase",
      description: "Interactive demonstrations of authentication guards with live status checking and nested examples",
      href: "/examples/guards",
      icon: Shield,
      badge: "3 Guards",
      features: [
        "SessionGuard - Require authentication",
        "RoleGuard - Role-based access control",
        "EmailVerifiedGuard - Email verification requirement",
        "Live status checking with current user state",
        "Nested guard examples for complex scenarios",
        "Custom fallback components and redirects",
        "Implementation best practices and pitfalls",
      ],
    },
    {
      title: "HOCs (Higher-Order Components)",
      description: "Component-level authentication wrappers with automatic redirects and prop injection patterns",
      href: "/examples/hocs",
      icon: Layers,
      badge: "3 HOCs",
      features: [
        "withAuth - Protect components with authentication",
        "withSession - Inject session props into components",
        "withEmailVerified - Require email verification",
        "Automatic redirect handling for better UX",
        "Chainable HOC patterns for complex requirements",
        "Loading state management and customization",
        "Comparison with Guards and best practice guide",
      ],
    },
    {
      title: "Authentication Forms",
      description:
        "Comprehensive showcase of all authentication forms with live demos, validation rules, and accessibility features",
      href: "/examples/forms",
      icon: FileText,
      badge: "6 Forms",
      features: [
        "SignInForm - Email/password authentication with social options",
        "SignUpForm - Registration with validation and verification",
        "ForgotPasswordForm - Password reset request workflow",
        "ResetPasswordForm - Password reset with token validation",
        "ChangePasswordForm - Password change for authenticated users",
        "UpdateProfileForm - Profile updates with real-time validation",
        "Interactive documentation with code examples and validation rules",
      ],
    },
    {
      title: "Error Handling",
      description:
        "Comprehensive error handling patterns with error boundaries, auth errors, network errors, and recovery strategies",
      href: "/examples/error-handling",
      icon: AlertTriangle,
      badge: "Error Patterns",
      features: [
        "Error Boundaries - Component error catching and fallbacks",
        "Network Error Handling - Connection failures and retry logic",
        "Authentication Errors - Session expiry and permission issues",
        "User-friendly error messages with recovery options",
        "Automatic retry mechanisms and manual recovery",
        "Error logging and monitoring integration",
        "Best practices for error handling in production",
      ],
    },
    {
      title: "Performance Examples",
      description: "Authentication performance optimization with caching, monitoring, and measurement tools",
      href: "/examples/performance",
      icon: Gauge,
      badge: "Performance",
      features: [
        "Auth hooks optimization and caching strategies",
        "Convex query performance and real-time monitoring",
        "Component rendering performance analysis",
        "Memory usage tracking and leak detection",
        "Network request optimization and batching",
        "Performance metrics dashboard with live updates",
        "Optimization recommendations and implementation guides",
      ],
    },
    {
      title: "Security Examples",
      description: "Security showcase with role-based access control, permission management, and attack prevention",
      href: "/examples/security",
      icon: ShieldCheck,
      badge: "Security",
      features: [
        "Role-Based Access Control (RBAC) implementation",
        "Permission management and validation systems",
        "Security monitoring and threat detection",
        "Attack prevention (CSRF, XSS, injection protection)",
        "Session security and token management",
        "Security audit logs and compliance tracking",
        "Best practices for secure authentication flows",
      ],
    },
    {
      title: "Hooks Demo",
      description: "Live demonstrations of @workspace/z-auth hooks with real-time data and interactive examples",
      href: "/examples/hooks",
      icon: Zap,
      badge: "All Hooks",
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
      description: "Interactive testing of @workspace/z-auth utility functions with custom inputs and visual feedback",
      href: "/examples/utilities",
      icon: Calculator,
      badge: "All Utilities",
      features: [
        "getUserRole() - Get user role safely",
        "Helper functions for common tasks",
        "Guard and permission checking",
        "User profile utilities",
        "Session management helpers",
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">9</div>
              <p className="text-sm text-muted-foreground">Example Categories</p>
            </div>
          </CardContent>
        </Card>
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
                    {example.features.map((feature) => (
                      <li key={generateUniqueId()} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
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
                <code>{`import { useAuth, SignInForm } from "@/lib/auth/setup";`}</code>
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
            <div className="flex items-center justify-between p-3 rounded-lg border bg-primary/10">
              <div>
                <code className="font-mono text-sm font-semibold">@workspace/z-auth</code>
                <p className="text-xs text-muted-foreground mt-1">Unified package - all components, hooks, and utilities</p>
              </div>
              <Badge variant="default">All-in-One</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@workspace/z-auth/react/ui</code>
                <p className="text-xs text-muted-foreground mt-1">Pre-built UI components for auth flows</p>
              </div>
              <Badge variant="secondary">14 Components</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@workspace/z-auth/react/hooks</code>
                <p className="text-xs text-muted-foreground mt-1">React hooks for authentication state</p>
              </div>
              <Badge variant="secondary">6 Hooks</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@workspace/z-auth/utils</code>
                <p className="text-xs text-muted-foreground mt-1">Utility functions for common auth tasks</p>
              </div>
              <Badge variant="secondary">7 Utilities</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <code className="font-mono text-sm font-semibold">@workspace/z-auth/types</code>
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
