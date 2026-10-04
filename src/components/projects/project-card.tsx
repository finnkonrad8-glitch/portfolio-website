import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ProjectSlides } from '@/components/projects/project-slides'
import { Tag } from '@/components/shared/tag'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'

const MAX_TAGS = 4

export function ProjectCard({
  project,
  headingLevel: Heading = 'h3',
  featured = false,
  slideOffset = 0,
}: {
  project: Project
  headingLevel?: 'h2' | 'h3'
  /** Wide layout: image beside the text on large screens. */
  featured?: boolean
  /** Staggers the screenshot carousels so cards don't all change at once. */
  slideOffset?: number
}) {
  const extraTags = project.tags.length - MAX_TAGS
  const metrics = project.metrics.slice(0, featured ? 3 : 2)

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_24px_60px_-30px_hsl(var(--accent)/0.35)]',
        featured && 'lg:grid lg:grid-cols-[1.35fr_1fr]',
      )}
    >
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary',
          featured && 'lg:aspect-auto lg:min-h-full lg:border-r lg:border-b-0',
        )}
      >
        <ProjectSlides
          images={[project.image, ...(project.gallery ?? [])]}
          title={project.title}
          slug={project.slug}
          offset={slideOffset}
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="font-mono text-xs text-muted-foreground">
          {project.category} · {project.year}
        </p>
        <Heading
          className={cn(
            'mt-3 font-display font-semibold tracking-tight text-balance',
            featured ? 'text-2xl sm:text-3xl' : 'text-2xl',
          )}
        >
          {/* Stretched link: the whole card opens the case study. */}
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <dl
          className={cn(
            'mt-6 grid gap-3 border-y border-border py-4',
            metrics.length === 3 ? 'grid-cols-3' : 'grid-cols-2',
          )}
        >
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className="block font-display text-2xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  {metric.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech used">
          {project.tags.slice(0, MAX_TAGS).map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
          {extraTags > 0 ? (
            <li>
              <Tag className="text-foreground/70">+{extraTags} more</Tag>
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 pt-7">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
            View case study
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Live site
              <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only">
                for {project.title} (opens in a new tab)
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
