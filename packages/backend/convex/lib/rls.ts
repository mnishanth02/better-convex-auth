/**
 * Row-Level Security (RLS) Implementation
 *
 * This module implements row-level security using convex-helpers.
 * RLS ensures that users can only access data they're authorized to see,
 * enforced at the database level for maximum security.
 *
 * @see https://stack.convex.dev/row-level-security
 */

import { customCtx, customMutation, customQuery } from "convex-helpers/server/customFunctions";
import {
  type RLSConfig,
  type Rules,
  wrapDatabaseReader,
  wrapDatabaseWriter,
} from "convex-helpers/server/rowLevelSecurity";
import type { DataModel } from "../_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "../_generated/server";

/**
 * Define Row-Level Security rules for all tables.
 *
 * These rules are evaluated for every database operation to ensure
 * users can only access data they're authorized to see.
 */
async function rlsRules(ctx: QueryCtx | MutationCtx) {
  // Get the current user's identity (null if not authenticated)
  const identity = await ctx.auth.getUserIdentity();

  return {
    /**
     * Users table rules
     * - Read: Users can only read their own user data (authenticated users only)
     * - Modify: Users can only modify their own user data
     */
    users: {
      read: async (_, user) => {
        // Unauthenticated users cannot read any user data
        if (!identity) return false;

        // Users can only read their own profile
        return user.id === identity.subject;
      },
      modify: async (_, user) => {
        // Must be authenticated to modify user data
        if (!identity) {
          throw new Error("Authentication required to modify user data");
        }

        // Users can only modify their own profile
        if (user.id !== identity.subject) {
          throw new Error("Unauthorized: You can only modify your own profile");
        }

        return true;
      },
    },

    /**
     * Sessions table rules
     * - Read: Users can only read their own sessions
     * - Modify: Users can only modify their own sessions (e.g., revoke)
     */
    sessions: {
      read: async (_, session) => {
        if (!identity) return false;

        // Users can only read their own sessions
        return session.userId === identity.subject;
      },
      modify: async (_, session) => {
        if (!identity) {
          throw new Error("Authentication required to modify sessions");
        }

        // Users can only modify their own sessions
        if (session.userId !== identity.subject) {
          throw new Error("Unauthorized: You can only modify your own sessions");
        }

        return true;
      },
    },

    /**
     * Accounts table rules (OAuth accounts)
     * - Read: Users can only read their own linked accounts
     * - Modify: Users can only modify their own linked accounts
     */
    accounts: {
      read: async (_, account) => {
        if (!identity) return false;

        // Users can only read their own linked accounts
        return account.userId === identity.subject;
      },
      modify: async (_, account) => {
        if (!identity) {
          throw new Error("Authentication required to modify accounts");
        }

        // Users can only modify their own linked accounts
        if (account.userId !== identity.subject) {
          throw new Error("Unauthorized: You can only modify your own accounts");
        }

        return true;
      },
    },
  } satisfies Rules<QueryCtx | MutationCtx, DataModel>;
}

/**
 * RLS configuration.
 *
 * Default policy: "deny"
 * - Tables with no explicit rules will deny all access
 * - This is the most secure default
 */
const rlsConfig: RLSConfig = {
  defaultPolicy: "deny",
};

/**
 * Custom query with Row-Level Security.
 *
 * Use this instead of the standard `query` function to automatically
 * enforce RLS rules on all database reads.
 *
 * @example
 * ```typescript
 * export const getUserProfile = queryWithRLS({
 *   args: { userId: v.string() },
 *   handler: async (ctx, args) => {
 *     // ctx.db automatically enforces RLS rules
 *     const user = await ctx.db
 *       .query("users")
 *       .filter(q => q.eq(q.field("id"), args.userId))
 *       .first();
 *     return user; // Will be null if user doesn't have access
 *   }
 * });
 * ```
 */
export const queryWithRLS = customQuery(
  query,
  customCtx(async (ctx) => ({
    db: wrapDatabaseReader(ctx, ctx.db, await rlsRules(ctx), rlsConfig),
  })),
);

/**
 * Custom mutation with Row-Level Security.
 *
 * Use this instead of the standard `mutation` function to automatically
 * enforce RLS rules on all database reads and writes.
 *
 * @example
 * ```typescript
 * export const updateProfile = mutationWithRLS({
 *   args: { name: v.string() },
 *   handler: async (ctx, args) => {
 *     // ctx.db automatically enforces RLS rules
 *     const user = await authComponent.getAuthUser(ctx);
 *     await ctx.db.patch(user._id, { name: args.name });
 *     // Will throw error if user doesn't own this record
 *   }
 * });
 * ```
 */
export const mutationWithRLS = customMutation(
  mutation,
  customCtx(async (ctx) => ({
    db: wrapDatabaseWriter(ctx, ctx.db, await rlsRules(ctx), rlsConfig),
  })),
);

/**
 * Type helper for the RLS-wrapped context.
 * Use this to properly type your handler functions.
 */
export type RLSQueryCtx = QueryCtx & {
  db: Awaited<ReturnType<typeof wrapDatabaseReader>>;
};

export type RLSMutationCtx = MutationCtx & {
  db: Awaited<ReturnType<typeof wrapDatabaseWriter>>;
};
