import './Navbar.css'

export default function Navbar({ currentPage, setCurrentPage, user, onLogout }) {
  const handleLogout = async () => {
    await onLogout()
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div 
          className="navbar-logo"
          onClick={() => setCurrentPage('marketplace')}
        >
          <span className="logo-text">AIStore</span>
          <span className="logo-tagline">Discovery Platform</span>
        </div>

        <div className="navbar-divider"></div>

        <ul className="navbar-menu">
          <li>
            <button
              className={`navbar-link ${currentPage === 'marketplace' ? 'active' : ''}`}
              onClick={() => setCurrentPage('marketplace')}
            >
              Marketplace
            </button>
          </li>
          <li>
            <button
              className={`navbar-link ${currentPage === 'seller' ? 'active' : ''}`}
              onClick={() => setCurrentPage('seller')}
            >
              {user ? 'Creator Hub' : 'For Creators'}
            </button>
          </li>
        </ul>

        {user && (
          <div className="navbar-auth">
            <span className="navbar-user">{user.displayName || user.email}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}