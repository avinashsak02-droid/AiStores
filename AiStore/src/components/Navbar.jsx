import './Navbar.css'

export default function Navbar({ currentPage, setCurrentPage, sellerLoggedIn, setSellerLoggedIn }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => setCurrentPage('marketplace')}>
          <span className="logo-icon">✨</span>
          <span className="logo-text">AI Store</span>
        </div>
        
        <ul className="nav-menu">
          <li>
            <button 
              className={`nav-btn ${currentPage === 'marketplace' ? 'active' : ''}`} 
              onClick={() => setCurrentPage('marketplace')}
            >
              Browse
            </button>
          </li>
          <li>
            <button 
              className={`nav-btn ${currentPage === 'seller' ? 'active' : ''}`} 
              onClick={() => setCurrentPage('seller')}
            >
              {sellerLoggedIn ? 'Creator Hub' : 'Become Creator'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}