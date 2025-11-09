"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ArrowLeft, Key, Fingerprint, Smartphone, Laptop, Trash2, Plus, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";

interface Passkey {
  id: string;
  name: string;
  type: "platform" | "cross-platform";
  createdAt: Date;
  lastUsed: Date | null;
}

const mockPasskeys: Passkey[] = [
  {
    id: "1",
    name: "MacBook Pro Touch ID",
    type: "platform",
    createdAt: new Date("2024-01-15"),
    lastUsed: new Date(),
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    type: "cross-platform",
    createdAt: new Date("2024-02-20"),
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export default function PasskeysPage() {
  const [passkeys, setPasskeys] = useState<Passkey[]>(mockPasskeys);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passkeyToDelete, setPasskeyToDelete] = useState<string | null>(null);
  const [newPasskeyName, setNewPasskeyName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatLastUsed = (date: Date | null) => {
    if (!date) return "Never used";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(date);
  };

  const getPasskeyIcon = (type: "platform" | "cross-platform") => {
    return type === "platform" ? Fingerprint : Smartphone;
  };

  const handleAddPasskey = async () => {
    setIsAdding(true);

    // Simulate WebAuthn registration
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newPasskey: Passkey = {
      id: Date.now().toString(),
      name: newPasskeyName || "New Device",
      type: "platform",
      createdAt: new Date(),
      lastUsed: null,
    };

    setPasskeys([...passkeys, newPasskey]);
    setNewPasskeyName("");
    setShowAddDialog(false);
    setIsAdding(false);
  };

  const handleDeletePasskey = async () => {
    if (!passkeyToDelete) return;

    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPasskeys(passkeys.filter((p) => p.id !== passkeyToDelete));
    setPasskeyToDelete(null);
    setShowDeleteDialog(false);
    setIsDeleting(false);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/security">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Security
        </Link>
      </Button>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Passkeys</h1>
        <p className="text-muted-foreground mt-1">Sign in faster and more securely without passwords</p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Passkeys use your device's biometric authentication (Face ID, Touch ID, fingerprint) or PIN to sign you in
          securely without needing a password.
        </AlertDescription>
      </Alert>

      {/* Passkeys Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Passkeys</CardTitle>
              <CardDescription>You have {passkeys.length} passkeys registered</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Passkey
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {passkeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">No passkeys yet</p>
              <p className="text-sm text-muted-foreground mb-4">Add a passkey to sign in faster and more securely</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Passkey
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {passkeys.map((passkey, index) => {
                const Icon = getPasskeyIcon(passkey.type);
                return (
                  <div key={passkey.id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-start gap-4 py-2">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{passkey.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {passkey.type === "platform" ? "Platform" : "Cross-Platform"}
                              </Badge>
                              {passkey.lastUsed && formatLastUsed(passkey.lastUsed) === "Today" && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  Recently Used
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPasskeyToDelete(passkey.id);
                              setShowDeleteDialog(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Created: {formatDate(passkey.createdAt)}</p>
                          <p>Last used: {formatLastUsed(passkey.lastUsed)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* What are Passkeys */}
      <Card>
        <CardHeader>
          <CardTitle>About Passkeys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-semibold">More Secure</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Passkeys use public-key cryptography, making them resistant to phishing and data breaches.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold">Faster Sign In</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sign in with just your fingerprint, face, or device PIN - no password needed.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Fingerprint className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold">Platform Passkeys</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Stored on your device. Use Face ID, Touch ID, or Windows Hello.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Smartphone className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-semibold">Cross-Platform</h3>
              </div>
              <p className="text-sm text-muted-foreground">Synced via iCloud or Google. Works across your devices.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Support */}
      <Card>
        <CardHeader>
          <CardTitle>Device Support</CardTitle>
          <CardDescription>Passkeys work on these platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Laptop className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">macOS & iOS</p>
                <p className="text-xs text-muted-foreground">Safari 16+, Chrome 108+</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Android</p>
                <p className="text-xs text-muted-foreground">Chrome 108+, Android 9+</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Laptop className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Windows</p>
                <p className="text-xs text-muted-foreground">Edge 108+, Chrome 108+</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Laptop className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Linux</p>
                <p className="text-xs text-muted-foreground">Chrome 108+, Firefox 122+</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Passkey Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Passkey</DialogTitle>
            <DialogDescription>
              You'll be prompted to authenticate with your device's biometric or PIN
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="passkeyName">Passkey Name (Optional)</Label>
              <Input
                id="passkeyName"
                placeholder="e.g., MacBook Pro, iPhone"
                value={newPasskeyName}
                onChange={(e) => setNewPasskeyName(e.target.value)}
                disabled={isAdding}
              />
              <p className="text-xs text-muted-foreground">Give this passkey a name to help you identify it later</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isAdding}>
              Cancel
            </Button>
            <Button onClick={handleAddPasskey} disabled={isAdding}>
              {isAdding ? "Creating..." : "Create Passkey"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this passkey?</AlertDialogTitle>
            <AlertDialogDescription>
              You won't be able to use this passkey to sign in anymore. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePasskey}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Passkey"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
