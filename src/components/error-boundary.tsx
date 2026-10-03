import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { buttonVariants } from '@/components/shared/button'

// Wired as router-level `defaultErrorComponent` (see ../router.tsx). Receives
// `{ error, info, reset }` — we only use `error` here.
//
// Retry uses `router.invalidate()`, NOT the `reset` prop. `reset()` alone just
// clears the error boundary without re-running the failed loader, so the same
// error fires again on the next render. `router.invalidate()` re-runs loaders
// AND resets the boundary, which is what you actually want for a retry button.
export function ErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  // `error` is typed `unknown` — anything can be thrown, not just an Error.
  const message = error instanceof Error ? error.message : String(error)
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="max-w-md break-words text-muted-foreground">{message}</p>
      <button
        onClick={() => router.invalidate()}
        className={buttonVariants({
          variant: 'secondary',
          size: 'md',
          className: 'mt-4',
        })}
      >
        Retry
      </button>
    </div>
  )
}
