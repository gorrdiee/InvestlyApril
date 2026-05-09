import { useState } from 'react'
import { useCtx } from '../App'
import { EMOTIONS, ACCENT_COLORS } from '../constants'
import type { BadgeSettings } from '../types'

type Tab = 'device' | 'badge' | 'notifications' | 'profile'

export default function Settings() {
  const ctx = useCtx()
  const [tab, setTab] = useState<Tab>('device')
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null)
  const [showDnd, setShowDnd] = useState(false)

  const s = ctx.settings

  const updateBadge = (partial: Partial<BadgeSettings>) => {
    Object.assign(ctx.badge, partial)
    localStorage.setItem('au_badge', JSON.stringify(ctx.badge))
    ctx.badge.brightness = ctx.badge.brightness // trigger re-render hack
  }

  return (
    <div className="page">
      <h1 className="page-title">Device & Settings</h1>

      <div className="tab-bar" style={{ flexWrap: 'wrap' }}>
        {(['device', 'badge', 'notifications', 'profile'] as const).map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'device' ? '📟 Device' : t === 'badge' ? '💡 Badge' : t === 'notifications' ? '🔔 Notifs' : '👤 Profile'}
          </button>
        ))}
      </div>

      {tab === 'device' && (
        <>
          {/* Device Status */}
          <div className="device-banner">
            <div className="device-icon neckband">📿</div>
            <div className="info">
              <div className="name">AuraLink Neckband</div>
              <div className="meta">
                Battery {ctx.physData?.battery ?? 82}% · BLE Signal -62 dBm · Last sync: now
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                <span className="text-sm" style={{ color: 'var(--neon-mint)' }}>● Connected</span>
              </div>
            </div>
          </div>

          <div className="device-banner">
            <div className="device-icon badge">🔵</div>
            <div className="info">
              <div className="name">AuraBadge</div>
              <div className="meta">
                Battery 91% · Flash mode: {ctx.badge.flashMode} · Brightness: {ctx.badge.brightness}%
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                <span className="text-sm" style={{ color: 'var(--neon-mint)' }}>● Connected</span>
              </div>
            </div>
          </div>

          {/* AI Calibration */}
          <div className="glass">
            <div className="glass-title">AI Model Training</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '73%', height: '100%', background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-mint))', borderRadius: 4 }} />
              </div>
              <span className="text-mono" style={{ fontSize: 13, color: 'var(--neon-mint)' }}>73%</span>
            </div>
            <div className="text-sm text-muted mb-2">1,247 hours of data collected</div>
            <button className="neon-btn small secondary" style={{ width: 'auto' }}>🔄 Reset Calibration</button>
          </div>

          {/* Smart Reminders */}
          <div className="glass">
            <div className="glass-title">Smart Reminders</div>
            <div className="setting-row">
              <div className="left">
                <div className="label">Remind to wear device</div>
                <div className="desc">If device not detected for 2+ hours</div>
              </div>
              <div className="toggle on"><div className="knob" /></div>
            </div>
          </div>

          {/* DND Mode */}
          <div className="glass" style={{ borderColor: s.dndMode ? 'rgba(245,158,11,0.3)' : undefined }}>
            <div className="glass-title">Do Not Disturb</div>
            <div className="setting-row">
              <div className="left">
                <div className="label">DND Mode</div>
                <div className="desc">Pause badge lights and observer notifications</div>
              </div>
              <div className={`toggle${s.dndMode ? ' on' : ''}`}
                onClick={() => ctx.setSettings({ ...s, dndMode: !s.dndMode })}>
                <div className="knob" />
              </div>
            </div>
            {s.dndMode && (
              <button className="neon-btn small secondary mt-2" style={{ width: 'auto' }} onClick={() => setShowDnd(true)}>
                ⏱ Set timer
              </button>
            )}
          </div>

          {/* Watch companion */}
          <div className="ai-insight">
            <div className="head"><span>⌚ Companion App</span></div>
            <div className="text">
              AuraLink is available on Apple Watch and Wear OS.
              Get quick glances at your emotional state right from your wrist.
            </div>
          </div>
        </>
      )}

      {tab === 'badge' && (
        <>
          {/* Brightness */}
          <div className="glass">
            <div className="glass-title">Brightness</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12 }}>🔅</span>
              <input type="range" min={10} max={100} value={ctx.badge.brightness}
                onChange={e => { ctx.badge.brightness = Number(e.target.value); localStorage.setItem('au_badge', JSON.stringify(ctx.badge)); ctx.badge.silentMode = ctx.badge.silentMode }}
                style={{ flex: 1, accentColor: 'var(--accent)' }} />
              <span style={{ fontSize: 12 }}>🔆</span>
              <span className="text-mono text-sm">{ctx.badge.brightness}%</span>
            </div>
          </div>

          {/* Flash Mode */}
          <div className="glass">
            <div className="glass-title">Flash Mode</div>
            <div className="tab-bar">
              {['solid', 'slowBlink', 'fastBlink', 'pulsing'].map(mode => (
                <button key={mode} className={`tab-btn${ctx.badge.flashMode === mode ? ' active' : ''}`}
                  onClick={() => { ctx.badge.flashMode = mode; localStorage.setItem('au_badge', JSON.stringify(ctx.badge)) }}>
                  {mode === 'solid' ? 'Solid' : mode === 'slowBlink' ? 'Slow' : mode === 'fastBlink' ? 'Fast' : 'Pulse'}
                </button>
              ))}
            </div>
          </div>

          {/* Silent Mode */}
          <div className="glass">
            <div className="setting-row">
              <div className="left">
                <div className="label">Silent Mode</div>
                <div className="desc">Disable sound, vibration only</div>
              </div>
              <div className={`toggle${ctx.badge.silentMode ? ' on' : ''}`}
                onClick={() => { ctx.badge.silentMode = !ctx.badge.silentMode; localStorage.setItem('au_badge', JSON.stringify(ctx.badge)) }}>
                <div className="knob" />
              </div>
            </div>
          </div>

          {/* Colors per emotion */}
          <div className="glass">
            <div className="glass-title">Emotion Colors</div>
            {EMOTIONS.map(em => (
              <div key={em.id} className="setting-row">
                <div className="left">
                  <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: ctx.badge.colors[em.id] }}>●</span>
                    {em.name}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="action-btn" onClick={() => setShowColorPicker(em.id)}>
                    🎨
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Color Picker Modal */}
          {showColorPicker !== null && (
            <div className="modal-overlay" onClick={() => setShowColorPicker(null)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h3>Choose Color — {EMOTIONS[showColorPicker].name}</h3>
                <div className="color-grid">
                  {['#00d4ff', '#00ffb3', '#facc15', '#f59e0b', '#ef4444', '#a855f7',
                    '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#06b6d4', '#e11d48',
                  ].map(color => (
                    <div key={color} className={`color-swatch${ctx.badge.colors[showColorPicker] === color ? ' selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => {
                        ctx.badge.colors[showColorPicker] = color
                        localStorage.setItem('au_badge', JSON.stringify(ctx.badge))
                        setShowColorPicker(null)
                      }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'notifications' && (
        <>
          {/* Threshold */}
          <div className="glass">
            <div className="glass-title">Alert Thresholds</div>
            <div className="setting-row">
              <div className="left"><div className="label">Push at emotion level</div></div>
              <select className="neon-input" style={{ width: 'auto', padding: '6px 12px' }}
                value={3} onChange={() => {}}>
                <option value={2}>Mild Unease+</option>
                <option value={3}>Anxiety+</option>
                <option value={4}>Stress only</option>
              </select>
            </div>
            <div className="setting-row">
              <div className="left">
                <div className="label">Remind to wear device</div>
                <div className="desc">Every 2 hours if device not detected</div>
              </div>
              <div className="toggle on"><div className="knob" /></div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="glass">
            <div className="glass-title">Quiet Hours</div>
            <div className="setting-row">
              <div className="left"><div className="label">Enable Quiet Hours</div></div>
              <div className={`toggle${s.quietHours.enabled ? ' on' : ''}`}
                onClick={() => ctx.setSettings({ ...s, quietHours: { ...s.quietHours, enabled: !s.quietHours.enabled } })}>
                <div className="knob" />
              </div>
            </div>
            {s.quietHours.enabled && (
              <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                  <input type="time" value={s.quietHours.start} className="neon-input" style={{ width: 'auto', padding: '6px 12px' }}
                    onChange={e => ctx.setSettings({ ...s, quietHours: { ...s.quietHours, start: e.target.value } })} />
                  <span className="text-muted">to</span>
                  <input type="time" value={s.quietHours.end} className="neon-input" style={{ width: 'auto', padding: '6px 12px' }}
                    onChange={e => ctx.setSettings({ ...s, quietHours: { ...s.quietHours, end: e.target.value } })} />
                </div>
                <div className="setting-row">
                  <div className="left"><div className="label">Override for Stress</div></div>
                  <div className={`toggle${s.quietHours.overrideRed ? ' on' : ''}`}
                    onClick={() => ctx.setSettings({ ...s, quietHours: { ...s.quietHours, overrideRed: !s.quietHours.overrideRed } })}>
                    <div className="knob" />
                  </div>
                </div>
                <div className="setting-row">
                  <div className="left"><div className="label">Override for SOS</div></div>
                  <div className={`toggle${s.quietHours.overrideSOS ? ' on' : ''}`}
                    onClick={() => ctx.setSettings({ ...s, quietHours: { ...s.quietHours, overrideSOS: !s.quietHours.overrideSOS } })}>
                    <div className="knob" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notification history */}
          <div className="glass">
            <div className="glass-title">Recent Notifications</div>
            {ctx.notifications.slice(0, 5).map(n => (
              <div key={n.id} className="event-item" style={{ borderLeftColor: n.type === 'stress' ? 'var(--neon-red)' : n.type === 'anxiety' ? 'var(--neon-amber)' : 'var(--neon-blue)' }}>
                <div className="info">
                  <div className="state">{n.title}</div>
                  <div className="meta">{n.message}</div>
                </div>
                <div className="time">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'profile' && (
        <>
          {/* User Info */}
          <div className="glass">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {ctx.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{ctx.user?.name || 'User'}</div>
                <div className="text-sm text-muted">{ctx.user?.email} · {ctx.user?.type === 'asd_user' ? 'ASD User' : 'Observer'}</div>
              </div>
            </div>
            <input className="neon-input" placeholder="Full Name" defaultValue={ctx.user?.name || ''} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="neon-input" placeholder="Age" type="number" defaultValue={14} style={{ width: '40%' }} />
              <input className="neon-input" placeholder="Diagnosis (optional)" defaultValue="ASD Level 1" style={{ flex: 1 }} />
            </div>
            <select className="neon-input" defaultValue="Asia/Almaty">
              <option>Asia/Almaty</option>
              <option>Asia/Astana</option>
              <option>Europe/Moscow</option>
              <option>America/New_York</option>
            </select>
          </div>

          {/* Theme & Accent */}
          <div className="glass">
            <div className="glass-title">Appearance</div>
            <div className="setting-row">
              <div className="left"><div className="label">Theme</div></div>
              <div className="tab-bar" style={{ margin: 0, width: '60%' }}>
                {['dark', 'light'].map(t => (
                  <button key={t} className={`tab-btn${s.theme === t ? ' active' : ''}`}
                    onClick={() => ctx.setSettings({ ...s, theme: t })}>
                    {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <div className="left"><div className="label">Accent Color</div></div>
              <div className="accent-grid">
                {ACCENT_COLORS.map(c => (
                  <div key={c.value} className={`accent-opt${s.accentColor === c.value ? ' active' : ''}`}
                    style={{ background: c.value }}
                    onClick={() => ctx.setSettings({ ...s, accentColor: c.value })} />
                ))}
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="glass">
            <div className="glass-title">Privacy & Security</div>
            <div className="setting-row">
              <div className="left"><div className="label">Share anonymized data for research</div></div>
              <div className={`toggle${s.researchSharing ? ' on' : ''}`}
                onClick={() => ctx.setSettings({ ...s, researchSharing: !s.researchSharing })}>
                <div className="knob" />
              </div>
            </div>
            <div className="setting-row">
              <div className="left"><div className="label">Pause GPS Tracking</div></div>
              <button className="neon-btn small secondary" style={{ width: 'auto' }}
                onClick={() => {}}>
                ⏸ 1h
              </button>
            </div>
            <div className="setting-row" style={{ borderBottom: 'none' }}>
              <div className="left">
                <div className="label">Data Encryption</div>
                <div className="desc">AES-256 — Active</div>
              </div>
              <span style={{ color: 'var(--neon-mint)', fontSize: 12 }}>✅ Secure</span>
            </div>
          </div>

          {/* Logout */}
          <button className="neon-btn secondary mb-2" onClick={ctx.logout}>
            🚪 Sign Out
          </button>

          {/* Export + Delete */}
          <button className="neon-btn primary mb-2" onClick={() => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ events: ctx.events.slice(0, 100), settings: s }, null, 2))
            const a = document.createElement('a'); a.href = dataStr; a.download = 'auralink-data.json'; a.click()
          }}>
            📥 Export My Data
          </button>
          <button className="neon-btn danger">
            🗑️ Delete Account
          </button>
        </>
      )}

      {/* DND Timer Modal */}
      {showDnd && (
        <div className="modal-overlay" onClick={() => setShowDnd(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>⏱ DND Timer</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Pause notifications and badge lights for:
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 4, 8].map(h => (
                <button key={h} className="neon-btn small secondary" style={{ flex: 1 }}
                  onClick={() => { ctx.setSettings({ ...s, dndMode: true }); setShowDnd(false) }}>
                  {h}h
                </button>
              ))}
              <button className="neon-btn small secondary" style={{ flex: 1 }}
                onClick={() => { ctx.setSettings({ ...s, dndMode: true }); setShowDnd(false) }}>
                All day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
