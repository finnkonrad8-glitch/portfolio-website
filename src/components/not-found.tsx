import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '@/components/brand/logo-mark'
import { PageShell } from '@/components/layout/page-shell'
import { buttonVariants } from '@/components/shared/button'

// Wired as router-level `defaultNotFoundComponent` (see ../router.tsx) so it
// catches both unmatched URLs and `throw notFound()` from loaders/beforeLoad.
//
// Do NOT call `Route.useLoaderData()` here — the loader may not have completed
// when the not-found boundary renders. Safe hooks: `useParams`, `useSearch`,
// `useRouteContext`. To forward partial data, throw `notFound({ data: ... })`
// and read it from the `data` prop (typed as `unknown` — validate before use).
export function NotFound() {
  return (
    <PageShell>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div className="container-page flex flex-col items-center py-24 text-center sm:py-32">
          <div
            aria-hidden
            className="flex items-center gap-2 font-display text-8xl font-extrabold tracking-tight sm:text-9xl"
          >
            4
            <LogoMark className="orbit size-20 text-accent sm:size-24" />4
          </div>
          <h1 className="mt-8 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            This page doesn't exist.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            The link may be broken, or the page may have moved. Let's get you
            back to something that works.
          </p>
          <Link
            to="/"
            className={buttonVariants({
              variant: 'primary',
              size: 'lg',
              className: 'mt-10',
            })}
          >
            <ArrowLeft aria-hidden className="group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
