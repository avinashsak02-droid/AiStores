import { useState, useEffect, useMemo } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import AICard from '../components/AICard'
import CoverArt from '../components/CoverArt'
import { ArrowRight, SearchIcon } from '../components/Icons'
import { getCreator, getPrice, isFree } from '../utils/tool'
import './Marketplace.css'

const CATEGORIES = ['All', 'Coding', 'Writing', 'Image', 'Video', 'Audio', 'Music', 'Other']

export default function Marketplace({ onViewTool, onOpenCreatorHub }) {
  const [allTools, setAllTools] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'tools'),
      (snapshot) => {
        setAllTools(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (error) => {
        console.error('Could not load tools:', error)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const isSearching = searchTerm.trim() !== ''

  // Search looks at name, description, category and creator.
  // Results are sorted "featured first": most users, then highest rating.
  const filteredTools = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return allTools
      .filter((tool) => {
        const text = [tool.name, tool.description, tool.category, getCreator(tool)]
          .join(' ')
          .toLowerCase()
        const matchesSearch = !term || text.includes(term)
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0) || (b.rating || 0) - (a.rating || 0))
  }, [allTools, searchTerm, selectedCategory])

  // The big "featured" block is shown while browsing (not while searching)
  const featured = !isSearching ? filteredTools[0] : null
  const count = String(filteredTools.length).padStart(2, '0')

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
  }

  return (
    <main className="marketplace">
      {/* ---------- Hero + search ---------- */}
      <section className="mk-hero">
        <div>
          <p className="eyebrow reveal">
            <span className="accent">AI Product Catalog</span> / 2026
          </p>
          <h1 className="mk-title reveal" style={{ '--d': 1 }}>
            The AI Product <em>Catalog</em>
          </h1>
          <p className="mk-lede reveal" style={{ '--d': 2 }}>
            Discover, compare and launch AI tools built for ambitious creative and technical workflows.
          </p>
        </div>

        <div className="mk-search reveal" style={{ '--d': 3 }}>
          <label className="eyebrow mk-search-label" htmlFor="mk-search">
            Search the index
          </label>
          <div className="mk-search-field">
            <SearchIcon />
            <input
              id="mk-search"
              type="text"
              className="mk-search-input"
              placeholder="Product, creator or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      {/* ---------- Category filters ---------- */}
      <div className="mk-filters" role="group" aria-label="Filter by category">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`mk-chip ${selectedCategory === category ? 'active' : ''}`}
            aria-pressed={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ---------- Featured entry ---------- */}
      {featured && (
        <article className="mk-featured reveal" onClick={() => onViewTool(featured)}>
          <div className="mk-featured-media">
            <CoverArt
              className="mk-featured-cover"
              seed={featured.id || featured.name}
              image={featured.image}
            />
            <span className="mk-featured-tag">Featured entry</span>
          </div>

          <div className="mk-featured-body">
            <div>
              <p className="eyebrow">Entry 01 / {featured.category}</p>
              <h2 className="mk-featured-title">{featured.name}</h2>
              <p className="mk-featured-desc">{featured.description}</p>
            </div>

            <div className="mk-featured-foot">
              <div className="mk-byline">
                <span className="mk-byline-creator">By {getCreator(featured)}</span>
                <span className={`mk-byline-price ${isFree(featured) ? 'is-free' : ''}`}>
                  {getPrice(featured)}
                </span>
              </div>
              {/* Click bubbles up to the article */}
              <button type="button" className="btn">
                Explore product <ArrowRight />
              </button>
            </div>
          </div>
        </article>
      )}

      {/* ---------- Marketplace index ---------- */}
      <div className="mk-index-head">
        <div>
          <p className="eyebrow accent">Marketplace index</p>
          <p className="mk-count">
            {count} product{filteredTools.length === 1 ? '' : 's'} found
          </p>
        </div>
        <span className="eyebrow">Sorted / Featured</span>
      </div>

      <div className="mk-index-wrap">
        {loading ? (
          <div aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div className="mk-skel" key={i}>
                <span className="mk-skel-line short"></span>
                <span className="mk-skel-thumb"></span>
                <span className="mk-skel-line"></span>
              </div>
            ))}
          </div>
        ) : filteredTools.length > 0 ? (
          <ul className="mk-index">
            {filteredTools.map((tool, index) => (
              <AICard
                key={tool.id}
                tool={tool}
                index={index}
                onClick={() => onViewTool(tool)}
              />
            ))}
          </ul>
        ) : (
          <div className="mk-empty">
            <h3>Nothing matches your search.</h3>
            <p>Try different words, or browse another category.</p>
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ---------- Creator call-to-action ---------- */}
      <section className="mk-cta">
        <div className="mk-cta-inner">
          <div>
            <p className="eyebrow light">Creator Hub</p>
            <h2>Building something remarkable?</h2>
            <p className="mk-cta-text">
              Present your AI product in a catalog built for thoughtful discovery and serious comparison.
            </p>
          </div>
          <button type="button" className="btn btn--light" onClick={onOpenCreatorHub}>
            Showcase your product <ArrowRight />
          </button>
        </div>
      </section>

      <footer className="mk-footer">
        <span>AIStore / Independent AI discovery</span>
        <span>Catalog edition 2026</span>
      </footer>
    </main>
  )
}