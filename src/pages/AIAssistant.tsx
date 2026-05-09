import { useState, useEffect, useRef } from 'react'
import { useCtx } from '../App'
import type { ChatMessage } from '../types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'

type Tab = 'chat' | 'insights' | 'progress'

const AI_RESPONSES: Record<string, string> = {
  'stress': 'Looking at your data, stress tends to spike in the afternoons, particularly between 14:00-15:30. This correlates with higher heart rate (avg 95 BPM) and lower HRV. Suggestions: try a 5-minute breathing break around 14:00.',
  'anxiety': 'Your anxiety episodes are most frequent on weekday mornings. The pattern suggests a connection with transitions (e.g., preparing for school). Consider establishing a calming morning routine.',
  'sleep': 'Your sleep quality averages 3.4/5. HRV during sleep shows adequate recovery. To improve: maintain consistent bed time, reduce screen time 30 min before sleep.',
  'report': 'Generating your wellness report for the past 7 days. Key findings:\n• Average Wellness Score: 72 (↑3 from previous week)\n• Most common emotion: Calm (34%)\n• Stress episodes: 12 (↓2)\n• Top trigger: Crowded places',
  'happy': 'You\'ve been in a positive state for the past 4 hours. Your HRV is elevated and stress is low. Keep up whatever you\'re doing!',
  'default': 'I\'m analyzing your physiological patterns. Here\'s what I\'ve found: your baseline HR is 72 BPM with good variability. Stress response is within normal range for today. Would you like me to dive deeper into any specific area?',
}

const quickQuestions = [
  'Why was I stressed on Friday?',
  'What helps me calm down?',
  'Generate a report for my doctor',
  'How is my sleep quality?',
]

export default function AIAssistant() {
  const ctx = useCtx()
  const [tab, setTab] = useState<Tab>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatEnd = useRef<HTMLDivElement>(null)

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome', from: 'ai', text: '👋 Hi! I\'m your AI wellness assistant. Ask me anything about your emotional patterns, stress triggers, or generate reports.', ts: Date.now(),
      }])
    }
  }, [])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { id: 'm' + Date.now(), from: 'user', text: text.trim(), ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let response = AI_RESPONSES['default']
      const lower = text.toLowerCase()
      if (lower.includes('stress') || lower.includes('anxious')) response = AI_RESPONSES['stress']
      else if (lower.includes('anxiety') || lower.includes('worry')) response = AI_RESPONSES['anxiety']
      else if (lower.includes('sleep') || lower.includes('rest')) response = AI_RESPONSES['sleep']
      else if (lower.includes('report') || lower.includes('doctor')) response = AI_RESPONSES['report']
      else if (lower.includes('happy') || lower.includes('good') || lower.includes('calm')) response = AI_RESPONSES['happy']

      const aiMsg: ChatMessage = { id: 'm' + Date.now(), from: 'ai', text: response, ts: Date.now() }
      setMessages(prev => [...prev, aiMsg])
      setTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  // Progress data (simulated 3 months)
  const progressData = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    wellness: Math.round(60 + Math.sin(i * 0.8) * 15 + Math.random() * 10),
    stress: Math.round(30 + Math.cos(i * 0.6) * 10 + Math.random() * 8),
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) return (
      <div className="tooltip-bubble">
        <div style={{ fontWeight: 600 }}>{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
        ))}
      </div>
    )
    return null
  }

  return (
    <div className="page">
      <h1 className="page-title">AI Assistant</h1>

      <div className="tab-bar">
        {(['chat', 'insights', 'progress'] as const).map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}>
            {t === 'chat' ? '💬 Chat' : t === 'insights' ? '💡 Insights' : '📈 Progress'}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.from}`}>
                <div>{msg.text}</div>
                <div className="ts">{new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg ai">
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ animation: 'pulse-ring 1s infinite', opacity: 0.4 }}>●</span>
                  <span style={{ animation: 'pulse-ring 1s infinite 0.2s', opacity: 0.4 }}>●</span>
                  <span style={{ animation: 'pulse-ring 1s infinite 0.4s', opacity: 0.4 }}>●</span>
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {/* Quick questions */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            {quickQuestions.map((q, i) => (
              <button key={i} className="neon-btn small secondary" style={{ width: 'auto', padding: '6px 10px', fontSize: 11 }}
                onClick={() => handleSend(q)}>
                {q}
              </button>
            ))}
          </div>

          <div className="chat-input-wrap">
            <input placeholder="Ask me anything..." value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(input) }} />
            <button onClick={() => handleSend(input)}>➤</button>
          </div>
        </div>
      )}

      {tab === 'insights' && (
        <>
          {/* Predictive Warning */}
          <div className="insight-card warning">
            <div className="icon">⚠️</div>
            <div className="content">
              <div className="title">Risk Advisory — Today</div>
              <div className="text">
                Similar physiological patterns preceded elevated anxiety last Tuesday.
                Current conditions show 62% match. Consider preparing calming strategies.
              </div>
            </div>
          </div>

          {/* Daily Insight */}
          <div className="insight-card insight">
            <div className="icon">📊</div>
            <div className="content">
              <div className="title">Morning Pattern</div>
              <div className="text">
                Your stress levels are typically 23% lower on weekends.
                Mornings between 8-10 AM show the highest variability.
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="insight-card tip">
            <div className="icon">🧘</div>
            <div className="content">
              <div className="title">Recommended: Deep Breathing</div>
              <div className="text">
                Based on your current HRV trend (28 ms), a 4-7-8 breathing
                exercise could help improve your state within 3 minutes.
              </div>
            </div>
          </div>

          {/* More insights */}
          <div className="insight-card insight">
            <div className="icon">🎯</div>
            <div className="content">
              <div className="title">Weekly Progress</div>
              <div className="text">
                Your average Wellness Score this week: 74 (↑5 from last week).
                Calm states increased by 12%. Great progress!
              </div>
            </div>
          </div>

          {/* Event Journal */}
          <div className="glass">
            <div className="glass-title">📝 Event Journal</div>
            {ctx.events.slice(0, 5).map(ev => (
              <div key={ev.id} className="event-item" style={{ borderLeftColor: ev.emotion.color }}>
                <div className="info">
                  <div className="state">{ev.emotion.stateName} {ev.note && `— ${ev.note}`}</div>
                  <div className="meta">HR {ev.heartRate} · Stress {ev.stress}%</div>
                </div>
                <div className="time">{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>

          {/* Add note to timeline */}
          <div className="glass">
            <div className="glass-title">Add Note to Timeline</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="neon-input" style={{ margin: 0, flex: 1 }} placeholder="e.g. Was at the mall..."
                onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { ctx.addNote({ id: Date.now().toString(), timestamp: Date.now(), note: (e.target as HTMLInputElement).value.trim(), tags: [] }); (e.target as HTMLInputElement).value = '' } }} />
              <button className="neon-btn small primary" style={{ width: 'auto' }}
                onClick={e => {
                  const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                  if (input?.value.trim()) { ctx.addNote({ id: Date.now().toString(), timestamp: Date.now(), note: input.value.trim(), tags: [] }); input.value = '' }
                }}>Add</button>
            </div>
          </div>
        </>
      )}

      {tab === 'progress' && (
        <>
          {/* Long-term Wellness Trend */}
          <div className="chart-box">
            <div className="chart-title">Wellness Score Trend (3 months)</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="wellnessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="wellness" stroke="#00d4ff" fill="url(#wellnessGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stress Trend */}
          <div className="chart-box">
            <div className="chart-title">Stress Level Trend</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="stress" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary stats */}
          <div className="glass">
            <div className="glass-title">Progress Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="text-mono" style={{ fontSize: 28, color: 'var(--neon-mint)', fontWeight: 700 }}>72</div>
                <div className="text-sm text-muted">Avg Wellness</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-mono" style={{ fontSize: 28, color: 'var(--neon-amber)', fontWeight: 700 }}>34</div>
                <div className="text-sm text-muted">Avg Stress</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-mono" style={{ fontSize: 28, color: 'var(--neon-blue)', fontWeight: 700 }}>75</div>
                <div className="text-sm text-muted">Days Tracked</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-mono" style={{ fontSize: 28, color: 'var(--neon-purple)', fontWeight: 700 }}>8</div>
                <div className="text-sm text-muted">Triggers Found</div>
              </div>
            </div>
          </div>

          {/* Doctor report */}
          <button className="neon-btn primary">
            📄 Generate Doctor Report
          </button>
        </>
      )}
    </div>
  )
}
