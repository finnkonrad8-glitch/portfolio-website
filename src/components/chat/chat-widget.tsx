import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAction } from 'convex/react'
import {
  AlertCircle,
  ArrowUp,
  MessageCircle,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react'
import { api } from '@/convex/_generated/api'
import { CHAT_LIMITS } from '@/convex/chatRules'
import { site } from '@/data/site'
import { delay } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { chat, useChat, type ChatMessage } from './chat-store'
import { MessageText } from './message-text'

const AVATAR = '/tolex-avatar.webp'

const SUGGESTIONS = [
  'What can Tolex build for me?',
  'Show me a past project',
  'Can you automate my spreadsheet?',
  'How do I start a project?',
]

const reachOut = `the [contact page](/contact) or [Fiverr](${site.fiverr.url})`

const NOTICES: Record<NonNullable<ChatMessage['error']>, string> = {
  busy: `Lots of people are chatting right now. Try again in a minute, or message ${site.nickname} on ${reachOut}.`,
  daily: `The assistant has answered all it can for today. You can still reach ${site.nickname} on ${reachOut}.`,
  session: `You've reached today's chat limit. For anything else, message ${site.nickname} on ${reachOut}.`,
  invalid: `That message is a little long. Please keep it under ${CHAT_LIMITS.messageChars} characters.`,
  unavailable: `The assistant is offline right now. You can still reach ${site.nickname} on ${reachOut}.`,
}

const noopSubscribe = () => () => {}

/** False while hydrating server HTML, true on every client render after. */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

/** Floating AI assistant, shown on every page through the page shell. */
export function ChatWidget() {
  // Needs JavaScript to work, so it only appears once the page is interactive.
  return useHydrated() ? <ChatWidgetClient /> : null
}

function ChatWidgetClient() {
  const { open, pending, messages, teaserDismissed } = useChat()
  const ask = useAction(api.chat.ask)
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const [teaser, setTeaser] = useState(false)
  const launcher = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const log = useRef<HTMLDivElement>(null)
  // Only messages that arrive while this page is open animate in.
  const firstNew = useRef(messages.length)

  useEffect(() => {
    if (teaserDismissed || open || messages.length > 0) {
      setTeaser(false)
      return
    }
    const timer = window.setTimeout(() => setTeaser(true), 9000)
    return () => window.clearTimeout(timer)
  }, [teaserDismissed, open, messages.length])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => input.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    const el = log.current
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
  }, [messages.length, pending, open])

  // Grow the composer with its content, up to a few lines.
  useEffect(() => {
    const el = input.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`
  }, [draft])

  const close = () => {
    chat.setOpen(false)
    launcher.current?.focus()
  }

  const go = (href: string) => {
    // On phones the panel covers the page, so get out of the way.
    if (window.matchMedia('(max-width: 639px)').matches) chat.setOpen(false)
    void navigate({ href })
  }

  const send = (text: string) => {
    if (!text.trim() || pending) return
    setDraft('')
    void chat.send(text, ask)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    send(draft)
  }

  const onComposerKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      send(draft)
    }
  }

  return (
    <div className="chat-widget pointer-events-none fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <section
        id="chat-panel"
        role="dialog"
        aria-labelledby="chat-title"
        aria-describedby="chat-description"
        inert={!open}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            close()
          }
        }}
        className={cn(
          'flex h-[min(36rem,calc(100dvh-10rem))] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-[0_24px_60px_-20px_hsl(var(--foreground)/0.35)] sm:w-96',
          'duration-300 ease-out motion-reduce:transition-none',
          // Visible at once on open (so focus can move in), hidden only
          // after the fade-out on close.
          open
            ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100 transition-[opacity,transform]'
            : 'invisible translate-y-4 scale-95 opacity-0 transition-[opacity,transform,visibility]',
        )}
      >
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="relative shrink-0">
            <img
              src={AVATAR}
              alt=""
              width={320}
              height={320}
              className="size-10 rounded-full object-cover ring-2 ring-accent/40"
            />
            <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-accent ring-2 ring-card" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="chat-title"
              className="font-display text-base leading-tight font-semibold tracking-tight"
            >
              {site.nickname}'s assistant
            </h2>
            <p
              id="chat-description"
              className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"
            >
              <Sparkles aria-hidden className="size-3 text-accent" />
              AI that answers from this site
            </p>
          </div>
          <IconButton
            label="Start a new chat"
            onClick={() => chat.reset()}
            disabled={pending || messages.length === 0}
          >
            <RotateCcw />
          </IconButton>
          <IconButton label="Close chat" onClick={close}>
            <X />
          </IconButton>
        </header>

        <div
          ref={log}
          role="log"
          aria-label="Conversation"
          className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
        >
          <Bubble role="assistant">
            Hi! I'm {site.nickname}'s AI assistant. Ask me about services, past
            projects, or how to start a project.
          </Bubble>

          {messages.length === 0 ? (
            <ul
              aria-label="Suggested questions"
              className="flex flex-wrap gap-2 pl-8"
            >
              {SUGGESTIONS.map((question, index) => (
                <li
                  key={question}
                  className="chat-in"
                  style={delay(150 + index * 70)}
                >
                  <button
                    type="button"
                    onClick={() => send(question)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs transition-colors hover:border-accent hover:text-accent"
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {messages.map((message, index) => (
            <Bubble
              key={message.id}
              role={message.role}
              error={Boolean(message.error)}
              animate={index >= firstNew.current}
            >
              {message.role === 'user' ? (
                message.content
              ) : (
                <MessageText
                  text={
                    message.error ? NOTICES[message.error] : message.content
                  }
                  onNavigate={go}
                />
              )}
            </Bubble>
          ))}

          {pending ? (
            <Bubble role="assistant" animate>
              <span className="flex h-5 items-center gap-1">
                {[0, 150, 300].map((ms) => (
                  <span
                    key={ms}
                    aria-hidden
                    className="chat-dot size-1.5 rounded-full bg-muted-foreground"
                    style={delay(ms)}
                  />
                ))}
                <span className="sr-only">The assistant is typing</span>
              </span>
            </Bubble>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="border-t border-border p-3">
          <div className="flex items-end gap-2 rounded-2xl border border-input bg-background py-1.5 pr-1.5 pl-3.5 transition-colors focus-within:border-accent">
            <label htmlFor="chat-input" className="sr-only">
              Message {site.nickname}'s assistant
            </label>
            <textarea
              id="chat-input"
              ref={input}
              rows={1}
              value={draft}
              maxLength={CHAT_LIMITS.messageChars}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onComposerKey}
              placeholder="Ask about services or projects"
              className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-base outline-none placeholder:text-muted-foreground sm:text-sm"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!draft.trim() || pending}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowUp aria-hidden className="size-4" />
            </button>
          </div>
          <p className="mt-2 flex items-start justify-between gap-3 px-1 text-[0.7rem] leading-snug text-muted-foreground">
            <span>
              AI answers can be wrong. For quotes, use the{' '}
              <a
                href="/contact"
                onClick={(event) => {
                  event.preventDefault()
                  go('/contact')
                }}
                className="underline underline-offset-2 hover:text-foreground"
              >
                contact page
              </a>
              .
            </span>
            {draft.length > CHAT_LIMITS.messageChars - 100 ? (
              <span className="shrink-0 font-mono">
                {draft.length}/{CHAT_LIMITS.messageChars}
              </span>
            ) : null}
          </p>
        </form>
      </section>

      <div className="pointer-events-auto flex items-center gap-3">
        {teaser && !open ? (
          <div className="chat-in hidden max-w-64 items-start gap-2 rounded-2xl border border-border bg-card py-3 pr-2 pl-4 text-sm shadow-lg sm:flex">
            <button
              type="button"
              onClick={() => chat.setOpen(true)}
              className="text-left leading-snug"
            >
              <span className="font-semibold">Questions?</span> My AI assistant
              can walk you through services and past projects.
            </button>
            <IconButton
              label="Dismiss"
              onClick={() => {
                setTeaser(false)
                chat.dismissTeaser()
              }}
            >
              <X />
            </IconButton>
          </div>
        ) : null}

        <button
          ref={launcher}
          type="button"
          aria-expanded={open}
          aria-controls="chat-panel"
          aria-label={
            open ? 'Close chat' : `Chat with ${site.nickname}'s AI assistant`
          }
          onClick={() => chat.setOpen(!open)}
          className="group relative size-14 rounded-full bg-accent p-0.5 shadow-[0_12px_30px_-10px_hsl(var(--accent)/0.7)] transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        >
          {teaser && !open ? (
            <span
              aria-hidden
              className="chat-ping absolute inset-0 rounded-full bg-accent/50"
            />
          ) : null}
          <img
            src={AVATAR}
            alt=""
            width={320}
            height={320}
            className={cn(
              'relative size-full rounded-full object-cover transition-all duration-300',
              open && 'scale-50 opacity-0',
            )}
          />
          <span
            aria-hidden
            className={cn(
              'absolute inset-0 flex items-center justify-center text-accent-foreground transition-all duration-300',
              open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
            )}
          >
            <X className="size-6" />
          </span>
          <span
            aria-hidden
            className={cn(
              'absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground text-background transition-all duration-300',
              open && 'scale-0 opacity-0',
            )}
          >
            <MessageCircle className="size-3" />
          </span>
        </button>
      </div>
    </div>
  )
}

function Bubble({
  role,
  error = false,
  animate = false,
  children,
}: {
  role: ChatMessage['role']
  error?: boolean
  animate?: boolean
  children: ReactNode
}) {
  if (role === 'user') {
    return (
      <div className={cn('flex justify-end', animate && 'chat-in')}>
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-accent-foreground">
          <span className="sr-only">You: </span>
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className={cn('flex items-end gap-2', animate && 'chat-in')}>
      <img
        src={AVATAR}
        alt=""
        width={320}
        height={320}
        className="size-6 shrink-0 rounded-full object-cover"
      />
      <div
        className={cn(
          'max-w-[85%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm leading-relaxed',
          error
            ? 'flex gap-2 border border-border bg-background text-muted-foreground'
            : 'bg-secondary text-secondary-foreground',
        )}
      >
        {error ? (
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
        ) : null}
        <div>
          <span className="sr-only">Assistant: </span>
          {children}
        </div>
      </div>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4"
    >
      {children}
    </button>
  )
}
