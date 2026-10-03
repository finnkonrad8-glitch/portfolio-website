import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
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
    { label: 'Category', value: project.category },
    { label: 'Role', value: project.role },
    { label: 'Year', value: project.year },
  ].filter((fact) => fact.value)

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
              <Eyebrow>
                {project.draft ? 'Case study coming soon' : 'Case study'}
              </Eyebrow>
              <h1 className="mt-4 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
                {project.summary}
              </p>
            </div>

            <div
              className="fade-up mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
              style={delay(120)}
            >
              {facts.length > 0 ? (
                <dl className="flex flex-wrap gap-x-8 gap-y-3">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'primary', size: 'md' })}
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
          <figure
            className="fade-up overflow-hidden rounded-3xl border border-border bg-secondary"
            style={delay(180)}
          >
            <img
              src={project.image.src}
              alt={project.image.alt}
              width={1600}
              height={1000}
              className="aspect-[16/10] w-full object-cover"
            />
          </figure>

          <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16 lg:py-20">
            <section aria-labelledby="overview-title" className="reveal">
              <h2
                id="overview-title"
                className="font-display text-3xl font-bold tracking-tight"
              >
                Overview
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {project.overview.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <h2 className="mt-14 font-display text-3xl font-bold tracking-tight">
                Highlights
              </h2>
              <ul className="mt-6 space-y-4">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed"
                  >
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check aria-hidden className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

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
                {next && next.slug !== project.slug ? (
                  <Link
                    to="/projects/$slug"
                    params={{ slug: next.slug }}
                    className="group mt-8 flex items-center justify-between gap-3 border-t border-border pt-6 text-sm"
                  >
                    <span>
                      <span className="block font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase">
                        Next project
                      </span>
                      <span className="mt-1 block font-display text-lg font-semibold transition-colors group-hover:text-accent">
                        {next.title}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </article>

      <CtaBand />
    </PageShell>
  )
}
