import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const ALL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook Marketplace', icon: '📘', note: 'Auto-filled via browser extension', oauth: false },
  { id: 'ebay', label: 'eBay', icon: '🛒', note: 'Securely sign in with your eBay account', oauth: true },
  { id: 'offerup', label: 'OfferUp', icon: '🟢', note: 'Auto-filled via browser extension', oauth: false },
  { id: 'craigslist', label: 'Craigslist', icon: '📋', note: 'Auto-filled via browser extension', oauth: false },
  { id: 'nextdoor', label: 'Nextdoor', icon: '🏘️', note: 'Auto-filled via browser extension', oauth: false },
]

const Settings = () => {
  const [connected, setConnected] = useState([])
  const [connecting, setConnecting] = useState(null)
  const [inputs, setInputs] = useState({})
  const [message, setMessage] = useState('')
  const [ebayConnecting, setEbayConnecting] = useState(false)
  const [ebayError, setEbayError] = useState(false)
  const pollRef = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    api.get('/api/ebay-auth/status').then(res => {
      if (res.data.connected) setConnected([{ platform: 'ebay', connected: true }])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const isConnected = (id) => connected.find(p => p.platform === id && p.connected)

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, error: isError })
    setTimeout(() => setMessage(''), 5000)
  }

  const connectEbay = () => {
    setEbayError(false)
    const token = localStorage.getItem('token')
    const url = `${import.meta.env.VITE_API_URL}/api/ebay-auth/connect?token=${token}`

    const width = 600, height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(url, 'ebay_oauth', `width=${width},height=${height},left=${left},top=${top}`)
    popupRef.current = popup
    setEbayConnecting(true)

    pollRef.current = setInterval(() => {
      try {
        if (popup && popup.closed) {
          clearInterval(pollRef.current)
          setEbayConnecting(false)
          return
        }
        const popupUrl = popup.location.href
        if (popupUrl && popupUrl.includes('error=')) {
          // eBay returned an error in the redirect URL
          clearInterval(pollRef.current)
          popup.close()
          setEbayConnecting(false)
          setEbayError(true)
          showMessage('eBay authorization failed — tap "Retry Connect" to try again.', true)
          return
        }
        if (popupUrl && popupUrl.includes('code=')) {
          const urlParams = new URLSearchParams(new URL(popupUrl).search)
          const code = urlParams.get('code')
          if (code) {
            clearInterval(pollRef.current)
            popup.close()
            api.post('/api/ebay-auth/exchange', { code })
              .then(() => {
                setConnected([{ platform: 'ebay', connected: true }])
                setEbayConnecting(false)
                setEbayError(false)
                showMessage('eBay connected successfully!')
              })
              .catch(() => {
                setEbayConnecting(false)
                setEbayError(true)
                showMessage('eBay connection failed — tap "Retry Connect" to try again.', true)
              })
          }
        }
      } catch {
        // Cross-origin — popup still on eBay's domain, keep polling
      }
    }, 500)

    setTimeout(() => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        setEbayConnecting(false)
      }
    }, 180000)
  }

  const saveConnect = async (platformId) => {
    try {
      const res = await api.post('/platforms/connect', {
        platform: platformId,
        username: inputs[platformId] || ''
      })
      setConnected(prev => {
        const existing = prev.findIndex(p => p.platform === platformId)
        if (existing >= 0) { const u = [...prev]; u[existing] = res.data; return u }
        return [...prev, res.data]
      })
      setConnecting(null)
      setInputs(prev => ({ ...prev, [platformId]: '' }))
      showMessage(`${platformId} connected!`)
    } catch {
      showMessage('Failed to save — try again', true)
    }
  }

  const disconnect = async (platformId) => {
    await api.patch(`/platforms/disconnect/${platformId}`)
    setConnected(prev => prev.map(p => p.platform === platformId ? { ...p, connected: false } : p))
  }

  const ebayButtonStyle = () => {
    if (ebayConnecting) return { ...styles.ebayConnectBtn, opacity: 0.6 }
    if (ebayError) return styles.ebayRetryBtn
    return styles.ebayConnectBtn
  }

  const ebayButtonLabel = () => {
    if (ebayConnecting) return '⏳ Connecting...'
    if (ebayError) return '⚠ Retry Connect'
    return '🔒 Sign in with eBay'
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Settings</h1>

      {message && (
        <div style={{ ...styles.messageBanner, ...(message.error ? styles.messageBannerError : {}) }}>
          {message.text}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Connected Platforms</h2>
        <p style={styles.cardSub}>Connect your accounts to enable posting.</p>

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
                </div>
              </div>
              <div style={styles.platformRight}>
                {conn ? (
                  <>
                    <span style={styles.connectedDot}>● Connected</span>
                    <button style={styles.disconnectBtn} onClick={() => disconnect(p.id)}>Disconnect</button>
                  </>
                ) : p.oauth ? (
                  <button
                    style={ebayButtonStyle()}
                    onClick={connectEbay}
                    disabled={ebayConnecting}
                  >
                    {ebayButtonLabel()}
                  </button>
                ) : connecting === p.id ? (
                  <div style={styles.connectForm}>
                    <input
                      style={styles.input}
                      placeholder="Username"
                      value={inputs[p.id] || ''}
                      onChange={e => setInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && saveConnect(p.id)}
                      autoFocus
                    />
                    <button style={styles.saveBtn} onClick={() => saveConnect(p.id)}>Save</button>
                    <button style={styles.cancelBtn} onClick={() => setConnecting(null)}>✕</button>
                  </div>
                ) : (
                  <button style={styles.connectBtn} onClick={() => setConnecting(p.id)}>Connect</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {ebayConnecting && (
        <div style={styles.pollingBanner}>
          <span style={styles.spinner}>⏳</span> Waiting for eBay authorization… Complete sign-in in the popup window.
          <button style={styles.cancelPollBtn} onClick={() => {
            clearInterval(pollRef.current)
            setEbayConnecting(false)
            if (popupRef.current && !popupRef.current.closed) popupRef.current.close()
          }}>Cancel</button>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Browser Extension</h2>
        <p style={styles.cardSub}>Install the HubAds extension to auto-fill Facebook, Craigslist, OfferUp and Nextdoor with one click. Works on Chrome, Edge, Brave, and Firefox.</p>
        <button style={styles.extensionBtn} disabled>Coming Soon — Install Extension</button>
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 680, margin: '0 auto', padding: '40px 16px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  pageTitle: { color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 24 },
  messageBanner: { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16 },
  messageBannerError: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' },
  pollingBanner: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: 'rgba(255,255,255,0.8)', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 },
  spinner: { fontSize: 16 },
  cancelPollBtn: { marginLeft: 'auto', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 6 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 },
  platformRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', gap: 12, flexWrap: 'wrap' },
  platformLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  platformIcon: { fontSize: 24, flexShrink: 0 },
  platformLabel: { color: '#fff', fontWeight: 600, fontSize: 14 },
  platformNote: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  platformRight: { display: 'flex', alignItems: 'center', gap: 8 },
  connectBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  ebayConnectBtn: { background: 'linear-gradient(135deg, #0064D2, #0099E0)', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s' },
  ebayRetryBtn: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', color: '#f87171', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s' },
  disconnectBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  connectedDot: { color: '#22c55e', fontSize: 12 },
  connectForm: { display: 'flex', gap: 6, alignItems: 'center' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', width: 160 },
  saveBtn: { background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  cancelBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', borderRadius: 8, padding: '7px 10px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  extensionBtn: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', borderRadius: 8, padding: '10px 18px', fontSize: 13, cursor: 'not-allowed', fontFamily: 'inherit' },
}

export default Settings