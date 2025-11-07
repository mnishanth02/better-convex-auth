import {
  createAuthClient,
  createAuthProvider,
  useAuth,
  useAuthClient,
  useSession,
  useSignIn,
  useSignOut,
  useSignUp,
  useUser,
  withAuth,
  withEmailVerified,
  withSession,
} from "@auth/web";

import type { SetupAuthConfig } from "./types";

/**
 * Result of setupAuthHeadless() - hooks and HOCs only, no UI components
 */
export interface SetupAuthHeadlessResult {
  authClient: ReturnType<typeof createAuthClient>;
  AuthProvider: ReturnType<typeof createAuthProvider>;
  hooks: {
    useAuth: typeof useAuth;
    useSession: typeof useSession;
    useUser: typeof useUser;
    useSignIn: typeof useSignIn;
    useSignUp: typeof useSignUp;
    useSignOut: typeof useSignOut;
    useAuthClient: typeof useAuthClient;
  };
  hocs: {
    withAuth: typeof withAuth;
    withSession: typeof withSession;
    withEmailVerified: typeof withEmailVerified;
  };
  useAuth: typeof useAuth;
  useSession: typeof useSession;
  useUser: typeof useUser;
  useSignIn: typeof useSignIn;
  useSignUp: typeof useSignUp;
  useSignOut: typeof useSignOut;
  useAuthClient: typeof useAuthClient;
  withAuth: typeof withAuth;
  withSession: typeof withSession;
  withEmailVerified: typeof withEmailVerified;
}

/**
 * Headless setup - hooks only, no UI components
 *
 * Use this when you want to build your own UI from scratch but still
 * want the convenience of quick setup for hooks and auth client.
 *
 * @example
 * ```typescript
 * export const auth = setupAuthHeadless({
 *   convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
 *   baseURL: "http://localhost:3000",
 * });
 *
 * export const { AuthProvider, useAuth, useSignIn } = auth;
 * ```
 */
export function setupAuthHeadless(config: SetupAuthConfig): SetupAuthHeadlessResult {
  const { convexUrl, baseURL, storagePrefix, expectAuth } = config;

  // Create the auth client
  const authClient = createAuthClient({
    baseURL,
    storagePrefix,
  });

  // Create the auth provider
  const AuthProvider = createAuthProvider({
    convexUrl,
    authClient,
    expectAuth,
  });

  // Return hooks and HOCs only (no UI components)
  return {
    authClient,
    AuthProvider,
    hooks: {
      useAuth,
      useSession,
      useUser,
      useSignIn,
      useSignUp,
      useSignOut,
      useAuthClient,
    },
    hocs: {
      withAuth,
      withSession,
      withEmailVerified,
    },
    useAuth,
    useSession,
    useUser,
    useSignIn,
    useSignUp,
    useSignOut,
    useAuthClient,
    withAuth,
    withSession,
    withEmailVerified,
  };
}
