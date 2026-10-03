import { SectionHeading } from '@/components/shared/section-heading'
import { process } from '@/data/services'

export function ProcessSteps() {
  return (
    <section
      aria-labelledby="process-title"
      className="border-y border-border/70 bg-card/30"
    >
      <div className="container-page py-24 sm:py-28">
        <div className="reveal">
          <SectionHeading
            eyebrow="How I work"
            title={
              <span id="process-title">
                From messy and manual to “it just works.”
              </span>
            }
          />
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {process.map((item) => (
            <li key={item.step} className="reveal relative md:pr-6">
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-extrabold text-foreground/15">
                  {item.step}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-gradient-to-r from-border to-transparent"
                />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
