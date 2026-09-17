import './ToolDetails.css'

export default function ToolDetails({ tool, onBack }) {
  const handleTryNow = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="tool-details">
      <button className="btn-back" onClick={onBack}>
        ← Back to Marketplace
      </button>

      <div className="details-container">
        <div className="details-hero">
          <div className="details-icon">{tool.icon}</div>
          <h1>{tool.name}</h1>
          <p className="details-category">{tool.category}</p>
          <p className="details-price">{tool.price}</p>
        </div>

        <div className="details-content">
          <div className="details-main">
            <section className="details-section">
              <h2>About</h2>
              <p>{tool.description || 'No description provided.'}</p>
            </section>

            <section className="details-section">
              <h2>Details</h2>
              <div className="details-stats">
                <div className="stat-box">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">⭐ {tool.rating || 4.5}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Downloads</span>
                  <span className="stat-value">{(tool.downloads || 0).toLocaleString()}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Creator</span>
                  <span className="stat-value">{tool.sellerId || 'Unknown'}</span>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h2>Link</h2>
              <a href={tool.link} target="_blank" rel="noopener noreferrer" className="details-link">
                {tool.link}
              </a>
            </section>
          </div>

          <div className="details-sidebar">
            <button className="btn-try-now" onClick={handleTryNow}>
              Try Now →
            </button>
            <button className="btn-rate">Rate This Tool</button>
          </div>
        </div>
      </div>
    </div>
  )
}