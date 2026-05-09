import { useState } from 'react'
import { useCtx } from '../App'
import { EMOTIONS } from '../constants'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

const SENSORS = ['Heart Rate', 'HRV', 'Temperature', 'GSR', 'Movement']

// Generate simulated sensory signatures per emotion
function genSignatures() {
  return EMOTIONS.map(em => {
    const base: Record<string, number> = {
      'Heart Rate': 50 + Math.sin(em.id * 1.5) * 30 + Math.random() * 10,
      'HRV': 50 + Math.cos(em.id * 1.2) * 25 + Math.random() * 10,
      'Temperature': 50 + Math.sin(em.id * 0.8 + 1) * 15 + Math.random() * 10,
      'GSR': 50 + Math.sin(em.id * 1.8 + 2) * 35 + Math.random() * 10,
      'Movement': 50 + Math.cos(em.id * 1.1 + 3) * 20 + Math.random() * 10,
    }
    return { emotionId: em.id, emotionName: em.name, color: em.color, sensors: base }
  })
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) return (
    <div className="tooltip-bubble">
      {payload.map((p: any, i: number) => <div key={i} style={{ color: p.color }}>{p.name}: {Math.round(p.value)}</div>)}
    </div>
  )
  return null
}

export default function SensoryProfile() {
  const ctx = useCtx()
  const [selectedEmotion, setSelectedEmotion] = useState(0)
  const [signatures] = useState(genSignatures)
  const sig = signatures[selectedEmotion]

  const radarData = SENSORS.map(s => ({
    sensor: s === 'Heart Rate' ? 'HR' : s === 'Temperature' ? 'Temp' : s === 'Movement' ? 'Move' : s,
    value: Math.round(sig.sensors[s]),
    fullMark: 100,
  }))
  radarData.push(radarData[0]) // close the radar polygon

  // Learning progress simulation
  const daysOfData = Math.min(30, Math.round(ctx.events.length / 10))
  const progress = Math.min(100, (daysOfData / 30) * 100)

  return (
    <div className="page">
      <h1 className="page-title">Sensory Profile</h1>

      {/* Learning Progress */}
      <div className="glass" style={{ borderColor: 'rgba(168,85,247,0.3)' }}>
        <div className="glass-title">🧠 AI Learning Progress</div>
        <div className="flex items-center gap-3" style={{ marginBottom: 4 }}>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #00d4ff)', borderRadius: 4, transition: 'width .5s' }} />
          </div>
          <span className="text-mono" style={{ fontSize: 13, color: 'var(--neon-purple)' }}>{daysOfData}/30 days</span>
        </div>
        <div className="text-sm text-muted">
          {progress >= 100
            ? '✅ Profile complete! Your unique emotional signatures are fully mapped.'
            : `Collecting data to build your personalized sensory profile. ${30 - daysOfData} days remaining for full accuracy.`}
        </div>
      </div>

      {/* Emotion Selector */}
      <div className="tab-bar" style={{ flexWrap: 'wrap' }}>
        {EMOTIONS.map(em => (
          <button key={em.id} className={`tab-btn${selectedEmotion === em.id ? ' active' : ''}`}
            style={{ flex: 1, minWidth: '15%' }}
            onClick={() => setSelectedEmotion(em.id)}>
            {em.icon} {em.name}
          </button>
        ))}
      </div>

      {/* Radar Chart — Emotional Fingerprint */}
      <div className="chart-box">
        <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: sig.color }}>●</span>
          Emotional Fingerprint — {sig.emotionName}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="sensor" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Radar name={sig.emotionName} dataKey="value" stroke={sig.color} fill={sig.color} fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          {SENSORS.map(s => (
            <span key={s}>{s}: <span className="text-mono" style={{ color: 'var(--text-primary)' }}>{Math.round(sig.sensors[s])}</span></span>
          ))}
        </div>
      </div>

      {/* Unique Signature Description */}
      <div className="ai-insight">
        <div className="head"><span>🧬 Signature Analysis</span></div>
        <div className="text">
          {selectedEmotion === 0 && 'Your Calm state is characterized by balanced HRV and low GSR — a textbook relaxation response. Your temperature runs slightly warm, indicating good peripheral circulation.'}
          {selectedEmotion === 1 && 'Joy shows elevated HR with high HRV — the "happy heart" pattern. Movement readings are higher, suggesting physical expression of positive emotion.'}
          {selectedEmotion === 2 && 'Mild Unease presents as a slight GSR elevation with stable HR. Your unique signature: temperature drops before HR rises — an early warning indicator specific to you.'}
          {selectedEmotion === 3 && 'Anxiety in your profile: HR climbs rapidly while HRV collapses. Your GSR response is delayed compared to HR — atypical and flagged as your personal biomarker.'}
          {selectedEmotion === 4 && 'Stress: extreme GSR spike with near-flat HRV. Your movement signature shows freeze response (↓ accelerometer) — distinct from the typical agitation pattern.'}
          {selectedEmotion === 5 && 'Transitional states show high variability across all sensors. Your signature: GSR normalizes before HR — you recover physiologically faster than most users.'}
        </div>
      </div>

      {/* Comparison across emotions */}
      <div className="chart-box">
        <div className="chart-title">Sensor Range Across States</div>
        {SENSORS.map(sensor => (
          <div key={sensor} style={{ marginBottom: 12 }}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sensor}</span>
            </div>
            <div className="flex items-center gap-1" style={{ height: 16 }}>
              {signatures.map(sig => (
                <div key={sig.emotionId} className="timeline-seg"
                  style={{
                    flex: sig.sensors[sensor],
                    background: sig.color,
                    height: 12,
                    opacity: 0.7 + (sig.emotionId === selectedEmotion ? 0.3 : 0),
                  }} />
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted" style={{ fontSize: 9 }}>
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
