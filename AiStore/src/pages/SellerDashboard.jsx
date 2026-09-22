import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { signInWithPopup } from 'firebase/auth'
import { db, auth, googleProvider } from '../firebase'
import './SellerDashboard.css'

const MAX_PHOTOS = 5

export default function SellerDashboard({ user }) {
  const [tools, setTools] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    category: 'Coding',
    link: '',
    price: 'Free',
    photos: ['']
  })
  const [loading, setLoading] = useState(true)

  // Fetch tools from Firestore
  useEffect(() => {
    if (!user) {
      // Not logged in — nothing to fetch, stop showing the loading state
      setLoading(false)
      return
    }

    const fetchTools = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'tools'), where('sellerId', '==', user.uid))
        const snapshot = await getDocs(q)
        setTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        console.error('Error fetching tools:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [user])

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Sign-in error:', error)
      alert('Sign-in failed. Please try again.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ---- Photo fields (1-5 required) ----
  const handlePhotoChange = (index, value) => {
    setFormData(prev => {
      const photos = [...prev.photos]
      photos[index] = value
      return { ...prev, photos }
    })
  }

  const addPhotoField = () => {
    setFormData(prev => {
      if (prev.photos.length >= MAX_PHOTOS) return prev
      return { ...prev, photos: [...prev.photos, ''] }
    })
  }

  const removePhotoField = (index) => {
    setFormData(prev => {
      if (prev.photos.length <= 1) return prev
      return { ...prev, photos: prev.photos.filter((_, i) => i !== index) }
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: '',
      category: 'Coding',
      link: '',
      price: 'Free',
      photos: ['']
    })
  }

  const handleAddTool = async () => {
    if (!formData.name || !formData.link || !formData.logo) {
      alert('App Name, Product URL, and Logo URL are all required!')
      return
    }

    // Validate logo URL format
    try {
      new URL(formData.logo)
    } catch (e) {
      alert('Please enter a valid Logo URL')
      return
    }

    // Validate product link URL format
    try {
      new URL(formData.link)
    } catch (e) {
      alert('Please enter a valid Product URL')
      return
    }

    // Validate photos: required (1-5), each must be a valid URL
    const validPhotos = formData.photos.map(p => p.trim()).filter(p => p !== '')

    if (validPhotos.length === 0) {
      alert('Please add at least 1 product photo for the gallery (up to 5).')
      return
    }
    if (validPhotos.length > MAX_PHOTOS) {
      alert(`You can add a maximum of ${MAX_PHOTOS} photos.`)
      return
    }
    for (const url of validPhotos) {
      try {
        new URL(url)
      } catch (e) {
        alert(`Please enter a valid URL for photo: "${url}"`)
        return
      }
    }

    const dataToSave = { ...formData, photos: validPhotos }

    try {
      if (editingId) {
        // Update existing tool
        const toolRef = doc(db, 'tools', editingId)
        await updateDoc(toolRef, {
          ...dataToSave,
          updatedAt: new Date()
        })
      } else {
        // Add new tool
        await addDoc(collection(db, 'tools'), {
          ...dataToSave,
          sellerId: user.uid,
          sellerEmail: user.email,
          sellerName: user.displayName || 'Anonymous',
          rating: 0,
          downloads: 0,
          createdAt: new Date()
        })
      }
      resetForm()
      setShowForm(false)
      setEditingId(null)
      // Refresh tools list
      const q = query(collection(db, 'tools'), where('sellerId', '==', user.uid))
      const snapshot = await getDocs(q)
      setTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error adding/updating tool:', error)
      alert('Error saving tool. Please try again.')
    }
  }

  const handleEdit = (tool) => {
    setFormData({
      name: tool.name,
      description: tool.description,
      logo: tool.logo || '',
      category: tool.category,
      link: tool.link,
      price: tool.price,
      photos: tool.photos && tool.photos.length > 0 ? tool.photos : ['']
    })
    setEditingId(tool.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return
    try {
      await deleteDoc(doc(db, 'tools', id))
      setTools(tools.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting tool:', error)
      alert('Error deleting tool. Please try again.')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    resetForm()
  }

  if (loading) {
    return <div className="seller-dashboard"><p>Loading...</p></div>
  }

  // Not signed in — show a sign-in prompt instead of hanging or showing an empty dashboard
  if (!user) {
    return (
      <div className="seller-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Seller Dashboard</h1>
            <p className="seller-email">Sign in to manage your AI tools.</p>
          </div>
          <button onClick={handleSignIn} className="btn-add-tool">
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p className="seller-email">{user?.email}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-add-tool">
          {showForm ? '✕ Cancel' : '+ Add AI Tool'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Tool' : 'List a New AI Tool'}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">App Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="e.g., ChatGPT, Midjourney"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
              >
                <option>Coding</option>
                <option>Writing</option>
                <option>Image</option>
                <option>Video</option>
                <option>Audio</option>
                <option>Music</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe what your AI tool does..."
              value={formData.description}
              onChange={handleInputChange}
              className="form-input form-textarea"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="link">Product URL *</label>
              <input
                id="link"
                type="url"
                name="link"
                placeholder="https://example.com"
                value={formData.link}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <select
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
              >
                <option>Free</option>
                <option>Paid</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="logo">App Logo URL *</label>
            <input
              id="logo"
              type="url"
              name="logo"
              placeholder="https://example.com/logo.png"
              value={formData.logo}
              onChange={handleInputChange}
              className="form-input"
            />
            {formData.logo && (
              <div className="logo-preview-form">
                <img src={formData.logo} alt="Logo preview" className="logo-preview-img" />
                <span className="preview-label">Logo Preview</span>
              </div>
            )}
          </div>

          {/* ---- Product photos (carousel) ---- */}
          <div className="form-group">
            <label>Product Photos * (1–{MAX_PHOTOS} required, for the gallery on the tool page)</label>
            <div className="photo-fields">
              {formData.photos.map((photoUrl, index) => (
                <div className="photo-input-row" key={index}>
                  <input
                    type="url"
                    placeholder={`https://example.com/screenshot-${index + 1}.png`}
                    value={photoUrl}
                    onChange={(e) => handlePhotoChange(index, e.target.value)}
                    className="form-input"
                  />
                  {photoUrl.trim() && (
                    <img src={photoUrl} alt="" className="photo-thumb-preview" />
                  )}
                  <button
                    type="button"
                    className="btn-photo-remove"
                    onClick={() => removePhotoField(index)}
                    disabled={formData.photos.length <= 1}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-photo-add"
              onClick={addPhotoField}
              disabled={formData.photos.length >= MAX_PHOTOS}
            >
              + Add another photo
            </button>
            <p className="photo-hint">
              {formData.photos.filter(p => p.trim()).length} / {MAX_PHOTOS} photos added
            </p>
          </div>

          <div className="form-actions">
            <button onClick={handleAddTool} className="btn-submit">
              {editingId ? '✓ Update Tool' : '+ List Tool'}
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="tools-list">
        <h2>Your AI Tools ({tools.length})</h2>
        {tools.length === 0 ? (
          <p className="empty-state">No tools yet. Create your first AI tool listing!</p>
        ) : (
          <div className="tools-grid">
            {tools.map((tool) => (
              <div key={tool.id} className="tool-card">
                <div className="tool-header">
                  {tool.logo ? (
                    <img src={tool.logo} alt={tool.name} className="tool-logo" />
                  ) : (
                    <div className="tool-logo-placeholder">📦</div>
                  )}
                </div>
                <div className="tool-content">
                  <h3>{tool.name}</h3>
                  <p className="tool-category">{tool.category}</p>
                  <p className="tool-description">{tool.description}</p>
                  <div className="tool-meta">
                    <span className={`tool-price ${tool.price.toLowerCase()}`}>{tool.price}</span>
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="tool-link">
                      Visit →
                    </a>
                  </div>
                </div>
                <div className="tool-actions">
                  <button onClick={() => handleEdit(tool)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(tool.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}