import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import './App.css'
import Navbar from './components/Navbar'
import Marketplace from './pages/Marketplace'
import ToolDetails from './pages/ToolDetails'
import SellerDashboard from './pages/SellerDashboard'
import { addSeedDataToFirebase } from './utils/addSeedData'


function App() {
  const [currentPage, setCurrentPage] = useState('marketplace')
  const [selectedTool, setSelectedTool] = useState(null)
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [])

  const handleViewTool = (tool) => {
    setSelectedTool(tool)
    setCurrentPage('tool-details')
  }

  const handleBackToMarketplace = () => {
    setSelectedTool(null)
    setCurrentPage('marketplace')
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setCurrentPage('marketplace')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loadingAuth) {
    return <div className="app-loading">Loading…</div>
  }

  return (
    <div className="App">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />

      {currentPage === 'marketplace' && (
        <Marketplace
          onViewTool={handleViewTool}
          onOpenCreatorHub={() => setCurrentPage('seller')}
        />
      )}

{currentPage === 'tool-details' && selectedTool && (
  <ToolDetails 
    tool={selectedTool} 
    onBack={handleBackToMarketplace}
    onViewTool={handleViewTool}
  />
)}

      {currentPage === 'seller' && <SellerDashboard user={user} />}
    </div>
  )
}

export default App