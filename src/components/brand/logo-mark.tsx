import { cn } from '@/lib/utils'

// Vector rebuild of the TolexTech "T in a circle" mark, on a 200×200 grid
// (r = 100). The white "T" is negative space: a 45-unit crossbar across the
// circle at y 34–79 and a 44-unit stem centred below it, leaving three solid
// pieces: the cap above the bar and the two lower quadrants.
export const LOGO_MARK_PATHS = [
  'M24.87 34A100 100 0 0 1 175.13 34Z',
  'M2.23 79H78V197.55A100 100 0 0 1 2.23 79Z',
  'M122 79H197.77A100 100 0 0 1 122 197.55Z',
]

type LogoMarkProps = {
  className?: string
  /** Accessible name. Omit when the mark is decorative or labelled nearby. */
  title?: string
}

export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="currentColor"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {LOGO_MARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
