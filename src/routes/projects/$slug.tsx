import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { buttonVariants } from '@/components/shared/button'
import { CtaBand } from '@/components/shared/cta-band'
import { Eyebrow } from '@/components/shared/section-heading'
import { Tag } from '@/components/shared/tag'
import { getProject, projects } from '@/data/projects'
import { delay } from '@/lib/motion'
import { buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    const project = getProject(params.slug)
    if (!project) throw notFound()
    return { project }
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: buildMeta({
            title: `${loaderData.project.title} | Projects by Tolex`,
            description: loaderData.project.summary,
          }),
        }
      : {},
  component: ProjectPage,
})

function ProjectPage() {
  const { project } = Route.useLoaderData()
  const index = projects.findIndex((item) => item.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  const facts = [
    { label: 'Client', value: project.client },
    { label: 'Category', value: project.category },
    { label: 'Year', value: project.year },
    { label: 'Role', value: project.role },
  ]

  return (
    <PageShell>
      <article>
        <header className="relative isolate overflow-hidden">
          <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
          <div className="container-page pt-10 pb-12 sm:pt-14">
            <Link
              to="/projects"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'fade-up -ml-1 px-1',
              })}
            >
              <ArrowLeft aria-hidden className="group-hover:-translate-x-0.5" />
              All projects
            </Link>

            <div className="fade-up mt-8 max-w-3xl" style={delay(60)}>
              <Eyebrow>Case study</Eyebrow>
              <h1 className="mt-4 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
                {project.summary}
              </p>
            </div>

            <div className="fade-up mt-9" style={delay(120)}>
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="border-l border-border pl-4">
                    <dt className="font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: 'primary',
                    size: 'md',
                    className: 'mt-8',
                  })}
                >
                  Visit live site
                  <ArrowUpRight aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <div className="container-page">
          <figure className="fade-up" style={delay(180)}>
            <div className="overflow-hidden rounded-3xl border border-border bg-secondary shadow-[0_40px_80px_-40px_hsl(var(--accent)/0.25)]">
              <img
                src={project.image.src}
                alt={project.image.alt}
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            {project.gallery?.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((shot) => (
                  <div
                    key={shot.src}
                    className="overflow-hidden rounded-2xl border border-border bg-secondary"
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      loading="lazy"
                      decoding="async"
                      width={1600}
                      height={1000}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
            {project.imageNote ? (
              <figcaption className="mt-3 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
                {project.imageNote}
              </figcaption>
            ) : null}
          </figure>

          <section aria-label="Key numbers" className="reveal mt-14">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-card p-6 sm:p-7">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl font-bold tracking-tight text-accent sm:text-5xl">
                      {metric.value}
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16 lg:py-20">
            <div className="space-y-14">
              <StorySection id="problem" step="01" title="The problem">
                <p>{project.problem}</p>
              </StorySection>
              <StorySection id="solution" step="02" title="What I built">
                {project.solution.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </StorySection>
              <StorySection id="result" step="03" title="The result">
                <p className="text-foreground/90">{project.result}</p>
                {project.quote ? (
                  <figure className="mt-8 rounded-2xl border border-accent/25 bg-accent/5 p-6 sm:p-8">
                    <Quote aria-hidden className="size-6 text-accent" />
                    <blockquote className="mt-4 font-display text-2xl leading-snug font-semibold tracking-tight text-foreground">
                      “{project.quote.text}”
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-muted-foreground">
                      {project.quote.attribution}
                    </figcaption>
                  </figure>
                ) : null}
              </StorySection>
            </div>

            <aside aria-label="Project details" className="reveal lg:pt-2">
              <div className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
                <h2 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Tech used
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Tag className="text-[0.75rem] text-foreground/85">
                        {tag}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                  {project.liveUrl
                    ? 'Live link above.'
                    : 'No public link: this is a private client system.'}
                </p>
                {next && next.slug !== project.slug ? (
                  <Link
                    to="/projects/$slug"
                    params={{ slug: next.slug }}
                    className="group mt-6 flex items-center justify-between gap-3 border-t border-border pt-6 text-sm"
                  >
                    <span>
                      <span className="block font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase">
                        Next project
                      </span>
                      <span className="mt-1 block font-display text-lg leading-snug font-semibold transition-colors group-hover:text-accent">
                        {next.title}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </article>

      <CtaBand
        title="Want a system like this?"
        description="Tell me about the manual process slowing you down, and I'll show you what it could look like."
      />
    </PageShell>
  )
}

function StorySection({
  id,
  step,
  title,
  children,
}: {
  id: string
  step: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="reveal">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm text-accent">{step}</span>
        <h2
          id={`${id}-title`}
          className="font-display text-3xl font-bold tracking-tight"
        >
          {title}
        </h2>
      </div>
      <div className="mt-5 space-y-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
        {children}
      </div>
    </section>
  )
}
