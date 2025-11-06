import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [
    convexClient(),
    crossDomainClient({
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storagePrefix: "better-convex-auth",
    }),
  ],
});
