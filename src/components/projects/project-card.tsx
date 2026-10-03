import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Tag } from '@/components/shared/tag'
import type { Project } from '@/data/projects'

export function ProjectCard({
  project,
  headingLevel: Heading = 'h3',
}: {
  project: Project
  headingLevel?: 'h2' | 'h3'
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_24px_60px_-30px_hsl(var(--accent)/0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary">
        <img
          src={project.image.src}
          alt={project.image.alt}
          loading="lazy"
          decoding="async"
          width={1600}
          height={1000}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {project.draft ? (
          <span className="absolute top-4 left-4 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[0.68rem] text-foreground/80 backdrop-blur">
            Case study coming soon
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="font-mono text-xs text-muted-foreground">
          {project.category}
          {project.year ? ` · ${project.year}` : ''}
        </p>
        <Heading className="mt-3 font-display text-2xl font-semibold tracking-tight">
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

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech used">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
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
