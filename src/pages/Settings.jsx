import { useState, useEffect } from 'react'
import api from '../services/api'

const ALL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook Marketplace' },
  { id: 'ebay', label: 'eBay' },
  { id: 'offerup', label: 'OfferUp' },
  { id: 'craigslist', label: 'Craigslist' },
]

const Settings = () => {
  const [connected, setConnected] = useState([])
  const [connecting, setConnecting] = useState(null)
  const [form, setForm] = useState({ username: '' })
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/platforms').then(res => setConnected(res.data))
  }, [])

  const isConnected = (id) => connected.find(p => p.platform === id && p.connected)

  const connect = async (platformId) => {
    setConnecting(platformId)
    setSuccess('')
  }

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
    } catch {}
  }

  const disconnect = async (platformId) => {
    await api.patch(`/platforms/disconnect/${platformId}`)
    setConnected(prev => prev.map(p => p.platform === platformId ? { ...p, connected: false } : p))
  }

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Connected Platforms</h2>
        {ALL_PLATFORMS.map(p => {
          const conn = isConnected(p.id)
          return (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{p.label}</div>
                {conn && <div style={{ fontSize: 12, color: '#777' }}>@{conn.username}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {conn ? (
                  <button className="btn btn-danger btn-sm" onClick={() => disconnect(p.id)}>Disconnect</button>
                ) : connecting === p.id ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="form-control" style={{ width: 160 }} placeholder="Username"
                      value={form.username} onChange={e => setForm({ username: e.target.value })} />
                    <button className="btn btn-primary btn-sm" onClick={() => saveConnect(p.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setConnecting(null)}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => connect(p.id)}>Connect</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Settings
