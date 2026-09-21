import './Navbar.css'

export default function Navbar({ currentPage, setCurrentPage, user, onLogout }) {
  const handleLogout = () => {
    onLogout()
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div 
          className="navbar-logo"
          onClick={() => setCurrentPage('marketplace')}
        >
          <span className="logo-text">AIStore</span>
          <span className="logo-tagline">DISCOVERY PLATFORM</span>
        </div>

        <div className="navbar-divider"></div>

        <div className="navbar-center">
          <button
            className={`navbar-link ${currentPage === 'marketplace' ? 'active' : ''}`}
            onClick={() => setCurrentPage('marketplace')}
          >
            MARKETPLACE
          </button>
          <button
            className={`navbar-link ${currentPage === 'seller' ? 'active' : ''}`}
            onClick={() => setCurrentPage('seller')}
          >
            FOR CREATORS
          </button>
        </div>

        <div className="navbar-right">
          {user && (
            <>
              <span className="user-name">{user.displayName || user.email}</span>
              <button onClick={handleLogout} className="btn-logout-nav">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}