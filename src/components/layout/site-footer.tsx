import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { LogoMark } from '@/components/brand/logo-mark'
import { navLinks, site } from '@/data/site'

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-24 overflow-hidden border-t border-border/70">
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {site.tagline}. Spreadsheets, websites, and automations that turn
            messy, manual work into systems that just work.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Pages
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-foreground/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Work with me
          </h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={site.fiverr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-accent"
              >
                Fiverr: @{site.fiverr.handle}
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            {site.email ? (
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-foreground/80 transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
            ) : null}
            <li>
              <Link
                to="/contact"
                className="text-sm text-foreground/80 transition-colors hover:text-accent"
              >
                Send a message
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-border/70 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{' '}
          {site.name} ({site.brand}). All rights reserved.
        </p>
        <p className="font-mono tracking-wide">{site.roles.join(' · ')}</p>
      </div>

      <LogoMark className="pointer-events-none absolute -right-28 -bottom-52 -z-10 size-96 text-charcoal/20" />
    </footer>
  )
}
