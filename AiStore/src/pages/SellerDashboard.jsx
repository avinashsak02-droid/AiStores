import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import './SellerDashboard.css'

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
    price: 'Free'
  })
  const [loading, setLoading] = useState(true)

  // Fetch tools from Firestore
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const q = query(collection(db, 'tools'), where('sellerId', '==', user?.uid))
        const snapshot = await getDocs(q)
        setTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        console.error('Error fetching tools:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchTools()
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

    try {
      if (editingId) {
        // Update existing tool
        const toolRef = doc(db, 'tools', editingId)
        await updateDoc(toolRef, {
          ...formData,
          updatedAt: new Date()
        })
      } else {
        // Add new tool
        await addDoc(collection(db, 'tools'), {
          ...formData,
          sellerId: user.uid,
          sellerEmail: user.email,
          sellerName: user.displayName || 'Anonymous',
          rating: 0,
          downloads: 0,
          createdAt: new Date()
        })
      }
      setFormData({
        name: '',
        description: '',
        logo: '',
        category: 'Coding',
        link: '',
        price: 'Free'
      })
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
      price: tool.price
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
    setFormData({
      name: '',
      description: '',
      logo: '',
      category: 'Coding',
      link: '',
      price: 'Free'
    })
  }

  if (loading) {
    return <div className="seller-dashboard"><p>Loading...</p></div>
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