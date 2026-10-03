import { createFileRoute } from '@tanstack/react-router'
import { FeaturedProjects } from '@/components/home/featured-projects'
import { Hero } from '@/components/home/hero'
import { ProcessSteps } from '@/components/home/process-steps'
import { ServicesGrid } from '@/components/home/services-grid'
import { SkillsMarquee } from '@/components/home/skills-marquee'
import { StatsBand } from '@/components/home/stats-band'
import { PageShell } from '@/components/layout/page-shell'
import { ReviewsSection } from '@/components/reviews/reviews-section'
import { CtaBand } from '@/components/shared/cta-band'
import { site } from '@/data/site'
import { pageHead } from '@/lib/seo'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  alternateName: [site.nickname, site.brand],
  jobTitle: site.roles,
  description:
    'Builds Excel and Google Sheets tools with VBA and Apps Script, websites, apps, and email automations for small businesses.',
  knowsAbout: [
    'VBA',
    'Google Apps Script',
    'Microsoft Excel',
    'Google Sheets',
    'Web development',
    'Email automation',
    'Canva',
    'Web accessibility (WCAG, ADA)',
    'Obsidian',
    'UI/UX design',
  ],
  sameAs: [site.fiverr.url],
}

export const Route = createFileRoute('/')({
  head: () => ({
    ...pageHead('/'),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(personJsonLd),
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <PageShell>
      <Hero />
      <SkillsMarquee />
      <StatsBand />
      <ServicesGrid />
      <ProcessSteps />
      <FeaturedProjects />
      <ReviewsSection />
      <CtaBand />
    </PageShell>
  )
}
