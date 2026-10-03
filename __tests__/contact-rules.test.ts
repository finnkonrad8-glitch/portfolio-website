import { describe, expect, it } from "vitest"
import {
  CONTACT_LIMITS,
  normalizeContact,
  validateContact,
} from "../convex/contactRules"

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  service: "Spreadsheet Systems",
  message: "I need my weekly sales report automated in Excel.",
}

describe("normalizeContact", () => {
  it("trims fields, collapses whitespace in names and lowercases email", () => {
    expect(
      normalizeContact({
        name: "  Ada \n  Lovelace ",
        email: " ADA@Example.COM ",
        service: "  ",
        message: "  Hello there, friend.  ",
      }),
    ).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello there, friend.",
    })
  })
})

describe("validateContact", () => {
  it("accepts a complete submission", () => {
    expect(validateContact(valid)).toEqual({})
  })

  it("accepts a submission without a service", () => {
    const { service, ...rest } = valid
    expect(validateContact(rest)).toEqual({})
  })

  it("flags missing required fields", () => {
    const errors = validateContact({ name: "", email: "", message: "" })
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"])
  })

  it("rejects malformed email addresses", () => {
    for (const email of ["ada", "ada@", "ada@example", "a da@example.com"]) {
      expect(validateContact({ ...valid, email }).email).toBeDefined()
    }
  })

  it("enforces message length limits", () => {
    expect(
      validateContact({ ...valid, message: "too short" }).message,
    ).toBeDefined()
    expect(
      validateContact({
        ...valid,
        message: "x".repeat(CONTACT_LIMITS.message + 1),
      }).message,
    ).toBeDefined()
  })

  it("enforces the name length limit", () => {
    expect(
      validateContact({ ...valid, name: "x".repeat(CONTACT_LIMITS.name + 1) })
        .name,
    ).toBeDefined()
  })
})
