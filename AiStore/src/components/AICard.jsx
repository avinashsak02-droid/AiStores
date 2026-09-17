import './AICard.css'

export default function AICard({ tool, onClick }) {
  return (
    <div className="ai-card" onClick={onClick}>
      <div className="card-header">
        <div className="card-icon">{tool.icon}</div>
        <div className="card-badge">{tool.category}</div>
      </div>
      
      <div className="card-body">
        <h3 className="card-title">{tool.name}</h3>
        <p className="card-description">{tool.description}</p>
        
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">⭐</span>
            <span className="meta-text">{tool.rating || 4.5}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📥</span>
            <span className="meta-text">{(tool.downloads || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <span className="card-price">{tool.price}</span>
        <button 
          className="card-btn" 
          onClick={(e) => {
            e.stopPropagation()
            window.open(tool.link, '_blank', 'noopener,noreferrer')
          }}
        >
          Launch →
        </button>
      </div>
    </div>
  )
}