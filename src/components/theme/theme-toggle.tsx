import { useEffect, useState, type MouseEvent } from 'react'
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { applyTheme, readStoredTheme, type Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'system', label: 'System theme', icon: Monitor },
  { value: 'light', label: 'Light theme', icon: Sun },
  { value: 'dark', label: 'Dark theme', icon: Moon },
]

export function ThemeToggle({ className }: { className?: string }) {
  // Server HTML can't know the stored choice; sync after mount.
  const [theme, setTheme] = useState<Theme>('system')
  useEffect(() => setTheme(readStoredTheme()), [])

  function choose(value: Theme, event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setTheme(value)
    applyTheme(value, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border bg-card/60 p-1',
        className,
      )}
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={(event) => choose(value, event)}
            className={cn(
              'relative flex size-7 items-center justify-center rounded-full transition-colors duration-200',
              active
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon aria-hidden className="size-3.5" />
          </button>
        )
      })}
    </div>
  )
}
