import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { LogoMark } from '@/components/brand/logo-mark'
import { buttonVariants } from '@/components/shared/button'
import { site } from '@/data/site'

type CtaBandProps = {
  title?: string
  description?: string
}

export function CtaBand({
  title = 'Have a manual process eating your week?',
  description = "Tell me how it works today. I'll help you turn it into a system that runs itself.",
}: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className="container-page">
      <div className="reveal relative isolate overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
        <div
          aria-hidden
          className="bg-grid absolute inset-0 -z-10 opacity-70"
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-accent/15 blur-3xl"
        />
        <LogoMark className="absolute -right-8 -bottom-20 -z-10 hidden size-80 text-charcoal/40 md:block" />

        <div className="max-w-xl">
          <h2
            id="cta-title"
            className="font-display text-3xl leading-[1.05] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className={buttonVariants({ variant: 'primary', size: 'lg' })}
            >
              Contact Me
              <ArrowRight aria-hidden />
            </Link>
            <a
              href={site.fiverr.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            >
              Hire me on Fiverr
              <ArrowUpRight aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
