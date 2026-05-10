import { useNavigate } from 'react-router-dom'

const S = {
  page: {
    background: '#050810', color: '#e2e8f0', minHeight: '100vh',
    fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' as const,
  },
  gradientBg: {
    position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
    background: `
      radial-gradient(ellipse 70% 50% at 10% 20%, rgba(0,212,255,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 30%, rgba(168,85,247,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 50% 80%, rgba(0,255,179,0.03) 0%, transparent 50%)
    `,
    pointerEvents: 'none' as const, zIndex: 0,
  },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative' as const, zIndex: 1 },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  logo: {
    fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 900,
    background: 'linear-gradient(135deg, #00d4ff, #00ffb3)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  navBtn: {
    padding: '10px 24px', borderRadius: 10, border: '1px solid rgba(0,212,255,0.3)',
    background: 'rgba(0,212,255,0.06)', color: '#00d4ff', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
    transition: 'all .3s',
  },
  hero: { textAlign: 'center' as const, padding: '100px 0 80px' },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '8px 18px', borderRadius: 100,
    background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)',
    fontSize: 13, fontWeight: 600, color: '#00d4ff', marginBottom: 32,
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%', background: '#00ffb3',
    boxShadow: '0 0 10px #00ffb3', display: 'inline-block',
  },
  heroTitle: {
    fontFamily: "'Orbitron', monospace", fontSize: 56, fontWeight: 900,
    lineHeight: 1.15, marginBottom: 20,
    background: 'linear-gradient(135deg, #00d4ff, #00ffb3 40%, #a855f7)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSub: { fontSize: 20, color: '#94a3b8', maxWidth: 620, margin: '0 auto 48px', lineHeight: 1.6 },
  heroBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 12,
    padding: '20px 52px', borderRadius: 16, border: 'none',
    background: 'linear-gradient(135deg, #00d4ff 0%, #0891b2 100%)',
    color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 0 40px rgba(0,212,255,0.25)',
    transition: 'all .3s',
  },
  heroNote: { marginTop: 20, fontSize: 14, color: '#475569' },
  section: { padding: '80px 0' },
  sectionTitle: {
    fontFamily: "'Orbitron', monospace", fontSize: 32, fontWeight: 700,
    textAlign: 'center' as const, marginBottom: 12,
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  sectionSub: { textAlign: 'center' as const, color: '#94a3b8', fontSize: 16, marginBottom: 56, maxWidth: 600, margin: '0 auto 56px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 },
  card: {
    background: 'rgba(13,17,29,0.6)', borderRadius: 16, padding: 28,
    border: '1px solid rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)', transition: 'all .3s', cursor: 'default',
  },
  cardIcon: { fontSize: 32, marginBottom: 16, display: 'block' },
  cardTitle: { fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' },
  cardDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.6 },
  steps: { display: 'flex', flexDirection: 'column' as const, gap: 24, maxWidth: 700, margin: '0 auto' },
  step: {
    display: 'flex', alignItems: 'flex-start', gap: 20,
    background: 'rgba(13,17,29,0.6)', borderRadius: 16, padding: 24,
    border: '1px solid rgba(255,255,255,0.04)',
  },
  stepNum: {
    width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 16, flexShrink: 0,
    background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.15)',
  },
  stepTitle: { fontSize: 17, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' },
  stepDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.5 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, margin: '60px 0' },
  statCard: { textAlign: 'center' as const, padding: 32, background: 'rgba(13,17,29,0.6)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)' },
  statNum: { fontFamily: "'Orbitron', monospace", fontSize: 36, fontWeight: 900, color: '#00d4ff', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#64748b' },
  cta: {
    textAlign: 'center' as const, padding: '80px 0',
    borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  footer: { textAlign: 'center' as const, padding: '32px 0', fontSize: 13, color: '#334155' },
}

const FEATURES = [
  { icon: '💓', title: 'Real-time Biometrics', desc: 'Continuous HR, HRV, temperature & GSR monitoring with 3-second refresh cycles.' },
  { icon: '🧠', title: 'Emotion Classification', desc: 'AI-driven recognition of 6 emotional states — Calm, Happy, Mild Unease, Anxiety, Stress, Transitional.' },
  { icon: '📊', title: 'Advanced Analytics', desc: 'Day/week/month views with stress heatmaps, emotion distribution, trigger analysis & CSV export.' },
  { icon: '🗺️', title: 'Geofencing & Safety', desc: 'Virtual safe zones with enter/exit alerts, route history, and environmental sensory load scanning.' },
  { icon: '👥', title: 'Caregiver Network', desc: 'Real-time observer sync with live aura visualization, haptic feedback bridge, and SOS escalation.' },
  { icon: '🤖', title: 'AI Assistant', desc: 'Contextual chat, personalized insights, community benchmarks, and auto-generated intervention suggestions.' },
  { icon: '🧘', title: 'Calm Interventions', desc: 'Auto-triggered breathing exercises, vibration patterns, sensory playlist & animation therapy.' },
  { icon: '💊', title: 'Medication & Therapy', desc: 'Medication adherence tracking, therapy logging, and effect-correlation analytics over time.' },
]

const STEPS = [
  { title: 'Wear the Band', desc: 'AuraLink neckband and badge continuously capture heart rate, HRV, skin temperature, and GSR.' },
  { title: 'AI Analysis', desc: 'On-device and cloud AI classify your emotional state, detect patterns, and predict triggers before they escalate.' },
  { title: 'Stay Connected', desc: 'Caregivers receive live status updates, zone alerts, and SOS notifications. You stay in control of your privacy.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={S.page}>
      <div style={S.gradientBg} />

      {/* Nav */}
      <div style={S.container}>
        <div style={S.nav}>
          <span style={S.logo}>AuraLink</span>
          <button style={S.navBtn} onClick={() => navigate('/login')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)' }}>
            Launch App →
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={S.container}>
        <div style={S.hero}>
          <div style={S.heroBadge}>
            <span style={S.dot} />
            Real-time Emotion Monitoring
          </div>
          <h1 style={S.heroTitle}>
            Emotional Wellbeing<br />Monitor
          </h1>
          <p style={S.heroSub}>
            AuraLink gives individuals with autism and their caregivers real-time emotional insight,
            predictive alerts, and calm interventions — all in one wearable system.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={S.heroBtn} onClick={() => navigate('/login')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(0,212,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.25)' }}>
              🚀 Get Started
            </button>
            <button style={{ ...S.heroBtn, background: 'transparent', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', boxShadow: 'none' }}
              onClick={() => navigate('/login')}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              Sign In
            </button>
          </div>
          <div style={S.heroNote}>Works in Chrome &amp; Edge · Desktop &amp; Mobile</div>
        </div>
      </div>

      {/* Stats */}
      <div style={S.container}>
        <div style={S.stats}>
          {[
            { num: '6', label: 'Emotional States' },
            { num: '4', label: 'Biometric Sensors' },
            { num: '3s', label: 'Refresh Cycle' },
            { num: '100%', label: 'Privacy-First' },
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={S.statNum}>{s.num}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ ...S.container, ...S.section }}>
        <h2 style={S.sectionTitle}>Everything You Need</h2>
        <p style={S.sectionSub}>From real-time sensing to caregiver coordination — AuraLink is a complete emotional wellbeing ecosystem.</p>
        <div style={S.grid}>
          {FEATURES.map(f => (
            <div key={f.title} style={S.card}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,212,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none' }}>
              <span style={S.cardIcon}>{f.icon}</span>
              <div style={S.cardTitle}>{f.title}</div>
              <div style={S.cardDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ ...S.container, ...S.section }}>
        <h2 style={S.sectionTitle}>How It Works</h2>
        <p style={S.sectionSub}>Three simple steps to get started with AuraLink.</p>
        <div style={S.steps}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={S.step}>
              <div style={S.stepNum}>{i + 1}</div>
              <div>
                <div style={S.stepTitle}>{s.title}</div>
                <div style={S.stepDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={S.cta}>
        <div style={S.container}>
          <h2 style={{ ...S.sectionTitle, marginBottom: 16 }}>Ready to Get Started?</h2>
          <p style={{ ...S.sectionSub, marginBottom: 40 }}>Join the future of emotional wellbeing monitoring.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={S.heroBtn} onClick={() => navigate('/login')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(0,212,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.25)' }}>
              🚀 Get Started
            </button>
            <button style={{ ...S.heroBtn, background: 'transparent', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', boxShadow: 'none' }}
              onClick={() => navigate('/login')}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={S.container}>
        <div style={S.footer}>
          © {new Date().getFullYear()} AuraLink · Emotional Wellbeing Monitor
        </div>
      </div>
    </div>
  )
}
