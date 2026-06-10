import { Link, useNavigate } from 'react-router-dom'

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
        <img src="/hubads-logo.jpg" alt="HubAds" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }} />
        <div style={styles.brandName}>
          <span style={styles.hub}>Hub</span>
          <span style={styles.ads}>Ads</span>
        </div>
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
  brand: { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' },
  brandName: { display: 'flex', alignItems: 'baseline', gap: '1px' },
  hub: { color: '#111', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.3px' },
  ads: { fontWeight: '800', fontSize: '18px', letterSpacing: '-0.3px', background: 'linear-gradient(90deg, #7B2FFF, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#555', fontSize: '14px' },
  newBtn: { textDecoration: 'none', color: '#7B2FFF', fontSize: '14px', fontWeight: '600' },
  userName: { fontSize: '13px', color: '#999' },
  logoutBtn: { background: 'none', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', color: '#555', fontFamily: 'inherit' },
  signupBtn: { textDecoration: 'none', background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
}

export default Navbar