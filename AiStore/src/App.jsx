import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Marketplace from './pages/Marketplace'
import ToolDetails from './pages/ToolDetails'
import SellerDashboard from './pages/SellerDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('marketplace')
  const [sellerLoggedIn, setSellerLoggedIn] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)

  const handleViewTool = (tool) => {
    setSelectedTool(tool)
    setCurrentPage('tool-details')
    window.scrollTo({ top: 0 })
  }

  const handleBackToMarketplace = () => {
    setSelectedTool(null)
    setCurrentPage('marketplace')
  }

  return (
    <div className="App">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sellerLoggedIn={sellerLoggedIn}
        setSellerLoggedIn={setSellerLoggedIn}
      />

      <main className="app-main">
        {currentPage === 'marketplace' && (
          <Marketplace
            onViewTool={handleViewTool}
            onOpenCreator={() => setCurrentPage('seller')}
          />
        )}
        {currentPage === 'tool-details' && selectedTool && (
          <ToolDetails tool={selectedTool} onBack={handleBackToMarketplace} />
        )}
        {currentPage === 'seller' && sellerLoggedIn && <SellerDashboard />}
        {currentPage === 'seller' && !sellerLoggedIn && (
          <div className="auth-screen">
            <div className="auth-card rise">
              <div className="auth-badge">A</div>
              <h2>Creator sign in</h2>
              <p>
                Access your creator console to publish, manage and track the
                performance of your AI tools on AIStore.
              </p>
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={() => setSellerLoggedIn(true)}
              >
                Continue to console
              </button>
              <p className="auth-note">
                Publishing is free — you keep full ownership of your product.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
