import { useState, useEffect } from 'react'
import { auth, db, googleProvider } from '../firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore'
import './SellerDashboard.css'

export default function SellerDashboard({ user }) {
  const [tools, setTools] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingIn, setLoggingIn] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🤖',
    category: 'Coding',
    link: '',
    price: 'Free',
    logo: '',
    photos: ['', '', '', '', '']
  })

  const categories = ['Coding', 'Image', 'Video', 'Writing', 'Music', 'SEO', 'Design', 'Other']

  // Load tools only if user is logged in
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const q = query(collection(db, 'tools'), where('sellerId', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const toolsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTools(toolsList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleGoogleLogin = async () => {
    try {
      setLoggingIn(true)
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle photo URL changes
  const handlePhotoChange = (index, value) => {
    const newPhotos = [...formData.photos]
    newPhotos[index] = value
    setFormData(prev => ({ ...prev, photos: newPhotos }))
  }

  // Filter out empty photo URLs
  const getValidPhotos = () => {
    return formData.photos.filter(photo => photo.trim() !== '')
  }

  const handleAddTool = async () => {
    if (!formData.name || !formData.link) {
      alert('Name and Link are required!')
      return
    }

    try {
      setSaving(true)

      const toolData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        category: formData.category,
        link: formData.link,
        price: formData.price,
        logo: formData.logo || null,
        photos: getValidPhotos(),
        rating: 4.5,
        downloads: 0,
        createdAt: new Date()
      }

      if (editingId) {
        await updateDoc(doc(db, 'tools', editingId), toolData)
        setEditingId(null)
      } else {
        await addDoc(collection(db, 'tools'), {
          ...toolData,
          sellerId: user.uid,
          sellerEmail: user.email,
          sellerName: user.displayName
        })
      }

      setFormData({
        name: '',
        description: '',
        icon: '🤖',
        category: 'Coding',
        link: '',
        price: 'Free',
        logo: '',
        photos: ['', '', '', '', '']
      })
      setShowForm(false)
      alert(editingId ? 'Product updated!' : 'Product published!')
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving tool: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (tool) => {
    setFormData({
      name: tool.name,
      description: tool.description,
      icon: tool.icon,
      category: tool.category,
      link: tool.link,
      price: tool.price,
      logo: tool.logo || '',
      photos: [...(tool.photos || []), '', '', '', ''].slice(0, 5)
    })
    setEditingId(tool.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await deleteDoc(doc(db, 'tools', id))
      } catch (error) {
        console.error('Error:', error)
        alert('Error deleting product.')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      icon: '🤖',
      category: 'Coding',
      link: '',
      price: 'Free',
      logo: '',
      photos: ['', '', '', '', '']
    })
  }

  // NOT LOGGED IN
  if (!user) {
    return (
      <div className="seller-dashboard">
        <div className="login-screen">
          <div className="login-card">
            <h1>Welcome to Creator Hub</h1>
            <p>Publish your AI products and reach millions of users.</p>
            
            <button 
              className="btn-google-login"
              onClick={handleGoogleLogin}
              disabled={loggingIn}
            >
              {loggingIn ? 'Logging in...' : '🔐 Login with Google'}
            </button>
            
            <p className="login-subtext">
              Sign in to publish and manage your AI products. Your data is secure and private.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // LOGGED IN - Show dashboard
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your products...</div>
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Creator Hub</h1>
          <p>Welcome, {user.displayName || user.email}!</p>
          <p className="subtitle">Manage and publish your AI products to the marketplace.</p>
        </div>
      </div>

      <div className="divider-heavy"></div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-num">{tools.length}</span>
          <span className="stat-label">Published Products</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{tools.reduce((sum, t) => sum + (t.downloads || 0), 0).toLocaleString()}</span>
          <span className="stat-label">Total Users</span>
        </div>
      </div>

      <div className="divider-h"></div>

      {!showForm && (
        <button className="btn-create" onClick={() => setShowForm(true)}>
          + Publish New Product
        </button>
      )}

      {showForm && (
        <div className="form-panel">
          <h2>{editingId ? 'Edit Product' : 'Publish New Product'}</h2>
          
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g., Advanced Video Editor AI"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe what your product does..."
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="icon">Icon Emoji</label>
              <input
                id="icon"
                type="text"
                name="icon"
                maxLength="2"
                placeholder="🤖"
                value={formData.icon}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Logo URL Input */}
          <div className="form-group">
            <label htmlFor="logo">App Logo URL</label>
            <input
              id="logo"
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logo}
              onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
              className="form-input"
            />
            {formData.logo && (
              <div className="url-preview">
                <img src={formData.logo} alt="Logo preview" onError={(e) => { e.target.src = ''; e.target.alt = 'Image failed to load' }} />
                <span>Logo preview</span>
              </div>
            )}
          </div>

          {/* Photos URL Inputs */}
          <div className="form-group">
            <label>App Photos (max 5 URLs)</label>
            <div className="photos-urls">
              {formData.photos.map((photo, idx) => (
                <div key={idx} className="photo-url-item">
                  <label htmlFor={`photo-${idx}`}>Photo {idx + 1}</label>
                  <input
                    id={`photo-${idx}`}
                    type="url"
                    placeholder="https://example.com/photo.png"
                    value={photo}
                    onChange={(e) => handlePhotoChange(idx, e.target.value)}
                    className="form-input"
                  />
                  {photo && (
                    <div className="url-preview-small">
                      <img src={photo} alt={`Photo ${idx + 1} preview`} onError={(e) => { e.target.src = ''; e.target.alt = 'Failed' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="form-hint">Added: {getValidPhotos().length} photos</p>
          </div>

          <div className="form-group">
            <label htmlFor="link">Product URL *</label>
            <input
              id="link"
              type="url"
              name="link"
              placeholder="https://..."
              value={formData.link}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Pricing Model</label>
            <select
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="form-select"
            >
              <option>Free</option>
              <option>Paid</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              className="btn-primary" 
              onClick={handleAddTool}
              disabled={saving}
            >
              {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Publish Product')}
            </button>
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {tools.length > 0 && (
        <div className="products-section">
          <h2>Your Products</h2>
          
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Status</th>
                <th>Users</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map(tool => (
                <tr key={tool.id} className="product-row">
                  <td className="col-name">
                    <span className="product-icon">{tool.icon}</span>
                    <div>
                      <div className="product-name">{tool.name}</div>
                      <div className="product-desc">{tool.description}</div>
                    </div>
                  </td>
                  <td>{tool.category}</td>
                  <td>
                    <span className={`status ${tool.price.toLowerCase()}`}>
                      {tool.price}
                    </span>
                  </td>
                  <td>{(tool.downloads || 0).toLocaleString()}</td>
                  <td>★ {tool.rating || 4.5}</td>
                  <td className="actions">
                    <button 
                      className="btn-icon edit" 
                      onClick={() => handleEdit(tool)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button 
                      className="btn-icon delete" 
                      onClick={() => handleDelete(tool.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tools.length === 0 && !showForm && (
        <div className="empty-state">
          <p>No products yet. Publish your first AI product to get started.</p>
        </div>
      )}
    </div>
  )
}