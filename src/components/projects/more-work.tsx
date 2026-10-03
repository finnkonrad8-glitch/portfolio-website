import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import { buttonVariants } from '@/components/shared/button'
import { SectionHeading } from '@/components/shared/section-heading'
import { workCategories, type WorkCategory } from '@/data/work'
import { cn } from '@/lib/utils'

export function MoreWork() {
  const [open, setOpen] = useState(false)

  // Allow linking straight to the gallery: /projects#more-work
  useEffect(() => {
    if (window.location.hash === '#more-work') setOpen(true)
  }, [])

  return (
    <section
      id="more-work"
      aria-labelledby="more-work-title"
      className="container-page scroll-mt-24 pb-24"
    >
      <div className="reveal flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-10 text-center">
        <h2
          id="more-work-title"
          className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Websites, apps, and email automation
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Three samples for each service: real client work where I can share it,
          and original concept designs where client work is private.
        </p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="more-work-panel"
          onClick={() => setOpen((value) => !value)}
          className={buttonVariants({
            variant: open ? 'secondary' : 'primary',
            size: 'lg',
            className: 'mt-7',
          })}
        >
          {open ? 'Show less' : 'See more work'}
          <ChevronDown
            aria-hidden
            className={cn(
              'transition-transform duration-300',
              open && 'rotate-180',
            )}
          />
        </button>
      </div>

      {/* Height animates via grid rows 0fr → 1fr. */}
      <div
        id="more-work-panel"
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="space-y-16 pt-14">
            {workCategories.map((category) => (
              <CategoryGallery key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryGallery({ category }: { category: WorkCategory }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const Icon = category.icon

  // Track which slide is mostly in view.
  useEffect(() => {
    const el = track.current
    if (!el) return
    const slides = [...el.children] as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(slides.indexOf(entry.target as HTMLElement))
      },
      { root: el, threshold: 0.6 },
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (index: number) => {
    const el = track.current
    const slide = el?.children[index] as HTMLElement | undefined
    if (!el || !slide) return
    const offset =
      slide.getBoundingClientRect().left - el.getBoundingClientRect().left
    el.scrollTo({ left: el.scrollLeft + offset, behavior: 'smooth' })
  }

  const count = category.samples.length
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={`${String(count).padStart(2, '0')} samples`}
          title={
            <span className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full border border-border bg-card">
                <Icon aria-hidden className="size-5 text-accent" />
              </span>
              {category.title}
            </span>
          }
          description={category.description}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Previous ${category.title} sample`}
            onClick={() => scrollTo(Math.max(0, active - 1))}
            disabled={active === 0}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label={`Next ${category.title} sample`}
            onClick={() => scrollTo(Math.min(count - 1, active + 1))}
            disabled={active === count - 1}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        role="region"
        aria-label={`${category.title} samples`}
        tabIndex={0}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:thin]"
      >
        {category.samples.map((sample, i) => (
          <figure
            key={sample.src}
            className="group w-[88%] shrink-0 snap-start sm:w-[72%] lg:w-[62%]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary">
              <img
                src={sample.src}
                alt={sample.alt}
                loading="lazy"
                decoding="async"
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <span
                className={cn(
                  'absolute top-3 left-3 rounded-full px-3 py-1 font-mono text-[0.68rem] backdrop-blur',
                  sample.kind === 'client'
                    ? 'bg-accent text-accent-foreground'
                    : 'border border-border bg-background/80 text-foreground/80',
                )}
              >
                {sample.kind === 'client'
                  ? 'Client work'
                  : 'Concept · sample data'}
              </span>
            </div>
            <figcaption className="mt-4 flex items-start justify-between gap-4">
              <span>
                <span className="block font-display text-lg font-semibold tracking-tight">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {sample.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {sample.caption}
                </span>
              </span>
              {sample.href ? (
                <a
                  href={sample.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Visit
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">
                    {sample.title} (opens in a new tab)
                  </span>
                </a>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-2" aria-hidden>
        {category.samples.map((sample, i) => (
          <button
            key={sample.src}
            type="button"
            tabIndex={-1}
            onClick={() => scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === active ? 'w-8 bg-accent' : 'w-3 bg-border',
            )}
          />
        ))}
      </div>
    </div>
  )
}
