import { useEffect, useState } from 'react'

const spinStyle = document.createElement('style')
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg) } }'
document.head.appendChild(spinStyle)

const EbayCallback = () => {
  const [status, setStatus] = useState('connecting') // connecting | success | error

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error) {
      setStatus('error')
      setTimeout(() => window.close(), 2500)
      return
    }

    if (code) {
      setStatus('success')
      setTimeout(() => window.close(), 1500)
      return
    }

    // No code or error — just close
    window.close()
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>H</div>

        {status === 'connecting' && (
          <>
            <div style={styles.spinner} />
            <p style={styles.title}>Connecting to eBay…</p>
            <p style={styles.sub}>Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.iconSuccess}>✓</div>
            <p style={styles.title}>eBay Connected!</p>
            <p style={styles.sub}>This window will close automatically</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.iconError}>✕</div>
            <p style={styles.title}>Authorization Failed</p>
            <p style={styles.sub}>This window will close — please try again</p>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f0f13',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    margin: 0,
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '40px 48px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    minWidth: 260,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)',
    color: '#fff',
    fontSize: 22,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid #7B2FFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  iconSuccess: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(34,197,94,0.15)',
    border: '2px solid rgba(34,197,94,0.4)',
    color: '#22c55e',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconError: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(239,68,68,0.15)',
    border: '2px solid rgba(239,68,68,0.4)',
    color: '#f87171',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    margin: 0,
  },
  sub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    margin: 0,
  },
}

export default EbayCallback