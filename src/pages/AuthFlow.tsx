import { useState } from 'react'

const SLIDES = [
  { icon: '🧠', title: 'Welcome to AuraLink', desc: 'Monitor emotional wellbeing in real time with our advanced wearable technology.' },
  { icon: '🔔', title: 'Instant Alerts', desc: 'Receive instant notifications when your loved one needs support.' },
  { icon: '📊', title: 'Deep Analytics', desc: 'Discover trends and triggers with detailed emotion analytics.' },
  { icon: '🎯', title: 'Simple Setup', desc: 'Intuitive interface designed for everyone. Get started in minutes.' },
]

interface AuthFlowProps {
  onComplete: (name: string, email: string, type: 'asd_user' | 'observer') => void
}

export default function AuthFlow({ onComplete }: AuthFlowProps) {
  const [slide, setSlide] = useState(0)
  const [mode, setMode] = useState<'onboarding' | 'login'>('onboarding')
  const [userType, setUserType] = useState<'asd_user' | 'observer' | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleLogin = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !userType) return
    onComplete(name.trim(), email.trim(), userType)
  }

  if (mode === 'onboarding') {
    const s = SLIDES[slide]
    return (
      <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 100 }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>{s.icon}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 12 }}>{s.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>{s.desc}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            {SLIDES.map((_, i) => (
              <div key={i} style={{
                width: slide === i ? 24 : 8, height: 8, borderRadius: slide === i ? 4 : 4,
                background: slide === i ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                transition: 'all .3s',
              }} />
            ))}
          </div>
          {slide < SLIDES.length - 1 ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="neon-btn secondary" onClick={() => setMode('login')} style={{ width: 'auto', flex: 1 }}>
                Skip
              </button>
              <button className="neon-btn primary" onClick={() => setSlide(s => s + 1)} style={{ width: 'auto', flex: 2 }}>
                Next
              </button>
            </div>
          ) : (
            <button className="neon-btn primary" onClick={() => setMode('login')}>
              Get Started
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 80 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🧠</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, background: 'linear-gradient(135deg, var(--accent), var(--neon-mint))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AuraLink
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
      </div>

      {/* User Type Selection */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className={`neon-btn ${userType === 'asd_user' ? 'primary' : 'secondary'}`}
          style={{ flex: 1, padding: '14px 8px', fontSize: 13 }}
          onClick={() => setUserType('asd_user')}>
          🧑‍🦰 Device User
        </button>
        <button
          className={`neon-btn ${userType === 'observer' ? 'primary' : 'secondary'}`}
          style={{ flex: 1, padding: '14px 8px', fontSize: 13 }}
          onClick={() => setUserType('observer')}>
          👀 Observer
        </button>
      </div>

      <input className="neon-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="neon-input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="neon-input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <label className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '8px 0 16px', cursor: 'pointer' }}>
        <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
          style={{ accentColor: 'var(--accent)' }} />
        I accept the Terms of Service and Privacy Policy
      </label>

      <button className="neon-btn primary" onClick={handleLogin}
        disabled={!name.trim() || !email.trim() || !password.trim() || !userType || !acceptTerms}>
        Sign In
      </button>

      <div className="flex items-center gap-3" style={{ margin: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        <span>or continue with</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
      </div>

      <button className="neon-btn secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>G</span>
        <span>Sign in with Google</span>
      </button>
    </div>
  )
}
