import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import PhotoCarousel from '../components/PhotoCarousel'
import ReviewSection from '../components/ReviewSection'
import './ToolDetails.css'

export default function ToolDetails({ tool, onBack, onViewTool, user }) {
  const [relatedTools, setRelatedTools] = useState([])
  const [reviews, setReviews] = useState([])

  // Fetch more apps in the same category
  useEffect(() => {
    const q = query(
      collection(db, 'tools'),
      where('category', '==', tool.category)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tools = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(t => t.id !== tool.id) // Exclude current tool
        .slice(0, 4) // Show max 4 related products
      setRelatedTools(tools)
    })

    return () => unsubscribe()
  }, [tool.category, tool.id])

  // Fetch reviews for this tool (sorted client-side to avoid needing a composite index)
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('toolId', '==', tool.id)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setReviews(list)
    })
    return () => unsubscribe()
  }, [tool.id])

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const handleTryNow = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="tool-details">
      {/* BACK BUTTON */}
      <button className="back-button" onClick={onBack}>
        ← Back to Catalog
      </button>

      {/* MAIN CONTENT */}
      <div className="tool-container">
               {/* SECTION 1: APP NAME + LOGO + LAUNCH BUTTON */}
        <section className="tool-header-section">
          <div className="tool-header-inner">
            <div className="tool-logo-wrapper">
              {tool.logo ? (
                <img src={tool.logo} alt={tool.name} className="tool-logo" />
              ) : (
                <div className="tool-logo-fallback">{tool.icon}</div>
              )}
            </div>
            <div className="tool-header-text">
              <h1 className="tool-title">{tool.name}</h1>
              <p className="tool-tagline">{tool.description}</p>
            </div>
            <button className="btn-launch-header" onClick={handleTryNow}>
              🚀 Launch
            </button>
          </div>
        </section>
        <div className="divider-h"></div>

        {/* SECTION 2: APP INFO (Category, Status, Rating, Users) */}
        <section className="tool-info-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Category</span>
              <span className="info-value">{tool.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">{tool.price}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rating</span>
              <span className="info-value">
                {avgRating ? `★ ${avgRating.toFixed(1)}` : '—'}
                {reviews.length > 0 && ` (${reviews.length})`}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Users</span>
              <span className="info-value">{(tool.downloads || 0).toLocaleString()}</span>
            </div>
          </div>
        </section>

        <div className="divider-h"></div>

        {/* SECTION 3: CAROUSEL */}
        {tool.photos && tool.photos.length > 0 && (
          <>
            <section className="carousel-section">
              <h2 className="section-title">Gallery</h2>
              <PhotoCarousel photos={tool.photos} />
            </section>

            <div className="divider-h"></div>
          </>
        )}

        {/* SECTION 4: REVIEWS */}
        <section className="reviews-section">
          <ReviewSection tool={tool} user={user} reviews={reviews} />
        </section>

        <div className="divider-h"></div>

        {/* SECTION 5: MORE APPS LIKE THIS */}
        {relatedTools.length > 0 && (
          <section className="related-section">
            <h2 className="section-title">More {tool.category} Tools</h2>
                      <div className="related-grid">
              {relatedTools.map(relatedTool => (
                <div 
                  key={relatedTool.id} 
                  className="related-card"
                  onClick={() => onViewTool(relatedTool)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && onViewTool(relatedTool)}
                >
                  <div className="related-icon">
                    {relatedTool.logo ? (
                      <img src={relatedTool.logo} alt={relatedTool.name} />
                    ) : (
                      relatedTool.icon
                    )}
                  </div>
                  <h3 className="related-name">{relatedTool.name}</h3>
                  <p className="related-desc">{relatedTool.description}</p>
                  <div className="related-meta">
                    <span className="related-rating">★ {relatedTool.rating || 4.5}</span>
                    <span className="related-price">{relatedTool.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="tool-details-footer">
        <p>&copy; 2024 AIStore. All rights reserved.</p>
      </footer>
    </div>
  )
}