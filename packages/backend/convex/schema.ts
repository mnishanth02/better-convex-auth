import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Better Auth User table
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

  // Better Auth Session table
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

  // Account table for OAuth
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

  // Password reset tokens
  passwordResetTokens: defineTable({
    userId: v.string(), // Better Auth uses string IDs, not Convex IDs
    token: v.string(), // Hashed token
    expiresAt: v.number(),
    used: v.boolean(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),
});
