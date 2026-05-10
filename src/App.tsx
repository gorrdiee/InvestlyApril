import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { EMOTIONS } from './constants'
import { genPhysData, classify, calcStress, calcWellness, genEvent } from './data'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import MapPage from './pages/MapPage'
import Observers from './pages/Observers'
import AIAssistant from './pages/AIAssistant'
import Settings from './pages/Settings'
import AuthFlow from './pages/AuthFlow'
import Landing from './pages/Landing'
import SensoryProfile from './pages/SensoryProfile'
import Interventions from './pages/Interventions'
import Medications from './pages/Medications'
import { initFirebase, onAuthChange, logoutUser, saveUserSettings } from './firebase'
import type { EmotionResult, PhysData, EventLog, NotificationRec, BadgeSettings, AppSettings, Observer, GeoZone, ChatMessage, AISuggestion, JournalNote } from './types'

export interface AppCtx {
  user: { name: string; email: string; type: string } | null;
  physData: PhysData | null; emotion: EmotionResult; stress: number; wellness: number;
  events: EventLog[]; notifications: NotificationRec[]; badge: BadgeSettings;
  settings: AppSettings; setSettings: (s: AppSettings) => void;
  observers: Observer[]; geoZones: GeoZone[]; chatMessages: ChatMessage[];
  setChatMessages: (m: ChatMessage[]) => void; suggestions: AISuggestion[];
  journalNotes: JournalNote[]; accentColor: string;
  triggerSos: () => void; addNote: (n: JournalNote) => void; logout: () => void;
}

export const Ctx = createContext<AppCtx>(null!)

export const useCtx = () => useContext(Ctx)

function load(key: string, def: any) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def } catch { return def }
}
function persist(key: string, val: any) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

const NAV = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/analytics', icon: '📈', label: 'Analytics' },
  { to: '/map', icon: '🗺️', label: 'Map' },
  { to: '/observers', icon: '👥', label: 'Observers' },
  { to: '/ai', icon: '🤖', label: 'AI' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
]

const DEFAULT_BADGE: BadgeSettings = {
  brightness: 80, flashMode: 'solid', silentMode: false,
  colors: { 0: '#00d4ff', 1: '#00ffb3', 2: '#facc15', 3: '#f59e0b', 4: '#ef4444', 5: '#a855f7' },
}
const DEFAULT_SETTINGS: AppSettings = {
  language: 'en', theme: 'dark', accentColor: '#00d4ff', fontSize: 'medium', units: 'metric',
  dataRetentionDays: 90, researchSharing: false,
  quietHours: { enabled: false, start: '22:00', end: '07:00', overrideRed: false, overrideSOS: true },
  predictiveAlerts: true, dndMode: false,
}

export default function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string; email: string; type: string } | null>(load('au_user', null))
  const [physData, setPhysData] = useState<PhysData | null>(null)
  const [emotion, setEmotion] = useState<EmotionResult>({ ...EMOTIONS[5], stateId: 5, stateName: 'Transitional', confidence: 50, timestamp: Date.now() })
  const [stress, setStress] = useState(0)
  const [wellness, setWellness] = useState(75)
  const [events, setEvents] = useState<EventLog[]>(load('au_events', []))
  const [notifications, setNotifications] = useState<NotificationRec[]>(load('au_notifs', []))
  const [badge, setBadge] = useState<BadgeSettings>(load('au_badge', DEFAULT_BADGE))
  const [settings, setSettingsState] = useState<AppSettings>(load('au_settings', DEFAULT_SETTINGS))
  const [observers] = useState<Observer[]>(load('au_observers', [
    { id: 'o1', name: 'Sarah', role: 'parent', liveStatus: true, viewHistory: true, viewGps: true, receiveSos: true, pushOnEscalation: true, active: true },
    { id: 'o2', name: 'Dr. Park', role: 'doctor', liveStatus: false, viewHistory: true, viewGps: false, receiveSos: true, pushOnEscalation: false, active: true },
  ]))
  const [geoZones, setGeoZones] = useState<GeoZone[]>(load('au_zones', [
    { id: 'z1', name: 'Home', lat: 51.1714, lng: 71.4451, radius: 200, color: '#00ffb3', notifyOnEnter: true, notifyOnExit: true },
    { id: 'z2', name: 'School', lat: 51.1654, lng: 71.4551, radius: 300, color: '#00d4ff', notifyOnEnter: true, notifyOnExit: false },
  ]))
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [journalNotes, setJournalNotes] = useState<JournalNote[]>([])

  const setSettings = useCallback((s: AppSettings) => { setSettingsState(s); persist('au_settings', s) }, [])

  // Persist
  useEffect(() => { persist('au_user', user) }, [user])
  useEffect(() => { persist('au_events', events.slice(0, 200)) }, [events])
  useEffect(() => { persist('au_notifs', notifications.slice(0, 50)) }, [notifications])
  useEffect(() => { persist('au_badge', badge) }, [badge])
  useEffect(() => { persist('au_zones', geoZones) }, [geoZones])
  useEffect(() => { persist('au_settings', settings) }, [settings])

  // Init Firebase
  useEffect(() => { try { initFirebase() } catch {} }, [])

  // Firebase auth state listener
  useEffect(() => {
    try {
      const unsub = onAuthChange((firebaseUser) => {
        if (firebaseUser) {
          setUser({ name: firebaseUser.displayName || 'User', email: firebaseUser.email || '', type: 'asd_user' })
        } else if (!load('au_user', null)) {
          // Only clear if we don't have a local user (for the demo flow)
        }
      })
      return unsub
    } catch { return }
  }, [])

  // Accent color CSS variable
  useEffect(() => { document.documentElement.style.setProperty('--accent', settings.accentColor) }, [settings.accentColor])

  const handleLogin = useCallback((name: string, email: string, type: string) => {
    setUser({ name, email, type })
    persist('au_user', { name, email, type })
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('au_user')
    try { logoutUser() } catch {}
  }, [])

  // Simulation loop (only when logged in)
  useEffect(() => {
    if (!user) return
    const id = setInterval(() => {
      const pd = genPhysData()
      const em = classify(pd.heartRate, pd.hrvRmssd, pd.gsr)
      const st = calcStress(pd.heartRate, pd.hrvRmssd, pd.gsr)
      const wl = calcWellness(st, pd.heartRate, pd.hrvRmssd)
      setPhysData(pd); setEmotion(em); setStress(st); setWellness(wl)

      if (Math.random() < 0.1) {
        const ev = genEvent(em, pd, st)
        setEvents(prev => [ev, ...prev].slice(0, 300))
        if (em.stateId >= 3 && Math.random() < 0.3) {
          const n: NotificationRec = {
            id: Date.now().toString(), timestamp: Date.now(),
            type: em.stateId === 4 ? 'stress' : 'anxiety',
            title: em.stateId === 4 ? '⚠️ Stress Alert' : '🔶 Anxiety Detected',
            message: `${em.stateName} (${em.confidence}% confidence)`,
            isRead: false,
          }
          setNotifications(prev => [n, ...prev].slice(0, 50))
        }
      }

      if (Math.random() < 0.03) {
        const tips = [
          { type: 'tip' as const, title: 'Breathing Exercise', message: 'Based on rising stress, a 4-7-8 breathing exercise may help.', icon: '🧘' },
          { type: 'insight' as const, title: 'Pattern Detected', message: 'Stress levels are typically lower after 6 PM this week.', icon: '📊' },
          { type: 'warning' as const, title: 'Risk Advisory', message: 'Similar physiological patterns preceded elevated anxiety last Tuesday.', icon: '⚠️' },
        ]
        const tip = tips[Math.floor(Math.random() * tips.length)]
        setSuggestions(prev => [{ id: Date.now().toString(), ...tip, ts: Date.now(), read: false }, ...prev].slice(0, 20))
      }
    }, 3000)
    return () => clearInterval(id)
  }, [user])

  const triggerSos = useCallback(() => {
    if (Math.random() < 0.9) {
      const n: NotificationRec = { id: Date.now().toString(), timestamp: Date.now(), type: 'sos', title: '🚨 SOS Alert Sent!', message: 'Emergency alert sent to all observers.', isRead: false }
      setNotifications(prev => [n, ...prev].slice(0, 50))
    }
  }, [])

  const addNote = useCallback((note: JournalNote) => { setJournalNotes(prev => [note, ...prev].slice(0, 100)) }, [])

  const themeClass = settings.theme === 'light' ? 'theme-light' : ''

  const ctx: AppCtx = {
    user, physData, emotion, stress, wellness, events, notifications, badge,
    settings, setSettings, observers, geoZones, chatMessages, setChatMessages,
    suggestions, journalNotes, accentColor: settings.accentColor,
    triggerSos, addNote, logout: handleLogout,
  }
  persist('au_observers', observers)

  return (
    <Ctx.Provider value={ctx}>
      <div className={`app-root ${themeClass}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={
            user
              ? <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Signed in as <strong>{user.name}</strong></p>
                  <button className="neon-btn primary" onClick={() => navigate('/dashboard')} style={{ marginBottom: 12, width: '100%', maxWidth: 300 }}>Continue to Dashboard →</button>
                  <button className="neon-btn secondary" onClick={() => { setUser(null); localStorage.removeItem('au_user') }} style={{ width: '100%', maxWidth: 300 }}>Sign Out</button>
                </div>
              : <AuthFlow onComplete={handleLogin} />
          } />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" />} />
          <Route path="/observers" element={user ? <Observers /> : <Navigate to="/login" />} />
          <Route path="/ai" element={user ? <AIAssistant /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/sensory-profile" element={user ? <SensoryProfile /> : <Navigate to="/login" />} />
          <Route path="/interventions" element={user ? <Interventions /> : <Navigate to="/login" />} />
          <Route path="/medications" element={user ? <Medications /> : <Navigate to="/login" />} />
        </Routes>
        {user && (
          <nav className="bottom-nav">
            {NAV.map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}
                className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </Ctx.Provider>
  )
}
