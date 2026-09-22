import { useState } from 'react'
import './ImageUploadPreview.css'

export default function ImageUploadPreview({ photos = [], onUpload, onRemove, uploading = false }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      // Trigger the file input with the dropped files
      const input = document.getElementById('image-upload-input')
      if (input) {
        input.files = files
        const event = new Event('change', { bubbles: true })
        input.dispatchEvent(event)
      }
    }
  }

  return (
    <div className="image-upload-section">
      <label className="form-group-label">Product Gallery (Optional)</label>
      <p className="form-group-sublabel">
        Upload up to 5 images to showcase your AI tool (JPG, PNG, max 5MB each)
      </p>

      <div
        className={`drag-drop-zone ${dragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="image-upload-input"
          type="file"
          multiple
          accept="image/*"
          onChange={onUpload}
          disabled={uploading || photos.length >= 5}
          className="file-input-hidden"
        />
        <label htmlFor="image-upload-input" className="drag-drop-label">
          <div className="drag-drop-icon">📷</div>
          <div className="drag-drop-text">
            {uploading ? 'Uploading...' : 'Drag images here or click to browse'}
          </div>
          <div className="drag-drop-subtext">
            {photos.length} / 5 images uploaded
          </div>
        </label>
      </div>

      {/* Preview gallery */}
      {photos.length > 0 && (
        <div className="photos-preview">
          <h4>Uploaded Images</h4>
          <div className="photos-grid">
            {photos.map((photoUrl, index) => (
              <div key={index} className="photo-item">
                <img src={photoUrl} alt={`Preview ${index + 1}`} className="photo-thumbnail" />
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={() => onRemove(photoUrl)}
                  disabled={uploading}
                  title="Remove this image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}