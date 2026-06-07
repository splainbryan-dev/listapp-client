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
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ListApp</Link>
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/listing/new">+ New Listing</Link>
            <Link to="/settings">Settings</Link>
            <span style={{ color: '#999', fontSize: 13 }}>{user?.name}</span>
            <button className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">
              <button className="btn btn-primary btn-sm">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
