import { v } from "convex/values"
import { internal } from "./_generated/api"
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server"
import { normalizeContact, validateContact } from "./contactRules"

const notificationStatus = v.union(
  v.literal("pending"),
  v.literal("sent"),
  v.literal("skipped"),
  v.literal("failed"),
)

/**
 * Public entry point for the contact form. Validation failures are returned,
 * not thrown, so the form can show them next to the right fields.
 */
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    service: v.optional(v.string()),
    message: v.string(),
    // Honeypot: hidden from people, filled in by naive bots.
    website: v.optional(v.string()),
  },
  handler: async (ctx, { website, ...raw }) => {
    if (website && website.trim() !== "") {
      return { ok: true as const }
    }

    const input = normalizeContact(raw)
    const errors = validateContact(input)
    if (Object.keys(errors).length > 0) {
      return { ok: false as const, errors }
    }

    const messageId = await ctx.db.insert("contactMessages", {
      ...input,
      notification: "pending",
    })
    await ctx.scheduler.runAfter(0, internal.contact.notifyOwner, { messageId })
    return { ok: true as const }
  },
})

export const getMessage = internalQuery({
  args: { messageId: v.id("contactMessages") },
  handler: async (ctx, { messageId }) => ctx.db.get(messageId),
})

export const setNotification = internalMutation({
  args: {
    messageId: v.id("contactMessages"),
    notification: notificationStatus,
  },
  handler: async (ctx, { messageId, notification }) => {
    await ctx.db.patch(messageId, { notification })
  },
})

/** Emails the site owner through Macaly's built-in notification service. */
export const notifyOwner = internalAction({
  args: { messageId: v.id("contactMessages") },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.runQuery(internal.contact.getMessage, {
      messageId,
    })
    if (!message) return

    const endpoint = process.env.EMAIL_NOTIFICATION_ENDPOINT
    const toEmail = process.env.RECIPIENT_EMAIL
    if (!endpoint || !toEmail) {
      console.warn(
        "Contact email skipped: EMAIL_NOTIFICATION_ENDPOINT or RECIPIENT_EMAIL is not set.",
      )
      await ctx.runMutation(internal.contact.setNotification, {
        messageId,
        notification: "skipped",
      })
      return
    }

    const body = [
      "New message from your portfolio contact form.",
      "",
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Service: ${message.service ?? "Not specified"}`,
      "",
      message.message,
    ].join("\n")

    let notification: "sent" | "failed" = "failed"
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail,
          subject: `New enquiry from ${message.name}`,
          message: body,
          chatId: process.env.CHAT_ID,
          appName: process.env.APP_NAME || "TolexTech Portfolio",
          secretKey: process.env.SECRET_KEY,
        }),
      })
      if (response.ok) {
        notification = "sent"
      } else {
        console.error(
          "Contact email failed",
          response.status,
          await response.text(),
        )
      }
    } catch (error) {
      console.error("Contact email failed", error)
    }

    await ctx.runMutation(internal.contact.setNotification, {
      messageId,
      notification,
    })
  },
})
