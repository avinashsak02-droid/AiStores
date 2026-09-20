export default function FeaturedCard({ tool, onClick }) {
  return (
    <div className="featured-card" onClick={onClick} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && onClick()}>
      <div className="featured-content">
        <div className="featured-icon">
          {tool.logo ? (
            <img src={tool.logo} alt={tool.name} className="featured-logo-img" />
          ) : (
            tool.icon || '🤖'
          )}
        </div>

        <div className="featured-text">
          <h2 className="featured-title">{tool.name}</h2>
          <p className="featured-description">{tool.description}</p>

          <div className="featured-meta">
            <span className={`featured-category ${tool.category.toLowerCase()}`}>
              {tool.category}
            </span>
            <span className={`featured-price ${tool.price.toLowerCase()}`}>
              {tool.price}
            </span>
          </div>
        </div>

        <button className="featured-launch-btn">
          Launch →
        </button>
      </div>

      <div className="featured-accent"></div>
    </div>
  )
}