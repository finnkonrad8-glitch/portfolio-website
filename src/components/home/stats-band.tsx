import { Eyebrow } from '@/components/shared/section-heading'
import { stats } from '@/data/site'

export function StatsBand() {
  return (
    <section aria-labelledby="stats-title" className="container-page pt-24">
      <div className="reveal">
        <Eyebrow>
          <span id="stats-title">By the numbers</span>
        </Eyebrow>
      </div>
      <dl className="reveal mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group bg-card p-6 transition-colors duration-300 hover:bg-secondary/70 sm:p-8"
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-display text-4xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-3 block text-sm leading-snug text-muted-foreground">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
