import { v } from "convex/values"
import { internal } from "./_generated/api"
import { action, internalMutation } from "./_generated/server"
import { systemPrompt } from "./assistantPrompt"
import {
  normalizeSessionId,
  prepareHistory,
  usageWindows,
  type LimitReason,
} from "./chatRules"
import { callMacalyJson } from "./macaly"

export type ChatReply =
  | { ok: true; text: string }
  | { ok: false; error: LimitReason | "invalid" | "unavailable" }

const turn = v.object({
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
})

/**
 * Public entry point for the chat widget. Failures are returned, not thrown,
 * so the widget can show a friendly message with a way to get in touch.
 */
export const ask = action({
  args: { sessionId: v.string(), messages: v.array(turn) },
  handler: async (ctx, { sessionId, messages }): Promise<ChatReply> => {
    const history = prepareHistory(messages)
    if (!history || history.length === 0) {
      return { ok: false, error: "invalid" }
    }

    const quota = await ctx.runMutation(internal.chat.reserve, {
      sessionId: normalizeSessionId(sessionId),
    })
    if (!quota.ok) return { ok: false, error: quota.reason }

    try {
      const result = await callMacalyJson("/api/client-app/llm-usage", {
        preset: "DOCS",
        temperature: 0.4,
        maxTokens: 500,
        messages: [{ role: "system", content: systemPrompt }, ...history],
      })
      const text = typeof result.text === "string" ? result.text.trim() : ""
      if (!text) return { ok: false, error: "unavailable" }
      // House style: no em dashes, even if the model slips one in.
      return { ok: true, text: text.replace(/\s*\u2014\s*/g, ", ") }
    } catch (error) {
      console.error("Chat assistant request failed:", error)
      return { ok: false, error: "unavailable" }
    }
  },
})

/** Counts one request against the per-minute, per-day and per-session caps. */
export const reserve = internalMutation({
  args: { sessionId: v.string() },
  handler: async (
    ctx,
    { sessionId },
  ): Promise<{ ok: true } | { ok: false; reason: LimitReason }> => {
    const now = Date.now()
    const windows = usageWindows(sessionId, now)
    const rows = await Promise.all(
      windows.map((window) =>
        ctx.db
          .query("chatUsage")
          .withIndex("by_window", (q) => q.eq("window", window.key))
          .unique(),
      ),
    )

    for (const [i, window] of windows.entries()) {
      const row = rows[i]
      if (row && row.count >= window.limit) {
        return { ok: false, reason: window.reason }
      }
    }

    for (const [i, window] of windows.entries()) {
      const row = rows[i]
      if (row) {
        await ctx.db.patch(row._id, { count: row.count + 1 })
      } else {
        await ctx.db.insert("chatUsage", {
          window: window.key,
          count: 1,
          expiresAt: window.expiresAt,
        })
      }
    }

    // Tidy up a few expired counters on each request.
    const expired = await ctx.db
      .query("chatUsage")
      .withIndex("by_expiry", (q) => q.lt("expiresAt", now))
      .take(10)
    for (const row of expired) await ctx.db.delete(row._id)

    return { ok: true }
  },
})
