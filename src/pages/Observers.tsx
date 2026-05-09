import { useState } from 'react'
import { useCtx } from '../App'
import { EmergencyContact } from '../types'

type Tab = 'observers' | 'emergency'

export default function Observers() {
  const ctx = useCtx()
  const [tab, setTab] = useState<Tab>('observers')
  const [showInvite, setShowInvite] = useState(false)
  const [showAddEmergency, setShowAddEmergency] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    try { return JSON.parse(localStorage.getItem('au_emergency') || '[]') } catch { return [] }
  })
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' })

  const saveEmergency = (contacts: EmergencyContact[]) => {
    setEmergencyContacts(contacts)
    localStorage.setItem('au_emergency', JSON.stringify(contacts))
  }

  const handleAddEmergency = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return
    const contact: EmergencyContact = { id: 'ec' + Date.now(), ...newContact }
    saveEmergency([...emergencyContacts, contact])
    setNewContact({ name: '', phone: '', relation: '' })
    setShowAddEmergency(false)
  }

  const handleRemoveEmergency = (id: string) => {
    saveEmergency(emergencyContacts.filter(c => c.id !== id))
  }

  const avatars = ['👩', '👨', '👴', '👩‍⚕️', '👨‍🏫']
  const roleLabels = { parent: 'Parent', teacher: 'Teacher', doctor: 'Doctor', therapist: 'Therapist' }

  return (
    <div className="page">
      <h1 className="page-title">Observers</h1>

      <div className="tab-bar">
        <button className={`tab-btn${tab === 'observers' ? ' active' : ''}`} onClick={() => setTab('observers')}>👥 Observers</button>
        <button className={`tab-btn${tab === 'emergency' ? ' active' : ''}`} onClick={() => setTab('emergency')}>🆘 Emergency</button>
      </div>

      {tab === 'observers' && (
        <>
          {/* Invite button */}
          <button className="neon-btn primary mb-3" onClick={() => setShowInvite(true)}>
            ✉️ Invite Observer
          </button>

          {/* Observer list */}
          {ctx.observers.map((obs, i) => (
            <div key={obs.id} className="observer-card">
              <div className="avatar" style={{ background: `rgba(0,212,255,${0.1 + i * 0.05})` }}>
                {avatars[i % avatars.length]}
              </div>
              <div className="info">
                <div className="name">{obs.name}</div>
                <div className="role">{roleLabels[obs.role]}</div>
              </div>
              <div className="status-indicator" style={{ background: obs.active ? 'var(--neon-mint)' : 'var(--text-muted)' }} />
            </div>
          ))}

          {/* Access Controls */}
          <div className="glass">
            <div className="glass-title">Access Controls</div>
            {ctx.observers.map((obs, i) => (
              <div key={obs.id}>
                <div style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 4px', color: 'var(--text-secondary)' }}>
                  {obs.name}
                </div>
                {([
                  { key: 'liveStatus', label: 'Live Status' },
                  { key: 'viewHistory', label: 'View History' },
                  { key: 'viewGps', label: 'View GPS' },
                  { key: 'receiveSos', label: 'Receive SOS' },
                  { key: 'pushOnEscalation', label: 'Push on Escalation' },
                ] as const).map(perm => (
                  <div key={perm.key} className="setting-row">
                    <div className="left">
                      <div className="label">{perm.label}</div>
                    </div>
                    <div className={`toggle${(obs as any)[perm.key] ? ' on' : ''}`}
                      onClick={() => { (obs as any)[perm.key] = !(obs as any)[perm.key]; ctx.observers.splice(i, 1, obs) }}>
                      <div className="knob" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div className="glass">
            <div className="glass-title">Activity Log</div>
            {[
              { who: 'Sarah', action: 'viewed live status', time: '2 min ago' },
              { who: 'Dr. Park', action: 'viewed history', time: '1 hour ago' },
              { who: 'Sarah', action: 'received SOS alert', time: 'Yesterday' },
            ].map((log, i) => (
              <div key={i} className="event-item" style={{ borderLeftColor: 'var(--accent)' }}>
                <div className="info">
                  <div className="state">{log.who}</div>
                  <div className="meta">{log.action}</div>
                </div>
                <div className="time">{log.time}</div>
              </div>
            ))}
          </div>

          {/* Public Badge Mode */}
          <div className="glass">
            <div className="glass-title">Public Display</div>
            <div className="setting-row">
              <div className="left">
                <div className="label">Show badge color in public</div>
                <div className="desc">When enabled, strangers can see your current emotion via the badge</div>
              </div>
              <div className="toggle on"><div className="knob" /></div>
            </div>
          </div>

          {/* Caregiver Sync Mode */}
          <div className="glass" style={{ borderColor: 'rgba(168,85,247,0.3)' }}>
            <div className="glass-title">🔁 Caregiver Sync Mode</div>
            <div className="flex items-center gap-3 mb-3" style={{ padding: 16, background: 'rgba(168,85,247,0.05)', borderRadius: 8 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                boxShadow: `0 0 20px ${ctx.emotion.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                background: `${ctx.emotion.color}20`,
                border: `2px solid ${ctx.emotion.color}`,
                transition: 'all .5s',
              }}>
                {ctx.user?.name?.[0] || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Live Aura — {ctx.emotion.stateName}</div>
                <div className="text-sm text-muted">Observer sees real-time color around user photo</div>
                <div className="flex items-center gap-2 mt-1">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-mint)', animation: 'pulse-ring 2s infinite' }} />
                  <span style={{ fontSize: 11, color: 'var(--neon-mint)' }}>Sync Active</span>
                </div>
              </div>
            </div>
            <div className="setting-row">
              <div className="left">
                <div className="label">Haptic Bridge</div>
                <div className="desc">Silent vibration pattern when user is distressed</div>
              </div>
              <div className="toggle on"><div className="knob" /></div>
            </div>
            <div className="setting-row" style={{ borderBottom: 'none' }}>
              <div className="left">
                <div className="label">Vibration Pattern</div>
                <div className="desc">Short pulse · Long pulse · Rapid pulse</div>
              </div>
              <select className="neon-input" style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}>
                <option>Gentle (.. .. ..)</option>
                <option>Urgent (... ... ...)</option>
                <option>Rhythmic (.- .- .-)</option>
              </select>
            </div>
          </div>
        </>
      )}

      {tab === 'emergency' && (
        <>
          <button className="neon-btn primary mb-3" onClick={() => setShowAddEmergency(true)}>
            + Add Emergency Contact
          </button>

          {emergencyContacts.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🆘</div>
              No emergency contacts yet
            </div>
          ) : (
            emergencyContacts.map(ec => (
              <div key={ec.id} className="emergency-item">
                <div className="info">
                  <div className="name">{ec.name}</div>
                  <div className="phone">{ec.phone} · {ec.relation}</div>
                </div>
                <button className="call-btn">📞</button>
                <button className="action-btn" onClick={() => handleRemoveEmergency(ec.id)}>✕</button>
              </div>
            ))
          )}
        </>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✉️ Invite Observer</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Share this code with an observer to grant them access:
            </p>
            <div style={{
              padding: 16, background: 'rgba(0,212,255,0.05)', borderRadius: 8,
              textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 24,
              letterSpacing: 8, marginBottom: 12, border: '1px dashed rgba(0,212,255,0.2)',
            }}>
              AURA-{Math.random().toString(36).slice(2, 6).toUpperCase()}
            </div>
            <div className="modal-actions">
              <button className="neon-btn primary" onClick={() => setShowInvite(false)}>Copy Link</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Emergency Modal */}
      {showAddEmergency && (
        <div className="modal-overlay" onClick={() => setShowAddEmergency(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Add Emergency Contact</h3>
            <input className="neon-input" placeholder="Full Name" value={newContact.name}
              onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
            <input className="neon-input" placeholder="Phone Number" value={newContact.phone}
              onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
            <input className="neon-input" placeholder="Relationship (e.g. Parent, Doctor)" value={newContact.relation}
              onChange={e => setNewContact({ ...newContact, relation: e.target.value })} />
            <div className="modal-actions">
              <button className="neon-btn secondary" onClick={() => setShowAddEmergency(false)}>Cancel</button>
              <button className="neon-btn primary" onClick={handleAddEmergency}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
