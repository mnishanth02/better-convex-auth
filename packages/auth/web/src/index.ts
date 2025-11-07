/**
 * @auth/web - React Hooks for Better Auth + Convex
 *
 * This package provides React hooks for authentication state management
 * in Next.js and React applications using Better Auth with Convex backend.
 *
 * @example Basic usage
 * ```tsx
 * import { useSession, useAuth } from "@auth/web";
 *
 * function Profile() {
 *   const { data: session, isPending } = useSession();
 *   const { signOut } = useAuth();
 *
 *   if (isPending) return <div>Loading...</div>;
 *   if (!session) return <div>Not authenticated</div>;
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {session.user.name}!</h1>
 *       <button onClick={() => signOut()}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

// Re-export types from @auth/types
export type * from "@auth/types";
// Client Factory
export * from "./client/index.js";
// Context
export * from "./context/index.js";
// HOCs
export * from "./hoc/index.js";
// Hooks
export * from "./hooks/index.js";
// Providers
export * from "./providers/index.js";
