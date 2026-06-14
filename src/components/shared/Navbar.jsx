import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const hideOn = ['/login', '/register', '/auth/callback']
  if (hideOn.includes(location.pathname)) return null

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <img src="/hubads-logo.png" alt="HubAds" style={{ height: '40px', objectFit: 'contain' }} />
      </Link>
      <div style={styles.links}>
        {token ? (
          <>
            <Link to="/listing/new" style={styles.newBtn}>+ New Listing</Link>
            <Link to="/settings" style={styles.link}>Settings</Link>
            <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
            <button style={styles.logoutBtn} onClick={logout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.signupBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: { background: '#080818', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, fontFamily: "'DM Sans', -apple-system, sans-serif" },
  brand: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '14px' },
  newBtn: { textDecoration: 'none', color: '#a78bfa', fontSize: '14px', fontWeight: '600' },
  userName: { fontSize: '13px', color: 'rgba(255,255,255,0.4)' },
  logoutBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'inherit' },
  signupBtn: { textDecoration: 'none', background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
}

export default Navbar