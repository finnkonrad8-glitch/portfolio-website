// Validation shared by the contact form (client) and the submit mutation
// (server), so both enforce exactly the same rules. No Convex imports here.

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  service: 100,
  messageMin: 10,
  message: 5000,
} as const

export type ContactInput = {
  name: string
  email: string
  service?: string
  message: string
}

export type ContactField = "name" | "email" | "service" | "message"
export type ContactErrors = Partial<Record<ContactField, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeContact(input: ContactInput): ContactInput {
  const service = input.service?.trim()
  return {
    name: input.name.trim().replace(/\s+/g, " "),
    email: input.email.trim().toLowerCase(),
    ...(service ? { service } : {}),
    message: input.message.trim(),
  }
}

/** Returns only the fields that failed; an empty object means valid. */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {}

  if (!input.name) errors.name = "Please enter your name."
  else if (input.name.length > CONTACT_LIMITS.name)
    errors.name = `Please keep your name under ${CONTACT_LIMITS.name} characters.`

  if (!input.email) errors.email = "Please enter your email address."
  else if (
    input.email.length > CONTACT_LIMITS.email ||
    !EMAIL_PATTERN.test(input.email)
  )
    errors.email = "Please enter a valid email address, like you@example.com."

  if (input.service && input.service.length > CONTACT_LIMITS.service)
    errors.service = "Please choose a shorter service description."

  if (input.message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Please tell me a little more (at least ${CONTACT_LIMITS.messageMin} characters).`
  else if (input.message.length > CONTACT_LIMITS.message)
    errors.message = `Please keep your message under ${CONTACT_LIMITS.message} characters.`

  return errors
}
