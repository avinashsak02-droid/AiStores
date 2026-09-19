import PhotoCarousel from '../components/PhotoCarousel'
import './ToolDetails.css'

export default function ToolDetails({ tool, onBack }) {
  const handleTryNow = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="tool-details">
      <button className="back-button" onClick={onBack}>
        ← Back to Catalog
      </button>

      <article className="tool-article">
        <header className="tool-header">
          <div className="tool-hero-section">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.name} className="tool-logo" />
            ) : (
              <div className="tool-hero-icon">{tool.icon}</div>
            )}
            <h1>{tool.name}</h1>
          </div>
          <p className="tool-tagline">{tool.description}</p>
          
          <div className="tool-meta-header">
            <div className="meta">
              <span className="meta-label">Category</span>
              <span className="meta-value">{tool.category}</span>
            </div>
            <div className="meta">
              <span className="meta-label">Status</span>
              <span className="meta-value">{tool.price}</span>
            </div>
            <div className="meta">
              <span className="meta-label">Rating</span>
              <span className="meta-value">★ {tool.rating || 4.5}</span>
            </div>
            <div className="meta">
              <span className="meta-label">Users</span>
              <span className="meta-value">{(tool.downloads || 0).toLocaleString()}</span>
            </div>
          </div>
        </header>

        <div className="divider-heavy"></div>

        {/* NEW: Photo Carousel */}
        {tool.photos && tool.photos.length > 0 && (
          <section className="tool-photos">
            <h2>Gallery</h2>
            <PhotoCarousel photos={tool.photos} />
          </section>
        )}

        <div className="tool-content-grid">
          <main className="tool-main">
            <section className="tool-section">
              <h2>About This Product</h2>
              <p>{tool.description}</p>
              <p>Explore {tool.name} to discover powerful capabilities designed for {tool.category.toLowerCase()} workflows.</p>
            </section>

            <section className="tool-section">
              <h2>Product Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Category</span>
                  <span className="info-value">{tool.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Creator</span>
                  <span className="info-value">{tool.sellerName || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Pricing Model</span>
                  <span className="info-value">{tool.price}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Community Rating</span>
                  <span className="info-value">★ {tool.rating || 4.5} / 5.0</span>
                </div>
              </div>
            </section>

            <section className="tool-section">
              <h2>Access the Product</h2>
              <div className="link-box">
                <div className="link-label">Official URL</div>
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="link-value">
                  {tool.link}
                </a>
              </div>
            </section>
          </main>

          <aside className="tool-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-label">Launch Now</div>
              <button className="btn-primary" onClick={handleTryNow}>
                Access Product
              </button>
            </div>

            <div className="divider-h"></div>

            <div className="sidebar-stats">
              <div className="sidebar-stat">
                <span className="stat-number">{(tool.downloads || 0).toLocaleString()}</span>
                <span className="stat-desc">Users</span>
              </div>
              <div className="sidebar-stat">
                <span className="stat-number">★ {tool.rating || 4.5}</span>
                <span className="stat-desc">Rating</span>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  )
}