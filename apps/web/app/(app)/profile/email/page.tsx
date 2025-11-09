"use client";

import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/lib/auth/setup";

export default function ChangeEmailPage() {
  const { user } = useUser();
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // This would use authClient.changeEmail in a real implementation
      // await authClient.changeEmail({ newEmail, callbackURL: "/profile" });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);

      // In real implementation, redirect after showing success message
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change email");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto max-w-2xl p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Verification Email Sent</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to <strong>{newEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Please check your email and click the verification link to complete the email change. Your old email
                address will remain active until you verify the new one.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full mt-4">
              <Link href="/profile">Back to Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Change Email Address</h1>
        <p className="text-muted-foreground mt-1">Update the email address associated with your account</p>
      </div>

      {/* Warning Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Changing your email address requires verification. You'll receive an email at the new address with a
          confirmation link.
        </AlertDescription>
      </Alert>

      {/* Current Email */}
      <Card>
        <CardHeader>
          <CardTitle>Current Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <p className="text-base">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Change Email Form */}
      <Card>
        <CardHeader>
          <CardTitle>New Email Address</CardTitle>
          <CardDescription>Enter your new email address and confirm your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="you@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">We'll send a verification link to this email address</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Confirm Your Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">For security, please confirm your current password</p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Verification...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Email
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/profile")} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>We'll send a verification email to your new address</li>
            <li>Click the verification link in the email</li>
            <li>Your email address will be updated once verified</li>
            <li>You can still sign in with your old email until verification is complete</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
