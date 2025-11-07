/**
 * React Hooks for Better Auth + Convex Authentication
 *
 * This module re-exports hooks from the Better Auth React client
 * with Convex integration, providing type-safe authentication state
 * management in React applications.
 *
 * @module hooks
 */

export { useAuth } from "./use-auth.js";
export { useSession } from "./use-session.js";
export {
  type SignInData,
  type UseSignInReturn,
  useSignIn,
} from "./use-sign-in.js";
export { type UseSignOutReturn, useSignOut } from "./use-sign-out.js";
export {
  type SignUpData,
  type UseSignUpReturn,
  useSignUp,
} from "./use-sign-up.js";
export { type UseUserReturn, useUser } from "./use-user.js";
