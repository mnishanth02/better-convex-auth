"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Activity, Calendar, Lock, Mail, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { SignOutButton, UserAvatar, useUser } from "@/lib/auth/setup";

export default function DashboardPage() {
  const { user } = useUser();

  const stats = [
    { label: "Account Status", value: "Active", icon: Activity, color: "text-green-600" },
    {
      label: "Email Status",
      value: user?.emailVerified ? "Verified" : "Unverified",
      icon: Mail,
      color: user?.emailVerified ? "text-green-600" : "text-yellow-600",
    },
    { label: "2FA Status", value: "Disabled", icon: Shield, color: "text-gray-600" },
    { label: "Active Sessions", value: "1", icon: Lock, color: "text-blue-600" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your account</p>
        </div>
        <UserAvatar name={user?.name} email={user?.email} image={user?.image} size="lg" />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color} opacity-60`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">{user?.name || "Not set"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-base">{user?.email}</p>
                {user?.emailVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member since</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
            <Separator />
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">View Full Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Overview
            </CardTitle>
            <CardDescription>Keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Verification</p>
                <p className="text-xs text-muted-foreground">
                  {user?.emailVerified ? "Your email is verified" : "Please verify your email"}
                </p>
              </div>
              {user?.emailVerified ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓
                </Badge>
              ) : (
                <Badge variant="destructive">!</Badge>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Badge variant="secondary">Not enabled</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Sessions</p>
                <p className="text-xs text-muted-foreground">Devices with access to your account</p>
              </div>
              <Badge variant="secondary">1 session</Badge>
            </div>
            <Separator />
            <Button asChild variant="outline" className="w-full">
              <Link href="/security">Security Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Commonly used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/profile/edit">
                <UserIcon className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/profile/password">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/security/sessions">
                <Activity className="mr-2 h-4 w-4" />
                Manage Sessions
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/examples">
                <Shield className="mr-2 h-4 w-4" />
                View Examples
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <div className="flex justify-center">
        <SignOutButton variant="outline" showConfirmation={true} redirectTo="/" />
      </div>
    </div>
  );
}
