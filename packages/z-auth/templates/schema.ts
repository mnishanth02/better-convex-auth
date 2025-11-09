/**
 * Database Schema Template for Better Convex Auth
 *
 * Copy this file to your app's convex/ directory as schema.ts
 *
 * This defines the complete schema for Better Auth + Convex authentication.
 * The schema is managed by the @convex-dev/better-auth component.
 *
 * Note: The auth tables (users, sessions, accounts, verifications) are
 * automatically created by the Better Auth component. You only need to
 * define your app-specific tables.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database schema
 *
 * Authentication tables are automatically managed by @convex-dev/better-auth.
 * Add your app-specific tables below.
 */
export default defineSchema({
  // Auth tables are handled by @convex-dev/better-auth component
  // You don't need to define them here!
  // Add your app-specific tables below
  // Example:
  // posts: defineTable({
  //   title: v.string(),
  //   content: v.string(),
  //   authorId: v.string(), // References Better Auth user ID
  //   published: v.boolean(),
  //   createdAt: v.number(),
  //   updatedAt: v.number(),
  // })
  //   .index("by_author", ["authorId"])
  //   .index("by_published", ["published"]),
  // comments: defineTable({
  //   postId: v.id("posts"),
  //   authorId: v.string(), // References Better Auth user ID
  //   content: v.string(),
  //   createdAt: v.number(),
  // })
  //   .index("by_post", ["postId"])
  //   .index("by_author", ["authorId"]),
  // Example: Organization/team tables
  // teams: defineTable({
  //   name: v.string(),
  //   slug: v.string(),
  //   ownerId: v.string(), // References Better Auth user ID
  //   createdAt: v.number(),
  // }).index("by_slug", ["slug"]),
  // teamMembers: defineTable({
  //   teamId: v.id("teams"),
  //   userId: v.string(), // References Better Auth user ID
  //   role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  //   joinedAt: v.number(),
  // })
  //   .index("by_team", ["teamId"])
  //   .index("by_user", ["userId"]),
});
