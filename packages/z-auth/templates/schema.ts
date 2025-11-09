/**
 * Database Schema Template
 *
 * Copy this file to your app's convex/ directory as schema.ts
 *
 * This defines the complete schema for @convex-dev/auth authentication.
 * The schema includes tables for users, sessions, accounts, and verifications.
 *
 * Note: @convex-dev/auth requires specific field names and indexes.
 * Do not modify the core auth tables unless you know what you're doing.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database schema with @convex-dev/auth tables
 */
export default defineSchema({
  // Required: Users table
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

  // Required: Sessions table
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

  // Required: Accounts table (for OAuth and password authentication)
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

  // Required: Verifications table (for email verification)
  verifications: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
  }).index("by_identifier", ["identifier"]),

  // Optional: Password reset tokens (if implementing password reset)
  // Uncomment if you need password reset functionality:
  // passwordResetTokens: defineTable({
  //   userId: v.string(),
  //   token: v.string(),
  //   expiresAt: v.number(),
  //   used: v.boolean(),
  // })
  //   .index("by_token", ["token"])
  //   .index("by_userId", ["userId"]),

  // Add your app-specific tables below
  // Example:
  // posts: defineTable({
  //   title: v.string(),
  //   content: v.string(),
  //   authorId: v.string(),
  //   createdAt: v.number(),
  // }).index("by_author", ["authorId"]),
});
