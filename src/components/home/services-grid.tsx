import { SectionHeading } from '@/components/shared/section-heading'
import { services } from '@/data/services'

export function ServicesGrid() {
  return (
    <section
      aria-labelledby="services-title"
      className="container-page py-24 sm:py-28"
    >
      <div className="reveal">
        <SectionHeading
          eyebrow="What I build"
          title={
            <span id="services-title">
              Tools that take the manual work off your plate.
            </span>
          }
          description="Eight ways I help small businesses run smoother, from the spreadsheet you open every morning to the website your customers find first."
        />
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <li key={service.title} className="reveal">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:bg-secondary/70 sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span
                  aria-hidden
                  className="absolute -right-10 -bottom-10 size-24 rounded-full border border-accent/0 transition-all duration-500 group-hover:-right-6 group-hover:-bottom-6 group-hover:border-accent/30"
                />
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
