"use client";

import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthErrorBoundary } from "@/components/auth";
import { AuthProvider, OAuthRedirectHandler } from "@/lib/auth/setup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthErrorBoundary
        showDetails={process.env.NODE_ENV === "development"}
        onError={(error) => {
          console.error("Auth error caught:", error);
        }}
      >
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
      </AuthErrorBoundary>
    </AuthProvider>
  );
}
