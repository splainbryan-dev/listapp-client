import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const HubAdsLogo = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
    <img src="/hubadslogo.png" alt="HubAds" style={{ width: '200px', objectFit: 'contain' }} />
  </div>
)

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = (provider) => {
    if (provider === 'Google') {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    } else if (provider === 'X') {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/x`
    } else {
      alert(`${provider} login coming soon!`)
    }
  }

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.card,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)'
      }}>
        <HubAdsLogo />
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your account</p>
        <div style={styles.oauthGroup}>
          <button style={styles.oauthBtn} onClick={() => handleOAuth('Google')}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button style={styles.oauthBtn} onClick={() => handleOAuth('Apple')}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M13.173 9.438c-.02-2.14 1.748-3.174 1.827-3.224-1-1.459-2.548-1.659-3.094-1.678-1.314-.134-2.573.775-3.24.775-.667 0-1.693-.757-2.786-.736-1.427.021-2.748.833-3.481 2.113-1.487 2.578-.381 6.394 1.067 8.485.706 1.022 1.547 2.166 2.653 2.124 1.067-.042 1.467-.687 2.754-.687 1.287 0 1.647.687 2.774.664 1.147-.021 1.867-1.042 2.567-2.068.814-1.183 1.147-2.328 1.167-2.387-.027-.012-2.24-.858-2.208-3.381zM11.073 3.16c.587-.712.981-1.694.873-2.676-.843.034-1.867.562-2.474 1.274-.54.625-1.014 1.627-.887 2.585.94.073 1.9-.476 2.488-1.183z"/>
            </svg>
            Continue with Apple
          </button>
          <button style={{ ...styles.oauthBtn, ...styles.xBtn }} onClick={() => handleOAuth('X')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Continue with X
          </button>
        </div>
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #080818 0%, #0f0f2a 50%, #080818 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  card: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px 36px', width: '100%', maxWidth: '420px', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' },
  title: { color: '#fff', fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '6px', letterSpacing: '-0.5px' },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', marginBottom: '24px' },
  oauthGroup: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  oauthBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  xBtn: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(255,255,255,0.3)', fontSize: '12px' },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '10px', padding: '12px', fontSize: '13px', marginBottom: '16px' },
  formGroup: { marginBottom: '14px' },
  label: { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '500', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' },
  submitBtn: { width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' },
  link: { color: '#a78bfa', textDecoration: 'none', fontWeight: '500' },
}

export default Login