import { useEffect, useMemo, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import CoverArt from '../components/CoverArt'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '../components/Icons'
import { getCreator, getPrice } from '../utils/tool'
import './ToolDetails.css'

// "https://www.elevenlabs.io/app" -> "elevenlabs.io"
function getHost(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, '')
  } catch {
    return link || '-'
  }
}

function NumberedList({ title, items }) {
  return (
    <div className="td-list">
      <h2>{title}</h2>
      <ol>
        {items.map((item, i) => (
          <li key={i + '-' + String(item)}>
            <span className="td-list-index">{String(i + 1).padStart(2, '0')}</span>
            <span>{String(item)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function ToolDetails({ tool, onBack, onViewTool }) {
  const [allTools, setAllTools] = useState([])

  // Always start at the top when a product page opens
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [tool.id])

  // Load all tools once so we can suggest related ones
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'tools'),
      (snapshot) => setAllTools(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (error) => console.error('Could not load related tools:', error)
    )
    return () => unsubscribe()
  }, [])

  // Same category first, then anything else. Max 3.
  const related = useMemo(() => {
    const others = allTools.filter((t) => t.id !== tool.id)
    const sameCategory = others.filter((t) => t.category === tool.category)
    const rest = others.filter((t) => t.category !== tool.category)
    return [...sameCategory, ...rest].slice(0, 3)
  }, [allTools, tool.id, tool.category])

  // Optional fields - shown only if a product has them
  const useCases = Array.isArray(tool.useCases) ? tool.useCases : []
  const features = Array.isArray(tool.features) ? tool.features : []

  const rating = tool.rating || 4.5
  const users = (tool.downloads || 0).toLocaleString()

  // Shared settings for every "open the product" link (opens in a new tab)
  const launchProps = {
    href: tool.link,
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  return (
    <main className="td">
      <div className="container td-top">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onBack}>
          <ArrowLeft /> Back to catalog
        </button>
      </div>

      {/* ---------- Hero ---------- */}
      <header className="container td-hero">
        <div>
          <p className="eyebrow reveal">
            <span className="accent">Product deep-dive</span> / {tool.category}
          </p>
          <h1 className="td-title reveal" style={{ '--d': 1 }}>
            {tool.name}
          </h1>
        </div>

        <div className="td-hero-side reveal" style={{ '--d': 2 }}>
          {tool.description && <p className="td-tagline">{tool.description}</p>}
          <a className="btn btn--block" {...launchProps}>
            Launch / Use product <ArrowUpRight />
          </a>
        </div>
      </header>

      {/* ---------- Cover + facts ---------- */}
      <section className="container td-stage">
        <div className="td-cover-wrap">
          <CoverArt
            className="td-cover"
            seed={tool.id || tool.name}
            icon={tool.icon}
            image={tool.image}
          />
        </div>

        <aside className="td-aside">
          <dl className="td-meta">
            <div>
              <dt>Category</dt>
              <dd>{tool.category}</dd>
            </div>
            <div>
              <dt>Creator</dt>
              <dd>{getCreator(tool)}</dd>
            </div>
            <div>
              <dt>Pricing</dt>
              <dd>{getPrice(tool)}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>★ {rating}</dd>
            </div>
            <div>
              <dt>Users</dt>
              <dd>{users}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>{getHost(tool.link)}</dd>
            </div>
          </dl>

          {tool.overview && (
            <div className="td-overview">
              <p className="eyebrow accent">Overview</p>
              <p className="td-overview-text">{tool.overview}</p>
            </div>
          )}
        </aside>
      </section>

      {/* ---------- Official link ---------- */}
      <section className="container td-access">
        <div className="td-access-info">
          <p className="eyebrow">Official URL</p>
          <a className="td-url" {...launchProps}>
            {tool.link}
          </a>
        </div>
        <a className="btn" {...launchProps}>
          Launch product <ArrowUpRight />
        </a>
      </section>

      {/* ---------- Use cases + features (only if the product has them) ---------- */}
      {(useCases.length > 0 || features.length > 0) && (
        <section className="container td-lists">
          {useCases.length > 0 && <NumberedList title="Use cases" items={useCases} />}
          {features.length > 0 && <NumberedList title="Features" items={features} />}
        </section>
      )}

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="container td-related">
          <p className="eyebrow accent">Continue exploring</p>
          <h2>Related AI tools</h2>
          <ul>
            {related.map((item, i) => (
              <li key={item.id}>
                <button type="button" className="td-related-row" onClick={() => onViewTool(item)}>
                  <span className="td-related-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="td-related-name">{item.name}</span>
                  <span className="td-related-cat">{item.category}</span>
                  <ArrowRight />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}