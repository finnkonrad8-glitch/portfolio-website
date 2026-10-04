import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { heroPhrases } from '@/data/services'
import { cn } from '@/lib/utils'

// Each phrase "recalculates" like a spreadsheet cell: the old words dissolve
// letter by letter, then the new ones decode out of formula symbols before
// settling into place.
const GLYPHS = '=Σ#{}()$%+<>/*01ƒx'
const HOLD_MS = 3400
const OUT_STAGGER = 12
const OUT_MS = 380
const IN_STAGGER = 24
const SETTLE_MS = 260
const TICK_MS = 40

type Phase = 'hold' | 'out' | 'in'

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

export function HeroRotator({ headingId }: { headingId: string }) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('hold')
  const [glyphs, setGlyphs] = useState<string[] | null>(null)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timers = useRef<number[]>([])

  const phrase = heroPhrases[index]
  const Icon = phrase.icon
  const halted = paused || hovering

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    const onChange = () => setReducedMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const goTo = useCallback(
    (next: number) => {
      clearTimers()
      if (reducedMotion) {
        setIndex(next)
        setPhase('hold')
        setGlyphs(null)
        return
      }
      const current = heroPhrases[index].text
      setPhase('out')
      later(
        () => {
          const target = heroPhrases[next].text
          const start = performance.now()
          setIndex(next)
          setPhase('in')
          const tick = () => {
            const elapsed = performance.now() - start
            let settled = 0
            const frame = [...target].map((ch, i) => {
              if (ch === ' ' || elapsed > i * IN_STAGGER + SETTLE_MS) {
                settled++
                return ch
              }
              return randomGlyph()
            })
            setGlyphs(frame)
            if (settled < target.length) later(tick, TICK_MS)
            else {
              setGlyphs(null)
              setPhase('hold')
            }
          }
          tick()
        },
        current.length * OUT_STAGGER + OUT_MS,
      )
    },
    [index, reducedMotion],
  )

  // Advance on a timer while holding, unless paused, hovered, or hidden.
  useEffect(() => {
    if (phase !== 'hold' || halted) return
    const id = window.setTimeout(() => {
      if (document.visibilityState === 'visible')
        goTo((index + 1) % heroPhrases.length)
    }, HOLD_MS)
    return () => window.clearTimeout(id)
  }, [phase, halted, index, goTo])

  useEffect(() => clearTimers, [])

  const chars = glyphs ?? [...phrase.text]
  // Group characters into words so lines only break between words.
  const words: { ch: string; i: number }[][] = [[]]
  chars.forEach((ch, i) => {
    if (ch === ' ' && phrase.text[i] === ' ') words.push([])
    else words[words.length - 1].push({ ch, i })
  })

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <h1
        id={headingId}
        className="font-display text-[2.6rem] leading-[0.98] font-extrabold tracking-tight sm:text-6xl lg:text-[4.1rem]"
      >
        <span className="sr-only">
          I build the systems small businesses run on: websites, brand kits and
          ebooks, workflow and email automations, Google Sheets and Excel tools,
          apps, and Obsidian knowledge vaults.
        </span>
        <span aria-hidden className="block">
          I build
        </span>
        <span
          aria-hidden
          className="block min-h-[3.06em] text-accent sm:min-h-[2.06em]"
        >
          {words.map((word, w) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {word.map(({ ch, i }) => {
                const decoding = phase === 'in' && ch !== phrase.text[i]
                return (
                  <span
                    key={i}
                    className={cn(
                      'inline-block transition-[opacity,transform,filter] ease-out',
                      phase === 'out'
                        ? '-translate-y-[0.25em] opacity-0 blur-[6px] duration-300'
                        : 'duration-150',
                      decoding && 'font-mono font-medium text-accent/45',
                    )}
                    style={
                      phase === 'out'
                        ? { transitionDelay: `${i * OUT_STAGGER}ms` }
                        : undefined
                    }
                  >
                    {ch}
                  </span>
                )
              })}
              {w < words.length - 1 ? '\u00a0' : null}
            </span>
          ))}
          <span className="ml-1 inline-block h-[0.8em] w-[0.07em] translate-y-[0.06em] animate-pulse bg-accent/80" />
        </span>
      </h1>

      <RotatorControls
        index={index}
        tag={phrase.tag}
        Icon={Icon}
        paused={paused}
        halted={halted}
        phase={phase}
        onSelect={(i) => i !== index && goTo(i)}
        onTogglePause={() => setPaused((value) => !value)}
      />
    </div>
  )
}

function RotatorControls({
  index,
  tag,
  Icon,
  paused,
  halted,
  phase,
  onSelect,
  onTogglePause,
}: {
  index: number
  tag: string
  Icon: (typeof heroPhrases)[number]['icon']
  paused: boolean
  halted: boolean
  phase: Phase
  onSelect: (i: number) => void
  onTogglePause: () => void
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
      <span
        key={tag}
        className="fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground"
      >
        <Icon aria-hidden className="size-3.5 text-accent" />
        {tag}
      </span>
      <span className="flex items-center gap-1.5">
        {heroPhrases.map((item, i) => (
          <button
            key={item.text}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Show: ${item.text}`}
            aria-current={i === index}
            className="group relative h-1.5 w-6 overflow-hidden rounded-full bg-border transition-colors hover:bg-muted-foreground/40"
          >
            <span
              key={`${index}-${phase}-${halted}`}
              className={cn(
                'absolute inset-y-0 left-0 rounded-full bg-accent',
                i < index && 'w-full',
                i > index && 'w-0',
                i === index &&
                  (phase === 'hold' && !halted
                    ? 'hero-progress w-full'
                    : 'w-full'),
              )}
            />
          </button>
        ))}
      </span>
      <button
        type="button"
        onClick={onTogglePause}
        aria-label={
          paused ? 'Play headline animation' : 'Pause headline animation'
        }
        aria-pressed={paused}
        className="inline-flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
      >
        {paused ? (
          <Play aria-hidden className="size-3" />
        ) : (
          <Pause aria-hidden className="size-3" />
        )}
      </button>
    </div>
  )
}
