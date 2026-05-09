export const EMOTIONS = [
  { id: 0, name: 'Calm', color: '#00d4ff', icon: '😌', neon: '#00d4ff' },
  { id: 1, name: 'Happy', color: '#00ffb3', icon: '😊', neon: '#00ffb3' },
  { id: 2, name: 'Mild Unease', color: '#facc15', icon: '😐', neon: '#facc15' },
  { id: 3, name: 'Anxiety', color: '#f59e0b', icon: '😟', neon: '#f59e0b' },
  { id: 4, name: 'Stress', color: '#ef4444', icon: '😢', neon: '#ef4444' },
  { id: 5, name: 'Transitional', color: '#a855f7', icon: '❓', neon: '#a855f7' },
]

export const ACTIVITY_TAGS = ['meal', 'therapy', 'school', 'sleep', 'play', 'walk', 'social', 'rest', 'other']
export const DATA_RETENTION = [7, 30, 90, 180, 365, 730]

export const ACCENT_COLORS = [
  { name: 'Cyan', value: '#00d4ff' },
  { name: 'Mint', value: '#00ffb3' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
]

export const MODAL_STYLE: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: 20,
}
export const MODAL_BOX: React.CSSProperties = {
  background: '#0d111d', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 16,
  padding: 24, maxWidth: 400, width: '100%', boxShadow: '0 0 30px rgba(0,212,255,0.1)',
}
export const GLOW_TEXT: React.CSSProperties = { textShadow: '0 0 20px rgba(0,212,255,0.3)' }
