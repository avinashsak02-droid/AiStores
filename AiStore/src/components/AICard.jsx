import './AICard.css'

export default function AICard({ tool, index, onClick }) {
  return (
    <div className="ai-card" onClick={onClick}>
      <div className="card-number">{String(index).padStart(2, '0')}</div>
      
      <div className="card-icon">{tool.icon}</div>
      
      <div className="card-content">
        <h3 className="card-title">{tool.name}</h3>
        
        <div className="card-meta">
          <span className="card-category">{tool.category}</span>
          <span className="card-status">{tool.price}</span>
        </div>
      </div>

      <button className="card-cta">
        Launch →
      </button>
    </div>
  )
}