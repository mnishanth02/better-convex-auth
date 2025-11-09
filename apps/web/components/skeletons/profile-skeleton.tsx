"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function ProfileSkeleton() {
  const fieldIds = Array.from({ length: 5 }).map(() => crypto.randomUUID?.() || Math.random().toString());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Fields */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {fieldIds.map((id) => (
            <div key={id} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Sessions Section */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => {
              const sessionId = `session-${crypto.randomUUID?.() || i}`;
              return (
                <div key={sessionId} className="flex items-center justify-between p-3 border rounded">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
