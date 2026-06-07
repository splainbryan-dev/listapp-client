import { Link, useNavigate } from 'react-router-dom'

const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="navGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7B2FFF"/>
        <stop offset="50%" stopColor="#4f8ef7"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="18" fill="url(#navGrad)"/>
    <circle cx="20" cy="20" r="7" fill="white" fillOpacity="0.95"/>
    <circle cx="20" cy="52" r="7" fill="white" fillOpacity="0.95"/>
    <circle cx="52" cy="20" r="7" fill="white" fillOpacity="0.95"/>
    <circle cx="52" cy="52" r="7" fill="white" fillOpacity="0.95"/>
    <rect x="16" y="26" width="8" height="20" rx="4" fill="white" fillOpacity="0.95"/>
    <rect x="48" y="26" width="8" height="20" rx="4" fill="white" fillOpacity="0.95"/>
    <rect x="24" y="32" width="24" height="8" rx="4" fill="white" fillOpacity="0.95"/>
  </svg>
)

const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <Logo size={32} />
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
  nav: { background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, fontFamily: "'DM Sans', -apple-system, sans-serif" },
  brand: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#555', fontSize: '14px' },
  newBtn: { textDecoration: 'none', color: '#7B2FFF', fontSize: '14px', fontWeight: '600' },
  userName: { fontSize: '13px', color: '#999' },
  logoutBtn: { background: 'none', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', color: '#555', fontFamily: 'inherit' },
  signupBtn: { textDecoration: 'none', background: 'linear-gradient(135deg, #7B2FFF, #4f8ef7)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
}

export default Navbar
