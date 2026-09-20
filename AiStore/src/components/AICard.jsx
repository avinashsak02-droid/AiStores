import CoverArt from './CoverArt'
import { ArrowRight } from './Icons'
import { getCreator, getPrice, isFree } from '../utils/tool'
import './AICard.css'

// One row of the "Marketplace index"
export default function AICard({ tool, index, onClick }) {
  const free = isFree(tool)

  return (
    <li
      className="tool-row reveal"
      style={{ '--d': Math.min(index, 8) }}
      onClick={onClick}
    >
      <span className="tool-row-index">{String(index + 1).padStart(2, '0')}</span>

      <CoverArt
        className="tool-row-thumb"
        seed={tool.id || tool.name}
        image={tool.image}
        showIcon={false}
      />

      <div className="tool-row-main">
        <h3 className="tool-row-title">{tool.name}</h3>
        <p className="tool-row-desc">{tool.description}</p>
      </div>

      <span className="tool-row-category">{tool.category}</span>

      <div className="tool-row-meta">
        <span className="tool-row-creator">{getCreator(tool)}</span>
        <span className={`tool-row-price ${free ? 'is-free' : ''}`}>{getPrice(tool)}</span>
      </div>

      <div className="tool-row-action">
        {/* No onClick needed: the click bubbles up to the row */}
        <button type="button" className="btn btn--ghost btn--sm">
          Explore <ArrowRight />
        </button>
      </div>
    </li>
  )
}