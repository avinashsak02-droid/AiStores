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
      
      {currentPage === 'marketplace' && <Marketplace onViewTool={handleViewTool} />}
      {currentPage === 'tool-details' && selectedTool && (
        <ToolDetails tool={selectedTool} onBack={handleBackToMarketplace} />
      )}
      {currentPage === 'seller' && sellerLoggedIn && <SellerDashboard />}
      {currentPage === 'seller' && !sellerLoggedIn && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Seller Login Required</h2>
          <button onClick={() => setSellerLoggedIn(true)}>Login as Seller</button>
        </div>
      )}
    </div>
  )
}

export default App