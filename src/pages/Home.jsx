import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import StatusBadge from '../components/dashboard/StatusBadge'

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    api.get('/listings').then(res => setListings(res.data)).finally(() => setLoading(false))
  }, [])

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, color: '#fff', letterSpacing: '-0.5px' }}>Post once. Sell everywhere.</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Create one listing and we generate platform-ready drafts for Facebook, eBay, OfferUp, and Craigslist. Fix issues in seconds, not hours.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/register">
            <button style={{ padding: '14px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Get Started Free
            </button>
          </Link>
          <Link to="/login">
            <button style={{ padding: '14px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Sign In
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) return <div className="page"><p>Loading...</p></div>

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Listings</h1>
        <button className="btn btn-primary" onClick={() => navigate('/listing/new')}>+ New Listing</button>
      </div>
      {listings.length === 0 ? (
        <div className="empty-state">
          <h3>No listings yet</h3>
          <p>Create your first listing and we'll generate drafts for every platform.</p>
          <button className="btn btn-primary" onClick={() => navigate('/listing/new')}>Create Listing</button>
        </div>
      ) : (
        <div className="listing-grid">
          {listings.map(l => (
            <div key={l.id} className="listing-card" onClick={() => navigate(`/review/${l.id}`)}>
              <div>
                <div className="listing-card-title">{l.title}</div>
                <div className="listing-card-meta">${l.price} · {l.condition} · {l.location}</div>
              </div>
              <div className="listing-card-right">
                <StatusBadge status={l.status} />
                <span style={{ color: '#999', fontSize: 18 }}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home