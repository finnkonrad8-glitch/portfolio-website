import siteMetadata from '../metadata.json'

type PageMetadata = {
  title: string
  description: string
  openGraph?: { images?: string }
}

type SiteMetadata = {
  default?: { openGraph?: { images?: string } }
} & Record<string, PageMetadata>

export const metadata = siteMetadata as unknown as SiteMetadata

export type MetaTag = Record<string, string | undefined>

/** Site-wide social image, set from Macaly's SEO tab (metadata.json → default). */
export function defaultSocialImage() {
  return metadata.default?.openGraph?.images
}

/** Drops tags whose content is missing, so no empty meta tags are emitted. */
export function compactMeta(tags: MetaTag[]) {
  return tags.filter(
    (tag) => !('content' in tag) || Boolean(tag.content),
  ) as Array<Record<string, string>>
}

/** Title, description, and social tags for a page. */
export function buildMeta(page: PageMetadata) {
  return compactMeta([
    { title: page.title },
    { name: 'description', content: page.description },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    {
      property: 'og:image',
      content: page.openGraph?.images ?? defaultSocialImage(),
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: page.description },
  ])
}

/** Head entries for a static route, read from src/metadata.json by pathname. */
export function pageHead(pathname: string) {
  const page = metadata[pathname]
  return { meta: page ? buildMeta(page) : [] }
}
