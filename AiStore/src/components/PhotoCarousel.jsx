import { useState } from 'react'
import './PhotoCarousel.css'

export default function PhotoCarousel({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) return null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="photo-carousel">
      <div className="carousel-main">
        <img src={photos[currentIndex]} alt={`Product photo ${currentIndex + 1}`} />
      </div>

      {photos.length > 1 && (
        <>
          <button className="carousel-arrow carousel-prev" onClick={handlePrev}>
            ←
          </button>
          <button className="carousel-arrow carousel-next" onClick={handleNext}>
            →
          </button>

          <div className="carousel-dots">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-counter">
            {currentIndex + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  )
}