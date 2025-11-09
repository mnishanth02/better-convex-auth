"use client";

import { useUser } from "@/lib/auth/setup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Shield, Lock, Smartphone, Activity, Key, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  const { user } = useUser();

  const securityItems = [
    {
      title: "Active Sessions",
      description: "Manage devices that have access to your account",
      icon: Activity,
      status: "1 session",
      statusColor: "text-blue-600",
      href: "/security/sessions",
      action: "Manage",
    },
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security with 2FA",
      icon: Smartphone,
      status: "Not enabled",
      statusColor: "text-yellow-600",
      href: "/security/two-factor",
      action: "Enable",
    },
    {
      title: "Passkeys",
      description: "Sign in securely without passwords using biometrics",
      icon: Key,
      status: "No passkeys",
      statusColor: "text-gray-600",
      href: "/security/passkeys",
      action: "Add Passkey",
    },
    {
      title: "Login Activity",
      description: "Review recent sign-in activity and locations",
      icon: Lock,
      status: "View history",
      statusColor: "text-green-600",
      href: "/security/activity",
      action: "View",
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground mt-1">Keep your account safe and secure</p>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
          <CardDescription>Your account security status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-4xl font-bold">60%</div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Medium
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Your account has moderate security</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {user?.emailVerified ? (
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  )}
                  <span>Email verified</span>
                </div>
                {user?.emailVerified ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓
                  </Badge>
                ) : (
                  <Badge variant="destructive">✗</Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Two-factor authentication</span>
                </div>
                <Badge variant="destructive">✗</Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Passkey registered</span>
                </div>
                <Badge variant="destructive">✗</Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Strong password</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        {securityItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm font-medium ${item.statusColor}`}>{item.status}</span>
                </div>
                <Button asChild className="w-full">
                  <Link href={item.href}>{item.action}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
          <CardDescription>Steps to improve your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!user?.emailVerified && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">Verify your email address</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Verify your email to enable password resets and important security notifications
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Verify
                </Button>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Enable two-factor authentication</p>
                <p className="text-sm text-blue-700 mt-1">
                  Add an extra layer of security by requiring a verification code when signing in
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href="/security/two-factor">Enable</Link>
              </Button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Key className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-900">Add a passkey</p>
                <p className="text-sm text-purple-700 mt-1">
                  Sign in faster and more securely using your device's biometric authentication
                </p>
              </div>
              <Button size="sm" asChild variant="outline">
                <Link href="/security/passkeys">Add</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/profile/password">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/security/sessions">
                <Activity className="mr-2 h-4 w-4" />
                View All Sessions
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
