import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import AICard from '../components/AICard'
import './Marketplace.css'

export default function Marketplace({ onViewTool }) {
  const [allTools, setAllTools] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Video', 'Image', 'Writing', 'Coding', 'Music', 'SEO', 'Design', 'Other']

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tools'), (snapshot) => {
      const toolsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAllTools(toolsList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1>AI Store Marketplace</h1>
        <p>Discover and use powerful AI tools for your projects</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search AI tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="tools-grid">
        {loading ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>Loading tools...</p>
        ) : filteredTools.length > 0 ? (
          filteredTools.map(tool => (
            <AICard 
              key={tool.id} 
              tool={tool}
              onClick={() => onViewTool(tool)}
            />
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>No AI tools found. Try a different search.</p>
        )}
      </div>
    </div>
  )
}