/**
 * OAuth Redirect Handler
 *
 * Utility component to handle redirects after OAuth authentication callback.
 * This should be mounted in your app layout to listen for OAuth callbacks.
 *
 * @module
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSession } from "../..";

/**
 * Props for OAuthRedirectHandler component
 */
export interface OAuthRedirectHandlerProps {
  /**
   * Default redirect path if no stored redirect is found
   * @default "/dashboard"
   */
  defaultRedirect?: string;

  /**
   * Whether to enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * OAuth Redirect Handler Component
 *
 * This component handles redirects after OAuth authentication callbacks.
 * It listens for session changes and redirects the user to their intended
 * destination or a default path.
 *
 * **How it works:**
 * 1. Before OAuth: Stores intended redirect URL in sessionStorage
 * 2. After OAuth callback: Reads stored URL and redirects user
 * 3. Cleans up sessionStorage after redirect
 *
 * @example Add to your root layout
 * ```tsx
 * // app/layout.tsx
 * import { OAuthRedirectHandler } from "@auth/ui/utils/oauth-redirect-handler";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           <OAuthRedirectHandler defaultRedirect="/dashboard" />
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @param props - Component props
 * @public
 */
export function OAuthRedirectHandler({ defaultRedirect = "/dashboard", debug = false }: OAuthRedirectHandlerProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Wait for session to load
    if (isPending) return;

    // Only redirect once
    if (hasRedirected.current) return;

    // Only redirect if user is authenticated
    if (!session?.user) return;

    // Check if we just came back from OAuth (URL will have code/state params)
    const searchParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = searchParams.has("code") || searchParams.has("state");

    if (hasOAuthParams) {
      // Get stored redirect URL
      const storedRedirect = sessionStorage.getItem("auth-redirect");
      const redirectUrl = storedRedirect || defaultRedirect;

      if (debug) {
        console.log("[OAuthRedirectHandler] OAuth callback detected", {
          hasSession: !!session,
          storedRedirect,
          redirectUrl,
        });
      }

      // Mark as redirected
      hasRedirected.current = true;

      // Clean up stored redirect
      sessionStorage.removeItem("auth-redirect");

      // Redirect to intended destination
      router.push(redirectUrl);
    }
  }, [session, isPending, router, defaultRedirect, debug]);

  // This component doesn't render anything
  return null;
}
