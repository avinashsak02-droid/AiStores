import { useId, useMemo, useState } from 'react'
import './CoverArt.css'

const W = 400
const H = 300
const MARGIN = 16
const GAP = 3

const INK = '#141414'
const WINE = '#7A1F26'
const PAPER = '#E4DAC7'
const TAN = '#D3C6AE'
const SAND = '#C5B79A'
const FRAME = '#D9CDB6'

// Each layout splits a 4 x 3 grid into tiles: [column, row, width, height]
const LAYOUTS = [
  [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [2, 1, 2, 1], [0, 2, 1, 1], [1, 2, 3, 1]],
  [[0, 0, 1, 3], [1, 0, 3, 1], [1, 1, 1, 1], [2, 1, 2, 2], [1, 2, 1, 1]],
  [[0, 0, 2, 1], [2, 0, 2, 2], [0, 1, 1, 2], [1, 1, 1, 1], [1, 2, 1, 1], [2, 2, 2, 1]],
  [[0, 0, 3, 2], [3, 0, 1, 3], [0, 2, 1, 1], [1, 2, 2, 1]],
]

const HERO_KINDS = ['ink', 'quarter', 'moon', 'rings', 'sun']
const KINDS = ['ink', 'wine', 'sun', 'moon', 'bars', 'vbars', 'plus', 'quarter', 'dots', 'hatch', 'rings', 'blank']

// Turns any text into a number, then into a repeatable stream of "random" numbers.
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildTiles(seed) {
  const rand = mulberry32(hashString(seed))
  const layout = LAYOUTS[Math.floor(rand() * LAYOUTS.length)]
  const ux = (W - MARGIN * 2) / 4
  const uy = (H - MARGIN * 2) / 3

  let prev = null
  const tiles = layout.map(([c, r, cw, rh], i) => {
    const pool = i === 0 ? HERO_KINDS : KINDS
    let kind = pool[Math.floor(rand() * pool.length)]
    let guard = 0
    while (kind === prev && guard++ < 6) kind = pool[Math.floor(rand() * pool.length)]
    prev = kind
    return {
      kind,
      x: MARGIN + c * ux + GAP / 2,
      y: MARGIN + r * uy + GAP / 2,
      w: cw * ux - GAP,
      h: rh * uy - GAP,
      a: rand(),
      b: rand(),
    }
  })

  // Every cover should have a touch of the wine-red accent
  if (!tiles.some((t) => t.kind === 'wine' || t.kind === 'sun')) {
    tiles[1 % tiles.length].kind = 'sun'
  }
  return tiles
}

function Shape({ tile }) {
  const { kind, x, y, w, h, a, b } = tile
  const cx = x + w / 2
  const cy = y + h / 2
  const m = Math.min(w, h)
  const bg = (fill) => <rect x={x} y={y} width={w} height={h} fill={fill} />

  switch (kind) {
    case 'ink':
      return bg(INK)
    case 'wine':
      return bg(WINE)
    case 'sun':
      return (
        <>
          {bg(TAN)}
          <circle cx={cx} cy={cy} r={m * 0.32} fill={WINE} />
        </>
      )
    case 'moon':
      return (
        <>
          {bg(INK)}
          <circle cx={cx} cy={y + h} r={m * 0.42} fill={PAPER} />
        </>
      )
    case 'bars': {
      const n = 3 + Math.floor(a * 3)
      const step = h / n
      return (
        <>
          {bg(PAPER)}
          {Array.from({ length: n }, (_, i) => (
            <rect key={i} x={x} y={y + i * step + step * 0.25} width={w} height={step * 0.5} fill={INK} />
          ))}
        </>
      )
    }
    case 'vbars': {
      const n = 4 + Math.floor(a * 4)
      const step = w / n
      return (
        <>
          {bg(PAPER)}
          {Array.from({ length: n }, (_, i) => (
            <rect
              key={i}
              x={x + i * step + step * 0.25}
              y={y}
              width={step * 0.5}
              height={h}
              fill={b > 0.6 && i === 0 ? WINE : INK}
            />
          ))}
        </>
      )
    }
    case 'plus': {
      const step = 16
      const cols = Math.max(1, Math.floor(w / step))
      const rows = Math.max(1, Math.floor(h / step))
      const ox = x + (w - (cols - 1) * step) / 2
      const oy = y + (h - (rows - 1) * step) / 2
      let d = ''
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = ox + i * step
          const py = oy + j * step
          d += `M${px - 3} ${py}H${px + 3}M${px} ${py - 3}V${py + 3}`
        }
      }
      return (
        <>
          {bg(PAPER)}
          <path d={d} stroke={INK} strokeWidth="1.4" fill="none" />
        </>
      )
    }
    case 'quarter': {
      const px = a < 0.5 ? x : x + w
      const py = b < 0.5 ? y : y + h
      return (
        <>
          {bg(PAPER)}
          <circle cx={px} cy={py} r={m * 0.95} fill={INK} />
        </>
      )
    }
    case 'dots': {
      const step = 13
      const cols = Math.max(1, Math.floor(w / step))
      const rows = Math.max(1, Math.floor(h / step))
      const ox = x + (w - (cols - 1) * step) / 2
      const oy = y + (h - (rows - 1) * step) / 2
      let d = ''
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          d += `M${ox + i * step} ${oy + j * step}h0.01`
        }
      }
      return (
        <>
          {bg(SAND)}
          <path d={d} stroke={b > 0.5 ? WINE : INK} strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      )
    }
    case 'hatch': {
      let d = ''
      for (let k = -h; k < w; k += 9) {
        d += `M${x + k} ${y + h}L${x + k + h} ${y}`
      }
      return (
        <>
          {bg(PAPER)}
          <path d={d} stroke={INK} strokeWidth="1.2" fill="none" />
        </>
      )
    }
    case 'rings': {
      const rings = []
      for (let r = 6; r < m * 0.72; r += 7) rings.push(r)
      return (
        <>
          {bg(SAND)}
          {rings.map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth="1.4" />
          ))}
          <circle cx={cx} cy={cy} r="3" fill={WINE} />
        </>
      )
    }
    default:
      return (
        <>
          {bg(SAND)}
          <rect x={x + 8} y={y + h - 16} width="8" height="8" fill={WINE} />
        </>
      )
  }
}

export default function CoverArt({ seed, icon, image, className = '', showIcon = true }) {
  const uid = 'cv' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [imageFailed, setImageFailed] = useState(false)
  const tiles = useMemo(() => buildTiles(String(seed || 'aistore')), [seed])
  const useImage = image && !imageFailed

  return (
    <div className={`cover ${className}`}>
      {useImage ? (
        <img src={image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Product cover artwork">
          <defs>
            {tiles.map((t, i) => (
              <clipPath key={i} id={`${uid}-${i}`}>
                <rect x={t.x} y={t.y} width={t.w} height={t.h} />
              </clipPath>
            ))}
          </defs>
          <rect width={W} height={H} fill={FRAME} />
          {tiles.map((t, i) => (
            <g key={i} clipPath={`url(#${uid}-${i})`}>
              <Shape tile={t} />
            </g>
          ))}
          {/* print-style registration marks */}
          <rect x="5" y="5" width="6" height="6" fill={WINE} />
          <rect x={W - 11} y="5" width="6" height="6" fill={WINE} />
          <g stroke={INK} strokeWidth="1" fill="none">
            <circle cx={W - 8} cy={H - 8} r="3.5" />
            <path d={`M${W - 14} ${H - 8}H${W - 2}M${W - 8} ${H - 14}V${H - 2}`} />
          </g>
        </svg>
      )}
      {showIcon && icon && <span className="cover-icon">{icon}</span>}
    </div>
  )
}