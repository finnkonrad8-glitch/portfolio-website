/**
 * Concept websites shown in the home page's website showcase. Each one is a
 * full page in public/concepts (built from design/website-concepts) with
 * sample content, so they are always labelled as concepts, not client work.
 */

export type Platform = 'Wix' | 'WordPress' | 'Shopify'

export type ConceptSite = {
  slug: string
  name: string
  platform: Platform
  niche: string
  summary: string
  features: string[]
  /** The site's own palette, for the loading state and the section glow. */
  colors: { bg: string; fg: string; accent: string }
}

export const platforms: { id: Platform; blurb: string }[] = [
  {
    id: 'Wix',
    blurb:
      'Quick to launch and easy for owners to edit. Right for service businesses that live on bookings, galleries and enquiries.',
  },
  {
    id: 'WordPress',
    blurb:
      'Built to grow with lots of content: listings, courses, donations and blogs, with room for custom features.',
  },
  {
    id: 'Shopify',
    blurb:
      'Stores that make buying easy: rich product pages, bundles, subscriptions and a cart that never gets in the way.',
  },
]

export const conceptSites: ConceptSite[] = [
  {
    slug: 'saffron-and-salt',
    name: 'Saffron & Salt',
    platform: 'Wix',
    niche: 'Restaurant',
    summary:
      "A candle-lit site for a West African kitchen and bar, with signature dishes, the chef's story and a table booking form.",
    features: ['Table booking', 'Menu highlights', 'Private dining'],
    colors: { bg: '#120f0d', fg: '#f4ece1', accent: '#e2a33d' },
  },
  {
    slug: 'kora-wellness',
    name: 'Kora Wellness',
    platform: 'Wix',
    niche: 'Yoga & Pilates studio',
    summary:
      'A calm, earthy studio site with class types, a weekly timetable by day, membership pricing and a soft gallery.',
    features: ['Class timetable', 'Membership pricing', 'Gallery'],
    colors: { bg: '#f3f1ea', fg: '#253126', accent: '#b8643f' },
  },
  {
    slug: 'aurelia-weddings',
    name: 'Aurelia',
    platform: 'Wix',
    niche: 'Wedding photographer',
    summary:
      'An editorial portfolio with a masonry gallery, a three-step process, packages and an inquiry form for couples.',
    features: ['Masonry gallery', 'Packages', 'Inquiry form'],
    colors: { bg: '#f7f3ec', fg: '#1b1917', accent: '#a0794a' },
  },
  {
    slug: 'meridian-realty',
    name: 'Meridian Realty',
    platform: 'WordPress',
    niche: 'Real estate agency',
    summary:
      'Property search, featured listings, neighbourhood guides and a mortgage calculator that updates as you drag.',
    features: ['Property search', 'Mortgage calculator', 'Listings'],
    colors: { bg: '#ffffff', fg: '#0f2236', accent: '#c39a5f' },
  },
  {
    slug: 'brightpath-academy',
    name: 'BrightPath Academy',
    platform: 'WordPress',
    niche: 'Online courses',
    summary:
      'A learning platform front end with course search and filters, progress widgets, learner stories and an FAQ.',
    features: ['Course filters', 'Progress widgets', 'FAQ'],
    colors: { bg: '#f7f7fc', fg: '#14123a', accent: '#4f46e5' },
  },
  {
    slug: 'harbor-hope',
    name: 'Harbor Hope',
    platform: 'WordPress',
    niche: 'Nonprofit food bank',
    summary:
      'A donation-first charity site with a live goal bar, monthly or one-off giving, impact counters and events.',
    features: ['Donation picker', 'Goal tracker', 'Events'],
    colors: { bg: '#fbf7f0', fg: '#14302e', accent: '#f0644a' },
  },
  {
    slug: 'oria-botanicals',
    name: 'Oria Botanicals',
    platform: 'Shopify',
    niche: 'Natural skincare',
    summary:
      'A warm skincare store with quick add to bag, hover product swaps, an ingredient story, a bundle and reviews.',
    features: ['Quick add to bag', 'Bundle offer', 'Reviews'],
    colors: { bg: '#f6efe8', fg: '#3a2a22', accent: '#b4573a' },
  },
  {
    slug: 'ember-and-oak',
    name: 'Ember & Oak',
    platform: 'Shopify',
    niche: 'Coffee roaster',
    summary:
      'A bold roastery store with a subscription builder that prices as you choose, roast profiles and brew guides.',
    features: ['Subscription builder', 'Roast profiles', 'Brew guides'],
    colors: { bg: '#17110d', fg: '#f5ebe0', accent: '#e8743b' },
  },
  {
    slug: 'ayo-and-indigo',
    name: 'Ayo & Indigo',
    platform: 'Shopify',
    niche: 'Fashion brand',
    summary:
      'A fashion store for hand-dyed clothing with category tiles, size quick-add, a lookbook and the craft story.',
    features: ['Size quick-add', 'Lookbook', 'Free shipping bar'],
    colors: { bg: '#f4f2ee', fg: '#141a3d', accent: '#2e3fa6' },
  },
]

export const conceptHref = (slug: string) => `/concepts/${slug}.html`
