import { describe, expect, it } from "vitest"
import {
  CHAT_LIMITS,
  normalizeSessionId,
  prepareHistory,
  usageWindows,
  type ChatTurn,
} from "../convex/chatRules"

const user = (content: string): ChatTurn => ({ role: "user", content })
const bot = (content: string): ChatTurn => ({ role: "assistant", content })

describe("prepareHistory", () => {
  it("trims turns and drops empty ones", () => {
    expect(
      prepareHistory([user("  hi  "), bot("   "), user(" more ")]),
    ).toEqual([user("hi"), user("more")])
  })

  it("requires the last turn to be a visitor message", () => {
    expect(prepareHistory([])).toBeNull()
    expect(prepareHistory([user("hi"), bot("hello")])).toBeNull()
    expect(prepareHistory([user("   ")])).toBeNull()
  })

  it("rejects an over-long visitor message", () => {
    const long = "a".repeat(CHAT_LIMITS.messageChars + 1)
    expect(prepareHistory([user(long)])).toBeNull()
    expect(
      prepareHistory([user("a".repeat(CHAT_LIMITS.messageChars))]),
    ).toHaveLength(1)
  })

  it("keeps only the most recent turns and starts on a visitor turn", () => {
    const turns: ChatTurn[] = []
    for (let i = 0; i < 20; i++) turns.push(user(`q${i}`), bot(`a${i}`))
    turns.push(user("latest"))
    const history = prepareHistory(turns)!
    expect(history.length).toBeLessThanOrEqual(CHAT_LIMITS.historyTurns)
    expect(history[0].role).toBe("user")
    expect(history[history.length - 1]).toEqual(user("latest"))
  })

  it("drops the oldest turns past the character budget", () => {
    const big = "x".repeat(CHAT_LIMITS.messageChars)
    const turns: ChatTurn[] = []
    for (let i = 0; i < 6; i++) turns.push(user(big), bot("y".repeat(1500)))
    turns.push(user("latest"))
    const history = prepareHistory(turns)!
    const total = history.reduce((sum, turn) => sum + turn.content.length, 0)
    expect(total).toBeLessThanOrEqual(CHAT_LIMITS.historyChars)
    expect(history[history.length - 1]).toEqual(user("latest"))
  })
})

describe("normalizeSessionId", () => {
  it("accepts browser-generated ids and replaces anything else", () => {
    const id = "3f2b8c1e-9a4d-4e5f-8b6a-1c2d3e4f5a6b"
    expect(normalizeSessionId(id)).toBe(id)
    expect(normalizeSessionId("short")).toBe("anonymous")
    expect(normalizeSessionId("bad id; drop table")).toBe("anonymous")
    expect(normalizeSessionId("a".repeat(65))).toBe("anonymous")
  })
})

describe("usageWindows", () => {
  it("counts against a minute, a day and a session window", () => {
    const now = Date.UTC(2026, 9, 3, 12, 30, 15)
    const [minute, day, session] = usageWindows("session-1234", now)
    expect(minute.limit).toBe(CHAT_LIMITS.perMinute)
    expect(day.limit).toBe(CHAT_LIMITS.perDay)
    expect(session.key).toContain("session-1234")
    for (const window of [minute, day, session]) {
      expect(window.expiresAt).toBeGreaterThan(now)
    }
  })

  it("rolls over to a new minute window", () => {
    const now = Date.UTC(2026, 9, 3, 12, 30, 59)
    expect(usageWindows("s", now)[0].key).not.toBe(
      usageWindows("s", now + 1000)[0].key,
    )
    expect(usageWindows("s", now)[1].key).toBe(
      usageWindows("s", now + 1000)[1].key,
    )
  })
})
