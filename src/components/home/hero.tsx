import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { LogoMark } from '@/components/brand/logo-mark'
import { buttonVariants } from '@/components/shared/button'
import { HeroRotator } from '@/components/home/hero-rotator'
import { Eyebrow } from '@/components/shared/section-heading'
import { site } from '@/data/site'
import { delay } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute top-1/3 right-[-10%] -z-10 size-[36rem] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-page grid items-center gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pt-24 lg:pb-28">
        <div>
          <div className="fade-up">
            <Eyebrow>
              {site.brand} · {site.tagline}
            </Eyebrow>
          </div>

          <div className="fade-up mt-6" style={delay(80)}>
            <HeroRotator headingId="hero-title" />
          </div>

          <p
            className="fade-up mt-7 font-mono text-xs leading-relaxed tracking-wide text-foreground/80 sm:text-sm"
            style={delay(160)}
          >
            {site.name} ({site.nickname}) · {site.roles.join(' · ')}
          </p>

          <p
            className="fade-up mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
            style={delay(220)}
          >
            I build the systems small businesses run on. I take the messy,
            manual parts of your business and turn them into something that just
            works.
          </p>

          <div
            className="fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={delay(300)}
          >
            <Link
              to="/projects"
              className={buttonVariants({ variant: 'primary', size: 'lg' })}
            >
              View My Work
              <ArrowRight aria-hidden />
            </Link>
            <Link
              to="/contact"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            >
              Contact Me
            </Link>
          </div>

          <a
            href={site.fiverr.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'fade-up mt-4 px-0',
            )}
            style={delay(360)}
          >
            Or hire me directly on Fiverr
            <ArrowUpRight aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

const chips = [
  {
    label: '=XLOOKUP(id, A:A, C:C)',
    className: 'top-[6%] left-0 sm:left-[2%]',
    delay: 0,
  },
  {
    label: 'function onEdit(e) {…}',
    className: 'top-[30%] right-0 sm:right-[-2%]',
    delay: 1200,
  },
  {
    label: 'Sub AutoReport()',
    className: 'bottom-[24%] left-0 sm:left-[-2%]',
    delay: 2400,
  },
  { label: 'WCAG 2.1 AA ✓', className: 'bottom-[4%] right-[4%]', delay: 3600 },
  {
    label: '[[Second Brain]]',
    className: 'top-[-2%] right-[16%] hidden sm:flex',
    delay: 1800,
  },
]

function HeroVisual() {
  return (
    <div
      aria-hidden
      className="fade-up relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-[30rem]"
      style={delay(200)}
    >
      {/* Orbits */}
      <div className="orbit absolute inset-0 rounded-full border border-dashed border-foreground/15">
        <span className="absolute top-1/2 -left-1.5 size-3 rounded-full bg-accent shadow-[0_0_24px_4px_hsl(var(--accent)/0.6)]" />
      </div>
      <div className="orbit-reverse absolute inset-[11%] rounded-full border border-foreground/10">
        <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-foreground/70" />
      </div>

      {/* The mark */}
      <div className="absolute inset-[19%] overflow-hidden rounded-full border-4 border-background shadow-[0_30px_80px_-30px_hsl(var(--accent)/0.55)] ring-1 ring-border">
        <img
          src="/tolex-portrait.webp"
          alt=""
          width={880}
          height={1100}
          fetchPriority="high"
          className="size-full object-cover object-[50%_18%]"
        />
      </div>
      <span className="absolute right-[20%] bottom-[19%] flex size-14 items-center justify-center rounded-full border-4 border-background bg-foreground text-background shadow-lg sm:size-16">
        <LogoMark className="size-7 sm:size-8" />
      </span>

      {/* Skill chips */}
      {chips.map((chip) => (
        <div
          key={chip.label}
          className={cn('float absolute flex', chip.className)}
          style={delay(chip.delay)}
        >
          <span className="rounded-full border border-border bg-card/85 px-3 py-1.5 font-mono text-[0.68rem] whitespace-nowrap text-foreground/85 shadow-lg backdrop-blur-md sm:text-xs">
            {chip.label}
          </span>
        </div>
      ))}
    </div>
  )
}
