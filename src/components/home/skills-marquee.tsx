import { LogoMark } from '@/components/brand/logo-mark'

const items = [
  'VBA',
  'Apps Script',
  'Microsoft Excel',
  'Google Sheets',
  'Web Development',
  'Email Automation',
  'Canva',
  'WCAG & ADA',
  'Obsidian',
  'UI/UX Design',
]

export function SkillsMarquee() {
  return (
    <section
      aria-label="Core tools"
      className="marquee-group relative overflow-hidden border-y border-border/70 bg-card/40 py-5"
    >
      {/* Static, readable list for assistive tech; the moving copy is decorative. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden className="marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-6 pr-6 font-display text-xl font-semibold tracking-tight whitespace-nowrap text-foreground/70 sm:text-2xl"
              >
                {item}
                <LogoMark className="size-4 text-accent/80" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent sm:w-32"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent sm:w-32"
      />
    </section>
  )
}
