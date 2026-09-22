import { useState } from 'react'
import { ArrowLeft, ArrowRight } from './Icons'
import './ImageFullscreenViewer.css'

export default function ImageFullscreenViewer({ photos, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  if (!photos || photos.length === 0) return null

  const currentPhoto = photos[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fullscreen-viewer" onKeyDown={handleKeyDown} tabIndex={0} role="dialog" aria-modal="true">
      {/* Close button */}
      <button
        className="fs-close-btn"
        onClick={onClose}
        aria-label="Close fullscreen view"
      >
        ✕
      </button>

      {/* Main image */}
      <div className="fs-main-area">
        <button
          className="fs-nav-btn fs-prev"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <ArrowLeft />
        </button>

        <img
          src={currentPhoto}
          alt={`Image ${currentIndex + 1}`}
          className="fs-image"
        />

        <button
          className="fs-nav-btn fs-next"
          onClick={goToNext}
          aria-label="Next image"
        >
          <ArrowRight />
        </button>
      </div>

      {/* Counter and thumbnails */}
      <div className="fs-footer">
        <div className="fs-counter">
          {currentIndex + 1} / {photos.length}
        </div>

        {photos.length > 1 && (
          <div className="fs-thumbnails">
            {photos.map((photo, index) => (
              <button
                key={index}
                className={`fs-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              >
                <img src={photo} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}