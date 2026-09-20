// Tiny inline SVG icons (no extra library needed).

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'square',
  'aria-hidden': true,
  focusable: 'false',
}

export function ArrowRight({ className = '', ...props }) {
  return (
    <svg {...svgProps} className={`icon icon-right ${className}`} {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowLeft({ className = '', ...props }) {
  return (
    <svg {...svgProps} className={`icon icon-left ${className}`} {...props}>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </svg>
  )
}

export function ArrowUpRight({ className = '', ...props }) {
  return (
    <svg {...svgProps} className={`icon icon-upright ${className}`} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function SearchIcon({ className = '', ...props }) {
  return (
    <svg {...svgProps} className={`icon ${className}`} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  )
}