import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { ArrowUpRight, Lock, MousePointer2 } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Tag } from '@/components/shared/tag'
import {
  conceptHref,
  conceptSites,
  platforms,
  type ConceptSite,
  type Platform,
} from '@/data/websites'
import { cn } from '@/lib/utils'

/** Width the concept pages are laid out at inside the previews. */
const PAGE_WIDTH = 1440
/** Preview scroll speed, in page pixels per millisecond. */
const SCROLL_SPEED = 0.75

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Home page showcase of the concept websites, grouped by platform. Each card
 * holds the real page in a scaled-down frame that scrolls through the site on
 * hover or focus (or while in view on touch screens).
 */
export function WebsiteShowcase() {
  const [active, setActive] = useState<Platform>('Wix')
  const [near, setNear] = useState(false)
  const [glow, setGlow] = useState<string | null>(null)
  // The first cards ease in on scroll; after a tab change they flip in.
  const [switched, setSwitched] = useState(false)
  const section = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  // Previews load once the section is close, not with the rest of the page.
  useEffect(() => {
    const el = section.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const index = platforms.findIndex((p) => p.id === active)
  const sites = conceptSites.filter((site) => site.platform === active)

  const choose = (i: number, focus = false) => {
    const next = (i + platforms.length) % platforms.length
    setActive(platforms[next].id)
    setSwitched(true)
    setGlow(null)
    if (focus) tabs.current[next]?.focus()
  }

  const onTabKey = (event: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: platforms.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    choose(moves[event.key], true)
  }

  return (
    <section
      id="websites"
      ref={section}
      aria-labelledby="websites-title"
      className="relative isolate scroll-mt-20 overflow-hidden py-24 sm:py-28"
    >
      {/* Ambient glow that takes on the colour of the site being explored. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full opacity-[0.14] blur-[120px] transition-colors duration-1000 dark:opacity-[0.1]"
        style={{ backgroundColor: glow ?? 'hsl(var(--accent))' }}
      />

      <div className="container-page relative">
        <p
          key={active}
          aria-hidden
          className="showcase-word pointer-events-none absolute -top-10 right-2 -z-10 font-display text-[clamp(4.5rem,15vw,12.5rem)] leading-none font-bold tracking-tighter whitespace-nowrap text-transparent select-none sm:-top-14"
        >
          {active.split('').map((letter, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties}>
              {letter}
            </span>
          ))}
        </p>

        <div className="reveal grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            eyebrow="Website showcase"
            title={
              <span id="websites-title">
                Nine sites, three platforms, zero templates.
              </span>
            }
            description="Concept builds with sample content, designed for Wix, WordPress and Shopify, each for a different kind of business. Hover a preview to scroll through the page, or open it live."
          />

          <div
            role="tablist"
            aria-label="Platform"
            onKeyDown={onTabKey}
            className="relative grid w-full grid-cols-3 rounded-full border border-border bg-card/80 p-1 shadow-sm backdrop-blur sm:w-auto"
          >
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-foreground shadow-[0_8px_24px_-10px_hsl(var(--foreground)/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]"
              style={{ transform: `translateX(${index * 100}%)` }}
            />
            {platforms.map((platform, i) => {
              const selected = platform.id === active
              return (
                <button
                  key={platform.id}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`websites-tab-${platform.id}`}
                  aria-selected={selected}
                  aria-controls="websites-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  className={cn(
                    'relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 sm:px-6',
                    selected
                      ? 'text-background'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {platform.id}
                  <span className="font-mono text-[0.65rem] opacity-60">
                    {pad(
                      conceptSites.filter((s) => s.platform === platform.id)
                        .length,
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p
          key={`blurb-${active}`}
          className="fade-up mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground lg:ml-auto lg:text-right"
        >
          {platforms[index].blurb}
        </p>

        <ul
          role="tabpanel"
          id="websites-panel"
          aria-labelledby={`websites-tab-${active}`}
          className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-7"
        >
          {sites.map((site, i) => (
            <SiteCard
              key={site.slug}
              site={site}
              index={i}
              entrance={switched ? 'site-card-in' : 'reveal'}
              load={near}
              onExplore={setGlow}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

function SiteCard({
  site,
  index,
  entrance,
  load,
  onExplore,
}: {
  site: ConceptSite
  index: number
  entrance: string
  load: boolean
  onExplore: (color: string | null) => void
}) {
  const href = conceptHref(site.slug)
  const tilt = useRef<HTMLDivElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState({ scale: 0, height: 0 })
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [motionOk, setMotionOk] = useState(false)
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    setMotionOk(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setTouch(window.matchMedia('(hover: none)').matches)
    const el = view.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ scale: width / PAGE_WIDTH, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Touch screens have no hover, so the preview plays while it is in view.
  useEffect(() => {
    if (!touch || !motionOk) return
    const el = view.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.7 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [touch, motionOk])

  // Scroll the framed page down while playing, and glide back up after.
  useEffect(() => {
    if (!ready || !motionOk) return
    const win = frame.current?.contentWindow
    if (!win) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48)
      last = now
      const max = win.document.documentElement.scrollHeight - win.innerHeight
      const y = win.scrollY
      const next = playing
        ? Math.min(max, y + dt * SCROLL_SPEED)
        : y < 1
          ? 0
          : y * Math.pow(0.88, dt / 16)
      win.scrollTo({ top: next, behavior: 'instant' })
      if (bar.current) {
        bar.current.style.transform = `scaleX(${max > 0 ? next / max : 0})`
      }
      if (playing ? next < max : next > 0) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, ready, motionOk])

  const start = () => {
    if (!touch) setPlaying(true)
    onExplore(site.colors.accent)
  }
  const stop = () => {
    if (!touch) setPlaying(false)
    onExplore(null)
  }

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = tilt.current
    if (!el || event.pointerType !== 'mouse' || !motionOk) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    const el = tilt.current
    el?.style.setProperty('--rx', '0deg')
    el?.style.setProperty('--ry', '0deg')
  }

  const pageHeight = size.scale ? size.height / size.scale : 0

  return (
    <li
      className={cn('group/site', entrance)}
      style={{ '--i': index } as CSSProperties}
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) stop()
      }}
    >
      <div
        ref={tilt}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="site-tilt relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-30px_hsl(var(--foreground)/0.35)] group-hover/site:shadow-[0_40px_80px_-30px_hsl(var(--foreground)/0.45)]"
      >
        {/* Browser chrome */}
        <div className="flex h-9 items-center gap-3 border-b border-border bg-secondary/70 px-3.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground">
            <Lock aria-hidden className="size-3 shrink-0" />
            <span className="truncate">concepts/{site.slug}</span>
          </span>
        </div>

        <div
          ref={view}
          aria-hidden
          className="relative aspect-[16/11] overflow-hidden"
          style={{ backgroundColor: site.colors.bg, color: site.colors.fg }}
        >
          {/* Shown until the live page has loaded. */}
          <div className="absolute inset-0 flex flex-col justify-end gap-2 p-6">
            <span
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: site.colors.accent }}
            />
            <span className="font-display text-3xl font-bold tracking-tight">
              {site.name}
            </span>
            <span className="text-sm opacity-70">{site.niche}</span>
          </div>

          {load && pageHeight ? (
            <iframe
              ref={frame}
              src={`${href}?embed`}
              title={`${site.name} preview`}
              tabIndex={-1}
              loading="lazy"
              onLoad={() => setReady(true)}
              className={cn(
                'pointer-events-none absolute top-0 left-0 origin-top-left border-0 transition-opacity duration-700',
                ready ? 'opacity-100' : 'opacity-0',
              )}
              style={{
                width: PAGE_WIDTH,
                height: pageHeight,
                transform: `scale(${size.scale})`,
              }}
            />
          ) : null}

          {/* Pointer glare */}
          <span className="site-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/site:opacity-100" />

          <span className="absolute top-3 left-3 rounded-full bg-black/65 px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-white uppercase backdrop-blur">
            Concept
          </span>

          <span
            className={cn(
              'absolute right-3 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-all duration-500',
              (playing || !motionOk) && 'translate-y-2 opacity-0',
            )}
          >
            <MousePointer2 className="size-3.5" />
            {touch ? 'Tap to open' : 'Hover to scroll'}
          </span>

          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-black/15">
            <span
              ref={bar}
              className="block h-full origin-left scale-x-0"
              style={{ backgroundColor: site.colors.accent }}
            />
          </span>

          {/* The whole preview opens the site; the text link below is the accessible one. */}
          <a
            href={href}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            className="absolute inset-0"
          >
            <span className="sr-only">Open {site.name}</span>
          </a>
        </div>
      </div>

      <div className="mt-5 px-1">
        <p className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
          <span
            aria-hidden
            className="size-1.5 rounded-full"
            style={{ backgroundColor: site.colors.accent }}
          />
          {site.platform} · {site.niche}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
          {site.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
          {site.summary}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Highlights">
          {site.features.map((feature) => (
            <li key={feature}>
              <Tag>{feature}</Tag>
            </li>
          ))}
        </ul>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Open live site
          <span className="sr-only"> (opens in a new tab)</span>
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </a>
      </div>
    </li>
  )
}
