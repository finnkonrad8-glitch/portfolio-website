import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, Check, Download, Mail } from 'lucide-react'
import { LogoMark } from '@/components/brand/logo-mark'
import { PageShell } from '@/components/layout/page-shell'
import { buttonVariants } from '@/components/shared/button'
import { CtaBand } from '@/components/shared/cta-band'
import { SectionHeading } from '@/components/shared/section-heading'
import { Tag } from '@/components/shared/tag'
import {
  coreSkills,
  industries,
  roleDetails,
  toolkit,
  workingStyle,
} from '@/data/skills'
import { bio, site } from '@/data/site'
import { delay } from '@/lib/motion'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () => pageHead('/about'),
  component: AboutPage,
})

function AboutPage() {
  return (
    <PageShell>
      {/* Intro */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div className="container-page grid gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:pt-20">
          <div className="fade-up">
            <SectionHeading
              as="h1"
              eyebrow="About & skills"
              title={
                <>
                  Hi, I'm Tolex. I make{' '}
                  <span className="text-accent">manual work</span> disappear.
                </>
              }
            />
            <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground">
              {bio.map((paragraph, index) => (
                <p
                  key={index}
                  className={index === 0 ? 'text-foreground/90' : undefined}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <ProfileCard />
        </div>
      </section>

      {/* Roles */}
      <section
        aria-labelledby="roles-title"
        className="border-y border-border/70 bg-card/30"
      >
        <div className="container-page py-20">
          <h2 id="roles-title" className="sr-only">
            Roles
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {roleDetails.map((item, index) => (
              <li
                key={item.role}
                className="reveal group bg-card p-6 transition-colors duration-300 hover:bg-secondary/70 sm:p-7"
              >
                <span className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                  {item.role}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section
        aria-labelledby="skills-title"
        className="container-page py-24 sm:py-28"
      >
        <div className="reveal">
          <SectionHeading
            eyebrow="Core skills"
            title={
              <span id="skills-title">The toolkit behind the systems.</span>
            }
            description="The five tools I reach for most, and the problems each one solves for the businesses I work with."
          />
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreSkills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <li
                key={skill.name}
                className={index === 0 ? 'reveal lg:col-span-2' : 'reveal'}
              >
                <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 sm:p-7">
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:text-accent">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold tracking-tight">
                      {skill.name}
                    </h3>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {skill.description}
                  </p>
                  <ul
                    className="mt-auto flex flex-wrap gap-2 pt-6"
                    aria-label={`${skill.name} focus areas`}
                  >
                    {skill.tags.map((tag) => (
                      <li key={tag}>
                        <Tag>{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            )
          })}
        </ul>

        <div className="reveal mt-14">
          <h3 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Also in the toolkit
          </h3>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {toolkit.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground/85 transition-colors duration-200 hover:border-accent/60 hover:text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How I work and who I work with */}
      <section
        aria-label="Working style and industries"
        className="container-page pb-24"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="reveal rounded-2xl border border-border bg-card p-7 sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Working style
            </h2>
            <ul className="mt-6 space-y-4">
              {workingStyle.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check aria-hidden className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-2xl border border-border bg-card p-7 sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Industries served
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {industries.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-4 py-2 text-sm text-foreground/85"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Based in Nigeria, working remotely with clients across Canada and
              the United States.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Want the full picture?"
        description="Download my résumé, browse the case studies, or tell me what you're trying to fix."
      />
    </PageShell>
  )
}

function ProfileCard() {
  return (
    <aside
      aria-label="Profile summary"
      className="fade-up relative self-start overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-8"
      style={delay(120)}
    >
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
          <img
            src="/tolex-portrait.webp"
            alt="Portrait of Iyodo Oluwatosin (Tolex)"
            width={880}
            height={1100}
            className="aspect-[4/5] w-full object-cover object-[50%_20%]"
          />
        </div>
        <span className="absolute -bottom-5 left-1/2 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-card bg-foreground text-background">
          <LogoMark className="size-6" />
        </span>
      </div>

      <div className="mt-9 text-center">
        <p className="font-display text-2xl font-bold tracking-tight">
          {site.name}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          a.k.a. {site.nickname} · {site.brand}
        </p>
      </div>

      <ul className="mt-7 space-y-2.5 border-t border-border pt-6">
        {site.roles.map((role) => (
          <li key={role} className="flex items-center gap-3 text-sm">
            <span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check aria-hidden className="size-3" />
            </span>
            {role}
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3">
        {site.resumeUrl ? (
          <a
            href={site.resumeUrl}
            download
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            <Download aria-hidden />
            Download résumé
          </a>
        ) : (
          <Link
            to="/contact"
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            <Mail aria-hidden />
            Request my résumé
          </Link>
        )}
        <a
          href={site.fiverr.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'secondary', size: 'md' })}
        >
          View Fiverr profile
          <ArrowUpRight aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </aside>
  )
}
