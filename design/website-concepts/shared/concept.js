// Motion and small interactions shared by the TolexTech concept sites.
;(() => {
  const root = document.documentElement
  root.classList.add('js')
  const params = new URLSearchParams(location.search)
  const poster = params.has('poster')
  if (poster) root.classList.add('poster')
  // ?embed is the portfolio's card preview, which carries its own label.
  if (params.has('embed')) root.classList.add('embed')

  // Split headlines into words that rise into place, keeping <em> etc.
  let n = 0
  const splitNode = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment()
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(' '))
            return
          }
          const outer = document.createElement('span')
          outer.className = 'w'
          const inner = document.createElement('span')
          inner.style.setProperty('--i', n++)
          inner.textContent = part
          outer.append(inner)
          frag.append(outer)
        })
        child.replaceWith(frag)
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        splitNode(child)
      }
    })
  }
  document.querySelectorAll('[data-split]').forEach((el) => {
    n = 0
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim())
    splitNode(el)
    el.classList.add('split')
  })

  // Count numbers up when they appear.
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count)
    const decimals = (el.dataset.count.split('.')[1] || '').length
    const prefix = el.dataset.prefix || ''
    const suffix = el.dataset.suffix || ''
    const format = (v) =>
      prefix +
      v.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix
    if (poster || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = format(target)
      return
    }
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1600)
      el.textContent = format(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const reveal = (el) => {
    el.classList.add('in')
    if (el.dataset.count) countUp(el)
    el.querySelectorAll?.('[data-width]').forEach((bar) => {
      bar.style.width = bar.dataset.width
    })
  }

  const targets = document.querySelectorAll(
    '.reveal, .split, [data-count], [data-bars]',
  )
  // Image wipes start fully clipped, which Chromium's IntersectionObserver
  // reads as zero visible area, so those are checked by position instead.
  const wipes = new Set(document.querySelectorAll('.img-reveal'))
  const checkWipes = () => {
    wipes.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < innerHeight * 0.92 && r.bottom > 0) {
        reveal(el)
        wipes.delete(el)
      }
    })
    if (!wipes.size) {
      removeEventListener('scroll', queueWipes)
      removeEventListener('resize', queueWipes)
    }
  }
  let wipeQueued = false
  const queueWipes = () => {
    if (wipeQueued) return
    wipeQueued = true
    requestAnimationFrame(() => {
      wipeQueued = false
      checkWipes()
    })
  }
  if (poster || !('IntersectionObserver' in window)) {
    targets.forEach(reveal)
    wipes.forEach(reveal)
  } else {
    addEventListener('scroll', queueWipes, { passive: true })
    addEventListener('resize', queueWipes)
    checkWipes()
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          io.unobserve(entry.target)
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    targets.forEach((el) => io.observe(el))
  }

  // Header tightens once the page scrolls.
  const header = document.querySelector('.site-header')
  const onScroll = () => {
    header?.classList.toggle('scrolled', scrollY > 20)
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax)
      el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`
    })
  }
  if (!poster) {
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  // Simple tabs: [data-tabs] > [data-tab] buttons toggle [data-panel]s.
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-tab]')
    buttons.forEach((button) =>
      button.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.toggle('on', b === button))
        group.querySelectorAll('[data-panel]').forEach((panel) => {
          panel.hidden = panel.dataset.panel !== button.dataset.tab
        })
      }),
    )
  })

  // Choice chips: one active per [data-choices] group.
  document.querySelectorAll('[data-choices]').forEach((group) => {
    group.querySelectorAll('button').forEach((button) =>
      button.addEventListener('click', () => {
        group
          .querySelectorAll('button')
          .forEach((b) => b.classList.toggle('on', b === button))
        group.dispatchEvent(new CustomEvent('choice', { bubbles: true }))
      }),
    )
  })

  // "Add to cart" micro-interaction with a bumping cart count.
  const count = document.querySelector('[data-cart-count]')
  document.querySelectorAll('[data-add]').forEach((button) =>
    button.addEventListener('click', () => {
      if (!count) return
      count.textContent = String(Number(count.textContent) + 1)
      count.classList.remove('bump')
      void count.offsetWidth
      count.classList.add('bump')
      const label = button.textContent
      button.textContent = 'Added ✓'
      setTimeout(() => (button.textContent = label), 1400)
    }),
  )

  // Forms on concept sites never submit anywhere.
  document.querySelectorAll('form').forEach((form) =>
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const button = form.querySelector('button[type="submit"], .btn')
      if (button) button.textContent = 'Thanks! (concept demo)'
    }),
  )
})()
