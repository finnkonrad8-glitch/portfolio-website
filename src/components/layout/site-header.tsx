import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { buttonVariants } from '@/components/shared/button'
import { navLinks, site } from '@/data/site'
import { delay } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={cn(
        'site-header sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open
          ? 'border-border/70 bg-background/80 backdrop-blur-xl'
          : 'border-transparent bg-background/0',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-18">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === '/' }}
                  className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground data-[status=active]:text-foreground"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 group-data-[status=active]:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          <a
            href={site.fiverr.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'primary', size: 'sm' }),
              'hidden lg:inline-flex',
            )}
          >
            Hire me on Fiverr
            <ArrowUpRight aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/50 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-border/70 md:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-4">
          <ul className="flex flex-col">
            {navLinks.map((link, index) => (
              <li key={link.to} className="fade-up" style={delay(index * 50)}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === '/' }}
                  onClick={() => setOpen(false)}
                  className="group/mobile flex items-center justify-between border-b border-border/60 py-4 font-display text-2xl font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="size-2 rounded-full bg-accent opacity-0 transition-opacity group-data-[status=active]/mobile:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <a
            href={site.fiverr.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'primary', size: 'md' }),
              'mt-6 w-full',
            )}
          >
            Hire me on Fiverr
            <ArrowUpRight aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
