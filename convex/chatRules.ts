// Shared limits and input cleanup for the chat assistant. Pure functions, so
// they can be unit tested without a Convex backend.

export const CHAT_LIMITS = {
  /** Longest message a visitor can send. */
  messageChars: 500,
  /** How many recent turns are sent to the model. */
  historyTurns: 12,
  /** Total characters of history sent to the model. */
  historyChars: 6000,
  /** Requests per minute across all visitors. */
  perMinute: 20,
  /** Requests per day across all visitors (protects AI credits). */
  perDay: 300,
  /** Requests per day from one browser session. */
  perSessionDay: 40,
}

export type ChatTurn = { role: "user" | "assistant"; content: string }

export type LimitReason = "busy" | "daily" | "session"

/**
 * Returns a bounded history that starts and ends with a visitor turn, or null
 * when the latest visitor message is missing, empty or too long.
 */
export function prepareHistory(messages: ChatTurn[]): ChatTurn[] | null {
  const cleaned = messages
    .map((turn) => ({ role: turn.role, content: turn.content.trim() }))
    .filter((turn) => turn.content.length > 0)

  const last = cleaned[cleaned.length - 1]
  if (!last || last.role !== "user") return null
  if (last.content.length > CHAT_LIMITS.messageChars) return null

  // Newest first, until the character budget runs out.
  const kept: ChatTurn[] = []
  let total = 0
  for (const turn of cleaned.slice(-CHAT_LIMITS.historyTurns).reverse()) {
    total += turn.content.length
    if (total > CHAT_LIMITS.historyChars) break
    kept.unshift(turn)
  }
  while (kept.length > 0 && kept[0].role !== "user") kept.shift()
  return kept
}

/**
 * Tidies a model reply: house style has no em dashes, and a reply that hit
 * the length cap is trimmed back to its last complete sentence or line.
 */
export function cleanReply(text: string, truncated: boolean): string {
  const reply = text.trim().replace(/\s*\u2014\s*/g, ", ")
  if (!truncated) return reply
  let end = -1
  for (const match of reply.matchAll(/[.!?](?=\s|$)|\n/g)) end = match.index
  return end > 0 ? reply.slice(0, end + 1).trim() : reply
}

/** Session ids come from the browser, so only a safe shape is accepted. */
export function normalizeSessionId(sessionId: string): string {
  return /^[A-Za-z0-9-]{8,64}$/.test(sessionId) ? sessionId : "anonymous"
}

const MINUTE = 60_000
const DAY = 86_400_000

/** The rate-limit counters one request counts against. */
export function usageWindows(sessionId: string, now: number) {
  const minute = Math.floor(now / MINUTE)
  const day = Math.floor(now / DAY)
  return [
    {
      key: `minute:${minute}`,
      limit: CHAT_LIMITS.perMinute,
      expiresAt: (minute + 2) * MINUTE,
      reason: "busy" as LimitReason,
    },
    {
      key: `day:${day}`,
      limit: CHAT_LIMITS.perDay,
      expiresAt: (day + 2) * DAY,
      reason: "daily" as LimitReason,
    },
    {
      key: `session:${sessionId}:${day}`,
      limit: CHAT_LIMITS.perSessionDay,
      expiresAt: (day + 2) * DAY,
      reason: "session" as LimitReason,
    },
  ]
}
