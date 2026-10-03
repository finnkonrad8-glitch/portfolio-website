export type Review = {
  id: string
  client: string
  project: string
  date?: string
  /** Star rating out of 5. */
  rating: number
  breakdown?: { communication: number; quality: number; value: number }
  /** The client's exact words. Only verbatim text goes here. */
  quote?: string
  /** Factual summary, shown without quotation marks, when no wording exists. */
  summary?: string
  highlights?: string[]
  source: 'Fiverr review' | 'Client message'
  /** Context shown under the name, e.g. which gig or account. */
  note?: string
  /**
   * Client messages are private. Set to true only after the client agrees to
   * being quoted; until then they are not shown anywhere on the site.
   */
  consent?: boolean
}

export const reviews: Review[] = [
  {
    id: 'horizon-phase-2',
    client: 'Udai Sharan',
    project: 'Horizon Transport, Phase 2',
    date: 'June 2026',
    rating: 5,
    breakdown: { communication: 5, quality: 5, value: 5 },
    quote:
      'She is a great professional who understands and delivers as desired.',
    source: 'Fiverr review',
  },
  {
    id: 'woba-connect',
    client: 'Terry',
    project: 'WOBA Connect 2.0',
    date: 'August 2026',
    rating: 4.7,
    breakdown: { communication: 5, quality: 5, value: 4 },
    quote:
      "Petra is excellent to work with. She communicates well and responds to her client's needs well. A pleasure working with her. I would do it again (and will)!",
    highlights: ['Level of cooperation', 'Professionalism of work'],
    source: 'Fiverr review',
    note: 'Earned on a previous Fiverr account',
  },
  {
    id: 'curated-bride',
    client: 'Tina',
    project: 'Curated Bride',
    date: 'September 2026',
    rating: 4,
    breakdown: { communication: 4, quality: 4, value: 4 },
    quote: 'Very good service.',
    source: 'Fiverr review',
  },
  {
    id: 'horizon-first-order',
    client: 'Udai Sharan',
    project: 'Horizon Transport, first order',
    date: 'May 2026',
    rating: 5,
    summary: 'Five stars for the first phase of the dispatch system.',
    source: 'Fiverr review',
  },
  {
    id: 'lottery-generator',
    client: 'Ron',
    project: '6/49 lottery generator',
    date: 'August 2026',
    rating: 5,
    breakdown: { communication: 5, quality: 5, value: 5 },
    summary: 'Praised delivery ahead of schedule and added 12 positive tags.',
    source: 'Fiverr review',
  },
  {
    id: 'obsidian-worldbuilding',
    client: 'Magellan',
    project: 'Obsidian worldbuilding vault',
    rating: 5,
    summary: 'Five stars for an Obsidian worldbuilding vault.',
    source: 'Fiverr review',
  },
  {
    id: 'ron-message',
    client: 'Ron',
    project: '6/49 lottery generator',
    rating: 5,
    quote:
      "Petie your professionalism is astounding. I have closed and opened the generator and it's solid.",
    source: 'Client message',
    consent: false,
  },
  {
    id: 'tina-message',
    client: 'Tina',
    project: 'Curated Bride, on the draft',
    rating: 5,
    quote:
      "it's very on brand and exactly what we spoke about. I'm really happy with how everything came together.",
    source: 'Client message',
    consent: false,
  },
]

/** Everything allowed on the site: all Fiverr reviews, plus consented messages. */
export const publicReviews = reviews.filter(
  (review) => review.source === 'Fiverr review' || review.consent === true,
)

const fiverrReviews = reviews.filter((r) => r.source === 'Fiverr review')

function average(values: number[]) {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

const withBreakdown = fiverrReviews.flatMap((r) =>
  r.breakdown ? [r.breakdown] : [],
)

export const reviewStats = {
  count: fiverrReviews.length,
  average: average(fiverrReviews.map((r) => r.rating)),
  breakdown: [
    {
      label: 'Communication',
      value: average(withBreakdown.map((b) => b.communication)),
    },
    { label: 'Quality', value: average(withBreakdown.map((b) => b.quality)) },
    { label: 'Value', value: average(withBreakdown.map((b) => b.value)) },
  ],
}
