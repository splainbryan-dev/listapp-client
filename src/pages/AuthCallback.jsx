import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    const token = params.get('token')
    const name = params.get('name')
    const email = params.get('email')
    const id = params.get('id')
    const error = params.get('error')

    if (error) {
      navigate('/login?error=' + error)
      return
    }

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ id, name, email }))
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080818' }}>
      <div style={{ color: '#fff', fontSize: 16, fontFamily: 'sans-serif' }}>Signing you in...</div>
    </div>
  )
}

export default AuthCallback
