import { useState } from 'react'
import CoverArt from './CoverArt'
import { ArrowRight } from './Icons'
import { getCreator, getPrice, isFree } from '../utils/tool'
import './AICard.css'

// One numbered row in the Marketplace index.
// Marketplace renders these inside a <ul>, so each row is an <li>.
export default function AICard({ tool, index, onClick }) {
  // Remember which logo URL failed to load, so we can show cover art instead.
  const [failedLogo, setFailedLogo] = useState(null)
  const showLogo = tool.logo && tool.logo !== failedLogo

  return (
    <li className="tool-row">
      <button type="button" className="tool-row-btn" onClick={onClick}>
        <span className="tool-row-index">{String(index + 1).padStart(2, '0')}</span>

        <span className="tool-row-thumb">
          {showLogo ? (
            <img
              src={tool.logo}
              alt=""
              className="tool-row-logo"
              loading="lazy"
              onError={() => setFailedLogo(tool.logo)}
            />
          ) : (
            <CoverArt seed={tool.id || tool.name} showIcon={false} />
          )}
        </span>

        <span className="tool-row-body">
          <span className="tool-row-meta">
            <span className="tool-row-cat">{tool.category || 'Other'}</span>
            {' / '}By {getCreator(tool)}
          </span>
          <span className="tool-row-title">{tool.name}</span>
          <span className="tool-row-desc">{tool.description}</span>
        </span>

        <span className="tool-row-side">
          <span className={`tool-row-price ${isFree(tool) ? 'is-free' : ''}`}>
            {getPrice(tool)}
          </span>
          <ArrowRight />
        </span>
      </button>
    </li>
  )
}