import { MoonIcon, SunIcon } from './Icons'
import './Navbar.css'

export default function Navbar({ currentPage, setCurrentPage, user, onLogin, onLogout, theme, onToggleTheme }) {
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
          <button
            className={`navbar-link ${currentPage === 'weekly-report' ? 'active' : ''}`}
            onClick={() => setCurrentPage('weekly-report')}
          >
            WEEKLY AI REPORT
          </button>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          {user ? (
            <>
              <span className="user-name">{user.displayName || user.email}</span>
              <button onClick={handleLogout} className="btn-logout-nav">
                Logout
              </button>
            </>
          ) : (
            <button onClick={onLogin} className="btn-logout-nav">
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}