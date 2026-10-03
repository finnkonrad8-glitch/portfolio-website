import type { LucideIcon } from 'lucide-react'
import {
  Accessibility,
  AppWindow,
  FileSpreadsheet,
  MailCheck,
  Palette,
  Waypoints,
} from 'lucide-react'

export type Service = {
  title: string
  description: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    title: 'Spreadsheet Systems',
    description:
      'Excel and Google Sheets tools powered by VBA and Apps Script that take repetitive, manual work off your plate.',
    icon: FileSpreadsheet,
  },
  {
    title: 'Websites & Apps',
    description:
      'Responsive websites and web apps built end to end, from the interface your customers see to the data behind it.',
    icon: AppWindow,
  },
  {
    title: 'Email Automations',
    description:
      'Automated email flows that handle the follow-up for you, so leads and clients never slip through the cracks.',
    icon: MailCheck,
  },
  {
    title: 'Brand Kits, Ebooks & Workbooks',
    description:
      'Polished brand kits, ebooks, and workbooks designed in Canva, ready to publish and easy for you to update.',
    icon: Palette,
  },
  {
    title: 'Accessibility (WCAG & ADA)',
    description:
      'Audits and fixes that bring websites up to WCAG and ADA accessibility standards, so everyone can use them.',
    icon: Accessibility,
  },
  {
    title: 'Obsidian Knowledge Systems',
    description:
      "Obsidian vaults that turn scattered notes into a connected knowledge system you'll actually use.",
    icon: Waypoints,
  },
]

export const process = [
  {
    step: '01',
    title: 'Map the mess',
    description:
      'We walk through how the process runs today and pinpoint where time, money, and attention leak away.',
  },
  {
    step: '02',
    title: 'Build the system',
    description:
      'I design and build the spreadsheet, automation, or site around the way you and your team actually work.',
  },
  {
    step: '03',
    title: 'Hand it over',
    description:
      'You get a working system, explained in plain language and ready for everyday use. It just works.',
  },
]
