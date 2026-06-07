import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import StatusBadge from '../components/dashboard/StatusBadge'

const PLATFORM_LABELS = { facebook: 'Facebook Marketplace', ebay: 'eBay', offerup: 'OfferUp', craigslist: 'Craigslist' }

const ReviewPage = () => {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fixing, setFixing] = useState({}) // draftId -> field being fixed
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    Promise.all([
      api.get(`/listings/${listingId}`),
      api.get(`/drafts/${listingId}`)
    ]).then(([lRes, dRes]) => {
      setListing(lRes.data)
      setDrafts(dRes.data)
    }).finally(() => setLoading(false))
  }, [listingId])

  const regenerate = async () => {
    setLoading(true)
    const res = await api.post(`/drafts/generate/${listingId}`)
    setDrafts(res.data)
    setLoading(false)
  }

  const fixTitle = async (draft) => {
    setFixing(f => ({ ...f, [draft.id]: 'title' }))
    try {
      const res = await api.post(`/ai/shorten-title/${draft.id}`)
      setDrafts(drafts.map(d => d.id === draft.id ? { ...d, title: res.data.title } : d))
    } finally {
      setFixing(f => ({ ...f, [draft.id]: null }))
    }
  }

  const fixDescription = async (draft) => {
    setFixing(f => ({ ...f, [draft.id]: 'description' }))
    try {
      const res = await api.post(`/ai/rewrite-description/${draft.id}`)
      setDrafts(drafts.map(d => d.id === draft.id ? { ...d, description: res.data.description } : d))
    } finally {
      setFixing(f => ({ ...f, [draft.id]: null }))
    }
  }

  const markReady = async (draft) => {
    const res = await api.put(`/drafts/${draft.id}`, { ...draft, status: 'ready' })
    setDrafts(drafts.map(d => d.id === draft.id ? res.data : d))
  }

  const markPublished = async (draft) => {
    const res = await api.put(`/drafts/${draft.id}`, { ...draft, status: 'published' })
    setDrafts(drafts.map(d => d.id === draft.id ? res.data : d))
  }

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  if (loading) return <div className="page"><p>Loading drafts...</p></div>
  if (!listing) return <div className="page"><p>Listing not found.</p></div>

  const readyCount = drafts.filter(d => d.status === 'ready' || d.status === 'published').length
  const issueCount = drafts.filter(d => d.status === 'needs_attention').length

  return (
    <div className="page">
      {/* Header */}
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: 12, fontSize: 14 }}>← Back</button>
      <h1 className="page-title" style={{ marginBottom: 4 }}>{listing.title}</h1>
      <p style={{ color: '#777', fontSize: 14, marginBottom: 20 }}>${listing.price} · {listing.condition} · {listing.location}</p>

      {/* Summary bar */}
      <div className="card" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div><span style={{ fontSize: 24, fontWeight: 800, color: '#16a34a' }}>{readyCount}</span><span style={{ fontSize: 13, color: '#777', marginLeft: 6 }}>ready</span></div>
        <div><span style={{ fontSize: 24, fontWeight: 800, color: '#ca8a04' }}>{issueCount}</span><span style={{ fontSize: 13, color: '#777', marginLeft: 6 }}>need attention</span></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={regenerate}>Regenerate All</button>
        </div>
      </div>

      {/* Platform drafts */}
      {drafts.map(draft => {
        const issues = Array.isArray(draft.issues) ? draft.issues : JSON.parse(draft.issues || '[]')
        const isExpanded = expanded[draft.id]

        return (
          <div key={draft.id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: issues.length > 0 ? 12 : 0 }}>
              <div className="platform-header" style={{ margin: 0 }}>
                {PLATFORM_LABELS[draft.platform] || draft.platform}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <StatusBadge status={draft.status} />
                {draft.status === 'ready' && (
                  <button className="btn btn-success btn-sm" onClick={() => markPublished(draft)}>Mark Published</button>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => toggleExpand(draft.id)}>
                  {isExpanded ? 'Hide' : 'Preview'}
                </button>
              </div>
            </div>

            {/* Issues */}
            {issues.map((issue, i) => (
              <div key={i} className="issue-card">
                <span className="issue-label">⚠ {issue.message}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {issue.type === 'title_too_long' && (
                    <button className="btn btn-primary btn-sm" disabled={fixing[draft.id] === 'title'} onClick={() => fixTitle(draft)}>
                      {fixing[draft.id] === 'title' ? 'Fixing...' : 'AI Shorten'}
                    </button>
                  )}
                  {issue.type === 'description_too_long' && (
                    <button className="btn btn-primary btn-sm" disabled={fixing[draft.id] === 'description'} onClick={() => fixDescription(draft)}>
                      {fixing[draft.id] === 'description' ? 'Fixing...' : 'AI Rewrite'}
                    </button>
                  )}
                  {(issue.type === 'missing_category') && (
                    <button className="btn btn-secondary btn-sm" onClick={() => markReady(draft)}>Confirm Anyway</button>
                  )}
                </div>
              </div>
            ))}

            {/* Expanded preview */}
            {isExpanded && (
              <div style={{ marginTop: 12, padding: 14, background: '#f9f9f9', borderRadius: 8, fontSize: 13 }}>
                <p><strong>Title:</strong> {draft.title}</p>
                <p style={{ marginTop: 8 }}><strong>Condition:</strong> {draft.condition}</p>
                <p style={{ marginTop: 8 }}><strong>Category:</strong> {draft.category || '—'}</p>
                <p style={{ marginTop: 8 }}><strong>Description:</strong></p>
                <p style={{ marginTop: 4, color: '#555', whiteSpace: 'pre-wrap' }}>{draft.description}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ReviewPage
