import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,

  // Every contact-form submission is stored, even if the email alert fails.
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    service: v.optional(v.string()),
    message: v.string(),
    notification: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("skipped"),
      v.literal("failed"),
    ),
  }),
})
