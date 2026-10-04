export type ProjectImage = {
  /** Path under /public (e.g. /projects/my-shot.webp) or a full https URL. */
  src: string
  alt: string
  /** Short name shown on the card carousel, e.g. "Driver hours". */
  label?: string
}

export type Project = {
  /** URL segment for the detail page: /projects/<slug> */
  slug: string
  title: string
  /** Who the work was for, as it can be shown publicly. */
  client: string
  /** One or two sentences shown on the project card. */
  summary: string
  problem: string
  /** "What I built" paragraphs for the detail page. */
  solution: string[]
  result: string
  /** Headline numbers, shown on the card and the detail page. */
  metrics: { value: string; label: string }[]
  quote?: { text: string; attribution: string }
  category: string
  tags: string[]
  year: string
  role: string
  image: ProjectImage
  /** Extra screens shown under the main image on the detail page. */
  gallery?: ProjectImage[]
  /** Shown under the images, e.g. to explain sample data. */
  imageNote?: string
  /** Optional link to the live deployment, opened in a new tab. */
  liveUrl?: string
}

const RECREATED =
  'Recreated preview with sample data. Client names, figures, and locations are withheld for privacy.'

export const projects: Project[] = [
  {
    slug: 'horizon-transport-dispatch-system',
    title: 'Horizon Transport Dispatch System',
    client: 'Horizon Transport, a Canadian trucking company',
    summary:
      'A live dispatch command center in Google Sheets that tracks 51 trucks and 96 trailers and sends loads to drivers in one click.',
    problem:
      'Horizon Transport, a Canadian trucking company, had its fleet data split between Samsara (truck GPS and reefer temperatures) and Motive (driver hours). Dispatchers needed one screen to see the whole fleet and get loads out to drivers fast.',
    solution: [
      'A 14-tab system powered by 60+ Apps Script functions. It pulls live truck and trailer locations and reefer temperatures from Samsara, driver hours and remaining cycle time from Motive, and trip distances from Google Maps, then color-codes every unit by yard.',
      "Each dispatch goes to the driver's WhatsApp in one click. An overnight sync keeps the truck and trailer lists current, and a daily safety trigger restores any formulas a dispatcher accidentally clears.",
    ],
    result:
      'Delivered across three phases with a 5-star review. The owner then came back to scope his next project with me.',
    metrics: [
      { value: '51', label: 'trucks tracked live' },
      { value: '96', label: 'trailers tracked live' },
      { value: '60+', label: 'Apps Script functions' },
      { value: '5★', label: 'client review' },
    ],
    category: 'Workflow Automation',
    tags: [
      'Google Sheets',
      'Google Apps Script',
      'Samsara API',
      'Motive API',
      'Google Maps',
      'WhatsApp click-to-chat',
      'Time-driven triggers',
    ],
    year: '2026',
    role: 'Solo developer, from scoping to handover',
    image: {
      src: '/projects/horizon-dispatch.webp',
      label: 'Dispatch board',
      alt: 'Dispatch tab of the Horizon Transport system in Google Sheets: trucks color-coded by yard with live location, reefer temperature, driver hours, and one-click WhatsApp dispatch buttons.',
    },
    gallery: [
      {
        src: '/projects/horizon-trailers.webp',
        label: 'Reefer monitor',
        alt: 'Reefer and trailer monitor tab with return-air temperatures, fuel levels, and alarms from Samsara, with the custom Dispatch menu of Apps Script actions open.',
      },
      {
        src: '/projects/horizon-hos.webp',
        label: 'Driver hours',
        alt: 'Driver hours tab with drive, shift, and cycle time left from Motive, and a trip check panel confirming a 632-mile load fits the driver’s remaining hours.',
      },
    ],
    imageNote: RECREATED,
  },
  {
    slug: 'wedding-tax-write-off-matrix',
    title: 'Wedding Tax Write-Off Matrix for Curated Bride',
    client: 'Curated Bride, a wedding planning brand',
    summary:
      'A branded Google Sheets product that helps brides see how getting married can change their taxes.',
    problem:
      'Curated Bride, a wedding planning brand, wanted a tool it could sell to its brides. It had to organize the numbers and show the potential impact using current IRS rules, without ever deciding what qualifies as a write-off, leaving that call to a CPA.',
    solution: [
      'A five-module workbook for US federal tax year 2026: a marriage bonus and penalty calculator on verified 2026 IRS brackets, a filing status comparison with a chart, a charitable contribution ledger that handles fair market value, a business expense ledger with CPA confirmation flags, and a disclaimer on every sheet.',
      'It opens on a branded cover and Quick Start Guide, with a live dashboard of four KPI cards, protected formulas, sample data, and a locked tax table sourced from IRS Revenue Procedure 2025-32. A tab-by-tab review guide PDF shipped with it.',
    ],
    result:
      "Delivered within the deadline. The client said it was exactly what we'd discussed and asked to bring it back every year to keep it current with tax law changes.",
    metrics: [
      { value: '5', label: 'modules in one workbook' },
      { value: '4', label: 'live KPI cards' },
      { value: '2026', label: 'verified IRS brackets' },
      { value: 'Yearly', label: 'repeat engagement' },
    ],
    category: 'Digital Product',
    tags: [
      'Google Sheets',
      'Data validation',
      'Conditional formatting',
      'Charts',
      'Protected ranges',
      'Python (openpyxl)',
      'PDF guide',
    ],
    year: '2026',
    role: 'Solo developer: tax research, build, testing and delivery',
    image: {
      src: '/projects/wedding-tax-dashboard.webp',
      label: 'Dashboard',
      alt: 'Dashboard of the Wedding Tax Write-Off Matrix showing four KPI cards and a filing status comparison chart, with sample data.',
    },
    gallery: [
      {
        src: '/projects/wedding-tax-calculator.webp',
        label: 'Marriage calculator',
        alt: 'Marriage Calculator tab: two sample incomes compared as two single returns and as married filing jointly on 2026 brackets, showing a $390 marriage bonus.',
      },
      {
        src: '/projects/wedding-tax-cover.webp',
        label: 'Cover and quick start',
        alt: 'Branded cover sheet of the Wedding Tax Write-Off Matrix with the Quick Start Guide.',
      },
    ],
    imageNote:
      'Recreated preview with the sample data the product ships with. Not tax advice.',
  },
  {
    slug: 'church-directory-desktop-app',
    title: 'Church Directory Desktop App',
    client: 'A regional church association',
    summary:
      'A desktop app built inside Excel that lets a regional church association manage its leaders, churches, groups and photos without ever touching a spreadsheet grid.',
    problem:
      "The association's directory lived in a broken Excel file, and the administrator who runs it isn't technical. The fix had to be something he could use every day without seeing a line of code.",
    solution: [
      'A full rebuild into cross-linked Individuals, Groups and Churches pages over hidden, protected data sheets, run by eight VBA modules.',
      'It handles adding and editing records, group membership, photo management, vCard sharing, Google Maps links, reports and an alphabetical search, all in large, easy-to-read type. It now runs 78 leader profiles and 123 group memberships.',
    ],
    result:
      'Closed out after eight-plus revision rounds with a 4.7-star review and a tip. The client has since asked about a version 3.0.',
    metrics: [
      { value: '8', label: 'VBA modules' },
      { value: '78', label: 'leader profiles' },
      { value: '123', label: 'group memberships' },
      { value: '4.7★', label: 'review, plus a tip' },
    ],
    quote: {
      text: "Tolex is excellent to work with. She communicates well and responds to her client's needs well. A pleasure working with her. I would do it again (and will)!",
      attribution: 'Terry, Fiverr review (earned on a previous account)',
    },
    category: 'Desktop App (Excel VBA)',
    tags: [
      'Microsoft Excel',
      'VBA (8 modules)',
      'Protected data sheets',
      'Data validation',
      'vCard export',
    ],
    year: '2026',
    role: 'Solo developer: data rebuild, VBA, testing and handover',
    image: {
      src: '/projects/church-directory.webp',
      label: 'Leader profile',
      alt: 'Individuals page of the Church Directory app in Excel, showing a sample leader profile with photo, contact details, groups, and large action buttons.',
    },
    gallery: [
      {
        src: '/projects/church-groups.webp',
        label: 'Group roster',
        alt: 'Groups page listing all ten groups with member counts and a roster of member cards with photos for the Youth Ministry Council.',
      },
      {
        src: '/projects/church-edit.webp',
        label: 'VBA edit form',
        alt: 'VBA Edit Individual form open over the directory, with fields for name, position, church, contact details, and a photo.',
      },
    ],
    imageNote: RECREATED,
  },
  {
    slug: 'community-association-budget-tracker',
    title: 'Community Association Budget Tracker',
    client: 'A large Canadian community association',
    summary:
      "A 17-tab Excel system that carries a community association's budget from monthly entries to a live dashboard automatically.",
    problem:
      'A large Canadian community association needed to track a seven-figure annual budget, with payroll, membership fees and mortgage costs in the mix, against actual spending every month, all the way up to one summary view.',
    solution: [
      'A Budget Master, 12 monthly planning tabs for actuals, an automated Quarterly Roll-Up, Repairs and Maintenance and Supplies planning tabs, and a Summary Dashboard showing year-to-date budget, actuals and variance with status flags.',
      'Input cells are highlighted and every formula region is protected, so the file holds up through a full year of use.',
    ],
    result:
      '2,219 formulas audited to zero errors, plus a full Q1 test run checked end to end before delivery. Delivered and accepted.',
    metrics: [
      { value: '17', label: 'connected tabs' },
      { value: '2,219', label: 'formulas audited' },
      { value: '0', label: 'formula errors' },
      { value: '7-figure', label: 'annual budget' },
    ],
    category: 'Financial Dashboard',
    tags: [
      'Microsoft Excel',
      'Formulas',
      'Conditional formatting',
      'Sheet protection',
      'Python (openpyxl)',
    ],
    year: '2026',
    role: 'Solo developer: workbook design, formulas, audit and delivery',
    image: {
      src: '/projects/budget-dashboard.webp',
      label: 'Summary dashboard',
      alt: 'Summary Dashboard of the budget tracker in Excel: year-to-date budget, actuals, and variance by category with status flags and a quarterly chart, using sample numbers.',
    },
    gallery: [
      {
        src: '/projects/budget-march.webp',
        label: 'Monthly actuals',
        alt: 'March monthly tab with yellow input cells for actuals by line item, budget pulled from the Budget Master, and variance with notes.',
      },
      {
        src: '/projects/budget-rollup.webp',
        label: 'Quarterly roll-up',
        alt: 'Quarterly Roll-Up tab summing January to March by category, beside an Excel chart of Q1 expenses, budget versus actual.',
      },
    ],
    imageNote: RECREATED,
  },
  {
    slug: 'onenote-to-obsidian-migration',
    title: 'OneNote to Obsidian Recovery Migration',
    client: "An IT consultant's client in California",
    summary:
      'Recovered 680 notes a client thought were lost and moved them into a clean, synced Obsidian vault.',
    problem:
      "An IT consultant's client in California had been told his OneNote notebook was corrupted. He wanted his notes back and moved somewhere reliable he could use on his phone and computer.",
    solution: [
      "First, a diagnosis: the data was safe in the cloud, and only the Windows desktop app was failing. When Obsidian's official importer silently dropped 28 of 38 sections, I switched to OneNoteMdExporter and recovered all 38.",
      'A custom Python cleanup script then stripped duplicate headers from 659 notes, repaired 59 broken filenames, removed 91 duplicate images (280MB down to 215MB) and fixed text that turned invisible in dark mode. Then I set up Obsidian Sync for his iPhone and Windows PC.',
    ],
    result:
      '680 notes recovered, cleaned and synced, compared with just 42 from the official importer, on a job that started as a 30-note quote.',
    metrics: [
      { value: '680', label: 'notes recovered' },
      { value: '38/38', label: 'sections restored' },
      { value: '42', label: 'found by the official importer' },
      { value: '−65MB', label: 'of duplicate images removed' },
    ],
    category: 'Knowledge Management (Obsidian)',
    tags: [
      'Obsidian',
      'OneNoteMdExporter',
      'Python',
      'Markdown',
      'Obsidian Sync (encrypted)',
    ],
    year: '2026',
    role: 'Migration specialist: diagnosis, export, cleanup scripting and sync setup',
    image: {
      src: '/projects/obsidian-migration.webp',
      label: 'Recovered vault',
      alt: 'The recovered Obsidian vault: 38 restored sections in the file explorer, a cleaned note open in the editor, and Obsidian Sync showing all 680 notes synced.',
    },
    gallery: [
      {
        src: '/projects/obsidian-graph.webp',
        label: 'Graph view',
        alt: 'Obsidian graph view of the recovered vault, with notes clustered by section and color-coded groups.',
      },
      {
        src: '/projects/obsidian-cleanup.webp',
        label: 'Cleanup script',
        alt: 'The Python cleanup script in VS Code, with terminal output: 659 headers fixed, 59 filenames repaired, and 91 duplicate images removed.',
      },
    ],
    imageNote: RECREATED,
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
