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
          Create one listing and we generate platform-ready drafts for Facebook, eBay, OfferUp, Craigslist and Nextdoor. Fix issues in seconds, not hours.
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

  if (loading) return <div style={styles.page}><p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p></div>

  return (
    <div style={styles.page}>
      {listings.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No listings yet</h3>
          <p style={styles.emptySub}>Create your first listing and we'll generate drafts for every platform.</p>
          <button style={styles.newBtn} onClick={() => navigate('/listing/new')}>+ New Listing</button>
        </div>
      ) : (
        <div>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>My Listings</h1>
          </div>
          <div style={styles.listingGrid}>
            {listings.map(l => (
              <div key={l.id} style={styles.listingCard} onClick={() => navigate(`/review/${l.id}`)}>
                <div>
                  <div style={styles.listingTitle}>{l.title}</div>
                  <div style={styles.listingMeta}>${l.price} · {l.condition} · {l.location}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusBadge status={l.status} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 720, margin: '0 auto', padding: '40px 16px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  header: { marginBottom: 20 },
  pageTitle: { color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' },
  emptyIcon: { width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24, maxWidth: 340 },
  newBtn: { background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 28px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  listingGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  listingCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  listingTitle: { color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 4 },
  listingMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
}

export default Home