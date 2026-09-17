import { useState, useEffect, useMemo } from 'react'
import { db } from '../firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore'
import { SELLER_CATEGORIES, categoryMeta, categoryTint } from '../utils/categories'
import './SellerDashboard.css'

const EMPTY_FORM = {
  name: '',
  description: '',
  icon: '🤖',
  category: 'Coding',
  link: '',
  price: 'Free',
}

const ICON_CHOICES = ['🤖', '✨', '🎨', '🎬', '✍️', '🎵', '📈', '🧩', '⚡', '🧠', '🔍', '💬']

export default function SellerDashboard() {
  const [tools, setTools] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sellerId] = useState('seller_1')
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    const q = query(collection(db, 'tools'), where('sellerId', '==', sellerId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const toolsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setTools(toolsList)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [sellerId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const openNewForm = () => {
    setFormData(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  const handleAddTool = async () => {
    if (!formData.name || !formData.link) {
      alert('Name and Link are required!')
      return
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, 'tools', editingId), formData)
        setEditingId(null)
      } else {
        await addDoc(collection(db, 'tools'), {
          ...formData,
          sellerId,
          rating: 4.5,
          downloads: 0,
          createdAt: new Date(),
        })
      }
      setFormData(EMPTY_FORM)
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
      price: tool.price,
    })
    setEditingId(tool.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    setFormData(EMPTY_FORM)
  }

  const stats = useMemo(() => {
    const totalInstalls = tools.reduce((s, t) => s + (t.downloads || 0), 0)
    const avgRating = tools.length
      ? (tools.reduce((s, t) => s + (t.rating || 0), 0) / tools.length).toFixed(1)
      : '—'
    const free = tools.filter((t) => String(t.price).toLowerCase() === 'free').length
    return { total: tools.length, totalInstalls, avgRating, free }
  }, [tools])

  return (
    <div className="seller-dashboard">
      <div className="page">
        <div className="dash-topbar">
          <div>
            <span className="kicker">Creator console</span>
            <h1>Your AI tools</h1>
            <p className="dash-sub">Publish and manage the AI agents and tools you offer on AIStore.</p>
          </div>
          {!showForm && (
            <button className="btn btn-primary btn-lg" onClick={openNewForm}>
              + Publish new tool
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <StatCard label="Published tools" value={loading ? '—' : stats.total} />
          <StatCard label="Total installs" value={loading ? '—' : stats.totalInstalls.toLocaleString()} />
          <StatCard label="Average rating" value={loading ? '—' : stats.avgRating} accent />
          <StatCard label="Free tools" value={loading ? '—' : stats.free} />
        </div>

        {/* Form */}
        {showForm && (
          <div className="dash-form rise">
            <div className="dash-form-head">
              <h2>{editingId ? 'Edit tool' : 'Publish a new tool'}</h2>
              <button className="dash-form-close" onClick={handleCancel} aria-label="Close form">
                ×
              </button>
            </div>

            <div className="form-grid">
              <div className="field field-full">
                <label htmlFor="name">Tool name *</label>
                <input id="name" type="text" name="name" placeholder="e.g. Lumen Video Editor"
                  value={formData.name} onChange={handleInputChange} />
              </div>

              <div className="field field-full">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="3"
                  placeholder="What does your AI tool do, and who is it for?"
                  value={formData.description} onChange={handleInputChange} />
              </div>

              <div className="field field-full">
                <label>Icon</label>
                <div className="icon-picker">
                  {ICON_CHOICES.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`icon-choice ${formData.icon === ic ? 'active' : ''}`}
                      onClick={() => setFormData((p) => ({ ...p, icon: ic }))}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                  {SELLER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="price">Price</label>
                <select id="price" name="price" value={formData.price} onChange={handleInputChange}>
                  <option>Free</option>
                  <option>Paid</option>
                </select>
              </div>

              <div className="field field-full">
                <label htmlFor="link">Link to your AI * (Hugging Face, Replit, etc.)</label>
                <input id="link" type="url" name="link" placeholder="https://..."
                  value={formData.link} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleAddTool}>
                {editingId ? 'Save changes' : 'Publish tool'}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="dash-list">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 96, borderRadius: 'var(--r-lg)' }} />
            ))}
          </div>
        ) : tools.length > 0 ? (
          <div className="dash-list">
            <div className="dash-list-head">
              <h2>Published ({tools.length})</h2>
            </div>
            {tools.map((tool) => {
              const meta = categoryMeta(tool.category)
              const free = String(tool.price).toLowerCase() === 'free'
              return (
                <div key={tool.id} className="dash-row">
                  <div className="dash-row-icon" style={categoryTint(tool.category)}>
                    <span aria-hidden="true">{tool.icon || meta.glyph}</span>
                  </div>
                  <div className="dash-row-info">
                    <div className="dash-row-top">
                      <h3>{tool.name}</h3>
                      <span className="dash-row-cat" style={{ color: meta.color }}>{tool.category}</span>
                      <span className={`pill ${free ? 'pill-free' : 'pill-paid'}`}>
                        {free ? 'Free' : tool.price || 'Paid'}
                      </span>
                    </div>
                    <p className="dash-row-desc">{tool.description || 'No description provided.'}</p>
                    <a className="dash-row-link" href={tool.link} target="_blank" rel="noopener noreferrer">
                      {tool.link}
                    </a>
                  </div>
                  <div className="dash-row-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(tool)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tool.id)}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          !showForm && (
            <div className="empty">
              <div className="empty-glyph">🚀</div>
              <h3>No tools published yet</h3>
              <p>Publish your first AI tool to start reaching people on AIStore.</p>
              <button className="btn btn-primary" onClick={openNewForm}>
                Publish your first tool
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card ${accent ? 'stat-card-accent' : ''}`}>
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </div>
  )
}
