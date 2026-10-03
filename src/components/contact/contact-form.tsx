import { useEffect, useState, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Send,
} from 'lucide-react'
import { api } from '@/convex/_generated/api'
import {
  CONTACT_LIMITS,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '@/convex/contactRules'
import { buttonVariants } from '@/components/shared/button'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const serviceOptions = [
  ...services.map((service) => service.title),
  'Something else',
]

const fieldClass =
  'w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors duration-200 hover:border-foreground/30 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 aria-[invalid=true]:border-destructive sm:text-sm'

export function ContactForm() {
  const submit = useMutation(api.contact.submit)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<ContactErrors>({})
  const [sentTo, setSentTo] = useState<{ name: string; email: string } | null>(
    null,
  )
  // Until React hydrates, a click would trigger the browser's native GET
  // submit and put the visitor's details in the URL. Keep Send disabled
  // (which also blocks Enter-key submission) until the form is interactive.
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const input = normalizeContact({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      service: String(data.get('service') ?? ''),
      message: String(data.get('message') ?? ''),
    })

    const clientErrors = validateContact(input)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(form, clientErrors)
      return
    }

    setStatus('submitting')
    try {
      const result = await submit({
        ...input,
        website: String(data.get('website') ?? ''),
      })
      if (!result.ok) {
        setErrors(result.errors)
        setStatus('idle')
        focusFirstError(form, result.errors)
        return
      }
      setSentTo({ name: input.name, email: input.email })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success' && sentTo) {
    return (
      <div
        role="status"
        className="fade-up flex flex-col items-start rounded-2xl border border-accent/30 bg-accent/5 p-8 sm:p-10"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <CircleCheck aria-hidden className="size-6" />
        </span>
        <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">
          Message sent.
        </h2>
        <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
          Thanks, {sentTo.name.split(' ')[0]}. Your message is in, and I'll
          reply to <span className="text-foreground">{sentTo.email}</span>.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setSentTo(null)
          }}
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'md' }),
            'mt-8',
          )}
        >
          Send another message
        </button>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      data-state={hydrated ? 'ready' : 'loading'}
      aria-describedby="contact-form-note"
      className="relative rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name}
            placeholder="Jane Doe"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={fieldClass}
          />
        </Field>
        <Field id="email" label="Email address" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={CONTACT_LIMITS.email}
            placeholder="jane@business.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field
          id="service"
          label="What can I help with?"
          optional
          error={errors.service}
        >
          <div className="relative">
            <select
              id="service"
              name="service"
              defaultValue=""
              aria-invalid={errors.service ? true : undefined}
              aria-describedby={errors.service ? 'service-error' : undefined}
              className={cn(fieldClass, 'appearance-none pr-11')}
            >
              <option value="">Choose a service</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="message" label="Your message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={CONTACT_LIMITS.message}
            placeholder="Tell me about the process you want to fix, the tools you use today, and what “done” looks like for you."
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={cn(fieldClass, 'min-h-40 resize-y leading-relaxed')}
          />
        </Field>
      </div>

      {/* Honeypot: visually hidden and skipped by keyboard and screen readers. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] size-px overflow-hidden"
      >
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          id="contact-form-note"
          className="text-xs leading-relaxed text-muted-foreground"
        >
          All fields except the service are required.
        </p>
        <button
          type="submit"
          disabled={!hydrated || submitting}
          className={buttonVariants({ variant: 'primary', size: 'lg' })}
        >
          {submitting ? (
            <>
              <LoaderCircle aria-hidden className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Send aria-hidden />
            </>
          )}
        </button>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {status === 'error' ? (
          <p className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
            <CircleAlert
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-destructive"
            />
            <span>
              Something went wrong sending your message. Please try again, or{' '}
              <a
                href={site.fiverr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-accent"
              >
                message me on Fiverr
              </a>
              .
            </span>
          </p>
        ) : null}
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: ContactField
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between text-sm font-medium"
      >
        {label}
        {optional ? (
          <span className="font-mono text-[0.7rem] font-normal text-muted-foreground">
            optional
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-center gap-1.5 text-sm text-destructive"
        >
          <CircleAlert aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

function focusFirstError(form: HTMLFormElement, errors: ContactErrors) {
  const order: ContactField[] = ['name', 'email', 'service', 'message']
  const first = order.find((field) => errors[field])
  if (first) form.querySelector<HTMLElement>(`#${first}`)?.focus()
}
