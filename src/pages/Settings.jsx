import { useState, useEffect } from 'react'
import api from '../services/api'

const ALL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook Marketplace', icon: '📘', note: 'Auto-filled via Chrome extension' },
  { id: 'ebay', label: 'eBay', icon: '🛒', note: 'Direct API posting — connect your account' },
  { id: 'offerup', label: 'OfferUp', icon: '🟢', note: 'Auto-filled via Chrome extension' },
  { id: 'craigslist', label: 'Craigslist', icon: '📋', note: 'Auto-filled via Chrome extension' },
  { id: 'nextdoor', label: 'Nextdoor', icon: '🏘️', note: 'Auto-filled via Chrome extension' },
]

const Settings = () => {
  const [connected, setConnected] = useState([])
  const [connecting, setConnecting] = useState(null)
  const [form, setForm] = useState({ username: '' })
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/platforms').then(res => setConnected(res.data)).catch(() => {})
  }, [])

  const isConnected = (id) => connected.find(p => p.platform === id && p.connected)

  const saveConnect = async (platformId) => {
    try {
      const res = await api.post('/platforms/connect', { platform: platformId, username: form.username })
      setConnected(prev => {
        const existing = prev.findIndex(p => p.platform === platformId)
        if (existing >= 0) { const u = [...prev]; u[existing] = res.data; return u }
        return [...prev, res.data]
      })
      setConnecting(null)
      setForm({ username: '' })
      setSuccess(`${platformId} connected!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch {}
  }

  const disconnect = async (platformId) => {
    await api.patch(`/platforms/disconnect/${platformId}`)
    setConnected(prev => prev.map(p => p.platform === platformId ? { ...p, connected: false } : p))
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Settings</h1>

      {success && (
        <div style={styles.successBanner}>{success}</div>
      )}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Connected Platforms</h2>
        <p style={styles.cardSub}>Connect your accounts to enable posting. Extension platforms auto-fill when you visit the site.</p>

        {ALL_PLATFORMS.map((p, i) => {
          const conn = isConnected(p.id)
          const isLast = i === ALL_PLATFORMS.length - 1

          return (
            <div key={p.id} style={{ ...styles.platformRow, borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
              <div style={styles.platformLeft}>
                <span style={styles.platformIcon}>{p.icon}</span>
                <div>
                  <div style={styles.platformLabel}>{p.label}</div>
                  <div style={styles.platformNote}>{p.note}</div>
                  {conn?.username && <div style={styles.platformConnected}>@{conn.username}</div>}
                </div>
              </div>

              <div style={styles.platformRight}>
                {conn ? (
                  <button style={styles.disconnectBtn} onClick={() => disconnect(p.id)}>Disconnect</button>
                ) : connecting === p.id ? (
                  <div style={styles.connectForm}>
                    <input
                      style={styles.input}
                      placeholder="Username"
                      value={form.username}
                      onChange={e => setForm({ username: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && saveConnect(p.id)}
                      autoFocus
                    />
                    <button style={styles.saveBtn} onClick={() => saveConnect(p.id)}>Save</button>
                    <button style={styles.cancelBtn} onClick={() => setConnecting(null)}>✕</button>
                  </div>
                ) : (
                  <button style={styles.connectBtn} onClick={() => setConnecting(p.id)}>
                    {p.id === 'ebay' ? 'Connect eBay' : 'Connect'}
                  </button>
                )}
                {conn && <span style={styles.connectedDot}>● Connected</span>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Chrome Extension</h2>
        <p style={styles.cardSub}>Install the HubAds extension to auto-fill Facebook, Craigslist, OfferUp and Nextdoor listings with one click.</p>
        <button style={styles.extensionBtn} disabled>
          Coming Soon — Install Extension
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 680, margin: '0 auto', padding: '40px 16px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  pageTitle: { color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 24 },
  successBanner: { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16 },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 6 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 },
  platformRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', gap: 12, flexWrap: 'wrap' },
  platformLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  platformIcon: { fontSize: 24, flexShrink: 0 },
  platformLabel: { color: '#fff', fontWeight: 600, fontSize: 14 },
  platformNote: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  platformConnected: { color: '#a78bfa', fontSize: 12, marginTop: 2 },
  platformRight: { display: 'flex', alignItems: 'center', gap: 8 },
  connectBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  disconnectBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  connectedDot: { color: '#22c55e', fontSize: 12 },
  connectForm: { display: 'flex', gap: 6, alignItems: 'center' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', width: 140 },
  saveBtn: { background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  cancelBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 16, cursor: 'pointer', padding: '4px 8px' },
  extensionBtn: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', borderRadius: 10, padding: '12px 20px', fontSize: 14, cursor: 'not-allowed', fontFamily: 'inherit', width: '100%' },
}

export default Settings