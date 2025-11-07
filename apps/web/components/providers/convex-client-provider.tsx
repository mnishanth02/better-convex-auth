"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/auth-client";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3000";

const convex = new ConvexReactClient(convexUrl, {
  expectAuth: false,
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    // @ts-expect-error ConvexBetterAuthProvider types are out of date
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
