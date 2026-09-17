import { useState, useEffect, useMemo } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import AICard from '../components/AICard'
import { BROWSE_CATEGORIES, categoryMeta, categoryTint } from '../utils/categories'
import './Marketplace.css'

function toTime(tool) {
  const c = tool.createdAt
  if (!c) return 0
  if (typeof c.seconds === 'number') return c.seconds * 1000
  const d = new Date(c)
  return isNaN(d.getTime()) ? 0 : d.getTime()
}

export default function Marketplace({ onViewTool, onOpenCreator }) {
  const [allTools, setAllTools] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [browseAll, setBrowseAll] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tools'), (snapshot) => {
      const toolsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setAllTools(toolsList)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const browsing = searchTerm.trim() !== '' || selectedCategory !== 'All' || browseAll

  const filteredTools = useMemo(() => {
    const term = searchTerm.toLowerCase()
    const list = allTools.filter((tool) => {
      const matchesSearch =
        (tool.name || '').toLowerCase().includes(term) ||
        (tool.description || '').toLowerCase().includes(term)
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    const sorted = [...list]
    if (sortBy === 'rating') sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    else if (sortBy === 'newest') sorted.sort((a, b) => toTime(b) - toTime(a))
    else sorted.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))
    return sorted
  }, [allTools, searchTerm, selectedCategory, sortBy])

  const featured = useMemo(
    () => [...allTools].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4),
    [allTools]
  )
  const trending = useMemo(
    () => [...allTools].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 8),
    [allTools]
  )
  const newArrivals = useMemo(
    () => [...allTools].sort((a, b) => toTime(b) - toTime(a)).slice(0, 4),
    [allTools]
  )
  const spotlight = featured[0]

  const categoryCounts = useMemo(() => {
    const map = {}
    for (const t of allTools) map[t.category] = (map[t.category] || 0) + 1
    return map
  }, [allTools])

  const totalInstalls = useMemo(
    () => allTools.reduce((sum, t) => sum + (t.downloads || 0), 0),
    [allTools]
  )

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setBrowseAll(false)
  }

  const renderSearch = (big) => (
    <div className={`search-field ${big ? 'search-field-lg' : ''}`}>
      <svg className="search-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        placeholder="Search tools, agents, use cases…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search AI tools"
      />
      {searchTerm && (
        <button className="search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  )

  return (
    <div className="marketplace">
      {!browsing && (
        <section className="hero">
          <div className="hero-grid page">
            <div className="hero-copy">
              <span className="kicker">
                <span className="kicker-dot" /> The AI marketplace
              </span>
              <h1 className="hero-title">
                Discover AI that <span className="serif hero-em">actually</span> gets the job done.
              </h1>
              <p className="hero-sub">
                A carefully curated home for the best AI tools, agents and apps — browse by
                what you need, compare the details, and launch in one click.
              </p>

              <SearchField big />

              <div className="hero-chips">
                {BROWSE_CATEGORIES.slice(1, 7).map((cat) => (
                  <button
                    key={cat}
                    className="hero-chip"
                    onClick={() => setSelectedCategory(cat)}
                    style={categoryTint(cat)}
                  >
                    {categoryMeta(cat).glyph} {cat}
                  </button>
                ))}
              </div>

              <div className="hero-stats">
                <div>
                  <strong>{allTools.length || '—'}</strong>
                  <span>AI tools</span>
                </div>
                <div>
                  <strong>{Object.keys(categoryCounts).length || '—'}</strong>
                  <span>Categories</span>
                </div>
                <div>
                  <strong>{totalInstalls.toLocaleString()}</strong>
                  <span>Total installs</span>
                </div>
              </div>
            </div>

            <div className="hero-aside">
              {spotlight ? (
                <button className="spotlight" onClick={() => onViewTool(spotlight)}>
                  <div className="spotlight-tag">Editor’s choice</div>
                  <div className="spotlight-icon" style={categoryTint(spotlight.category)}>
                    <span aria-hidden="true">{spotlight.icon || categoryMeta(spotlight.category).glyph}</span>
                  </div>
                  <h3>{spotlight.name}</h3>
                  <p>{spotlight.description}</p>
                  <div className="spotlight-foot">
                    <span className="meta-rating">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--star)" aria-hidden="true">
                        <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
                      </svg>
                      {spotlight.rating ?? 4.5}
                    </span>
                    <span className={`pill ${String(spotlight.price).toLowerCase() === 'free' ? 'pill-free' : 'pill-paid'}`}>
                      {spotlight.price || 'Paid'}
                    </span>
                  </div>
                  <span className="spotlight-deco" style={{ background: categoryMeta(spotlight.category).color }} />
                </button>
              ) : (
                <div className="spotlight spotlight-empty">
                  <div className="spotlight-tag">Editor’s choice</div>
                  <div className="skeleton" style={{ height: 52, width: 52, borderRadius: 14 }} />
                  <div className="skeleton" style={{ height: 22, width: '70%', marginTop: 16 }} />
                  <div className="skeleton" style={{ height: 14, width: '100%', marginTop: 12 }} />
                  <div className="skeleton" style={{ height: 14, width: '85%', marginTop: 8 }} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!browsing ? (
        <div className="page">
          {/* Categories */}
          <section className="section categories-section">
            <div className="section-head">
              <div>
                <h2>Browse by category</h2>
                <p className="section-sub">Find the right tool for the task at hand.</p>
              </div>
            </div>
            <div className="category-tiles">
              {BROWSE_CATEGORIES.slice(1).map((cat) => {
                const meta = categoryMeta(cat)
                return (
                  <button key={cat} className="category-tile" onClick={() => setSelectedCategory(cat)}>
                    <span className="category-glyph" style={categoryTint(cat)}>
                      {meta.glyph}
                    </span>
                    <span className="category-tile-name">{cat}</span>
                    <span className="category-tile-count">{categoryCounts[cat] || 0} tools</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Featured */}
          <section className="section">
            <div className="section-head">
              <div>
                <span className="kicker">Curated</span>
                <h2>Featured this week</h2>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  setSortBy('rating')
                  setBrowseAll(true)
                  window.scrollTo({ top: 0 })
                }}
              >
                View all →
              </button>
            </div>
            <div className="grid-cards">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                : featured.map((tool) => (
                    <AICard key={tool.id} tool={tool} onClick={() => onViewTool(tool)} />
                  ))}
              {!loading && featured.length === 0 && <FirstToolEmpty onOpenCreator={onOpenCreator} />}
            </div>
          </section>

          {/* Trending */}
          {(loading || trending.length > 0) && (
            <section className="section">
              <div className="section-head">
                <div>
                  <span className="kicker">Most installed</span>
                  <h2>Trending now</h2>
                </div>
              </div>
              <div className="grid-cards">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                  : trending.map((tool) => (
                      <AICard key={tool.id} tool={tool} onClick={() => onViewTool(tool)} />
                    ))}
              </div>
            </section>
          )}

          {/* New arrivals */}
          {!loading && newArrivals.length > 0 && (
            <section className="section">
              <div className="section-head">
                <div>
                  <span className="kicker">Fresh</span>
                  <h2>New arrivals</h2>
                </div>
              </div>
              <div className="grid-cards">
                {newArrivals.map((tool) => (
                  <AICard key={tool.id} tool={tool} onClick={() => onViewTool(tool)} />
                ))}
              </div>
            </section>
          )}

          {/* Creator CTA */}
          <section className="section">
            <div className="creator-band">
              <div className="creator-band-copy">
                <span className="kicker">For creators</span>
                <h2 className="serif">Built something powerful? Put it in front of the world.</h2>
                <p>
                  Publish your AI tool or agent to AIStore, reach people actively looking for it,
                  and manage everything from one console.
                </p>
              </div>
              <button className="btn btn-accent btn-lg" onClick={onOpenCreator}>
                Become a creator
              </button>
              <span className="creator-band-deco" aria-hidden="true" />
            </div>
          </section>
        </div>
      ) : (
        <section className="page browse">
          <div className="browse-head">
            <div className="browse-title">
              <h1>{selectedCategory === 'All' ? 'All AI tools' : selectedCategory}</h1>
              <p>
                {loading ? 'Loading…' : `${filteredTools.length} ${filteredTools.length === 1 ? 'result' : 'results'}`}
                {searchTerm && !loading ? ` for “${searchTerm}”` : ''}
              </p>
            </div>
            <SearchField />
          </div>

          <div className="browse-toolbar">
            <div className="chip-row">
              {BROWSE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <label className="sort-select">
              <span>Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Most popular</option>
                <option value="rating">Top rated</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </div>

          <div className="grid-cards browse-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            ) : filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <AICard key={tool.id} tool={tool} onClick={() => onViewTool(tool)} />
              ))
            ) : (
              <div className="empty">
                <div className="empty-glyph">🔍</div>
                <h3>No tools match your search</h3>
                <p>Try a different keyword or clear the filters to browse the full catalog.</p>
                <button className="btn btn-ghost" onClick={resetFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="skeleton" style={{ height: 52, width: 52, borderRadius: 14 }} />
      <div className="skeleton" style={{ height: 16, width: '60%', marginTop: 18 }} />
      <div className="skeleton" style={{ height: 12, width: '100%', marginTop: 12 }} />
      <div className="skeleton" style={{ height: 12, width: '80%', marginTop: 8 }} />
      <div className="skeleton" style={{ height: 34, width: '100%', marginTop: 20 }} />
    </div>
  )
}

function FirstToolEmpty({ onOpenCreator }) {
  return (
    <div className="empty">
      <div className="empty-glyph">✨</div>
      <h3>The catalog is just getting started</h3>
      <p>Be one of the first creators to publish an AI tool on AIStore.</p>
      <button className="btn btn-primary" onClick={onOpenCreator}>
        Publish a tool
      </button>
    </div>
  )
}
