import { useState, useEffect, useRef } from 'react'
import { useCtx } from '../App'
import type { InterventionLog } from '../types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const INTERVENTIONS = [
  { id: 'breathing', icon: '🫁', name: 'Box Breathing', desc: '4-4-4-4 pattern. Calms nervous system.', duration: 120 },
  { id: 'playlist', icon: '🎵', name: 'Anchor Playlist', desc: 'Your calming playlist — lofi ambient.', duration: 300 },
  { id: 'vibration', icon: '📳', name: 'Vibration Pattern', desc: '"Breathe with me" rhythm on badge.', duration: 120 },
  { id: 'animation', icon: '✨', name: 'Calm Animation', desc: 'Gentle visual animation on screen.', duration: 60 },
]

export default function Interventions() {
  const ctx = useCtx()
  const [activeIntervention, setActiveIntervention] = useState<string | null>(null)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale')
  const [breathCount, setBreathCount] = useState(0)
  const [stressBefore, setStressBefore] = useState(0)
  const [logs, setLogs] = useState<InterventionLog[]>([])
  const [showResult, setShowResult] = useState(false)
  const [stressAfter, setStressAfter] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const intervalRef = useRef<number>()

  // Auto-trigger when stress > 60 and emotion is anxiety/stress
  useEffect(() => {
    if (ctx.stress > 60 && (ctx.emotion.stateId === 3 || ctx.emotion.stateId === 4)) {
      if (!activeIntervention && !showResult) {
        setActiveIntervention('breathing')
        setStressBefore(ctx.stress)
        startBreathing()
      }
    }
  }, [ctx.stress, ctx.emotion.stateId])

  const startBreathing = () => {
    setBreathCount(0)
    setBreathingPhase('inhale')
    let phase = 'inhale', count = 0
    let time = 0

    const phases = ['inhale', 'hold', 'exhale', 'rest']
    const durations: Record<string, number> = { inhale: 4, hold: 4, exhale: 4, rest: 4 }

    intervalRef.current = window.setInterval(() => {
      time++
      if (time >= durations[phase]) {
        time = 0
        const idx = phases.indexOf(phase)
        const next = phases[(idx + 1) % 4]
        phase = next
        setBreathingPhase(next as any)
        if (next === 'inhale') {
          count++
          setBreathCount(count)
          if (count >= 4) {
            clearInterval(intervalRef.current)
            setStressAfter(ctx.stress - Math.round(Math.random() * 20 + 5))
            setActiveIntervention(null)
            setShowResult(true)
            const log: InterventionLog = {
              id: Date.now().toString(), timestamp: Date.now(),
              type: 'breathing', triggeredBy: ctx.emotion.stateId,
              completed: true, stressBefore, stressAfter: Math.max(0, stressBefore - 15),
              effective: true,
            }
            setLogs(prev => [log, ...prev].slice(0, 50))
          }
        }
      }
    }, 1000)
  }

  const effectivenessData = [
    { name: 'Breathing', rate: 82 },
    { name: 'Playlist', rate: 74 },
    { name: 'Vibration', rate: 68 },
    { name: 'Animation', rate: 79 },
  ]

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
      <h1 className="page-title">Calm Interventions</h1>

      {/* Active Intervention */}
      {activeIntervention && (
        <div className="glass" style={{ borderColor: 'rgba(0,255,179,0.3)', textAlign: 'center', padding: 32 }}>
          <div className="glass-title" style={{ color: 'var(--neon-mint)' }}>🔄 Auto-Intervention Active</div>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '16px auto' }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,255,179,0.1)" strokeWidth="4" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--neon-mint)" strokeWidth="4"
                strokeDasharray={`${(breathCount / 4) * 264}, 264`} strokeLinecap="round" />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 36, marginBottom: 4 }}>
                {breathingPhase === 'inhale' ? '🌬️' : breathingPhase === 'hold' ? '⏸️' : breathingPhase === 'exhale' ? '💨' : '😌'}
              </div>
              <div className="text-mono" style={{ fontSize: 18, color: 'var(--neon-mint)', textTransform: 'uppercase' }}>{breathingPhase}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Cycle {breathCount}/4</div>
            </div>
          </div>
          <div className="text-sm text-muted">Breathe with the rhythm. Focus on slow, deep breaths.</div>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className="glass" style={{ borderColor: 'rgba(0,255,179,0.3)', textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--neon-mint)', marginBottom: 8 }}>Intervention Complete!</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="text-sm text-muted">Before</div>
              <div className="text-mono" style={{ fontSize: 22, color: 'var(--neon-red)' }}>{stressBefore}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="text-sm text-muted">After</div>
              <div className="text-mono" style={{ fontSize: 22, color: 'var(--neon-mint)' }}>{Math.max(0, stressBefore - 15)}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="text-sm text-muted">Drop</div>
              <div className="text-mono" style={{ fontSize: 22, color: 'var(--neon-blue)' }}>-{Math.min(stressBefore, 15)}%</div>
            </div>
          </div>
          <button className="neon-btn small secondary" style={{ width: 'auto' }} onClick={() => setShowResult(false)}>Dismiss</button>
        </div>
      )}

      {/* Available Interventions */}
      <div className="glass">
        <div className="glass-title">Manual Interventions</div>
        {INTERVENTIONS.map(int => (
          <div key={int.id} className="observer-card" style={{ cursor: 'pointer' }}
            onClick={() => {
              if (!activeIntervention) {
                setActiveIntervention(int.id)
                setStressBefore(ctx.stress)
                if (int.id === 'breathing') startBreathing()
              }
            }}>
            <div style={{ fontSize: 28 }}>{int.icon}</div>
            <div className="info">
              <div className="name">{int.name}</div>
              <div className="role">{int.desc}</div>
            </div>
            <span className="text-mono text-sm" style={{ color: 'var(--text-muted)' }}>{int.duration}s</span>
          </div>
        ))}
      </div>

      {/* Effectiveness */}
      <div className="chart-box">
        <div className="chart-title">📊 Intervention Effectiveness</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={effectivenessData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" fill="var(--neon-mint)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* History Toggle */}
      <button className="neon-btn secondary" onClick={() => setShowHistory(!showHistory)}>
        📋 {showHistory ? 'Hide' : 'Show'} Intervention History
      </button>

      {showHistory && (
        <div className="glass mt-2">
          <div className="glass-title">History</div>
          {logs.length === 0 ? (
            <div className="text-sm text-muted">No interventions recorded yet.</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="event-item" style={{ borderLeftColor: log.effective ? 'var(--neon-mint)' : 'var(--neon-amber)' }}>
                <div className="dot" style={{ background: log.effective ? 'var(--neon-mint)' : 'var(--neon-amber)' }} />
                <div className="info">
                  <div className="state">{log.type} — {log.effective ? '✅ Effective' : '⚠️ Partial'}</div>
                  <div className="meta">Stress: {log.stressBefore}% → {log.stressAfter ?? '?'}%</div>
                </div>
                <div className="time">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
