export type Theme = 'system' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'tolex-theme'

/**
 * Runs in <head> before first paint (see __root.tsx) so a saved light/dark
 * choice applies without a flash. "System" leaves data-theme unset and lets
 * the prefers-color-scheme media query in styles.css decide.
 */
export const THEME_COLORS = { light: '#faf8f5', dark: '#0b0a09' } as const

export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){d.setAttribute('data-theme',t)}var dark=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);var m=document.querySelector('meta[name=theme-color]');if(m){m.setAttribute('content',dark?'${THEME_COLORS.dark}':'${THEME_COLORS.light}')}}catch(e){}})()`

export function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

function writeTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
  const dark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light)
  try {
    if (theme === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode or blocked storage: the choice still applies for this visit.
  }
}

/** Applies a theme with a circular reveal from `origin` where supported. */
export function applyTheme(theme: Theme, origin?: { x: number; y: number }) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (!document.startViewTransition || reduceMotion || !origin) {
    writeTheme(theme)
    return
  }

  const root = document.documentElement
  root.classList.add('theme-switching')
  const transition = document.startViewTransition(() => writeTheme(theme))
  const radius = Math.hypot(
    Math.max(origin.x, innerWidth - origin.x),
    Math.max(origin.y, innerHeight - origin.y),
  )
  transition.ready
    .then(() =>
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 550,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      ),
    )
    .catch(() => {})
  transition.finished.finally(() => root.classList.remove('theme-switching'))
}
