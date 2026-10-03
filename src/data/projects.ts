export type Project = {
  /** URL segment for the detail page: /projects/<slug> */
  slug: string
  title: string
  /** One or two sentences shown on the project card. */
  summary: string
  /** Paragraphs for the detail page overview. */
  overview: string[]
  /** Key outcomes or features, shown as a list on the detail page. */
  highlights: string[]
  category: string
  tags: string[]
  year?: string
  role?: string
  image: {
    /** Path under /public (e.g. /projects/my-shot.webp) or a full https URL. */
    src: string
    alt: string
  }
  /** Optional link to the live deployment, opened in a new tab. */
  liveUrl?: string
  /** Marks placeholder entries so the UI can flag them until real data lands. */
  draft?: boolean
}

// Placeholder entries: replace with real Project 1 and Project 2 details.
export const projects: Project[] = [
  {
    slug: 'project-one',
    title: 'Project One',
    summary:
      'Case study coming soon. This card will describe the problem, what was built, and the result in a sentence or two.',
    overview: [
      'This is a placeholder for the full case study. It will explain the client or business context, what the process looked like before, and why it needed to change.',
      'The next section will walk through what was built, the key decisions made along the way, and how the finished system is used day to day.',
    ],
    highlights: [
      'The problem this project solved',
      'What was built and how it works',
      'The measurable result for the business',
    ],
    category: 'Automation',
    tags: ['VBA', 'Excel', 'Automation'],
    image: {
      src: '/projects/project-one.svg',
      alt: 'Placeholder artwork for Project One',
    },
    draft: true,
  },
  {
    slug: 'project-two',
    title: 'Project Two',
    summary:
      'Case study coming soon. This card will describe the problem, what was built, and the result in a sentence or two.',
    overview: [
      'This is a placeholder for the full case study. It will explain the client or business context, what the process looked like before, and why it needed to change.',
      'The next section will walk through what was built, the key decisions made along the way, and how the finished system is used day to day.',
    ],
    highlights: [
      'The problem this project solved',
      'What was built and how it works',
      'The measurable result for the business',
    ],
    category: 'Web Development',
    tags: ['React', 'Accessibility', 'UI/UX'],
    image: {
      src: '/projects/project-two.svg',
      alt: 'Placeholder artwork for Project Two',
    },
    draft: true,
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
