"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";

export function FormSkeleton() {
  const fieldIds = Array.from({ length: 4 }).map(() => crypto.randomUUID?.() || Math.random().toString());

  return (
    <div className="space-y-6 w-full max-w-md">
      {fieldIds.map((id) => (
        <div key={id} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}
