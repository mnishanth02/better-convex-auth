"use client";

import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexClientProvider } from "./convex-client-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
        <Toaster position="bottom-right" richColors toastOptions={{ style: { textAlign: "center" } }} />
      </NextThemesProvider>
    </ConvexClientProvider>
  );
}
