import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote, Star } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { publicReviews, reviewStats, type Review } from '@/data/reviews'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

const quoted = publicReviews.filter((review) => review.quote)
const DECK_INTERVAL = 6500
const FLING_MS = 480

export function ReviewsSection() {
  return (
    <section
      aria-labelledby="reviews-title"
      className="relative isolate overflow-hidden py-24 sm:py-28"
    >
      <div
        aria-hidden
        className="absolute top-1/4 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <div className="container-page">
        <div className="reveal">
          <SectionHeading
            eyebrow="Client reviews"
            title={<span id="reviews-title">Don't take my word for it.</span>}
            description="Verified reviews from clients I've worked with on Fiverr, in their own words."
          />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <RatingSummary />
          <ReviewDeck />
        </div>
      </div>

      <ReviewWall />
    </section>
  )
}

/* ---------------- Rating summary ---------------- */

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, inView] as const
}

function useCountUp(target: number, start: boolean, ms = 1400) {
  const [value, setValue] = useState(target)
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    // Server HTML shows the real number; animate only once JS is running.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
    setValue(0)
  }, [])
  useEffect(() => {
    if (!start || !armed) return
    const t0 = performance.now()
    let frame = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      setValue(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [start, armed, target, ms])
  return value
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn('relative inline-flex', className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="flex gap-0.5 text-border">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} aria-hidden className="size-[1em] fill-current" />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-star"
        style={{ width: `${(rating / 5) * 100}%` }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden
            className="size-[1em] shrink-0 fill-current"
          />
        ))}
      </span>
    </span>
  )
}

function RatingSummary() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const shown = useCountUp(reviewStats.average, inView)

  return (
    <div
      ref={ref}
      className="reveal relative self-start overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-9"
    >
      <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
        Average rating
      </p>
      <div className="mt-3 flex items-end gap-4">
        <span className="font-display text-7xl leading-none font-extrabold tracking-tight tabular-nums">
          {shown.toFixed(1)}
        </span>
        <div className="pb-2">
          <Stars
            rating={inView ? reviewStats.average : 0}
            className="text-xl [&_span]:transition-[width] [&_span]:duration-1000"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            across {reviewStats.count} Fiverr reviews
          </p>
        </div>
      </div>

      <dl className="mt-8 space-y-4">
        {reviewStats.breakdown.map((item, i) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm">
              <dt>{item.label}</dt>
              <dd className="font-mono text-muted-foreground">
                {item.value.toFixed(2)}
              </dd>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
                style={{
                  width: inView ? `${(item.value / 5) * 100}%` : '0%',
                  transitionDelay: `${300 + i * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </dl>

      <a
        href={site.fiverr.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
      >
        See my Fiverr profile
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  )
}

/* ---------------- Spotlight deck ---------------- */

function ReviewDeck() {
  const [top, setTop] = useState(0)
  const [flinging, setFlinging] = useState<string | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [hovering, setHovering] = useState(false)
  const busy = useRef(false)
  const n = quoted.length

  const advance = (dir: 1 | -1) => {
    if (busy.current || n < 2) return
    busy.current = true
    setDirection(dir)
    setFlinging(quoted[top].id)
    window.setTimeout(() => {
      setTop((value) => (value + dir + n) % n)
      setFlinging(null)
      busy.current = false
    }, FLING_MS)
  }

  useEffect(() => {
    if (hovering || n < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') advance(1)
    }, DECK_INTERVAL)
    return () => window.clearInterval(id)
  })

  return (
    <div
      className="reveal"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {/* All cards share one grid cell, so the deck sizes to the tallest. */}
      <div
        className="grid pb-10 [&>*]:[grid-area:1/1]"
        aria-roledescription="carousel"
        aria-label="Client reviews"
      >
        {quoted.map((review, i) => {
          const position = (i - top + n) % n
          const isTop = position === 0
          const flung = flinging === review.id
          return (
            <article
              key={review.id}
              aria-hidden={!isTop}
              className={cn(
                'relative flex flex-col rounded-3xl border border-border bg-card p-7 shadow-[0_30px_60px_-40px_hsl(var(--foreground)/0.5)] transition-[transform,opacity] duration-500 ease-out sm:p-9',
                position > 2 && 'opacity-0',
              )}
              style={{
                zIndex: n - position,
                transform: flung
                  ? `translateX(${direction * -70}%) rotate(${direction * -9}deg)`
                  : `translateY(${position * 18}px) scale(${1 - position * 0.05})`,
                // Cards stay opaque so text never shows through; depth comes
                // from the dimming overlay below.
                opacity: flung || position > 2 ? 0 : 1,
                transitionDuration: flung ? `${FLING_MS}ms` : undefined,
              }}
            >
              <ReviewCardBody review={review} animate={isTop && !flung} />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-background transition-opacity duration-500"
                style={{ opacity: isTop ? 0 : Math.min(0.7, position * 0.35) }}
              />
            </article>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Previous review"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowLeft aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Next review"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowRight aria-hidden className="size-4" />
        </button>
        <span
          className="ml-2 font-mono text-xs text-muted-foreground"
          aria-live="polite"
        >
          {String(top + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

function ReviewCardBody({
  review,
  animate,
}: {
  review: Review
  animate: boolean
}) {
  const words = (review.quote ?? '').split(' ')
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Quote aria-hidden className="size-7 text-accent" />
        <Stars rating={review.rating} className="text-base" />
      </div>
      <blockquote
        key={animate ? 'on' : 'off'}
        className="mt-5 font-display text-xl leading-snug font-semibold tracking-tight text-pretty sm:text-2xl"
      >
        “
        {words.map((word, i) => (
          <span
            key={i}
            className={cn('inline-block', animate && 'word-in')}
            style={animate ? { animationDelay: `${i * 45}ms` } : undefined}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
        ”
      </blockquote>
      <footer className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
        <div>
          <p className="font-medium">{review.client}</p>
          <p className="text-sm text-muted-foreground">
            {review.project}
            {review.date ? ` · ${review.date}` : ''}
          </p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.68rem] text-muted-foreground">
          {review.source}
          {review.note ? ` · ${review.note}` : ''}
        </span>
      </footer>
    </>
  )
}

/* ---------------- Marquee wall ---------------- */

function ReviewWall() {
  const rowA = publicReviews
  const rowB = [...publicReviews].reverse()
  return (
    <div
      className="marquee-group relative mt-20 space-y-4"
      aria-label="All reviews"
    >
      <ul className="sr-only">
        {publicReviews.map((review) => (
          <li key={review.id}>
            {review.client}, {review.project}: {review.rating} out of 5.{' '}
            {review.quote ?? review.summary}
          </li>
        ))}
      </ul>
      {[rowA, rowB].map((row, r) => (
        <div key={r} aria-hidden className="overflow-hidden">
          <div
            className={cn(
              'marquee flex w-max gap-4',
              r === 1 && 'marquee-reverse',
            )}
          >
            {[...row, ...row].map((review, i) => (
              <WallChip key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>
      ))}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent sm:w-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent sm:w-40"
      />
    </div>
  )
}

function WallChip({ review }: { review: Review }) {
  return (
    <div className="flex w-[22rem] shrink-0 flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent/15 font-display text-sm font-bold text-accent">
            {review.client.charAt(0)}
          </span>
          <span className="text-sm leading-tight">
            <span className="block font-medium">{review.client}</span>
            <span className="block text-xs text-muted-foreground">
              {review.project}
            </span>
          </span>
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {review.rating.toFixed(1)}
        </span>
      </div>
      <Stars rating={review.rating} className="mt-3 text-sm" />
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {review.quote ? `“${review.quote}”` : review.summary}
      </p>
    </div>
  )
}
