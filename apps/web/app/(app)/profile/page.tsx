"use client";

import { useUser, UserAvatar } from "@/lib/auth/setup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Edit, Mail, Lock, Calendar, Shield, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <UserAvatar name={user?.name} email={user?.email} image={user?.image} size="xl" />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
            {user?.emailVerified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Mail className="mr-1 h-3 w-3" />
                Email Verified
              </Badge>
            )}
            <Badge variant="secondary">
              <Calendar className="mr-1 h-3 w-3" />
              Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href="/app/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <Separator />

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal information and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="text-base mt-1">{user?.name || "Not set"}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
            <div className="flex items-center gap-2 mt-1">
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
            <p className="text-sm font-medium text-muted-foreground">Profile Image</p>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.image ? "Custom avatar" : "Using default avatar"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/app/profile/edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile Information
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/app/profile/password">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/app/profile/email">
              <Mail className="mr-2 h-4 w-4" />
              Change Email Address
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/app/security">
              <Shield className="mr-2 h-4 w-4" />
              Security Settings
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="destructive" className="w-full justify-start">
            <Link href="/app/profile/delete">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
