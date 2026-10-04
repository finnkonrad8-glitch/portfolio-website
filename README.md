# portfolio-website

My personal portfolio website built with Claude Code and Macaly Cloud, showcasing my professional background, skills, and projects.

**Iyodo Oluwatosin (Tolex) · TolexTech · Built for Business Growth**
Full-Stack Developer, UI/UX Designer, Automation Specialist, and Spreadsheet Expert.

## Stack

| Layer      | Choice                                                             |
| ---------- | ------------------------------------------------------------------ |
| Framework  | [TanStack Start](https://tanstack.com/start) (React 19 + Vite)     |
| Styling    | Tailwind CSS v4 with design tokens in `src/styles.css`             |
| Icons      | Lucide React                                                       |
| Backend    | [Convex](https://convex.dev) (stores contact form messages)        |
| Email      | Macaly's built-in notification email service, called from Convex  |
| Hosting    | Macaly Cloud                                                       |

> **Why not Next.js?** Macaly Cloud only hosts TanStack Start + Convex apps. TanStack Start
> gives the same React component model, file-based routing, and server rendering, so every
> page is still a real, separately prerendered route.

## Pages

| Route              | File                               | What it shows                                              |
| ------------------ | ---------------------------------- | ---------------------------------------------------------- |
| `/`                | `src/routes/index.tsx`             | Hero, skills marquee, services, process, featured work, CTA |
| `/about`           | `src/routes/about.tsx`             | Bio, roles, core skills grid, toolkit, résumé link         |
| `/projects`        | `src/routes/projects/index.tsx`    | Project gallery cards                                      |
| `/projects/:slug`  | `src/routes/projects/$slug.tsx`    | Case study detail page for each project                    |
| `/contact`         | `src/routes/contact.tsx`           | Contact form (Convex) plus Fiverr link                     |

## Structure

```
src/
  routes/            File-based routes (one file per page)
  components/
    brand/           Vector logo mark + wordmark
    layout/          Header (with mobile menu), footer, page shell
    home/            Home page sections
    projects/        Project card
    contact/         Contact form
    shared/          Buttons, section headings, tags, CTA band
  data/              All editable content: site.ts, services.ts, skills.ts, projects.ts
  lib/               SEO head helpers, motion helper, utils
  metadata.json      Per-page SEO titles and descriptions
  styles.css         Palette, fonts, motion, view transitions
convex/
  schema.ts          contactMessages table
  contact.ts         submit mutation + owner email notification
  contactRules.ts    Validation shared by the form and the server
public/              Favicon, app icons, project screenshots, résumé PDF
resume/
  resume.html        Source for public/Iyodo-Oluwatosin-Resume.pdf (A4, one page)
scripts/
  generate-icons.mjs Renders public/logo192.png and logo512.png from the logo geometry
```

## Palette

Derived from the logo's charcoal geometry, set on a deep ink base with one vibrant accent.

| Token                | Value     | Use                               |
| -------------------- | --------- | --------------------------------- |
| `--background` Ink   | `#0B0A09` | Page background                   |
| `--card` Graphite    | `#131211` | Cards, panels                     |
| `--secondary` Slate  | `#1D1C1B` | Hover surfaces, chips             |
| `--border` Seam      | `#2B2827` | Hairlines, grid                   |
| `--charcoal` Logo    | `#3C3A39` | Decorative logo marks             |
| `--muted-foreground` | `#A9A39E` | Secondary text (7.9:1 contrast)   |
| `--foreground` Paper | `#FAF8F5` | Headings and body text            |
| `--accent` Growth    | `#3EE092` | Links, buttons, focus rings       |

Fonts: League Spartan (headings, matches the logo), DM Sans (body), JetBrains Mono (labels and tags).

## Editing content

- **Personal details, résumé link, email, headline numbers:** `src/data/site.ts`.
- **Projects:** `src/data/projects.ts`. Each entry becomes a card and a `/projects/<slug>` page
  (prerendered automatically). Screenshots live in `public/projects/`. The current ones are
  recreations with sample data, labelled as such on each case study; swap in real, blurred
  screenshots any time and update `imageNote`.
- **Résumé:** edit `resume/resume.html`, open it in Chrome, Print, Save as PDF (A4, margins None,
  background graphics on), and save over `public/Iyodo-Oluwatosin-Resume.pdf`.
- **Services, skills, roles:** `src/data/services.ts` and `src/data/skills.ts`.
- **SEO titles and descriptions:** `src/metadata.json`.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests for the contact form rules
npm run build
```

The app reads its Convex URL from `VITE_CONVEX_URL`. On Macaly this is managed for you; for a local
UI-only run without a backend, any placeholder works, for example
`VITE_CONVEX_URL=https://placeholder.convex.cloud npm run dev` (the contact form just won't send).

## Contact form

Submissions are validated on both the client and the server (`convex/contactRules.ts`), stored in the
`contactMessages` Convex table, and then emailed to the address in the `RECIPIENT_EMAIL` Convex
environment variable. If that variable is not set, messages are still stored and marked `skipped`.
A hidden honeypot field filters out basic spam bots.
