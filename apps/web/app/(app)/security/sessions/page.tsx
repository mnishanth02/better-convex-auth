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
import { Separator } from "@workspace/ui/components/separator";
import { AlertTriangle, ArrowLeft, Clock, MapPin, Monitor, Smartphone, Tablet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock session data - in real app, this would come from Convex query
const mockSessions = [
  {
    id: "current",
    device: "MacBook Pro",
    deviceType: "desktop" as const,
    browser: "Chrome 119",
    os: "macOS Sonoma",
    ipAddress: "192.168.1.100",
    location: "San Francisco, CA",
    lastActive: new Date(),
    isCurrent: true,
  },
  {
    id: "session-2",
    device: "iPhone 15 Pro",
    deviceType: "mobile" as const,
    browser: "Safari 17",
    os: "iOS 17",
    ipAddress: "192.168.1.101",
    location: "San Francisco, CA",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isCurrent: false,
  },
  {
    id: "session-3",
    device: "iPad Air",
    deviceType: "tablet" as const,
    browser: "Safari 17",
    os: "iPadOS 17",
    ipAddress: "192.168.1.102",
    location: "Oakland, CA",
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isCurrent: false,
  },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState(mockSessions);
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const getDeviceIcon = (deviceType: "desktop" | "mobile" | "tablet") => {
    switch (deviceType) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const handleRevokeSession = async (sessionId: string) => {
    setIsRevoking(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Remove the session
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSessionToRevoke(null);
    setIsRevoking(false);
  };

  const handleRevokeAllOthers = async () => {
    setIsRevoking(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Keep only current session
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setIsRevoking(false);
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/security">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Security
        </Link>
      </Button>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Active Sessions</h1>
        <p className="text-muted-foreground mt-1">Manage devices that have access to your account</p>
      </div>

      {/* Security Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          If you see a session you don't recognize, revoke it immediately and change your password.
        </AlertDescription>
      </Alert>

      {/* Sessions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions Overview</CardTitle>
          <CardDescription>You have {sessions.length} active sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Last activity: {sessions[0] ? formatLastActive(sessions[0].lastActive) : "N/A"}
            </div>
            {otherSessions.length > 0 && (
              <AlertDialog>
                <Button variant="outline" size="sm" onClick={() => {}}>
                  Revoke All Other Sessions
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke all other sessions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will sign out all devices except your current one. You'll need to sign in again on those
                      devices.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRevokeAllOthers} disabled={isRevoking}>
                      {isRevoking ? "Revoking..." : "Revoke All"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Session */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Session</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active Now
            </Badge>
          </div>
          <CardDescription>This is the device you're using right now</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions
            .filter((s) => s.isCurrent)
            .map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType);
              return (
                <div key={session.id} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <DeviceIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-semibold text-lg">{session.device}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.browser} • {session.os}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{session.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Last Active</p>
                            <p className="text-muted-foreground">{formatLastActive(session.lastActive)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">IP Address: {session.ipAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Other Sessions */}
      {otherSessions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Other Sessions</h2>
          {otherSessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.deviceType);
            return (
              <Card key={session.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <DeviceIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.browser} • {session.os}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSessionToRevoke(session.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Revoke
                        </Button>
                      </div>

                      <Separator />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{session.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Last Active</p>
                            <p className="text-muted-foreground">{formatLastActive(session.lastActive)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">IP Address: {session.ipAddress}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {otherSessions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">No other active sessions</p>
            <p className="text-sm text-muted-foreground">
              You're only signed in on this device. Any new sign-ins will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!sessionToRevoke} onOpenChange={() => setSessionToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign out the device immediately. You'll need to sign in again on that device to regain access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sessionToRevoke && handleRevokeSession(sessionToRevoke)}
              disabled={isRevoking}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isRevoking ? "Revoking..." : "Revoke Session"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Sessions remain active for 30 days of inactivity</p>
            <p>• You'll be automatically signed out after 90 days</p>
            <p>• Changing your password revokes all other sessions</p>
            <p>• We recommend reviewing your sessions regularly</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
