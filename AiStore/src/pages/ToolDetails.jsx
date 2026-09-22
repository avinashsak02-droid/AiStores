import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import PhotoCarousel from '../components/PhotoCarousel'
import ImageFullscreenViewer from '../components/ImageFullScreenViewer'
import CoverArt from '../components/CoverArt'
import { ArrowLeft, ArrowUpRight } from '../components/Icons'
import { getPrice } from '../utils/tool'
import './ToolDetails.css'

// Shows the tool's logo. If there is no logo (or the URL is broken),
// it falls back to generated cover art - never an emoji.
function ToolLogo({ tool }) {
  const [failedUrl, setFailedUrl] = useState(null)

  if (tool.logo && tool.logo !== failedUrl) {
    return (
      <img
        src={tool.logo}
        alt=""
        className="td-logo-img"
        onError={() => setFailedUrl(tool.logo)}
      />
    )
  }
  return <CoverArt seed={tool.id || tool.name} showIcon={false} />
}

export default function ToolDetails({ tool, onBack, onViewTool }) {
  const [relatedTools, setRelatedTools] = useState([])
  const [fullscreenIndex, setFullscreenIndex] = useState(null)

  // Fetch more tools in the same category
  useEffect(() => {
    if (!tool.category) {
      setRelatedTools([])
      return
    }

    const q = query(collection(db, 'tools'), where('category', '==', tool.category))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tools = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((t) => t.id !== tool.id) // exclude the current tool
          .slice(0, 4) // show max 4
        setRelatedTools(tools)
      },
      (error) => console.error('Could not load related tools:', error)
    )

    return () => unsubscribe()
  }, [tool.category, tool.id])

  const handleTryNow = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="tool-details">
      <div className="td-container">
        <button type="button" className="td-back" onClick={onBack}>
          <ArrowLeft /> Back to catalog
        </button>

        {/* HERO: logo + name + launch */}
        <section className="td-hero">
          <div className="td-logo">
            <ToolLogo tool={tool} />
          </div>

          <div className="td-hero-text">
            <p className="eyebrow">
              <span className="accent">{tool.category || 'Other'}</span> / {getPrice(tool)}
            </p>
            <h1 className="td-title">{tool.name}</h1>
            <p className="td-tagline">{tool.description}</p>
          </div>

          <button type="button" className="btn" onClick={handleTryNow}>
            Launch <ArrowUpRight />
          </button>
        </section>

        {/* INFO */}
        <section className="td-info">
          <div className="td-info-item">
            <span className="td-info-label">Category</span>
            <span className="td-info-value">{tool.category || 'Other'}</span>
          </div>
          <div className="td-info-item">
            <span className="td-info-label">Status</span>
            <span className="td-info-value">{getPrice(tool)}</span>
          </div>
          <div className="td-info-item">
            <span className="td-info-label">Rating</span>
            <span className="td-info-value">★ {tool.rating || 4.5}</span>
          </div>
          <div className="td-info-item">
            <span className="td-info-label">Users</span>
            <span className="td-info-value">{(tool.downloads || 0).toLocaleString()}</span>
          </div>
        </section>

        {/* GALLERY */}
        {tool.photos && tool.photos.length > 0 && (
          <section className="td-section">
            <h2 className="td-section-title">Product Gallery</h2>
            <div className="gallery-wrapper">
              <PhotoCarousel 
                photos={tool.photos}
                onPhotoClick={(index) => setFullscreenIndex(index)}
              />
              <p className="gallery-hint">Click image to view fullscreen</p>
            </div>
          </section>
        )}

        {/* RELATED */}
        {relatedTools.length > 0 && (
          <section className="td-section">
            <h2 className="td-section-title">More {tool.category} tools</h2>
            <ul className="td-related-grid">
              {relatedTools.map((relatedTool) => (
                <li key={relatedTool.id}>
                  <button
                    type="button"
                    className="td-related-card"
                    onClick={() => onViewTool(relatedTool)}
                  >
                    <span className="td-related-logo">
                      <ToolLogo tool={relatedTool} />
                    </span>
                    <span className="td-related-name">{relatedTool.name}</span>
                    <span className="td-related-desc">{relatedTool.description}</span>
                    <span className="td-related-meta">
                      <span>★ {relatedTool.rating || 4.5}</span>
                      <span className="td-related-price">{getPrice(relatedTool)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <footer className="td-footer">
        <p>&copy; {new Date().getFullYear()} AIStore. All rights reserved.</p>
      </footer>

      {/* Fullscreen viewer */}
      {fullscreenIndex !== null && tool.photos && (
        <ImageFullscreenViewer
          photos={tool.photos}
          initialIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
        />
      )}
    </div>
  )
}