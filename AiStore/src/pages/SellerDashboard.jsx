import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore'
import './SellerDashboard.css'

export default function SellerDashboard() {
  const [tools, setTools] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sellerId] = useState('seller_1') // For now, hardcoded seller ID
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🤖',
    category: 'Coding',
    link: '',
    price: 'Free'
  })

  const categories = ['Coding', 'Image', 'Video', 'Writing', 'Music', 'SEO', 'Design', 'Other']

  // Load seller's tools from Firebase
  useEffect(() => {
    const q = query(collection(db, 'tools'), where('sellerId', '==', sellerId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const toolsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTools(toolsList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [sellerId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTool = async () => {
    if (!formData.name || !formData.link) {
      alert('Name and Link are required!')
      return
    }

    try {
      if (editingId) {
        // Update existing tool in Firebase
        await updateDoc(doc(db, 'tools', editingId), formData)
        setEditingId(null)
      } else {
        // Add new tool to Firebase
        await addDoc(collection(db, 'tools'), {
          ...formData,
          sellerId,
          rating: 4.5,
          downloads: 0,
          createdAt: new Date()
        })
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        icon: '🤖',
        category: 'Coding',
        link: '',
        price: 'Free'
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error adding/updating tool:', error)
      alert('Error saving tool. Check console.')
    }
  }

  const handleEdit = (tool) => {
    setFormData({
      name: tool.name,
      description: tool.description,
      icon: tool.icon,
      category: tool.category,
      link: tool.link,
      price: tool.price
    })
    setEditingId(tool.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this tool?')) {
      try {
        await deleteDoc(doc(db, 'tools', id))
      } catch (error) {
        console.error('Error deleting tool:', error)
        alert('Error deleting tool.')
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
      price: 'Free'
    })
  }

  if (loading) {
    return <div style={{ padding: '2rem', color: '#999' }}>Loading...</div>
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>My AI Tools</h1>
        <p>Upload and manage your AI agents or tools</p>
      </div>

      {!showForm && (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add New Tool
        </button>
      )}

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Tool' : 'Add New Tool'}</h2>
          
          <div className="form-group">
            <label>Tool Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., My Video Editor AI"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="What does your AI tool do?"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Icon/Emoji</label>
              <input
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
              <label>Category</label>
              <select
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

          <div className="form-row">
            <div className="form-group">
              <label>Link to Your AI * (Hugging Face, Replit, etc.)</label>
              <input
                type="url"
                name="link"
                placeholder="https://..."
                value={formData.link}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <select
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

          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddTool}>
              {editingId ? 'Update Tool' : 'Add Tool'}
            </button>
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {tools.length > 0 && (
        <div className="tools-list">
          <h2>Your Tools ({tools.length})</h2>
          
          {tools.map(tool => (
            <div key={tool.id} className="tool-item">
              <div className="tool-content">
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-info">
                  <h3>{tool.name}</h3>
                  <p className="tool-category">{tool.category}</p>
                  <p className="tool-description">{tool.description}</p>
                  <p className="tool-link">
                    <strong>Link:</strong> <a href={tool.link} target="_blank" rel="noopener noreferrer">{tool.link}</a>
                  </p>
                </div>
              </div>
              
              <div className="tool-actions">
                <span className="tool-price">{tool.price}</span>
                <button className="btn-edit" onClick={() => handleEdit(tool)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(tool.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tools.length === 0 && !showForm && (
        <div className="empty-state">
          <p>No tools yet. Add your first AI tool to get started!</p>
        </div>
      )}
    </div>
  )
}