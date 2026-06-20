import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Navbar from './components/shared/Navbar'
import SplashScreen from './components/shared/SplashScreen'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewListing from './pages/NewListing'
import ReviewPage from './pages/ReviewPage'
import Settings from './pages/Settings'
import AuthCallback from './pages/AuthCallback'
import EbayCallback from './pages/EbayCallback'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && !user) localStorage.removeItem('token')
  }, [])

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/ebay-callback" element={<EbayCallback />} />
          <Route path="/listing/new" element={<ProtectedRoute><NewListing /></ProtectedRoute>} />
          <Route path="/review/:listingId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App