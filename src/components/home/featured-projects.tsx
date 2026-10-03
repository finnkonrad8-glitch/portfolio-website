import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '@/components/projects/project-card'
import { buttonVariants } from '@/components/shared/button'
import { SectionHeading } from '@/components/shared/section-heading'
import { projects } from '@/data/projects'

export function FeaturedProjects() {
  return (
    <section
      aria-labelledby="work-title"
      className="container-page py-24 sm:py-28"
    >
      <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title={<span id="work-title">Real problems, working systems.</span>}
        />
        <Link
          to="/projects"
          className={buttonVariants({ variant: 'secondary', size: 'md' })}
        >
          All projects
          <ArrowRight aria-hidden />
        </Link>
      </div>

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {projects.slice(0, 2).map((project) => (
          <li key={project.slug} className="reveal">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}
