import { useSyncExternalStore } from 'react'
import type { ChatReply } from '@/convex/chat'
import type { ChatTurn } from '@/convex/chatRules'

// Chat state lives outside React so a conversation (and a reply still on its
// way) survives page navigations, which remount the page shell. Messages are
// also kept in sessionStorage so they survive a reload in the same tab.

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  /** Set on local notices (limits, outages). They are never sent to the model. */
  error?: Exclude<ChatReply, { ok: true }>['error']
}

type ChatState = {
  open: boolean
  pending: boolean
  messages: ChatMessage[]
  teaserDismissed: boolean
}

type Ask = (args: {
  sessionId: string
  messages: ChatTurn[]
}) => Promise<ChatReply>

const MESSAGES_KEY = 'tolex-chat'
const SESSION_KEY = 'tolex-chat-session'
const TEASER_KEY = 'tolex-chat-teaser'
const MAX_STORED = 40

const serverState: ChatState = {
  open: false,
  pending: false,
  messages: [],
  teaserDismissed: true,
}

let state: ChatState | null = null
const listeners = new Set<() => void>()

function storage() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function load(): ChatState {
  const store = storage()
  let messages: ChatMessage[] = []
  try {
    const saved = JSON.parse(store?.getItem(MESSAGES_KEY) ?? '[]')
    if (Array.isArray(saved)) messages = saved
  } catch {
    // Ignore unreadable storage and start fresh.
  }
  let teaserDismissed = false
  try {
    teaserDismissed = store?.getItem(TEASER_KEY) === '1'
  } catch {
    // Storage blocked: show the teaser.
  }
  return { open: false, pending: false, messages, teaserDismissed }
}

function current(): ChatState {
  if (!state) state = load()
  return state
}

function update(patch: Partial<ChatState>) {
  state = { ...current(), ...patch }
  if ('messages' in patch) {
    try {
      storage()?.setItem(
        MESSAGES_KEY,
        JSON.stringify(state.messages.slice(-MAX_STORED)),
      )
    } catch {
      // Storage full or blocked: the chat still works for this page view.
    }
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useChat() {
  return useSyncExternalStore(subscribe, current, () => serverState)
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

function sessionId() {
  const store = storage()
  try {
    const saved = store?.getItem(SESSION_KEY)
    if (saved) return saved
  } catch {
    // Fall through to a fresh id.
  }
  const id = newId()
  try {
    store?.setItem(SESSION_KEY, id)
  } catch {
    // An unsaved id still works for this page view.
  }
  return id
}

export const chat = {
  setOpen(open: boolean) {
    update({ open })
    if (open) chat.dismissTeaser()
  },

  dismissTeaser() {
    if (!current().teaserDismissed) update({ teaserDismissed: true })
    try {
      storage()?.setItem(TEASER_KEY, '1')
    } catch {
      // Not remembered across reloads; harmless.
    }
  },

  reset() {
    if (current().pending) return
    update({ messages: [] })
  },

  async send(text: string, ask: Ask) {
    const content = text.trim()
    if (!content || current().pending) return

    const messages = [
      ...current().messages,
      { id: newId(), role: 'user' as const, content },
    ]
    update({ messages, pending: true })

    let reply: ChatReply
    try {
      reply = await ask({
        sessionId: sessionId(),
        messages: messages
          .filter((message) => !message.error)
          .map(({ role, content }) => ({ role, content })),
      })
    } catch {
      reply = { ok: false, error: 'unavailable' }
    }

    update({
      pending: false,
      messages: [
        ...current().messages,
        reply.ok
          ? { id: newId(), role: 'assistant', content: reply.text }
          : { id: newId(), role: 'assistant', content: '', error: reply.error },
      ],
    })
  },
}
