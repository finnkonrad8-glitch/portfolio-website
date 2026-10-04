import { Fragment, type ReactNode } from 'react'
import { site } from '@/data/site'

// A tiny, safe renderer for the assistant's replies: paragraphs, bullet and
// numbered lists, **bold**, and [links](url). Everything else stays plain
// text (React escapes it), and only known destinations become links.

const EXTERNAL_HOSTS = [
  'www.fiverr.com',
  'fiverr.com',
  'be-inspired-12.myshopify.com',
]

type Href = { href: string; internal: boolean }

function safeHref(raw: string): Href | null {
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    // Files (the résumé, the concept sites) open outside the app router.
    return { href: raw, internal: !/\.(pdf|html)$/.test(raw) }
  }
  if (site.email && raw === `mailto:${site.email}`) {
    return { href: raw, internal: false }
  }
  try {
    const url = new URL(raw)
    if (url.protocol === 'https:' && EXTERNAL_HOSTS.includes(url.hostname)) {
      return { href: url.href, internal: false }
    }
  } catch {
    // Not a URL: render as text.
  }
  return null
}

// **bold**, [label](url), or a bare https:// or mailto: link (trailing
// punctuation stays outside the link).
const INLINE =
  /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\([^)\s]+\)|(?:https:\/\/|mailto:)[^\s()<>]*[^\s()<>.,!?;:'"])/g

const LINK_CLASS =
  'font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent'

function linkOrText(
  key: number,
  label: string,
  raw: string,
  onNavigate: (href: string) => void,
): ReactNode {
  const target = safeHref(raw)
  if (!target) return label
  if (target.internal) {
    return (
      <a
        key={key}
        href={target.href}
        className={LINK_CLASS}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey) return
          event.preventDefault()
          onNavigate(target.href)
        }}
      >
        {label}
      </a>
    )
  }
  const mail = target.href.startsWith('mailto:')
  return (
    <a
      key={key}
      href={target.href}
      className={LINK_CLASS}
      {...(mail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {label}
    </a>
  )
}

function inline(text: string, onNavigate: (href: string) => void): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part)
    if (bold) {
      return (
        <strong key={i} className="font-semibold">
          {bold[1]}
        </strong>
      )
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
    if (link) return linkOrText(i, link[1], link[2], onNavigate)
    if (/^(?:https:\/\/|mailto:)/.test(part)) {
      return linkOrText(i, part.replace(/^mailto:/, ''), part, onNavigate)
    }
    return part
  })
}

const BULLET = /^\s*(?:[-*•]|\d+[.)])\s+/

export function MessageText({
  text,
  onNavigate,
}: {
  text: string
  onNavigate: (href: string) => void
}) {
  const blocks: { type: 'p' | 'ul' | 'ol'; lines: string[] }[] = []
  for (const line of text.split('\n')) {
    if (!line.trim()) {
      blocks.push({ type: 'p', lines: [] })
      continue
    }
    const listType = BULLET.test(line)
      ? /^\s*\d/.test(line)
        ? 'ol'
        : 'ul'
      : null
    const last = blocks[blocks.length - 1]
    const content = line.replace(BULLET, '').trim()
    if (listType) {
      if (last?.type === listType) last.lines.push(content)
      else blocks.push({ type: listType, lines: [content] })
    } else if (last?.type === 'p' && last.lines.length > 0) {
      last.lines.push(content)
    } else {
      blocks.push({ type: 'p', lines: [content] })
    }
  }

  return (
    <div className="space-y-2">
      {blocks
        .filter((block) => block.lines.length > 0)
        .map((block, i) => {
          if (block.type === 'p') {
            return (
              <p key={i}>
                {block.lines.map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 ? <br /> : null}
                    {inline(line, onNavigate)}
                  </Fragment>
                ))}
              </p>
            )
          }
          const List = block.type
          return (
            <List
              key={i}
              className={
                List === 'ul'
                  ? 'list-disc space-y-1 pl-4 marker:text-accent'
                  : 'list-decimal space-y-1 pl-4 marker:text-muted-foreground'
              }
            >
              {block.lines.map((line, j) => (
                <li key={j}>{inline(line, onNavigate)}</li>
              ))}
            </List>
          )
        })}
    </div>
  )
}
