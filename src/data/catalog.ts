// Plain-text data (no icons or React), so the chat assistant in convex/ can
// import it too. Icons are added in services.ts for the UI.

export const serviceList = [
  {
    id: 'spreadsheets',
    title: 'Spreadsheet Systems',
    description:
      'Excel and Google Sheets tools powered by VBA and Apps Script that take repetitive, manual work off your plate.',
  },
  {
    id: 'automation',
    title: 'API & Workflow Automation',
    description:
      'Your tools talking to each other: Samsara, Motive, Google Maps, WhatsApp, n8n, Zapier, and Make, wired into one flow.',
  },
  {
    id: 'apps',
    title: 'App Development',
    description:
      'Desktop apps built in Excel VBA and web apps built in Bubble, so your team works in clean screens instead of raw grids.',
  },
  {
    id: 'websites',
    title: 'Websites',
    description:
      'Responsive websites and online stores on WordPress, Shopify, and Wix, designed to convert and easy for you to update.',
  },
  {
    id: 'email',
    title: 'Email Automations',
    description:
      'Automated email flows that handle the follow-up for you, so leads and clients never slip through the cracks.',
  },
  {
    id: 'design',
    title: 'Brand Kits, Ebooks & Workbooks',
    description:
      'Polished brand kits, ebooks, and workbooks designed in Canva, ready to publish and easy for you to update.',
  },
  {
    id: 'accessibility',
    title: 'Accessibility (WCAG & ADA)',
    description:
      'Audits and fixes that bring websites up to WCAG and ADA accessibility standards, so everyone can use them.',
  },
  {
    id: 'obsidian',
    title: 'Obsidian Knowledge Systems',
    description:
      "Obsidian vaults that turn scattered notes into a connected knowledge system you'll actually use.",
  },
] as const

export type ServiceId = (typeof serviceList)[number]['id']

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
