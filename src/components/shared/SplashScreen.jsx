import { useEffect, useState } from 'react'

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter')
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100)
    const t2 = setTimeout(() => setPhase('exit'), 2400)
    const t3 = setTimeout(() => {
      setGone(true)
      onComplete()
    }, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (gone) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#080c1f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: phase === 'exit' ? 0 : 1,
      transition: phase === 'exit' ? 'opacity 0.6s ease-in-out' : 'none',
      pointerEvents: phase === 'exit' ? 'none' : 'all',
    }}>
      <img
        src="/hubads-splash.jpg"
        alt="HubAds"
        style={{
          width: '320px',
          height: '320px',
          objectFit: 'contain',
          borderRadius: '32px',
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'scale(0.9)' : 'scale(1)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      />
    </div>
  )
}

export default SplashScreen