import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import PlatformSelector from '../components/listing/PlatformSelector'
import ItemSpecifics from '../components/listing/ItemSpecifics'

const TITLE_LIMIT = 70 // Craigslist is shortest — enforce across all
const DESC_LIMIT = 4000 // OfferUp is shortest

const CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor']
const CONDITION_LABELS = { new: 'New', like_new: 'Like New', good: 'Good', fair: 'Fair', poor: 'Poor' }

const NewListing = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [defaults, setDefaults] = useState({})

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'good',
    category: '',
    location: '',
    pickup_only: true,
    shipping_policy: '',
  })
  const [platforms, setPlatforms] = useState(['facebook', 'ebay', 'offerup', 'craigslist'])
  const [specifics, setSpecifics] = useState([])

  // Load user defaults
  useEffect(() => {
    api.get('/platforms').then(res => {
      // Could load default location from user_defaults in future
    }).catch(() => {})
  }, [])

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!platforms.length) return setError('Select at least one platform')
    if (!form.title.trim()) return setError('Title is required')
    setLoading(true)
    setError('')
    try {
      const listingRes = await api.post('/listings', { ...form, price: parseFloat(form.price), platforms, specifics })
      const listing = listingRes.data
      // Generate drafts immediately
      await api.post(`/drafts/generate/${listing.id}`)
      navigate(`/review/${listing.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const titleOver = form.title.length > TITLE_LIMIT
  const descOver = form.description.length > DESC_LIMIT

  return (
    <div className="page">
      <h1 className="page-title">New Listing</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Listing Details</h2>
          <div className="form-group">
            <label>Title <span style={{ color: '#999', fontWeight: 400 }}>(max {TITLE_LIMIT} chars — fits all platforms)</span></label>
            <input className="form-control" maxLength={TITLE_LIMIT} placeholder="e.g. 2018 Ford F150 XLT — great condition"
              value={form.title} onChange={e => set('title', e.target.value)} required />
            <div className={`char-counter ${titleOver ? 'over' : ''}`}>{form.title.length}/{TITLE_LIMIT}</div>
          </div>

          <div className="form-group">
            <label>Description <span style={{ color: '#999', fontWeight: 400 }}>(max {DESC_LIMIT} chars)</span></label>
            <textarea className="form-control" rows={5} maxLength={DESC_LIMIT}
              placeholder="Describe your item — condition details, history, what's included..."
              value={form.description} onChange={e => set('description', e.target.value)} />
            <div className={`char-counter ${descOver ? 'over' : ''}`}>{form.description.length}/{DESC_LIMIT}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Price ($)</label>
              <input className="form-control" type="number" min="0" step="0.01" placeholder="0.00"
                value={form.price} onChange={e => set('price', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select className="form-control" value={form.condition} onChange={e => set('condition', e.target.value)}>
                {CONDITIONS.map(c => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input className="form-control" placeholder="e.g. Vehicles, Electronics, Furniture"
              value={form.category} onChange={e => set('category', e.target.value)} />
          </div>
        </div>

        {/* Location & Shipping */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Location & Shipping</h2>
          <div className="form-group">
            <label>Location</label>
            <input className="form-control" placeholder="e.g. Tulsa, OK"
              value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.pickup_only} onChange={e => set('pickup_only', e.target.checked)} />
              Local pickup only
            </label>
          </div>
          {!form.pickup_only && (
            <div className="form-group">
              <label>Shipping Policy</label>
              <input className="form-control" placeholder="e.g. Buyer pays shipping via USPS"
                value={form.shipping_policy} onChange={e => set('shipping_policy', e.target.value)} />
            </div>
          )}
        </div>

        {/* Item Specifics */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Item Details</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>Add specifics like color, size, model, storage, etc.</p>
          <ItemSpecifics specifics={specifics} onChange={setSpecifics} />
        </div>

        {/* Platform Selection */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Post To</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>Select which platforms to list on</p>
          <PlatformSelector selected={platforms} onChange={setPlatforms} />
        </div>

        <button className="btn btn-primary btn-full" type="submit" disabled={loading || !platforms.length}>
          {loading ? 'Creating drafts...' : `Generate Drafts for ${platforms.length} Platform${platforms.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  )
}

export default NewListing
