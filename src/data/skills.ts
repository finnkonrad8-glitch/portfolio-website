import type { LucideIcon } from 'lucide-react'
import {
  Braces,
  CodeXml,
  FileSpreadsheet,
  Palette,
  Waypoints,
} from 'lucide-react'

export type Skill = {
  name: string
  description: string
  icon: LucideIcon
  tags: string[]
}

export const coreSkills: Skill[] = [
  {
    name: 'VBA',
    description:
      'Macros, custom functions, and user forms that automate Excel workbooks from data entry to finished report.',
    icon: FileSpreadsheet,
    tags: ['Excel', 'Macros', 'UserForms'],
  },
  {
    name: 'Apps Script',
    description:
      'Google Sheets and Workspace automations: custom menus, time-based triggers, Gmail sends, and integrations.',
    icon: Braces,
    tags: ['Google Sheets', 'APIs', 'Triggers', 'Gmail'],
  },
  {
    name: 'Canva',
    description:
      'Brand kits, ebooks, and workbooks that look sharp, stay on-brand, and remain easy for you to edit.',
    icon: Palette,
    tags: ['Brand kits', 'Ebooks', 'Workbooks'],
  },
  {
    name: 'Web Development',
    description:
      'Website design and WCAG 2.1 AA, ADA, and AODA accessibility remediation for WordPress, Shopify, and Wix, plus web apps built in Bubble.',
    icon: CodeXml,
    tags: ['WordPress', 'Shopify', 'Wix', 'Bubble', 'WCAG 2.1 AA'],
  },
  {
    name: 'Obsidian',
    description:
      'Vaults with clear structure, templates, and links that turn scattered notes into a usable second brain.',
    icon: Waypoints,
    tags: ['Vault design', 'Migrations', 'Dataview', 'Templater', 'Sync'],
  },
]

export const toolkit = [
  'Microsoft Excel',
  'Google Sheets',
  'Samsara & Motive APIs',
  'Google Maps API',
  'WhatsApp',
  'n8n',
  'Zapier',
  'Make',
  'HubSpot',
  'Smartlead',
  'Instantly',
  'Systeme.io',
  'Apollo',
  'Clay',
  'Fillable PDFs',
  'ADA & AODA',
  'Python (openpyxl)',
]

export const roleDetails = [
  {
    role: 'Full-Stack Developer',
    description:
      'Websites and web apps built end to end, from interface to data.',
  },
  {
    role: 'Automation Specialist',
    description:
      'Email flows and scripts that run the repetitive work for you.',
  },
  {
    role: 'Spreadsheet Expert',
    description:
      'Excel and Google Sheets tools powered by VBA and Apps Script.',
  },
  {
    role: 'UI/UX Designer',
    description:
      'Clean, accessible interfaces plus brand assets designed in Canva.',
  },
]

export const workingStyle = [
  'Written-first: every scope, change, and handover on record',
  'A clear guide ships with every build',
  'Tested end to end before delivery',
]

export const industries = [
  'Trucking and logistics',
  'Nonprofits and churches',
  'Community associations',
  'Wedding and lifestyle brands',
  'IT consulting',
]
