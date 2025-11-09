"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AuthErrorBoundary, AuthErrorFallback } from "@/components/auth";
import { SessionGuard } from "@/lib/auth/setup";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGuard>
      <AuthErrorBoundary fallback={(error, reset) => <AuthErrorFallback error={error} reset={reset} />}>
        <AppShell>{children}</AppShell>
      </AuthErrorBoundary>
    </SessionGuard>
  );
}
