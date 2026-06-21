import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const ALL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook Marketplace', icon: '📘', loginUrl: 'https://www.facebook.com/login/?next=%2Fmarketplace%2Fcreate%2Fitem&login_attempt=1' },
  { id: 'ebay', label: 'eBay', icon: '🛒', loginUrl: null, oauth: true },
  { id: 'offerup', label: 'OfferUp', icon: '🟢', loginUrl: 'https://offerup.com/login' },
  { id: 'craigslist', label: 'Craigslist', icon: '📋', loginUrl: 'https://accounts.craigslist.org/login' },
  { id: 'nextdoor', label: 'Nextdoor', icon: '🏘️', loginUrl: 'https://nextdoor.com/login' },
]

const PLATFORM_NOTES = {
  facebook: 'Sign in to your Facebook account to enable posting',
  ebay: 'Securely sign in with your eBay account',
  offerup: 'Sign in to your OfferUp account to enable posting',
  craigslist: 'Sign in to your Craigslist account to enable posting',
  nextdoor: 'Sign in to your Nextdoor account to enable posting',
}

const Settings = () => {
  const [connected, setConnected] = useState({})
  const [message, setMessage] = useState('')
  const [ebayConnecting, setEbayConnecting] = useState(false)
  const [ebayError, setEbayError] = useState(false)
  const [extensionInstalled, setExtensionInstalled] = useState(false)
  const pollRef = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    // Check if extension is installed
    const handler = () => setExtensionInstalled(true)
    window.addEventListener('hubads-extension-ready', handler)

    // Check eBay connection status
    api.get('/api/ebay-auth/status').then(res => {
      if (res.data.connected) {
        setConnected(prev => ({ ...prev, ebay: true }))
      }
    }).catch(() => {})

    // Check other platform login status via extension
    if (extensionInstalled) {
      ALL_PLATFORMS.filter(p => !p.oauth).forEach(p => {
        window.dispatchEvent(new CustomEvent('hubads-check-login', { detail: { platform: p.id } }))
      })
    }

    // Listen for login status responses from extension
    const loginHandler = (e) => {
      const { platform, loggedIn } = e.detail
      if (loggedIn) setConnected(prev => ({ ...prev, [platform]: true }))
    }
    window.addEventListener('hubads-login-status', loginHandler)

    // Also listen for real-time login status updates from extension
    const extMsgHandler = (e) => {
      const msg = e.detail
      if (msg.type === 'LOGIN_STATUS_UPDATE' && msg.loggedIn) {
        setConnected(prev => ({ ...prev, [msg.platform]: true }))
      }
    }
    window.addEventListener('hubads-extension-message', extMsgHandler)

    return () => {
      window.removeEventListener('hubads-extension-ready', handler)
      window.removeEventListener('hubads-login-status', loginHandler)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [extensionInstalled])

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, error: isError })
    setTimeout(() => setMessage(''), 5000)
  }

  const connectPlatform = (platform) => {
    if (!extensionInstalled) {
      showMessage('Please install the HubAds extension first to connect platforms.', true)
      return
    }
    const p = ALL_PLATFORMS.find(p => p.id === platform)
    if (!p?.loginUrl) return

    const width = 500, height = 650
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(p.loginUrl, `${platform}_login`, `width=${width},height=${height},left=${left},top=${top}`)
    popupRef.current = popup

    // Poll for login completion via extension
    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll)
        // Re-check login status after popup closes
        window.dispatchEvent(new CustomEvent('hubads-check-login', { detail: { platform } }))
        return
      }
    }, 500)
  }

  const disconnectPlatform = async (platformId) => {
    if (platformId === 'ebay') {
      try {
        await api.patch(`/api/platforms/disconnect/${platformId}`)
        setConnected(prev => ({ ...prev, ebay: false }))
      } catch {
        showMessage('Failed to disconnect eBay', true)
      }
    } else {
      // For extension platforms just mark as disconnected locally
      setConnected(prev => ({ ...prev, [platformId]: false }))
      showMessage(`Disconnected from ${platformId}. You may also want to log out on the platform directly.`)
    }
  }

  // eBay OAuth flow
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
          clearInterval(pollRef.current)
          popup.close()
          setEbayConnecting(false)
          setEbayError(true)
          showMessage('eBay authorization failed — tap "Retry Connect" to try again.', true)
          return
        }
        if (popupUrl && popupUrl.includes('success=true')) {
          clearInterval(pollRef.current)
          popup.close()
          setConnected(prev => ({ ...prev, ebay: true }))
          setEbayConnecting(false)
          setEbayError(false)
          showMessage('eBay connected successfully!')
        }
      } catch { }
    }, 500)

    setTimeout(() => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        setEbayConnecting(false)
      }
    }, 180000)
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
        <p style={styles.cardSub}>Connect your accounts to enable posting across platforms.</p>

        {ALL_PLATFORMS.map((p, i) => {
          const isConn = connected[p.id]
          const isLast = i === ALL_PLATFORMS.length - 1
          return (
            <div key={p.id} style={{ ...styles.platformRow, borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
              <div style={styles.platformLeft}>
                <span style={styles.platformIcon}>{p.icon}</span>
                <div>
                  <div style={styles.platformLabel}>{p.label}</div>
                  <div style={styles.platformNote}>{PLATFORM_NOTES[p.id]}</div>
                </div>
              </div>
              <div style={styles.platformRight}>
                {isConn ? (
                  <>
                    <span style={styles.connectedDot}>● Connected</span>
                    <button style={styles.disconnectBtn} onClick={() => disconnectPlatform(p.id)}>Disconnect</button>
                  </>
                ) : p.oauth ? (
                  <button
                    style={ebayConnecting ? { ...styles.ebayConnectBtn, opacity: 0.6 } : ebayError ? styles.ebayRetryBtn : styles.ebayConnectBtn}
                    onClick={connectEbay}
                    disabled={ebayConnecting}
                  >
                    {ebayConnecting ? '⏳ Connecting...' : ebayError ? '⚠ Retry Connect' : '🔒 Sign in with eBay'}
                  </button>
                ) : (
                  <button style={styles.connectBtn} onClick={() => connectPlatform(p.id)}>
                    Connect
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Browser Extension</h2>
        {extensionInstalled ? (
          <p style={styles.extensionActive}>✓ HubAds extension is active — connect your platforms above to start posting.</p>
        ) : (
          <>
            <p style={styles.cardSub}>Install the HubAds extension to post to Facebook, Craigslist, OfferUp, and Nextdoor automatically. Works on Chrome, Edge, and Brave.</p>
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noreferrer"
              style={styles.installBtn}
            >
              Install HubAds Extension
            </a>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 680, margin: '0 auto', padding: '40px 16px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  pageTitle: { color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 24 },
  messageBanner: { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16 },
  messageBannerError: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 6 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 16 },
  extensionActive: { color: '#22c55e', fontSize: 13 },
  platformRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', gap: 12, flexWrap: 'wrap' },
  platformLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  platformIcon: { fontSize: 24, flexShrink: 0 },
  platformLabel: { color: '#fff', fontWeight: 600, fontSize: 14 },
  platformNote: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  platformRight: { display: 'flex', alignItems: 'center', gap: 8 },
  connectBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  ebayConnectBtn: { background: 'linear-gradient(135deg, #0064D2, #0099E0)', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  ebayRetryBtn: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', color: '#f87171', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  disconnectBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  connectedDot: { color: '#22c55e', fontSize: 12 },
  installBtn: { display: 'inline-block', background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
}

export default Settings