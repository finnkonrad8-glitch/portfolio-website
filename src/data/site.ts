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
  email: null as string | null,
  /**
   * Path to the downloadable résumé, e.g. '/resume.pdf' after adding the file
   * to /public. While null, the About page links visitors to the contact form.
   */
  resumeUrl: null as string | null,
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
