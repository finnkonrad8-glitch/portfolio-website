// Renders the TolexTech mark into public/logo192.png and public/logo512.png.
// Zero dependencies: rasterises the logo geometry directly and encodes PNGs
// with node:zlib. Run with `node scripts/generate-icons.mjs`.

import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const INK = [11, 10, 9] // --background
const PAPER = [250, 248, 245] // --foreground

// Mark geometry on a 200×200 grid (see src/components/brand/logo-mark.tsx).
function insideMark(x, y) {
  const dx = x - 100
  const dy = y - 100
  if (dx * dx + dy * dy > 100 * 100) return false
  if (y >= 34 && y < 79) return false // crossbar
  if (y >= 79 && x >= 78 && x < 122) return false // stem
  return true
}

function render(size) {
  const markSize = size * 0.62
  const offset = (size - markSize) / 2
  const samples = 4
  const raw = Buffer.alloc(size * (size * 3 + 1))
  for (let py = 0; py < size; py++) {
    const row = py * (size * 3 + 1)
    raw[row] = 0 // PNG filter: none
    for (let px = 0; px < size; px++) {
      let hits = 0
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const gx = ((px + (sx + 0.5) / samples - offset) / markSize) * 200
          const gy = ((py + (sy + 0.5) / samples - offset) / markSize) * 200
          if (insideMark(gx, gy)) hits++
        }
      }
      const t = hits / (samples * samples)
      for (let c = 0; c < 3; c++) {
        raw[row + 1 + px * 3 + c] = Math.round(INK[c] + (PAPER[c] - INK[c]) * t)
      }
    }
  }
  return encodePng(size, size, raw)
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

function encodePng(width, height, raw) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8 // bit depth
  header[9] = 2 // colour type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const size of [192, 512]) {
  const file = new URL(`../public/logo${size}.png`, import.meta.url)
  writeFileSync(file, render(size))
  console.log(`wrote public/logo${size}.png`)
}
