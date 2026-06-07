import { useEffect, useState } from 'react'

const HubAdsLogo = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="splashGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7B2FFF"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="18" fill="url(#splashGrad)"/>
    <circle cx="20" cy="20" r="7" fill="white"/>
    <circle cx="20" cy="52" r="7" fill="white"/>
    <circle cx="52" cy="20" r="7" fill="white"/>
    <circle cx="52" cy="52" r="7" fill="white"/>
    <rect x="16" y="26" width="8" height="20" rx="4" fill="white"/>
    <rect x="48" y="26" width="8" height="20" rx="4" fill="white"/>
    <rect x="24" y="32" width="24" height="8" rx="4" fill="white"/>
  </svg>
)

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100)
    const t2 = setTimeout(() => setPhase('exit'), 2200)
    const t3 = setTimeout(() => onComplete(), 2800)
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
        transform: phase === 'enter' ? 'translateY(20px)' : 'translateY(0)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={styles.iconWrap}>
          <HubAdsLogo size={80} />
          <div style={styles.iconRing} />
        </div>

        <div style={styles.nameWrap}>
          <span style={styles.nameHub}>Hub</span>
          <span style={styles.nameAds}>Ads</span>
        </div>

        <p style={styles.tagline}>Post once. Sell everywhere.</p>

        <div style={styles.dotsWrap}>
          {[0,1,2].map(i => (
            <div key={i} style={{ ...styles.dot, animationDelay: `${i * 0.18}s`, animation: 'pulse 1.2s ease-in-out infinite' }} />
          ))}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.25;transform:scale(.7)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )
}

const styles = {
  splash: { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #080818 0%, #0f0f2a 50%, #080818 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, fontFamily: "'DM Sans', -apple-system, sans-serif" },
  glow: { position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,255,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  glow2: { position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', top: '45%', left: '55%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  content: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 },
  iconWrap: { position: 'relative', marginBottom: '4px' },
  iconRing: { position: 'absolute', inset: '-10px', borderRadius: '28px', border: '1px solid rgba(123,47,255,0.2)', pointerEvents: 'none' },
  nameWrap: { display: 'flex', alignItems: 'baseline', gap: '1px' },
  nameHub: { color: '#ffffff', fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' },
  nameAds: { fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', background: 'linear-gradient(90deg, #7B2FFF, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  tagline: { color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: 0, letterSpacing: '0.3px' },
  dotsWrap: { display: 'flex', gap: '7px', marginTop: '20px' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)' },
}

export { HubAdsLogo }
export default SplashScreen
