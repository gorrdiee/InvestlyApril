import { useState, useEffect } from 'react'
import { useCtx } from '../App'
import { genRouteHistory, genHeatmapData } from '../data'
import { EMOTIONS } from '../constants'

type Tab = 'map' | 'zones' | 'routes' | 'scanner'

export default function MapPage() {
  const ctx = useCtx()
  const [tab, setTab] = useState<Tab>('map')
  const [pos, setPos] = useState({ lat: 51.1694, lng: 71.4491 })
  const [routeHistory] = useState(() => genRouteHistory())
  const [heatmapData] = useState(() => genHeatmapData())
  const [showZoneModal, setShowZoneModal] = useState(false)
  const [newZone, setNewZone] = useState({ name: '', notifyOnEnter: true, notifyOnExit: false })
  const [showUnsafe, setShowUnsafe] = useState(false)

  // Simulate movement
  useEffect(() => {
    const id = setInterval(() => {
      setPos(p => ({
        lat: p.lat + (Math.random() - 0.5) * 0.002,
        lng: p.lng + (Math.random() - 0.5) * 0.002,
      }))
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // Convert lat/lng to pixel positions (simulated map)
  const toPct = (lat: number, lng: number) => ({
    x: ((lng - 71.43) / 0.04) * 100,
    y: ((51.18 - lat) / 0.03) * 100,
  })

  const curPos = toPct(pos.lat, pos.lng)
  const totalZones = ctx.geoZones.length

  const emotionColors: Record<string, string> = {
    'Calm': '#00d4ff', 'Happy': '#00ffb3', 'Mild Unease': '#facc15',
    'Anxiety': '#f59e0b', 'Stress': '#ef4444', 'Transitional': '#a855f7',
  }

  const handleAddZone = () => {
    if (!newZone.name.trim()) return
    ctx.geoZones.push({
      id: 'z' + Date.now(), name: newZone.name,
      lat: pos.lat, lng: pos.lng, radius: 200,
      color: '#00d4ff',
      notifyOnEnter: newZone.notifyOnEnter,
      notifyOnExit: newZone.notifyOnExit,
    })
    setNewZone({ name: '', notifyOnEnter: true, notifyOnExit: false })
    setShowZoneModal(false)
  }

  const handleDeleteZone = (id: string) => {
    const idx = ctx.geoZones.findIndex(z => z.id === id)
    if (idx >= 0) {
      const updated = [...ctx.geoZones]; updated.splice(idx, 1)
      ;(ctx as any).geoZones.splice(0, ctx.geoZones.length, ...updated)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Map & Geofencing</h1>

      {/* Sub tabs */}
      <div className="tab-bar" style={{ flexWrap: 'wrap' }}>
        {(['map', 'zones', 'routes', 'scanner'] as const).map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'map' ? '🗺️ Map' : t === 'zones' ? '📍 Zones' : t === 'routes' ? '🛤️ Routes' : '📷 Scanner'}
          </button>
        ))}
      </div>

      {tab === 'map' && (
        <>
          {/* Simulated Map */}
          <div className="map-container">
            <div className="map-grid">
              {/* Heatmap dots */}
              {heatmapData.map((pt, i) => {
                const p = toPct(pt.lat, pt.lng)
                return (
                  <div key={i} className="map-pin"
                    style={{
                      left: `${p.x}%`, top: `${p.y}%`,
                      background: `rgba(239,68,68,${pt.intensity / 150})`,
                      width: 12 + pt.intensity * 0.08, height: 12 + pt.intensity * 0.08,
                    }} />
                )
              })}
              {/* Current location */}
              <div className="map-dot" style={{ left: `${curPos.x}%`, top: `${curPos.y}%`, background: ctx.emotion.color, boxShadow: `0 0 20px ${ctx.emotion.color}` }} />
              {/* Zone markers */}
              {ctx.geoZones.map(z => {
                const p = toPct(z.lat, z.lng)
                return (
                  <div key={z.id} className="map-pin-label"
                    style={{ left: `${p.x}%`, top: `${p.y - 3}%`, color: z.color }}>
                    {z.name}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Status */}
          <div className="glass">
            <div className="glass-title">Current Status</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-mono" style={{ color: ctx.emotion.color, fontSize: 14 }}>●</span>
              <span style={{ fontSize: 14 }}>{ctx.emotion.stateName}</span>
              <span className="text-muted text-sm">at {pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 Location active</span>
              </div>
              <button className="neon-btn small secondary" onClick={() => setShowUnsafe(!showUnsafe)}>
                {showUnsafe ? 'Hide' : 'Unsafe Zones'}
              </button>
            </div>
          </div>

          {/* Unsafe Zones */}
          {showUnsafe && (
            <div className="glass" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
              <div className="glass-title">⚠️ Detected Unsafe Zones</div>
              <div className="trigger-item">
                <div className="info">
                  <div className="name">Shopping District</div>
                  <div className="meta">High stress detected 8 times · Mark as unsafe?</div>
                </div>
                <button className="neon-btn small danger">Mark</button>
              </div>
              <div className="trigger-item">
                <div className="info">
                  <div className="name">Bus Terminal</div>
                  <div className="meta">High stress detected 5 times · Mark as unsafe?</div>
                </div>
                <button className="neon-btn small danger">Mark</button>
              </div>
            </div>
          )}

          {/* Heatmap legend */}
          <div className="glass">
            <div className="glass-title">Stress Heatmap</div>
            <div className="flex items-center gap-3">
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(to right, rgba(0,212,255,0.1), rgba(239,68,68,0.8))' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Low → High</span>
            </div>
          </div>
        </>
      )}

      {tab === 'zones' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="text-muted text-sm">{totalZones} zone{totalZones !== 1 ? 's' : ''}</span>
            <button className="neon-btn small primary" onClick={() => setShowZoneModal(true)}>+ Add Zone</button>
          </div>
          {ctx.geoZones.map(z => (
            <div key={z.id} className="glass" style={{ borderLeft: `3px solid ${z.color}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{z.name}</div>
                  <div className="text-sm text-muted">
                    {z.lat.toFixed(4)}, {z.lng.toFixed(4)} · {z.radius}m radius
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span style={{ fontSize: 11, color: z.notifyOnEnter ? 'var(--neon-mint)' : 'var(--text-muted)' }}>
                      📥 {z.notifyOnEnter ? 'Enter' : 'Enter off'}
                    </span>
                    <span style={{ fontSize: 11, color: z.notifyOnExit ? 'var(--neon-mint)' : 'var(--text-muted)' }}>
                      📤 {z.notifyOnExit ? 'Exit' : 'Exit off'}
                    </span>
                  </div>
                </div>
                <button className="action-btn" onClick={() => handleDeleteZone(z.id)}>✕</button>
              </div>
            </div>
          ))}
          {ctx.geoZones.length === 0 && (
            <div className="empty-state"><div className="icon">📍</div>No zones added yet</div>
          )}
        </>
      )}

      {tab === 'routes' && (
        <>
          <div className="glass">
            <div className="glass-title">Today's Route</div>
            <div className="map-container" style={{ height: 160 }}>
              <div className="map-grid">
                {routeHistory.map((pt, i) => {
                  const p = toPct(pt.lat, pt.lng)
                  const color = pt.emotion ? (emotionColors[pt.emotion] || '#666') : '#666'
                  return (
                    <div key={i} className="map-pin"
                      style={{
                        left: `${p.x}%`, top: `${p.y}%`,
                        background: color, width: 5, height: 5,
                        opacity: 0.3 + (i / routeHistory.length) * 0.7,
                      }} />
                  )
                })}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted">{routeHistory.length} recorded points</span>
              <span className="text-sm text-muted">Today</span>
            </div>
          </div>

          <div className="glass">
            <div className="glass-title">Recent Locations</div>
            {routeHistory.slice(0, 8).map((pt, i) => {
              const color = pt.emotion ? (emotionColors[pt.emotion] || '#666') : '#666'
              return (
                <div key={i} className="event-item" style={{ borderLeftColor: color }}>
                  <div className="dot" style={{ background: color }} />
                  <div className="info">
                    <div className="state">{pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}</div>
                    <div className="meta">Stress {pt.stress}% · {pt.emotion}</div>
                  </div>
                  <div className="time">{new Date(pt.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'scanner' && (
        <>
          <div className="glass" style={{ textAlign: 'center', padding: 24 }}>
            <div className="glass-title">📷 Environment Scanner</div>
            <div style={{ fontSize: 64, marginBottom: 12 }}>📸</div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Point your camera at a new environment to assess sensory load before entering.
            </p>
            <div className="map-container" style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="map-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                  <div className="text-sm text-muted">Camera viewfinder</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Scan Result */}
          <div className="glass" style={{ borderColor: 'rgba(0,212,255,0.2)' }}>
            <div className="glass-title">Last Scan — Coffee Shop</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Sensory Load Score</span>
              <div className="progress-ring" style={{ width: 56, height: 56 }}>
                <svg viewBox="0 0 36 36">
                  <path className="progress-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="progress-ring-fg" stroke={6 > 5 ? 'var(--neon-amber)' : 'var(--neon-mint)'}
                    strokeDasharray={`${(6 / 10) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="center" style={{ fontSize: 16, color: 6 > 5 ? 'var(--neon-amber)' : 'var(--neon-mint)' }}>6</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Visual Noise', value: 7, color: 'var(--neon-amber)' },
                { label: 'Lighting', value: 4, color: 'var(--neon-mint)' },
                { label: 'Crowd Density', value: 8, color: 'var(--neon-red)' },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <div className="text-sm text-muted">{item.label}</div>
                  <div className="text-mono" style={{ fontSize: 20, color: item.color }}>{item.value}/10</div>
                </div>
              ))}
            </div>
            <div className="ai-insight" style={{ margin: 0 }}>
              <div className="head"><span>🤖 Comfort Prediction</span></div>
              <div className="text">Based on your profile, comfort probability in this environment is <strong style={{ color: 'var(--neon-amber)' }}>42%</strong>. Similar environments (cafés) have historically triggered mild unease. Consider visiting during off-peak hours.</div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <span className="text-sm text-muted">🚶 5 min walk · 📍 200m away</span>
            </div>
          </div>

          {/* Scan History */}
          <div className="glass">
            <div className="glass-title">Recent Scans</div>
            {[
              { name: 'Supermarket', score: 8, comfort: 25, time: 'Yesterday' },
              { name: 'Library', score: 2, comfort: 91, time: '2 days ago' },
              { name: 'Park Bench', score: 3, comfort: 88, time: '3 days ago' },
            ].map((scan, i) => (
              <div key={i} className="event-item" style={{ borderLeftColor: scan.score > 7 ? 'var(--neon-red)' : scan.score > 4 ? 'var(--neon-amber)' : 'var(--neon-mint)' }}>
                <div className="dot" style={{ background: scan.score > 7 ? 'var(--neon-red)' : scan.score > 4 ? 'var(--neon-amber)' : 'var(--neon-mint)' }} />
                <div className="info">
                  <div className="state">{scan.name}</div>
                  <div className="meta">Load: {scan.score}/10 · Comfort: {scan.comfort}%</div>
                </div>
                <div className="time">{scan.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Zone Modal */}
      {showZoneModal && (
        <div className="modal-overlay" onClick={() => setShowZoneModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>📍 Add Geofence Zone</h3>
            <input className="neon-input" placeholder="Zone name (e.g. Home, School)" value={newZone.name}
              onChange={e => setNewZone({ ...newZone, name: e.target.value })} />
            <div className="text-sm text-muted mb-2">Current location will be used as center point.</div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <label className="flex items-center gap-2" style={{ fontSize: 13 }}>
                <input type="checkbox" checked={newZone.notifyOnEnter}
                  onChange={e => setNewZone({ ...newZone, notifyOnEnter: e.target.checked })} />
                Notify on enter
              </label>
              <label className="flex items-center gap-2" style={{ fontSize: 13 }}>
                <input type="checkbox" checked={newZone.notifyOnExit}
                  onChange={e => setNewZone({ ...newZone, notifyOnExit: e.target.checked })} />
                Notify on exit
              </label>
            </div>
            <div className="modal-actions">
              <button className="neon-btn secondary" onClick={() => setShowZoneModal(false)}>Cancel</button>
              <button className="neon-btn primary" onClick={handleAddZone}>Add Zone</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
