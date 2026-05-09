import { useState } from 'react'
import { useCtx } from '../App'
import { EMOTIONS } from '../constants'
import { genTriggerEvents } from '../data'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const PERIODS = ['Day', 'Week', 'Month']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Analytics() {
  const ctx = useCtx()
  const [period, setPeriod] = useState('Day')
  const triggers = genTriggerEvents()

  // Emotion distribution
  const distData = EMOTIONS.map(em => {
    const count = ctx.events.filter(e => e.emotion.stateId === em.id).length
    return { name: em.name, value: count || Math.round(Math.random() * 20 + 5), color: em.color }
  })

  // Timeline segments
  const timelineSegments = ctx.events.slice(0, 48).reverse().map(e => ({
    color: e.emotion.color,
    stress: e.stress,
    time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    emotion: e.emotion.stateName,
  }))

  // HR data for chart
  const hrData = ctx.events.slice(0, 30).reverse().map((e, i) => ({
    time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hr: e.heartRate,
    stress: e.stress,
    temp: e.temperature,
  }))

  // Heatmap data (simulated 7x24)
  const heatmapData = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => ({
      day, hour,
      value: Math.round(Math.random() * 100),
    }))
  )

  // Week comparison data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekCompare = weekDays.map(d => ({
    day: d,
    current: Math.round(Math.random() * 40 + 30),
    previous: Math.round(Math.random() * 40 + 25),
  }))

  const totalEvents = distData.reduce((a, b) => a + b.value, 0)

  const [showExport, setShowExport] = useState(false)

  const handleExport = (format: 'csv' | 'pdf') => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ctx.events.slice(0, 50), null, 2))
    const a = document.createElement('a'); a.href = dataStr; a.download = `auralink-export.${format === 'csv' ? 'csv' : 'json'}`; a.click()
    setShowExport(false)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) return (
      <div className="tooltip-bubble">
        <div style={{ fontWeight: 600 }}>{label}</div>
        {payload.map((p: any, i: number) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
      </div>
    )
    return null
  }

  return (
    <div className="page">
      <h1 className="page-title">Analytics</h1>

      {/* Period Switcher */}
      <div className="tab-bar">
        {PERIODS.map(p => (
          <button key={p} className={`tab-btn${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
        ))}
      </div>

      {/* Emotion Timeline */}
      <div className="chart-box">
        <div className="chart-title">Emotion Timeline</div>
        <div className="timeline-bar">
          {timelineSegments.slice(0, 48).map((seg, i) => (
            <div key={i} className="timeline-seg" style={{ background: seg.color }} />
          ))}
        </div>
        <div className="timeline-labels">
          <span>Now</span>
          <span>-2h</span>
        </div>
      </div>

      {/* Sensor Charts */}
      <div className="chart-box">
        <div className="chart-title">Heart Rate</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={hrData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="hr" stroke="#00d4ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <div className="chart-title">Stress Level</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={hrData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="stress" fill="#f59e0b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="chart-box">
        <div className="chart-title">Stress Heatmap (7×24)</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-around' }}>
            {DAYS.map(d => <div key={d} style={{ fontSize: 8, color: 'var(--text-muted)', height: 14, display: 'flex', alignItems: 'center' }}>{d}</div>)}
          </div>
          <div style={{ flex: 1 }}>
            <div className="heatmap-grid">
              {heatmapData.flat().map((cell, i) => (
                <div key={i} className="heatmap-cell"
                  style={{ background: `rgba(0,212,255,${cell.value / 100})` }}
                  title={`${DAYS[cell.day]} ${cell.hour}:00 - ${cell.value}%`} />
              ))}
            </div>
            <div className="heatmap-labels">
              <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emotion Distribution */}
      <div className="chart-box">
        <div className="chart-title">Emotion Distribution</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 120, height: 120 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={distData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value" stroke="none">
                  {distData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="dist-list" style={{ flex: 1 }}>
            {distData.filter(d => d.value > 0).map(d => (
              <div key={d.name} className="dist-item">
                <div className="color" style={{ background: d.color }} />
                <div className="name">{d.name}</div>
                <div className="bar-wrap"><div className="bar" style={{ width: `${(d.value / Math.max(totalEvents, 1)) * 100}%`, background: d.color }} /></div>
                <div className="pct">{Math.round((d.value / Math.max(totalEvents, 1)) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trigger Analysis */}
      <div className="chart-box">
        <div className="chart-title">Trigger Analysis</div>
        {triggers.map(t => (
          <div key={t.id} className="trigger-item">
            <div className="info">
              <div className="name">{t.trigger}</div>
              <div className="meta">{t.frequency} occurrences · {t.timeOfDay}</div>
            </div>
            <div className="trigger-badge"
              style={{
                background: t.severity === 'high' ? 'rgba(239,68,68,0.15)' : t.severity === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(0,255,179,0.15)',
                color: t.severity === 'high' ? '#ef4444' : t.severity === 'medium' ? '#f59e0b' : '#00ffb3',
              }}>
              {t.severity}
            </div>
          </div>
        ))}
      </div>

      {/* Week Comparison */}
      <div className="chart-box">
        <div className="chart-title">Week Comparison</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekCompare}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="previous" fill="rgba(255,255,255,0.1)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="current" fill="#00d4ff" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          <span><span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>▬</span> Previous</span>
          <span><span style={{ color: '#00d4ff', fontWeight: 700 }}>▬</span> Current</span>
        </div>
      </div>

      {/* Export */}
      <button className="neon-btn primary" onClick={() => setShowExport(true)}>
        📥 Export Report
      </button>

      {showExport && (
        <div className="modal-overlay" onClick={() => setShowExport(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>📥 Export Data</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Download your analytics data as a report.
            </p>
            <div className="modal-actions">
              <button className="neon-btn secondary" onClick={() => setShowExport(false)}>Cancel</button>
              <button className="neon-btn primary small" onClick={() => handleExport('csv')}>CSV</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
