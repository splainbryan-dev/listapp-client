import { useEffect, useState } from 'react'

const Logo = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="splashGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7B2FFF"/>
        <stop offset="50%" stopColor="#4f8ef7"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="18" fill="url(#splashGrad)"/>
    {/* H shape made of connected nodes like the logo */}
    <circle cx="20" cy="20" r="7" fill="white" fillOpacity="0.95"/>
    <circle cx="20" cy="52" r="7" fill="white" fillOpacity="0.95"/>
    <circle cx="52" cy="20" r="7" fill="white" fillOpacity="0.95"/>
    <circle cx="52" cy="52" r="7" fill="white" fillOpacity="0.95"/>
    <rect x="16" y="26" width="8" height="20" rx="4" fill="white" fillOpacity="0.95"/>
    <rect x="48" y="26" width="8" height="20" rx="4" fill="white" fillOpacity="0.95"/>
    <rect x="24" y="32" width="24" height="8" rx="4" fill="white" fillOpacity="0.95"/>
  </svg>
)

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter')

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
      <div style={styles.glow} />
      <div style={styles.glow2} />

      <div style={{
        ...styles.content,
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(16px)' : 'translateY(0)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={styles.iconWrap}>
          <Logo size={72} />
          <div style={styles.iconRing} />
        </div>
        <p style={styles.tagline}>Post once. Sell everywhere.</p>

        <div style={styles.dotsWrap}>
          {[0,1,2].map(i => (
            <div key={i} style={{ ...styles.dot, animationDelay: `${i * 0.15}s`, animation: 'pulse 1s ease-in-out infinite' }} />
          ))}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )
}

const styles = {
  splash: { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, fontFamily: "'DM Sans', -apple-system, sans-serif" },
  glow: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  glow2: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', top: '40%', left: '55%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  content: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 },
  iconWrap: { position: 'relative', marginBottom: '8px' },
  iconRing: { position: 'absolute', inset: '-8px', borderRadius: '26px', border: '1px solid rgba(123,47,255,0.25)', pointerEvents: 'none' },
  tagline: { color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: 0, letterSpacing: '0.2px' },
  dotsWrap: { display: 'flex', gap: '6px', marginTop: '16px' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#7B2FFF' },
}

export { Logo }
export default SplashScreen
