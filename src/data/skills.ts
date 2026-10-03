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
    tags: ['Google Sheets', 'Gmail', 'Triggers'],
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
      'Responsive, accessible websites and apps, built to WCAG and ADA standards and designed to grow with you.',
    icon: CodeXml,
    tags: ['HTML & CSS', 'JavaScript', 'React', 'Accessibility'],
  },
  {
    name: 'Obsidian',
    description:
      'Vaults with clear structure, templates, and links that turn scattered notes into a usable second brain.',
    icon: Waypoints,
    tags: ['Vault design', 'Templates', 'Linking'],
  },
]

export const toolkit = [
  'Microsoft Excel',
  'Google Sheets',
  'Email Automation',
  'Google Workspace',
  'UI/UX Design',
  'Responsive Design',
  'WCAG 2.x',
  'ADA Compliance',
  'Brand Identity',
  'Ebook Design',
  'Knowledge Management',
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
