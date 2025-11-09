/**
 * Database Schema Template
 *
 * Copy this file to your app's convex/ directory as schema.ts
 *
 * This defines the basic schema for Better Auth.
 * Add your app-specific tables below.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database schema with Better Auth tables
 */
export default defineSchema({
  // Better Auth tables
  users: defineTable({
    id: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byemail", ["email"])
    .index("byid", ["id"]),

  sessions: defineTable({
    id: v.string(),
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(),
  })
    .index("byuser", ["userId"])
    .index("bytoken", ["token"]),

  accounts: defineTable({
    userId: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  })
    .index("byuser", ["userId"])
    .index("byprovider", ["provider", "providerAccountId"]),

  verifications: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
  }).index("by_identifier", ["identifier"]),

  // Password reset tokens
  passwordResetTokens: defineTable({
    userId: v.string(), // Better Auth uses string IDs, not Convex IDs
    token: v.string(), // Hashed token
    expiresAt: v.number(),
    used: v.boolean(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  // Add your app-specific tables below
  // Example:
  // posts: defineTable({
  //   title: v.string(),
  //   content: v.string(),
  //   authorId: v.string(),
  //   createdAt: v.number(),
  // }).index("by_author", ["authorId"]),
});
