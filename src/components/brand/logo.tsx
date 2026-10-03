import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { LogoMark } from './logo-mark'

// Wordmark mirrors the logo: the mark stands in for the "T" of TOLEX.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="TolexTech, home"
      className={cn(
        'group inline-flex items-end gap-0.5 rounded-md text-foreground',
        className,
      )}
    >
      <LogoMark className="size-8 transition-transform duration-500 ease-out group-hover:rotate-[360deg]" />
      <span className="font-display text-[1.45rem] leading-[0.8] font-extrabold tracking-tight">
        OLEX
      </span>
      <span className="mb-px ml-1 font-mono text-[0.6rem] leading-none font-medium tracking-[0.2em] text-accent">
        TECH
      </span>
    </Link>
  )
}
