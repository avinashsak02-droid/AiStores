import './AICard.css'
import { categoryTint, categoryMeta } from '../utils/categories'

function isFree(price) {
  if (price === undefined || price === null) return false
  return String(price).trim().toLowerCase() === 'free'
}

export default function AICard({ tool, onClick }) {
  const meta = categoryMeta(tool.category)
  const free = isFree(tool.price)
  const rating = tool.rating ?? 4.5
  const downloads = tool.downloads ?? 0

  return (
    <article className="ai-card" onClick={onClick} tabIndex={0} role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="ai-card-top">
        <span className="ai-card-icon" style={categoryTint(tool.category)}>
          <span aria-hidden="true">{tool.icon || meta.glyph}</span>
        </span>
        <span className={`pill ${free ? 'pill-free' : 'pill-paid'}`}>
          {free ? 'Free' : tool.price || 'Paid'}
        </span>
      </div>

      <div className="ai-card-body">
        <span className="ai-card-cat" style={{ color: meta.color }}>
          {tool.category || 'Other'}
        </span>
        <h3 className="ai-card-title">{tool.name}</h3>
        <p className="ai-card-desc">{tool.description}</p>
      </div>

      <div className="ai-card-foot">
        <div className="ai-card-meta">
          <span className="meta-rating" title={`${rating} rating`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--star)" aria-hidden="true">
              <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
            </svg>
            {rating}
          </span>
          <span className="meta-dot" aria-hidden="true">·</span>
          <span className="meta-installs">{downloads.toLocaleString()} installs</span>
        </div>
        <button
          className="ai-card-open"
          onClick={(e) => {
            e.stopPropagation()
            window.open(tool.link, '_blank', 'noopener,noreferrer')
          }}
          aria-label={`Open ${tool.name}`}
        >
          Open
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  )
}
