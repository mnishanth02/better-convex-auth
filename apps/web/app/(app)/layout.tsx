"use client";

import { AppShell } from "@/components/layout/app-shell";
import { SessionGuard } from "@/lib/auth/setup";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGuard>
      <AppShell>{children}</AppShell>
    </SessionGuard>
  );
}
