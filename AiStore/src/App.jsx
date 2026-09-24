import { useState, useEffect } from 'react'
import { auth, googleProvider } from './firebase'
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth'
import './App.css'
import Navbar from './components/Navbar'
import Marketplace from './pages/Marketplace'
import ToolDetails from './pages/ToolDetails'
import SellerDashboard from './pages/SellerDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('marketplace')
  const [selectedTool, setSelectedTool] = useState(null)
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

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
    window.scrollTo(0, 0)
  }

  const handleBackToMarketplace = () => {
    setSelectedTool(null)
    setCurrentPage('marketplace')
    window.scrollTo(0, 0)
  }

  const handleOpenCreatorHub = () => {
    setCurrentPage('seller')
    window.scrollTo(0, 0)
  }
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      // Closing the popup is not a real error, so don't show an alert for it
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        return
      }
      console.error('Sign-in error:', error)
      alert('Sign-in failed. Please try again.')
    }
  }
  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setCurrentPage('marketplace')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loadingAuth) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div className="App">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {currentPage === 'marketplace' && (
        <Marketplace
          onViewTool={handleViewTool}
          onOpenCreatorHub={handleOpenCreatorHub}
        />
      )}

      {currentPage === 'tool-details' && selectedTool && (
        <ToolDetails
          tool={selectedTool}
          onBack={handleBackToMarketplace}
          onViewTool={handleViewTool}
          user={user}
        />
      )}

      {currentPage === 'seller' && (
        <SellerDashboard
          user={user}
          setUser={setUser}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  )
}

export default App