import type { LucideIcon } from 'lucide-react'
import { AppWindow, MailCheck, Smartphone } from 'lucide-react'

export type WorkSample = {
  src: string
  alt: string
  title: string
  caption: string
  /** "client" = real delivered work; "concept" = original design with sample data. */
  kind: 'client' | 'concept'
  href?: string
}

export type WorkCategory = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  samples: WorkSample[]
}

const SHOP = 'https://be-inspired-12.myshopify.com/'
const ASSETS =
  'https://assets.macaly-user-data.dev/w1d3l53ilwmk41qxl7gr1us4/yulndv6pwyvi7y5lr354szct'

export const workCategories: WorkCategory[] = [
  {
    id: 'websites',
    title: 'Websites',
    description:
      'Online stores and websites on Shopify, WordPress, and Wix: clean layouts, clear products, and pages that are easy to update.',
    icon: AppWindow,
    samples: [
      {
        src: `${ASSETS}/nVU8feT5At403VizxBGpT/shop-home-8GNlf8JH.webp`,
        alt: 'Be Inspired Today Shopify store home page with the headline "Begin Your Day With Intention" over a lifestyle photo of a branded mug and sweatshirt.',
        title: 'Be Inspired Today: home page',
        caption: 'Shopify store with a warm cream, brown, and sage palette.',
        kind: 'client',
        href: SHOP,
      },
      {
        src: `${ASSETS}/9ZDKeN0rKyUKkUvibPLxf/shop-collection-KVM2DnHH.webp`,
        alt: 'Be Inspired Today product collection grid with a T-shirt, coffee mug, blanket, and candle.',
        title: 'Be Inspired Today: collection',
        caption: 'Product grid across apparel, home, and stationery.',
        kind: 'client',
        href: `${SHOP}collections/all`,
      },
      {
        src: `${ASSETS}/Y45igV4Y9sszzGLfUyD4X/shop-product-us0JJYfs.webp`,
        alt: 'Be Inspired Today product page for the Crème Brûlée candle with a large image and purchase details.',
        title: 'Be Inspired Today: product page',
        caption: 'Two-column product page built to convert.',
        kind: 'client',
        href: `${SHOP}products/be-inspired-creme-brulee-candle`,
      },
    ],
  },
  {
    id: 'apps',
    title: 'Apps',
    description:
      'Desktop apps in Excel VBA and web apps in Bubble that replace raw spreadsheets with clean, focused screens.',
    icon: Smartphone,
    samples: [
      {
        src: '/work/app-driver.webp',
        alt: 'Concept driver app on two phones: today’s load with route, hours-of-service ring, reefer status, and a proof-of-delivery checklist.',
        title: 'Driver companion app',
        caption: 'Loads, hours of service, and proof of delivery in the cab.',
        kind: 'concept',
      },
      {
        src: '/work/app-booking.webp',
        alt: 'Concept salon booking web app showing revenue KPIs and a day calendar for four stylists.',
        title: 'Booking and client portal',
        caption: 'Calendar, reminders, and revenue for a service business.',
        kind: 'concept',
      },
      {
        src: '/work/app-jobs.webp',
        alt: 'Concept home-services job board with leads, quoted, scheduled, and invoiced columns plus a crew panel.',
        title: 'Field jobs board',
        caption: 'Leads to invoices on one drag-and-drop board.',
        kind: 'concept',
      },
    ],
  },
  {
    id: 'email-automation',
    title: 'Email Automation',
    description:
      'Follow-up flows, welcome series, and outreach sequences in tools like HubSpot, Smartlead, Instantly, and Systeme.io.',
    icon: MailCheck,
    samples: [
      {
        src: '/work/email-workflow.webp',
        alt: 'Concept lead follow-up automation canvas: trigger, CRM, wait, welcome email, reply branch, WhatsApp alert, and follow-ups.',
        title: 'Lead follow-up workflow',
        caption:
          'Every inquiry answered in minutes, then followed up automatically.',
        kind: 'concept',
      },
      {
        src: '/work/email-welcome.webp',
        alt: 'Concept branded welcome email for a floral studio, shown on desktop and on a phone.',
        title: 'Branded welcome series',
        caption: 'Responsive emails that look right on every screen.',
        kind: 'concept',
      },
      {
        src: '/work/email-sequence.webp',
        alt: 'Concept outreach dashboard with a five-step sequence, open and reply rates, A/B subject test, and deliverability stats.',
        title: 'Outreach sequence dashboard',
        caption:
          'Five-step sequence with A/B testing and deliverability checks.',
        kind: 'concept',
      },
    ],
  },
]
