import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Tag({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[0.7rem] leading-none text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
