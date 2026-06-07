import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Navbar from './components/shared/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewListing from './pages/NewListing'
import ReviewPage from './pages/ReviewPage'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/new" element={<ProtectedRoute><NewListing /></ProtectedRoute>} />
        <Route path="/review/:listingId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
