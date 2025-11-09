"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpdateProfileForm } from "@/lib/auth/setup";

export default function EditProfilePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/profile">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </Button>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground mt-1">Update your personal information</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your name and profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm onSuccess={() => router.push("/profile")} />
        </CardContent>
      </Card>
    </div>
  );
}
