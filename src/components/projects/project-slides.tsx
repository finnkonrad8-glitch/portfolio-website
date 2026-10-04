import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import type { ProjectImage } from '@/data/projects'
import { cn } from '@/lib/utils'

type Direction = 'next' | 'prev'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The screenshots on a project card. Each change is a curtain wipe with an
 * accent scan line; it auto-advances while in view, pauses on hover, focus,
 * or the pause button, and can be swiped on touch screens.
 */
export function ProjectSlides({
  images,
  title,
  slug,
  offset = 0,
  className,
}: {
  images: ProjectImage[]
  title: string
  slug: string
  /** Delay before the first auto-advance, so cards don't all change at once. */
  offset?: number
  className?: string
}) {
  const count = images.length
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [dir, setDir] = useState<Direction>('next')
  const [turn, setTurn] = useState(0)
  const [userDriven, setUserDriven] = useState(false)
  const [inView, setInView] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [paused, setPaused] = useState(false)
  const [motionOk, setMotionOk] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)

  useEffect(() => {
    setMotionOk(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = root.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.55 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const go = (to: number, direction: Direction, byUser = true) => {
    const target = (to + count) % count
    if (count < 2 || target === index) return
    setLeaving(index)
    setDir(direction)
    setIndex(target)
    setTurn((t) => t + 1)
    if (byUser) setUserDriven(true)
  }

  const running =
    motionOk && inView && !hovering && !focused && !paused && count > 1

  const onPointerDown = (event: PointerEvent) => {
    swipe.current = { x: event.clientX, y: event.clientY }
    swiped.current = false
  }
  const onPointerUp = (event: PointerEvent) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true
      go(index + (dx < 0 ? 1 : -1), dx < 0 ? 'next' : 'prev')
    }
  }

  const label = images[index]?.label ?? `Screenshot ${index + 1}`
  const control =
    'pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur transition-opacity duration-300 hover:bg-black/75'

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      className={cn('group/slides absolute inset-0 z-10', className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setFocused(false)
        }
      }}
    >
      {/* The pictures also open the case study (the title link is the accessible one). */}
      <Link
        to="/projects/$slug"
        params={{ slug }}
        tabIndex={-1}
        aria-hidden
        draggable={false}
        className="absolute inset-0 block touch-pan-y overflow-hidden bg-secondary"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={(event) => {
          if (swiped.current) {
            event.preventDefault()
            swiped.current = false
          }
        }}
      >
        {images.map((image, i) => {
          const active = i === index
          const isLeaving = i === leaving && !active
          return (
            <div
              key={image.src}
              className={cn(
                'absolute inset-0',
                active ? 'z-20' : isLeaving ? 'z-10' : 'z-0 opacity-0',
                active && turn > 0 && `slide-in-${dir}`,
                isLeaving && `slide-out-${dir}`,
              )}
            >
              <img
                src={image.src}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                width={1600}
                height={1000}
                className="size-full object-cover object-left-top transition-transform duration-700 ease-out select-none group-hover:scale-[1.03]"
              />
            </div>
          )
        })}
        {turn > 0 ? (
          <span
            key={turn}
            className={cn(
              'pointer-events-none absolute inset-y-0 z-30 w-[3px] -translate-x-1/2 bg-accent shadow-[0_0_28px_8px_hsl(var(--accent)/0.55)] motion-reduce:hidden',
              `slide-scan-${dir}`,
            )}
          />
        ) : null}
      </Link>

      {/* Screen-reader view: one description per slide, current one announced on user changes. */}
      <p className="sr-only" aria-live={userDriven ? 'polite' : 'off'}>
        {`Screenshot ${index + 1} of ${count}: ${images[index]?.alt ?? ''}`}
      </p>

      {/* Story-style progress, doubling as slide pickers. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex gap-1.5 bg-gradient-to-b from-black/45 to-transparent px-3 pt-3 pb-6">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Show ${image.label ?? `screenshot ${i + 1}`}`}
            aria-current={i === index}
            onClick={() => go(i, i > index ? 'next' : 'prev')}
            className="pointer-events-auto relative h-1 flex-1 rounded-full bg-white/35 before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-['']"
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              {i === index && motionOk && count > 1 ? (
                <span
                  key={`${index}-${turn}`}
                  className="slide-progress absolute inset-0 rounded-full bg-white"
                  style={{
                    animationPlayState: running ? 'running' : 'paused',
                    animationDelay: turn === 0 ? `${offset}ms` : '0ms',
                  }}
                  onAnimationEnd={() => go(index + 1, 'next', false)}
                />
              ) : (
                <span
                  className={cn(
                    'absolute inset-0 rounded-full bg-white transition-transform duration-500',
                    i <= index ? 'scale-x-100' : 'scale-x-0',
                    'origin-left',
                  )}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {count > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-3 z-40 flex items-center">
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => go(index - 1, 'prev')}
              className={cn(
                control,
                'opacity-0 group-hover/slides:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100',
              )}
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-3 z-40 flex items-center">
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={() => go(index + 1, 'next')}
              className={cn(
                control,
                'opacity-0 group-hover/slides:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100',
              )}
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-40 flex items-end justify-between gap-3">
        <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[0.68rem] text-white backdrop-blur">
          {pad(index + 1)} / {pad(count)} · {label}
        </span>
        {count > 1 && motionOk ? (
          <button
            type="button"
            aria-label={paused ? 'Play screenshots' : 'Pause screenshots'}
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className={cn(control, 'size-8')}
          >
            {paused ? (
              <Play aria-hidden className="size-3.5" />
            ) : (
              <Pause aria-hidden className="size-3.5" />
            )}
          </button>
        ) : null}
      </div>
    </div>
  )
}
