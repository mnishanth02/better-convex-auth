"use client";

import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider, components } from "@/lib/auth/setup";

export function Providers({ children }: { children: React.ReactNode }) {
  const { OAuthRedirectHandler } = components.Utils;

  return (
    <AuthProvider>
      <OAuthRedirectHandler defaultRedirect="/dashboard" />
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
    </AuthProvider>
  );
}
