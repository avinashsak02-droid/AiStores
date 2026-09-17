import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar({ currentPage, setCurrentPage, sellerLoggedIn, setSellerLoggedIn }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const go = (page) => {
    setCurrentPage(page)
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }

  const browsing = currentPage === 'marketplace' || currentPage === 'tool-details'

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner page">
        <button className="brand" onClick={() => go('marketplace')} aria-label="AIStore home">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span className="brand-name">
            AI<span>Store</span>
          </span>
        </button>

        <nav className="nav-links" aria-label="Primary">
          <button className={`nav-link ${browsing ? 'active' : ''}`} onClick={() => go('marketplace')}>
            Discover
          </button>
          <button className={`nav-link ${currentPage === 'seller' ? 'active' : ''}`} onClick={() => go('seller')}>
            For creators
          </button>
        </nav>

        <div className="nav-actions">
          {sellerLoggedIn && currentPage !== 'seller' && (
            <button className="nav-link hide-sm" onClick={() => go('seller')}>
              Console
            </button>
          )}
          <button
            className="btn btn-primary nav-cta"
            onClick={() => {
              if (!sellerLoggedIn) setSellerLoggedIn(true)
              go('seller')
            }}
          >
            {sellerLoggedIn ? 'Creator console' : 'Publish a tool'}
          </button>

          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-sheet ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-panel" onClick={(e) => e.stopPropagation()}>
          <button className={`mobile-item ${browsing ? 'active' : ''}`} onClick={() => go('marketplace')}>
            Discover
          </button>
          <button className={`mobile-item ${currentPage === 'seller' ? 'active' : ''}`} onClick={() => go('seller')}>
            For creators
          </button>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={() => {
              if (!sellerLoggedIn) setSellerLoggedIn(true)
              go('seller')
            }}
          >
            {sellerLoggedIn ? 'Open creator console' : 'Publish a tool'}
          </button>
        </div>
      </div>
    </header>
  )
}
