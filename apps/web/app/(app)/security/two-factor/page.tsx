"use client";

import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { AlertTriangle, ArrowLeft, CheckCircle2, Copy, Download, Key, Loader2, Shield, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock backup codes
const generateBackupCodes = () => {
  return Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 10).toUpperCase());
};

export default function TwoFactorPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<"initial" | "qr" | "verify" | "backup" | "complete">("initial");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock QR code data
  const qrCodeUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/BetterAuth:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=BetterAuth";
  const secretKey = "JBSWY3DPEHPK3PXP";

  const handleEnableStart = () => {
    setSetupStep("qr");
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (verificationCode.length === 6) {
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      setSetupStep("backup");
    }
    setIsLoading(false);
  };

  const handleCompleteSetup = () => {
    setIsEnabled(true);
    setSetupStep("complete");
    setTimeout(() => {
      setSetupStep("initial");
    }, 2000);
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEnabled(false);
    setShowDisableDialog(false);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "better-auth-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Initial state - 2FA not enabled
  if (!isEnabled && setupStep === "initial") {
    return (
      <div className="container mx-auto max-w-2xl p-6 space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/security">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Security
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Two-Factor Authentication</h1>
          <p className="text-muted-foreground mt-1">Add an extra layer of security to your account</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <CardTitle>2FA Not Enabled</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  Not Protected
                </Badge>
              </div>
            </div>
            <CardDescription>
              Two-factor authentication adds an extra layer of security by requiring a verification code in addition to
              your password when signing in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">How it works:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Scan the QR code we'll provide</li>
                <li>Enter the 6-digit code from your app to verify</li>
                <li>Save your backup codes in a safe place</li>
              </ol>
            </div>
            <Separator />
            <Button onClick={handleEnableStart} className="w-full">
              <Smartphone className="mr-2 h-4 w-4" />
              Enable Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Make sure you have access to your authenticator app before starting. You'll need it to sign in after
            enabling 2FA.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Step 1: Show QR Code
  if (setupStep === "qr") {
    return (
      <div className="container mx-auto max-w-2xl p-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSetupStep("initial")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel Setup
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Scan QR Code</h1>
          <p className="text-muted-foreground mt-1">Step 1 of 3: Set up your authenticator app</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scan with your authenticator app</CardTitle>
            <CardDescription>Use Google Authenticator, Authy, or any TOTP-compatible app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-muted-foreground text-center">Scan this QR code with your authenticator app</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Can't scan the QR code?</Label>
              <div className="flex gap-2">
                <Input value={secretKey} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(secretKey)}
                  title="Copy secret key"
                >
                  {copiedCode === secretKey ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Enter this secret key manually in your authenticator app</p>
            </div>

            <Button onClick={() => setSetupStep("verify")} className="w-full">
              I've Scanned the Code
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Verify Code
  if (setupStep === "verify") {
    return (
      <div className="container mx-auto max-w-2xl p-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSetupStep("qr")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to QR Code
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Verify Code</h1>
          <p className="text-muted-foreground mt-1">Step 2 of 3: Enter the code from your app</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter verification code</CardTitle>
            <CardDescription>Open your authenticator app and enter the 6-digit code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">6-Digit Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest"
              />
              <p className="text-xs text-muted-foreground">The code refreshes every 30 seconds</p>
            </div>

            <Button onClick={handleVerifyCode} disabled={verificationCode.length !== 6 || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </CardContent>
        </Card>

        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            Having trouble? Make sure your device's time is synced correctly. Authenticator codes are time-based.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Step 3: Backup Codes
  if (setupStep === "backup") {
    return (
      <div className="container mx-auto max-w-2xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Save Backup Codes</h1>
          <p className="text-muted-foreground mt-1">Step 3 of 3: Keep these codes safe</p>
        </div>

        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Save these backup codes in a safe place. You can use them to sign in if you lose
            access to your authenticator app. Each code can only be used once.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Your Backup Codes</CardTitle>
            <CardDescription>Store these codes securely - you won't be able to see them again</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                  <code className="text-sm font-mono">{code}</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(code)}>
                    {copiedCode === code ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={downloadBackupCodes} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Codes
              </Button>
              <Button variant="outline" onClick={() => copyToClipboard(backupCodes.join("\n"))} className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>

            <Separator />

            <Button onClick={handleCompleteSetup} className="w-full">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Complete state
  if (setupStep === "complete") {
    return (
      <div className="container mx-auto max-w-2xl p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Two-Factor Authentication Enabled!</CardTitle>
            <CardDescription className="text-center">
              Your account is now protected with 2FA. You'll need your authenticator app to sign in.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // 2FA Enabled state
  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/security">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Security
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Two-Factor Authentication</h1>
        <p className="text-muted-foreground mt-1">Your account is protected with 2FA</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>2FA Enabled</CardTitle>
              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                Protected
              </Badge>
            </div>
          </div>
          <CardDescription>
            Two-factor authentication is active. You need your authenticator app to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">What's protected:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sign in from new devices</li>
              <li>Password changes</li>
              <li>Email address changes</li>
              <li>Security settings modifications</li>
            </ul>
          </div>
          <Separator />
          <Button variant="destructive" onClick={() => setShowDisableDialog(true)} className="w-full">
            Disable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Codes</CardTitle>
          <CardDescription>Use these if you lose access to your authenticator app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              You have 8 unused backup codes. Generate new codes if you've used some or lost access to your current
              codes.
            </AlertDescription>
          </Alert>
          <Button variant="outline" className="w-full">
            Regenerate Backup Codes
          </Button>
        </CardContent>
      </Card>

      {/* Disable Confirmation Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make your account less secure. You'll only need your password to sign in. Are you sure you want
              to disable 2FA?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable2FA}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
