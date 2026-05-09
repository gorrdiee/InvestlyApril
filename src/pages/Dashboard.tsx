import { useCtx } from '../App'
import { EMOTIONS } from '../constants'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUICK_ACTIONS = [
  { icon: '🆘', label: 'SOS' }, { icon: '📍', label: 'Pause GPS' },
  { icon: '🧘', label: 'Interventions', link: '/interventions' },
  { icon: '🧬', label: 'Sensory Profile', link: '/sensory-profile' },
  { icon: '💊', label: 'Medications', link: '/medications' },
  { icon: '🧠', label: 'Day Planner' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const ctx = useCtx()
  const pd = ctx.physData
  const h = ctx.emotion
  const [showSos, setShowSos] = useState(false)
  const [showPlanner, setShowPlanner] = useState(false)

  const ringColor = h.color
  const sparklineData = ctx.events.slice(0, 30).reverse()
  const latestEvents = ctx.events.slice(0, 5)

  const handleSos = () => {
    ctx.triggerSos()
    setShowSos(false)
  }

  return (
    <div className="page">
      <h1 className="page-title">AuraLink</h1>

      {/* Quick Actions */}
      <div className="quick-actions" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {QUICK_ACTIONS.map((qa: any, i) => (
          <button key={i} className="qa-btn" onClick={() => {
            if (i === 0) setShowSos(true)
            else if (qa.link) navigate(qa.link)
            else if (i === 5) setShowPlanner(!showPlanner)
          }}>
            <span className="qa-icon">{qa.icon}</span>
            <span>{qa.label}</span>
          </button>
        ))}
      </div>

      {/* Emotion Ring */}
      <div className="glass" style={{ borderColor: ringColor + '40' }}>
        <div className="emotion-ring-wrap">
          <div className="emotion-ring" style={{ boxShadow: `0 0 30px ${ringColor}40` }}>
            <div className="emotion-ring-inner pulse" style={{ boxShadow: `0 0 20px ${ringColor}20` }}>
              <div className="icon">{h.icon}</div>
              <div className="label" style={{ color: ringColor }}>{h.stateName}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Confidence</div>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, width: 100 }}>
              <div style={{ width: h.confidence + '%', height: '100%', background: ringColor, borderRadius: 2, transition: 'width .3s' }} />
            </div>
            <div className="text-mono" style={{ fontSize: 11, color: ringColor }}>{h.confidence}%</div>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="vitals-grid">
        <div className="vital-card" style={{ borderColor: 'rgba(0,212,255,0.2)' }}>
          <div className="label">Heart Rate</div>
          <div className="value">{pd?.heartRate ?? '--'}<span className="unit">BPM</span></div>
          <div className="sparkline">
            {sparklineData.slice(0, 20).map((e, i) => (
              <div key={i} className="spark-bar"
                style={{ height: Math.max(3, (e.heartRate - 50) * 0.6), background: '#00d4ff' }} />
            ))}
          </div>
        </div>
        <div className="vital-card" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
          <div className="label">HRV</div>
          <div className="value">{pd?.hrvRmssd ?? '--'}<span className="unit">ms</span></div>
          <div className="sparkline">
            {sparklineData.slice(0, 20).map((e, i) => (
              <div key={i} className="spark-bar"
                style={{ height: Math.max(3, e.hrv * 0.5), background: '#a855f7' }} />
            ))}
          </div>
        </div>
        <div className="vital-card" style={{ borderColor: 'rgba(0,255,179,0.2)' }}>
          <div className="label">Temperature</div>
          <div className="value">{pd?.temperature ?? '--'}<span className="unit">°C</span></div>
          <div className="sparkline">
            {sparklineData.slice(0, 20).map((e, i) => (
              <div key={i} className="spark-bar"
                style={{ height: Math.max(3, (e.temperature - 35) * 30), background: '#00ffb3' }} />
            ))}
          </div>
        </div>
        <div className="vital-card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
          <div className="label">GSR</div>
          <div className="value">{pd?.gsr ?? '--'}<span className="unit">μS</span></div>
          <div className="sparkline">
            {sparklineData.slice(0, 20).map((e, i) => (
              <div key={i} className="spark-bar"
                style={{ height: Math.max(3, e.stress * 0.4), background: '#f59e0b' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Wellness Score */}
      <div className="glass">
        <div className="glass-title">Wellness Score</div>
        <div className="wellness-wrap">
          <div className="wellness-ring">
            <svg viewBox="0 0 36 36">
              <path className="wellness-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="wellness-ring-fg" stroke={h.color}
                strokeDasharray={`${ctx.wellness}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="wellness-score">
              <span style={{ color: ctx.wellness > 60 ? 'var(--neon-mint)' : ctx.wellness > 40 ? 'var(--neon-amber)' : 'var(--neon-red)' }}>
                {ctx.wellness}
              </span>
            </div>
          </div>
          <div className="wellness-info">
            <div className="score-label">Today's overall wellbeing</div>
            <div className="score-trend" style={{ color: ctx.wellness > 60 ? 'var(--neon-mint)' : 'var(--neon-amber)' }}>
              {ctx.wellness > 70 ? '👍 Great day' : ctx.wellness > 50 ? '📊 Moderate' : '⚠️ Needs attention'}
            </div>
          </div>
        </div>
      </div>

      {/* SOS */}
      <button className="sos-btn" onClick={() => setShowSos(true)}>
        <span>🆘</span> SOS EMERGENCY
      </button>

      {/* AI Insight */}
      <div className="ai-insight">
        <div className="head"><span>🤖 AI Insight</span></div>
        <div className="text">
          {ctx.stress > 50
            ? 'Stress levels have been elevated. Try a breathing exercise to calm down.'
            : ctx.emotion.stateId <= 1
              ? 'You\'ve been calm and happy today. Great job maintaining balance!'
              : 'Mild unease detected in the last hour. A short walk might help.'}
        </div>
      </div>

      {/* Predictive Day Planner */}
      {showPlanner && (
        <div className="glass" style={{ borderColor: 'rgba(168,85,247,0.3)' }}>
          <div className="glass-title">📅 Predictive Day Planner</div>
          <div className="ai-insight" style={{ marginBottom: 8 }}>
            <div className="head"><span>🤖 Today's Forecast</span></div>
            <div className="text">
              {new Date().toLocaleDateString('en', { weekday: 'long' })}. Historically, stress peaks around 10-11 AM.
              Recommended: prepare calming strategies before morning activities.
            </div>
          </div>
          <div className="timeline-bar" style={{ height: 24 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const hour = i + 7
              const risk = hour >= 9 && hour <= 11 ? 80 : hour >= 14 && hour <= 16 ? 60 : 20
              return (
                <div key={i} className="timeline-seg" style={{
                  background: risk > 70 ? '#ef4444' : risk > 40 ? '#f59e0b' : '#00d4ff',
                  opacity: 0.7,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 8, color: '#fff', fontWeight: 600 }}>{hour}</span>
                </div>
              )
            })}
          </div>
          <div className="timeline-labels"><span>7 AM</span><span>12 PM</span><span>6 PM</span></div>
          <div className="mt-2" style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            🔴 10-11 AM: High stress predicted — take a 5-min break beforehand<br />
            🟡 2-4 PM: Moderate risk — keep noise-cancelling headphones ready<br />
            🔵 Morning/Evening: Low stress — good time for focus activities
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="glass">
        <div className="glass-title">Recent Events</div>
        {latestEvents.length === 0 ? (
          <div className="empty-state"><div className="icon">📭</div>No events yet</div>
        ) : (
          <div className="event-list">
            {latestEvents.map(ev => (
              <div key={ev.id} className="event-item" style={{ borderLeftColor: ev.emotion.color }}>
                <div className="dot" style={{ background: ev.emotion.color }} />
                <div className="info">
                  <div className="state">{ev.emotion.stateName}</div>
                  <div className="meta">HR {ev.heartRate} · Stress {ev.stress}%</div>
                </div>
                <div className="time">{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badge Status */}
      <div className="badge-status">
        <div className="badge-led" style={{ background: h.color, boxShadow: `0 0 12px ${h.color}` }} />
        <div className="info">
          <div className="name">AuraBadge</div>
          <div className="meta">
            {ctx.badge.flashMode === 'solid' ? 'Solid' : ctx.badge.flashMode} · {ctx.badge.silentMode ? 'Silent' : 'Sound on'}
            {pd && ` · ${pd.battery}%`}
          </div>
        </div>
        <div style={{ fontSize: 20 }}>🔋</div>
      </div>

      {/* SOS Modal */}
      {showSos && (
        <div className="modal-overlay" onClick={() => setShowSos(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>🚨 Send SOS?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Emergency alert will be sent to all observers with your current location.
            </p>
            <div className="modal-actions">
              <button className="neon-btn secondary" onClick={() => setShowSos(false)}>Cancel</button>
              <button className="neon-btn danger" onClick={handleSos}>Send SOS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
