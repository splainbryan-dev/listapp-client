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
      <Link to="/" style={styles.brand}>ListApp</Link>
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
  nav: {
    background: '#fff',
    borderBottom: '1px solid #e5e5e5',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  brand: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#2563eb',
    textDecoration: 'none',
    letterSpacing: '-0.3px',
  },
  links: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#555',
    fontSize: '14px',
  },
  newBtn: {
    textDecoration: 'none',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '600',
  },
  userName: {
    fontSize: '13px',
    color: '#999',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#555',
    fontFamily: 'inherit',
  },
  signupBtn: {
    textDecoration: 'none',
    background: '#2563eb',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
}

export default Navbar
