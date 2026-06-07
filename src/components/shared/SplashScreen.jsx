import { useEffect, useState } from 'react'

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter') // enter, hold, exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100)
    const t2 = setTimeout(() => setPhase('exit'), 2000)
    const t3 = setTimeout(() => onComplete(), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{
      ...styles.splash,
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
      transition: phase === 'exit' ? 'all 0.6s cubic-bezier(0.16,1,0.3,1)' : 'none',
      pointerEvents: phase === 'exit' ? 'none' : 'all',
    }}>
      {/* Background glow */}
      <div style={styles.glow} />
      <div style={styles.glow2} />

      {/* Logo */}
      <div style={{
        ...styles.content,
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(16px)' : 'translateY(0)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={styles.iconWrap}>
          <div style={styles.icon}>L</div>
          <div style={styles.iconRing} />
        </div>
        <h1 style={styles.appName}>ListApp</h1>
        <p style={styles.tagline}>Post once. Sell everywhere.</p>

        <div style={styles.dotsWrap}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              ...styles.dot,
              animationDelay: `${i * 0.15}s`,
              animation: 'pulse 1s ease-in-out infinite',
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  splash: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  glow: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79,142,247,0.15) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
    top: '40%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
  },
  iconWrap: {
    position: 'relative',
    marginBottom: '8px',
  },
  icon: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #4f8ef7, #2563eb)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '800',
    fontSize: '36px',
    boxShadow: '0 20px 40px rgba(37,99,235,0.4)',
  },
  iconRing: {
    position: 'absolute',
    inset: '-8px',
    borderRadius: '28px',
    border: '1px solid rgba(79,142,247,0.2)',
    pointerEvents: 'none',
  },
  appName: {
    color: '#fff',
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-1px',
    margin: 0,
  },
  tagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '15px',
    margin: 0,
    letterSpacing: '0.2px',
  },
  dotsWrap: {
    display: 'flex',
    gap: '6px',
    marginTop: '16px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#4f8ef7',
  },
}

export default SplashScreen
