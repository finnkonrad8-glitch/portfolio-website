import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { MacalyBridge } from '@macaly/bridge'

// CSS imported as a side effect — do NOT add `?url` or `?inline`.
//
// Why: TanStack Start runs two Vite build environments (client + ssr) with
// independent module graphs. A `?url` import resolves the CSS URL twice and
// the two passes can produce different hashes; the SSR pass bakes its hash
// into the prerendered HTML, but only the client's asset actually exists in
// `dist/client/assets/`, so the stylesheet 404s and the page loads unstyled.
//
// A bare side-effect import sidesteps the issue: only the client environment
// emits the CSS asset, and TanStack Start's manifest collection injects the
// correct hashed `<link rel="stylesheet">` into the rendered head from the
// client manifest. The CSS stays a shared, cacheable asset (important if
// prerender is expanded to multiple static pages — `?inline` would duplicate
// the CSS into every HTML file).
import '../styles.css'
import AppConvexProvider from '@/components/convex-client-provider'
import { compactMeta, defaultSocialImage, metadata } from '@/lib/seo'
import { themeInitScript } from '@/lib/theme'

const rootMeta = metadata['/']

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&family=League+Spartan:wght@600;700;800&display=swap'

export const Route = createRootRoute({
  head: () => ({
    meta: compactMeta([
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: rootMeta.title },
      { name: 'description', content: rootMeta.description },
      // Kept in sync with the active theme by themeInitScript / applyTheme.
      { name: 'theme-color', content: '#faf8f5' },
      { property: 'og:site_name', content: 'TolexTech' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: defaultSocialImage() },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]),
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: FONTS_URL },
    ],
    // Applies a saved light/dark choice before first paint (no theme flash).
    scripts: [{ children: themeInitScript }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <MacalyBridge>
        <body>
          <AppConvexProvider>{children}</AppConvexProvider>
          <Scripts />
        </body>
      </MacalyBridge>
    </html>
  )
}
