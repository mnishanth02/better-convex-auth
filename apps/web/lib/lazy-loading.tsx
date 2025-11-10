import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/skeletons";

// Lazy load admin components with suspense
export const AdminDashboard = dynamic(() => import("@/app/(app)/admin/page"), {
  loading: () => <PageSkeleton />,
  ssr: false, // Admin pages don't need SSR for better performance
});

export const ModeratorPanel = dynamic(() => import("@/app/(app)/moderator/page"), {
  loading: () => <PageSkeleton />,
  ssr: false,
});

// Generic lazy loader for heavy components
export function withLazyLoading<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = dynamic(importFn, {
    loading: () => fallback || <PageSkeleton />,
    ssr: false,
  });

  return function LazyLoadedComponent(props: T) {
    return (
      <Suspense fallback={fallback || <PageSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Usage example:
// const LazyProfileSettings = withLazyLoading(() => import("./profile-settings"));
