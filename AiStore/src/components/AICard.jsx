export default function AICard({ tool, index, onClick }) {
  return (
    <div className="ai-card" onClick={onClick} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && onClick()}>
      <div className="card-header">
        <span className="card-index">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="card-icon">
          {tool.logo ? (
            <img src={tool.logo} alt={tool.name} className="card-logo-img" />
          ) : (
            tool.icon || '🤖'
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{tool.name}</h3>
        <p className="card-description">{tool.description}</p>

        <div className="card-footer">
          <span className={`card-category ${tool.category.toLowerCase()}`}>
            {tool.category}
          </span>
          <span className={`card-price ${tool.price.toLowerCase()}`}>
            {tool.price}
          </span>
        </div>
      </div>

      <div className="card-hover-overlay">
        <button className="card-launch-btn">
          Launch →
        </button>
      </div>
    </div>
  )
}