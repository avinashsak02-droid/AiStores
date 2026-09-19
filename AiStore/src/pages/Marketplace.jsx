import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import AICard from '../components/AICard'
import FeaturedCard from '../components/FeaturedCard'
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

  // Featured product is the first one
  const featuredTool = filteredTools.length > 0 ? filteredTools[0] : null
  const regularTools = filteredTools.slice(1)

  return (
    <div className="marketplace">
      <div className="marketplace-hero">
        <h1>The AI Product Catalog</h1>
        <p>Discover, compare, and launch AI tools tailored to your needs.</p>
      </div>

      <div className="marketplace-search">
        <input
          type="text"
          placeholder="Search AI products, creators, categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="marketplace-filters">
        <div className="filter-label">Category</div>
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="marketplace-stats">
        <div className="stat">
          <span className="stat-number">{filteredTools.length}</span>
          <span className="stat-label">Products Found</span>
        </div>
        {selectedCategory !== 'All' && (
          <div className="stat">
            <span className="stat-label">{selectedCategory}</span>
          </div>
        )}
      </div>

      <div className="divider-h"></div>

      <div className="tools-container">
        {loading ? (
          <div className="loading-state">
            <p>Loading AI products...</p>
          </div>
        ) : filteredTools.length > 0 ? (
          <>
            {/* Featured Section */}
            {featuredTool && (
              <div className="featured-section">
                <FeaturedCard 
                  tool={featuredTool}
                  onClick={() => onViewTool(featuredTool)}
                />
              </div>
            )}

            {/* Regular Grid */}
            {regularTools.length > 0 && (
              <div className="tools-grid">
                {regularTools.map((tool, index) => (
                  <AICard 
                    key={tool.id} 
                    tool={tool}
                    index={index + 2}
                    onClick={() => onViewTool(tool)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No AI products match your search.</p>
            <p className="empty-subtext">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}