import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, Mail } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'
import { PageShell } from '@/components/layout/page-shell'
import { SectionHeading } from '@/components/shared/section-heading'
import { site } from '@/data/site'
import { delay } from '@/lib/motion'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => pageHead('/contact'),
  component: ContactPage,
})

const checklist = [
  'How the process works today, step by step',
  'The tools you already use (Excel, Sheets, Gmail, your website…)',
  'What “done” looks like for you',
]

function ContactPage() {
  return (
    <PageShell>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute top-0 left-[-15%] -z-10 size-[30rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div className="container-page grid gap-12 pt-12 pb-8 sm:pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:pt-20">
          <div className="fade-up">
            <SectionHeading
              as="h1"
              eyebrow="Contact"
              title="Tell me about the process you want fixed."
              description="Send a message and it lands straight in my inbox. Prefer to keep things on a marketplace? You can hire me on Fiverr too."
            />

            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <img
                src="/tolex-avatar.webp"
                alt=""
                width={320}
                height={320}
                className="size-14 shrink-0 rounded-full object-cover ring-2 ring-accent/40"
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="block font-medium text-foreground">
                  You'll hear back from me, not a team.
                </span>
                {site.name} ({site.nickname}), {site.brand}
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <a
                href={site.fiverr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50"
              >
                <span>
                  <span className="block font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase">
                    Fiverr
                  </span>
                  <span className="mt-1 block font-display text-lg font-semibold">
                    @{site.fiverr.handle}
                  </span>
                </span>
                <span className="flex size-10 items-center justify-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowUpRight aria-hidden className="size-4" />
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>

              {site.email ? (
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50"
                >
                  <span>
                    <span className="block font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase">
                      Email
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold">
                      {site.email}
                    </span>
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                    <Mail aria-hidden className="size-4" />
                  </span>
                </a>
              ) : null}
            </div>

            <div className="mt-10">
              <h2 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Helpful to include
              </h2>
              <ul className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fade-up lg:pt-2" style={delay(120)}>
            <ContactForm />
          </div>
        </div>
      </section>
    </PageShell>
  )
}
