"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function PageSkeleton() {
  const itemIds = Array.from({ length: 6 }).map(() => crypto.randomUUID?.() || Math.random().toString());

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {itemIds.map((id) => (
          <Card key={id}>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="pt-2 flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
