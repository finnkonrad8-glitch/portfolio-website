// Single source of truth for personal details. Edit here, not in components.

export const site = {
  name: 'Iyodo Oluwatosin',
  nickname: 'Tolex',
  brand: 'TolexTech',
  tagline: 'Built for Business Growth',
  roles: [
    'Full-Stack Developer',
    'Automation Specialist',
    'Spreadsheet Expert',
    'UI/UX Designer',
  ],
  fiverr: {
    url: 'https://www.fiverr.com/tolexpert87',
    handle: 'tolexpert87',
  },
  /** Public contact email shown on the Contact page. Leave null to hide it. */
  email: 'tolexpert87@gmail.com' as string | null,
  /**
   * Path to the downloadable résumé in /public. Set to null to hide the
   * download and link visitors to the contact form instead.
   */
  resumeUrl: '/Iyodo-Oluwatosin-Resume.pdf' as string | null,
}

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
] as const

export const bio = [
  'Hi, my name is Iyodo Oluwatosin (Tolex). I build the systems small businesses run on: Excel and Google Sheets tools powered by VBA and Apps Script, websites and apps, and email automations that handle the follow-up for you.',
  "I also design brand kits, ebooks, and workbooks in Canva, bring websites up to WCAG and ADA accessibility standards, and set up Obsidian vaults that turn scattered notes into a knowledge system you'll actually use.",
  'Whatever the project, my favorite part is taking a messy, manual process and turning it into something that just works.',
]

// Headline numbers from real projects (see src/data/projects.ts).
export const stats = [
  { value: '2,219', label: 'formulas audited to zero errors' },
  { value: '60+', label: 'Apps Script functions in one dispatch system' },
  { value: '680', label: 'notes recovered in one migration' },
  { value: '4', label: 'live API integrations in one build' },
]
