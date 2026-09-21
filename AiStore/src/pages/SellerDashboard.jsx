import { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import './SellerDashboard.css'

export default function SellerDashboard({ user, setUser, setCurrentPage }) {
  const [tools, setTools] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingIn, setLoggingIn] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    category: 'Coding',
    link: '',
    price: 'Free'
  })

  const categories = ['Coding', 'Writing', 'Image', 'Video', 'Audio', 'Music', 'Other']

  // Fetch tools when user is logged in
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const q = query(collection(db, 'tools'), where('sellerId', '==', user.uid))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const toolsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setTools(toolsList)
        setLoading(false)
      }, (err) => {
        console.error('Error fetching tools:', err)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }, [user])

  // ✅ GOOGLE LOGIN HANDLER
  const handleGoogleLogin = async () => {
    try {
      setLoggingIn(true)
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed: ' + error.message)
    } finally {
      setLoggingIn(false)
    }
  }

  // ✅ LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setCurrentPage('marketplace')
    } catch (error) {
      console.error('Logout error:', error)
      alert('Logout failed')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTool = async () => {
    if (!formData.name || !formData.link || !formData.logo) {
      alert('App Name, Product URL, and Logo URL are all required!')
      return
    }

    try {
      new URL(formData.logo)
      new URL(formData.link)
    } catch (e) {
      alert('Please enter valid URLs')
      return
    }

    try {
      if (editingId) {
        const toolRef = doc(db, 'tools', editingId)
        await updateDoc(toolRef, {
          ...formData,
          updatedAt: new Date()
        })
      } else {
        await addDoc(collection(db, 'tools'), {
          ...formData,
          sellerId: user.uid,
          sellerEmail: user.email,
          sellerName: user.displayName || 'Anonymous',
          rating: 4.5,
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
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving tool')
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
    if (!window.confirm('Delete this tool?')) return
    try {
      await deleteDoc(doc(db, 'tools', id))
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error deleting tool')
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

  // ✅ NOT LOGGED IN - SHOW LOGIN SCREEN
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

  // ✅ LOGGED IN - SHOW DASHBOARD
  if (loading) {
    return (
      <div className="seller-dashboard">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your products...</div>
      </div>
    )
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Creator Hub</h1>
          <p>👤 {user.displayName || user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowForm(!showForm)} className="btn-add-tool">
            {showForm ? '✕ Cancel' : '+ Add AI Tool'}
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
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
                placeholder="e.g., ChatGPT"
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
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