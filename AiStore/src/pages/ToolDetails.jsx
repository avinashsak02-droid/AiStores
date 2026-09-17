import './ToolDetails.css'
import { categoryMeta, categoryTint } from '../utils/categories'

export default function ToolDetails({ tool, onBack }) {
  const meta = categoryMeta(tool.category)
  const free = String(tool.price ?? '').trim().toLowerCase() === 'free'
  const rating = tool.rating ?? 4.5
  const downloads = tool.downloads ?? 0

  const handleTryNow = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer')
  }

  let host = ''
  try {
    host = tool.link ? new URL(tool.link).hostname.replace(/^www\./, '') : ''
  } catch {
    host = tool.link || ''
  }

  const highlights = [
    { label: 'Category', value: tool.category || 'Other' },
    { label: 'Pricing', value: free ? 'Free to use' : tool.price || 'Paid' },
    { label: 'Rating', value: `${rating} / 5` },
    { label: 'Installs', value: downloads.toLocaleString() },
  ]

  return (
    <div className="tool-details">
      <div className="page">
        <button className="back-link" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to marketplace
        </button>

        <header className="td-hero">
          <div className="td-hero-main">
            <div className="td-icon" style={categoryTint(tool.category)}>
              <span aria-hidden="true">{tool.icon || meta.glyph}</span>
            </div>
            <div className="td-headings">
              <span className="td-cat" style={{ color: meta.color }}>
                {tool.category || 'Other'}
              </span>
              <h1>{tool.name}</h1>
              <div className="td-hero-meta">
                <span className="meta-rating">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--star)" aria-hidden="true">
                    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
                  </svg>
                  {rating}
                </span>
                <span className="meta-dot">·</span>
                <span>{downloads.toLocaleString()} installs</span>
                <span className={`pill ${free ? 'pill-free' : 'pill-paid'}`}>
                  {free ? 'Free' : tool.price || 'Paid'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="td-layout">
          <div className="td-content">
            <section className="td-section">
              <h2>About this tool</h2>
              <p className="td-about">{tool.description || 'No description provided for this tool yet.'}</p>
            </section>

            <section className="td-section">
              <h2>At a glance</h2>
              <div className="td-highlights">
                {highlights.map((h) => (
                  <div className="td-highlight" key={h.label}>
                    <span className="td-highlight-label">{h.label}</span>
                    <span className="td-highlight-value">{h.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="td-section">
              <h2>Resource</h2>
              <a href={tool.link} target="_blank" rel="noopener noreferrer" className="td-resource">
                <span className="td-resource-ico" aria-hidden="true">↗</span>
                <span className="td-resource-text">
                  <strong>Visit the tool</strong>
                  <span>{host}</span>
                </span>
              </a>
            </section>
          </div>

          <aside className="td-sidebar">
            <div className="td-cta-card">
              <div className="td-cta-price">
                {free ? 'Free' : tool.price || 'Paid'}
                {free && <span>No account required</span>}
              </div>
              <button className="btn btn-primary btn-lg btn-block" onClick={handleTryNow}>
                Launch tool ↗
              </button>
              <button className="btn btn-ghost btn-block td-cta-secondary">Save for later</button>
              <div className="td-cta-by">
                <span className="td-cta-avatar" aria-hidden="true">
                  {(tool.sellerId || 'A').charAt(0).toUpperCase()}
                </span>
                <span>
                  Published by
                  <strong>{tool.sellerId || 'Unknown creator'}</strong>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
