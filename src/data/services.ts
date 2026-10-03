import type { LucideIcon } from 'lucide-react'
import {
  Accessibility,
  AppWindow,
  Braces,
  FileSpreadsheet,
  MailCheck,
  Palette,
  Smartphone,
  Waypoints,
  Workflow,
} from 'lucide-react'
import { serviceList, type ServiceId } from './catalog'

export { process } from './catalog'

export type Service = (typeof serviceList)[number] & { icon: LucideIcon }

const serviceIcons: Record<ServiceId, LucideIcon> = {
  spreadsheets: FileSpreadsheet,
  automation: Workflow,
  apps: Smartphone,
  websites: AppWindow,
  email: MailCheck,
  design: Palette,
  accessibility: Accessibility,
  obsidian: Waypoints,
}

export const services: Service[] = serviceList.map((service) => ({
  ...service,
  icon: serviceIcons[service.id],
}))

export type HeroPhrase = { text: string; tag: string; icon: LucideIcon }

/** Rotating hero headline: "I build …" */
export const heroPhrases: HeroPhrase[] = [
  {
    text: 'Excel dashboards that update themselves.',
    tag: 'VBA · Excel',
    icon: FileSpreadsheet,
  },
  {
    text: 'Google Sheets that talk to your apps.',
    tag: 'Apps Script · APIs',
    icon: Braces,
  },
  {
    text: 'follow-up emails that send themselves.',
    tag: 'Email automation',
    icon: MailCheck,
  },
  {
    text: 'apps that replace messy spreadsheets.',
    tag: 'App development',
    icon: Smartphone,
  },
  {
    text: 'websites that everyone can use.',
    tag: 'Web · WCAG 2.1 AA',
    icon: AppWindow,
  },
  {
    text: 'brand kits, ebooks, and workbooks.',
    tag: 'Canva design',
    icon: Palette,
  },
  {
    text: 'notes that become a second brain.',
    tag: 'Obsidian',
    icon: Waypoints,
  },
]
