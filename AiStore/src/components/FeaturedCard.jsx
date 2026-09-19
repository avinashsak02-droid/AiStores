import './FeaturedCard.css'

export default function FeaturedCard({ tool, onClick }) {
  return (
    <div className="featured-card" onClick={onClick}>
      <div className="featured-inner">
        <div className="featured-icon">{tool.icon}</div>
        <div className="featured-content">
          <div className="featured-meta">
            <span className="featured-category">{tool.category}</span>
            <span className="featured-status">{tool.price}</span>
          </div>
          <h2 className="featured-title">{tool.name}</h2>
          <p className="featured-description">{tool.description}</p>
          <button className="featured-cta">Launch Product →</button>
        </div>
      </div>
    </div>
  )
}