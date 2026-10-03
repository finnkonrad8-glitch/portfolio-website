import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/layout/page-shell'
import { ProjectCard } from '@/components/projects/project-card'
import { CtaBand } from '@/components/shared/cta-band'
import { SectionHeading } from '@/components/shared/section-heading'
import { projects } from '@/data/projects'
import { delay } from '@/lib/motion'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/projects/')({
  head: () => pageHead('/projects'),
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <PageShell>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div className="container-page pt-12 pb-16 sm:pt-16 lg:pt-20">
          <div className="fade-up">
            <SectionHeading
              as="h1"
              eyebrow="Projects"
              title="Selected work: messy processes, made to just work."
              description="Spreadsheet systems, websites, automations, and designs. Each case study covers the problem, what I built, and what changed for the business."
            />
          </div>
        </div>
      </section>

      <section aria-label="Project gallery" className="container-page pb-24">
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="fade-up"
              style={delay(120 + index * 80)}
            >
              <ProjectCard project={project} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Need something similar built?"
        description="More reviews and ready-to-order services live on my Fiverr profile, or send me the details directly."
      />
    </PageShell>
  )
}
