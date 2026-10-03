import type { CSSProperties } from 'react'

/** Staggers `.fade-up` / `.float` animations via the `--delay` custom property. */
export function delay(ms: number): CSSProperties {
  return { ['--delay' as string]: `${ms}ms` } as CSSProperties
}
