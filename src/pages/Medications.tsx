import { useState } from 'react'
import { useCtx } from '../App'
import type { MedicationRecord, TherapySession } from '../types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

type Tab = 'meds' | 'therapy' | 'effects'

export default function Medications() {
  const ctx = useCtx()
  const [tab, setTab] = useState<Tab>('meds')
  const [meds, setMeds] = useState<MedicationRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem('au_meds') || '[]') } catch { return [] }
  })
  const [sessions, setSessions] = useState<TherapySession[]>(() => {
    try { return JSON.parse(localStorage.getItem('au_therapy') || '[]') } catch { return [] }
  })
  const [showAddMed, setShowAddMed] = useState(false)
  const [showAddTherapy, setShowAddTherapy] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', startDate: '' })
  const [newTherapy, setNewTherapy] = useState({ type: '', provider: '', notes: '', effectiveness: 3 as 1|2|3|4|5, date: '' })

  const saveMeds = (m: MedicationRecord[]) => { setMeds(m); localStorage.setItem('au_meds', JSON.stringify(m)) }
  const saveSessions = (s: TherapySession[]) => { setSessions(s); localStorage.setItem('au_therapy', JSON.stringify(s)) }

  const handleAddMed = () => {
    if (!newMed.name.trim() || !newMed.dosage.trim()) return
    const med: MedicationRecord = {
      id: 'med' + Date.now(), name: newMed.name, dosage: newMed.dosage,
      frequency: newMed.frequency, startDate: newMed.startDate || new Date().toISOString().split('T')[0],
      logs: [],
    }
    saveMeds([...meds, med])
    setNewMed({ name: '', dosage: '', frequency: '', startDate: '' })
    setShowAddMed(false)
  }

  const handleAddTherapy = () => {
    if (!newTherapy.type.trim() || !newTherapy.date.trim()) return
    const session: TherapySession = {
      id: 'th' + Date.now(), date: newTherapy.date, type: newTherapy.type,
      provider: newTherapy.provider, notes: newTherapy.notes,
      effectiveness: newTherapy.effectiveness,
    }
    saveSessions([...sessions, session])
    setNewTherapy({ type: '', provider: '', notes: '', effectiveness: 3, date: '' })
    setShowAddTherapy(false)
  }

  const toggleTaken = (medId: string, date: string) => {
    const updated = meds.map(med => {
      if (med.id !== medId) return med
      const exists = med.logs.find(l => l.date === date)
      const logs = exists
        ? med.logs.map(l => l.date === date ? { ...l, taken: !l.taken } : l)
        : [...med.logs, { date, taken: true }]
      return { ...med, logs }
    })
    saveMeds(updated)
  }

  // Simulated correlation data
  const correlationData = [
    { month: 'Jan', calm: 32, anxiety: 28, afterTherapy: 38 },
    { month: 'Feb', calm: 35, anxiety: 25, afterTherapy: 42 },
    { month: 'Mar', calm: 38, anxiety: 22, afterTherapy: 48 },
    { month: 'Apr', calm: 42, anxiety: 18, afterTherapy: 52 },
    { month: 'May', calm: 45, anxiety: 16, afterTherapy: 55 },
  ]

  const today = new Date().toISOString().split('T')[0]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) return (
      <div className="tooltip-bubble">
        <div style={{ fontWeight: 600 }}>{label}</div>
        {payload.map((p: any, i: number) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}%</div>)}
      </div>
    )
    return null
  }

  return (
    <div className="page">
      <h1 className="page-title">Medication & Therapy</h1>

      <div className="tab-bar">
        {(['meds', 'therapy', 'effects'] as const).map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'meds' ? '💊 Meds' : t === 'therapy' ? '🛋️ Therapy' : '📈 Effects'}
          </button>
        ))}
      </div>

      {tab === 'meds' && (
        <>
          <button className="neon-btn primary mb-3" onClick={() => setShowAddMed(true)}>
            + Add Medication
          </button>

          {meds.length === 0 ? (
            <div className="empty-state"><div className="icon">💊</div>No medications added yet</div>
          ) : (
            meds.map(med => {
              const takenToday = med.logs.find(l => l.date === today)?.taken || false
              const adherence = med.logs.length > 0
                ? Math.round((med.logs.filter(l => l.taken).length / med.logs.length) * 100)
                : 0
              return (
                <div key={med.id} className="glass" style={{ borderLeft: `3px solid ${takenToday ? 'var(--neon-mint)' : 'var(--neon-amber)'}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <div style={{ fontWeight: 600 }}>{med.name}</div>
                    <button className={`neon-btn small ${takenToday ? 'secondary' : 'primary'}`}
                      style={{ width: 'auto' }} onClick={() => toggleTaken(med.id, today)}>
                      {takenToday ? '✅ Taken' : 'Mark Taken'}
                    </button>
                  </div>
                  <div className="text-sm text-muted">{med.dosage} · {med.frequency} · Since {med.startDate}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${adherence}%`, height: '100%', background: 'var(--neon-mint)', borderRadius: 2 }} />
                    </div>
                    <span className="text-mono text-sm" style={{ color: 'var(--neon-mint)' }}>{adherence}%</span>
                  </div>
                </div>
              )
            })
          )}
        </>
      )}

      {tab === 'therapy' && (
        <>
          <button className="neon-btn primary mb-3" onClick={() => setShowAddTherapy(true)}>
            + Log Therapy Session
          </button>

          {sessions.length === 0 ? (
            <div className="empty-state"><div className="icon">🛋️</div>No therapy sessions logged yet</div>
          ) : (
            sessions.map(s => (
              <div key={s.id} className="glass">
                <div className="flex items-center justify-between mb-1">
                  <div style={{ fontWeight: 600 }}>{s.type}</div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <span key={i} style={{ color: i <= s.effectiveness ? 'var(--neon-amber)' : 'rgba(255,255,255,0.1)' }}>★</span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted">{s.provider} · {s.date}</div>
                {s.notes && <div className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{s.notes}</div>}
              </div>
            ))
          )}
        </>
      )}

      {tab === 'effects' && (
        <>
          {/* Effectiveness correlation */}
          <div className="chart-box">
            <div className="chart-title">📈 Therapy Impact on Calm State</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 60]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="calm" stroke="#00d4ff" strokeWidth={2} dot={false} name="Calm %" />
                <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} dot={false} name="Anxiety %" />
                <Line type="monotone" dataKey="afterTherapy" stroke="#00ffb3" strokeWidth={2} strokeDasharray="4 2" dot={false} name="After Therapy" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              <span><span style={{ color: '#00d4ff', fontWeight: 700 }}>▬</span> Calm</span>
              <span><span style={{ color: '#f59e0b', fontWeight: 700 }}>▬</span> Anxiety</span>
              <span><span style={{ color: '#00ffb3', fontWeight: 700 }}>- -</span> After Therapy</span>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="ai-insight">
            <div className="head"><span>🤖 AI Correlation Analysis</span></div>
            <div className="text">
              After starting therapy, average time in Calm state increased by 23%.
              Crisis episodes reduced by 40% on days following therapy sessions.
              Recommended: maintain current medication dosage and continue weekly sessions.
            </div>
          </div>

          {/* Medication Impact */}
          <div className="chart-box">
            <div className="chart-title">Medication Adherence vs. Wellness</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="calm" fill="#00d4ff" radius={[2, 2, 0, 0]} name="Wellness Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Add Medication Modal */}
      {showAddMed && (
        <div className="modal-overlay" onClick={() => setShowAddMed(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>💊 Add Medication</h3>
            <input className="neon-input" placeholder="Medication name" value={newMed.name}
              onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
            <input className="neon-input" placeholder="Dosage (e.g. 50mg)" value={newMed.dosage}
              onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
            <input className="neon-input" placeholder="Frequency (e.g. Twice daily)" value={newMed.frequency}
              onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} />
            <input className="neon-input" type="date" placeholder="Start date" value={newMed.startDate}
              onChange={e => setNewMed({ ...newMed, startDate: e.target.value })} />
            <div className="modal-actions">
              <button className="neon-btn secondary" onClick={() => setShowAddMed(false)}>Cancel</button>
              <button className="neon-btn primary" onClick={handleAddMed}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Therapy Modal */}
      {showAddTherapy && (
        <div className="modal-overlay" onClick={() => setShowAddTherapy(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>🛋️ Log Therapy Session</h3>
            <input className="neon-input" placeholder="Therapy type (e.g. CBT, ABA)" value={newTherapy.type}
              onChange={e => setNewTherapy({ ...newTherapy, type: e.target.value })} />
            <input className="neon-input" placeholder="Provider name" value={newTherapy.provider}
              onChange={e => setNewTherapy({ ...newTherapy, provider: e.target.value })} />
            <input className="neon-input" type="date" value={newTherapy.date}
              onChange={e => setNewTherapy({ ...newTherapy, date: e.target.value })} />
            <textarea className="neon-input" placeholder="Session notes" value={newTherapy.notes}
              onChange={e => setNewTherapy({ ...newTherapy, notes: e.target.value })} />
            <div style={{ marginBottom: 12 }}>
              <div className="text-sm text-muted mb-1">Effectiveness</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} className={`neon-btn small ${newTherapy.effectiveness === i ? 'primary' : 'secondary'}`}
                    style={{ flex: 1, width: 'auto' }} onClick={() => setNewTherapy({ ...newTherapy, effectiveness: i as 1|2|3|4|5 })}>
                    {i}★
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="neon-btn secondary" onClick={() => setShowAddTherapy(false)}>Cancel</button>
              <button className="neon-btn primary" onClick={handleAddTherapy}>Log Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
