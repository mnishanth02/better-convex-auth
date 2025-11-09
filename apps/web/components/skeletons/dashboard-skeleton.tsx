"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function DashboardSkeleton() {
  // Use crypto for unique IDs in skeleton loaders (not rendered in production)
  const statIds = Array.from({ length: 4 }).map(() => crypto.randomUUID?.() || Math.random().toString());
  const chartIds = Array.from({ length: 5 }).map(() => crypto.randomUUID?.() || Math.random().toString());
  const rowIds = Array.from({ length: 8 }).map(() => crypto.randomUUID?.() || Math.random().toString());

  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {statIds.map((id) => (
          <Card key={id}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-6 w-1/4" />
          {chartIds.map((id) => (
            <div key={id} className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="flex-1 h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="space-y-4">
            {rowIds.map((id) => (
              <div key={id} className="flex items-center gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
