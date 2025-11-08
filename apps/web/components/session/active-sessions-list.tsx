"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import { Loader2, Monitor, Smartphone, Tablet, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

interface SessionListProps {
  className?: string;
}

export function ActiveSessionsList({ className }: SessionListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const sessions = useQuery(api.sessionManagement.getUserSessions);
  const sessionStats = useQuery(api.sessionManagement.getSessionStats);
  const invalidateSession = useMutation(api.sessionManagement.invalidateSession);
  const invalidateAllOther = useMutation(api.sessionManagement.invalidateAllOtherSessions);

  const handleInvalidateSession = async (sessionId: Id<"sessions">) => {
    setIsLoading(sessionId);
    setError("");

    try {
      await invalidateSession({ sessionId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end session");
    } finally {
      setIsLoading(null);
    }
  };

  const handleInvalidateAllOther = async () => {
    setIsLoading("all");
    setError("");

    try {
      await invalidateAllOther({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end sessions");
    } finally {
      setIsLoading(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (token: string) => {
    // Simple heuristic based on token pattern
    const hash = token.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const deviceType = hash % 3;

    switch (deviceType) {
      case 0:
        return <Monitor className="h-4 w-4" />;
      case 1:
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Tablet className="h-4 w-4" />;
    }
  };

  if (sessions === undefined || sessionStats === undefined) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div className={className}>
      {/* Stats Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
          <CardDescription>Manage your active login sessions across all devices</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{sessionStats.activeSessions}</div>
            <div className="text-sm text-muted-foreground">Active Sessions</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{sessionStats.expiredSessions}</div>
            <div className="text-sm text-muted-foreground">Expired Sessions</div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Session */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Current Session</CardTitle>
          <CardDescription>This device you're using now</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.find((s) => s.isCurrent) ? (
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border p-2">{getDeviceIcon(sessions.find((s) => s.isCurrent)!.token)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Current Device</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Signed in {formatDate(sessions.find((s) => s.isCurrent)!.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">Token: {sessions.find((s) => s.isCurrent)!.token}</p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Other Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Other Sessions</CardTitle>
              <CardDescription>
                {otherSessions.length > 0
                  ? `${otherSessions.length} other active ${otherSessions.length === 1 ? "session" : "sessions"}`
                  : "No other active sessions"}
              </CardDescription>
            </div>
            {otherSessions.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleInvalidateAllOther} disabled={isLoading !== null}>
                {isLoading === "all" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ending...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    End All Others
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {otherSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Monitor className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">You're only signed in on this device</p>
            </div>
          ) : (
            <div className="space-y-4">
              {otherSessions.map((session) => (
                <div key={session.id} className="flex items-start justify-between rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border p-2">{getDeviceIcon(session.token)}</div>
                    <div>
                      <div className="font-medium">Other Device</div>
                      <p className="text-sm text-muted-foreground">Signed in {formatDate(session.createdAt)}</p>
                      <p className="text-xs text-muted-foreground">Token: {session.token}</p>
                      <p className="text-xs text-muted-foreground">Expires {formatDate(session.expiresAt)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInvalidateSession(session.id)}
                    disabled={isLoading !== null}
                  >
                    {isLoading === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
