import './AICard.css'

export default function AICard({ tool, index, onClick }) {
  return (
    <div className="ai-card" onClick={onClick}>
      <div className="card-header">
        <span className="card-index">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="card-icon">{tool.icon}</div>
      </div>

      <h3 className="card-title">{tool.name}</h3>
      
      <p className="card-description">{tool.description}</p>

      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Category</span>
          <span className="meta-value">{tool.category}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Rating</span>
          <span className="meta-value">★ {tool.rating || 4.5}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Status</span>
          <span className={`meta-value status-${tool.price.toLowerCase()}`}>
            {tool.price}
          </span>
        </div>
      </div>

      <div className="card-footer">
        <button 
          className="card-cta"
          onClick={(e) => {
            e.stopPropagation()
            window.open(tool.link, '_blank', 'noopener,noreferrer')
          }}
        >
          Launch Product →
        </button>
      </div>
    </div>
  )
}