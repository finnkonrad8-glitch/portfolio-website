import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.18em] text-accent uppercase',
        className,
      )}
    >
      {/* Circle + bar glyph borrowed from the logo geometry */}
      <span aria-hidden className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="h-px w-5 bg-accent/60" />
      </span>
      {children}
    </p>
  )
}

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  /** Heading level, so each page keeps a single, ordered outline. */
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <Eyebrow className={cn(align === 'center' && 'justify-center')}>
        {eyebrow}
      </Eyebrow>
      <Heading
        className={cn(
          'mt-4 font-display font-bold tracking-tight text-balance',
          Heading === 'h1'
            ? 'text-4xl leading-[1.02] sm:text-5xl lg:text-6xl'
            : 'text-3xl leading-[1.05] sm:text-4xl lg:text-[2.75rem]',
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
