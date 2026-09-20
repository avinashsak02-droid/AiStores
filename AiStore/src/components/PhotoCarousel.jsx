import { useState } from 'react'
import './PhotoCarousel.css'

export default function PhotoCarousel({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="photo-carousel">
      <div className="carousel-main">
        {photos.length > 1 && (
          <button 
            className="carousel-arrow carousel-prev" 
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ◀
          </button>
        )}

        <div className="carousel-image-wrapper">
          <img
            src={photos[currentIndex]}
            alt={`Gallery ${currentIndex + 1}`}
            className="carousel-image"
          />
        </div>

        {photos.length > 1 && (
          <button 
            className="carousel-arrow carousel-next" 
            onClick={goToNext}
            aria-label="Next image"
          >
            ▶
          </button>
        )}
      </div>

      {/* INDICATORS */}
      {photos.length > 1 && (
        <div className="carousel-indicators">
          <div className="indicator-counter">
            {currentIndex + 1} / {photos.length}
          </div>
          <div className="indicator-dots">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}