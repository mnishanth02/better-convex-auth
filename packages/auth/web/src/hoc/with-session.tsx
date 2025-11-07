/**
 * withSession HOC
 *
 * Higher-order component that injects session data as a prop.
 *
 * @module
 */

"use client";

import type { ComponentType } from "react";
import { useSession } from "../hooks/use-session";

/**
 * Props injected by withSession HOC
 */
export interface WithSessionProps {
  session: NonNullable<ReturnType<typeof useSession>["data"]> | null;
  isLoadingSession: boolean;
}

/**
 * Options for withSession HOC
 */
export interface WithSessionOptions {
  /**
   * Component to show while loading
   */
  LoadingComponent?: ComponentType;
}

/**
 * Higher-order component that injects session data as a prop.
 *
 * Does not protect the route - use withAuth for that.
 * Simply provides session data to the component.
 *
 * @example Basic usage
 * ```tsx
 * interface MyPageProps extends WithSessionProps {
 *   title: string;
 * }
 *
 * function MyPage({ session, isLoadingSession, title }: MyPageProps) {
 *   if (isLoadingSession) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h1>{title}</h1>
 *       {session ? (
 *         <p>Welcome, {session.user.name}!</p>
 *       ) : (
 *         <p>Guest user</p>
 *       )}
 *     </div>
 *   );
 * }
 *
 * export default withSession(MyPage);
 * ```
 *
 * @param Component - Component to wrap
 * @param options - Configuration options
 * @returns Component with session props
 * @public
 */
export function withSession<P extends WithSessionProps>(Component: ComponentType<P>, options: WithSessionOptions = {}) {
  const { LoadingComponent } = options;

  return function SessionInjectedComponent(props: Omit<P, keyof WithSessionProps>) {
    const { data: session, isPending } = useSession();

    if (isPending && LoadingComponent) {
      return <LoadingComponent />;
    }

    const sessionProps: WithSessionProps = {
      session,
      isLoadingSession: isPending,
    };

    return <Component {...(props as P)} {...sessionProps} />;
  };
}
