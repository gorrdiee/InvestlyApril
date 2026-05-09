import { EMOTIONS } from './constants'
import { PhysData, EmotionResult, EventLog } from './types'

let counter = 0

export function genPhysData(): PhysData {
  const ts = Date.now()
  counter++
  const baseHR = 72 + Math.sin(ts / 10000) * 12
  const hr = Math.round(baseHR + Math.random() * 8 - 4)
  const hrv = Math.round((38 + Math.sin(ts / 8000 + counter * 0.1) * 18 + Math.random() * 8 - 4) * 10) / 10
  const temp = Math.round((36.5 + Math.sin(ts / 6000) * 0.3 + Math.random() * 0.2 - 0.1) * 10) / 10
  const gsr = Math.round(220 + Math.sin(ts / 7000 + counter * 0.05) * 70 + Math.random() * 30 - 15)
  return {
    timestamp: ts,
    heartRate: hr, hrvRmssd: hrv, temperature: temp, gsr,
    accelerometer: {
      x: Math.round((Math.sin(ts / 5000) * 0.2 + Math.random() * 0.1 - 0.05) * 100) / 100,
      y: Math.round((Math.cos(ts / 5000) * 0.2 + Math.random() * 0.1 - 0.05) * 100) / 100,
      z: Math.round((9.81 + Math.sin(ts / 10000) * 0.1 + Math.random() * 0.1 - 0.05) * 100) / 100,
    },
    battery: Math.max(8, Math.round(82 + Math.sin(ts / 60000 + counter * 0.02) * 12)),
  }
}

export function classify(hr: number, hrv: number, gsr: number): EmotionResult {
  const ts = Date.now()
  if (hr < 68 && hrv > 45 && gsr < 160) return { ...EMOTIONS[0], confidence: 60 + Math.round(Math.random() * 25), stateId: 0, stateName: EMOTIONS[0].name, timestamp: ts }
  if (hr >= 65 && hr < 88 && hrv >= 32) return { ...EMOTIONS[1], confidence: 55 + Math.round(Math.random() * 20), stateId: 1, stateName: EMOTIONS[1].name, timestamp: ts }
  if (hr >= 82 && hr < 98 && hrv >= 22) return { ...EMOTIONS[2], confidence: 55 + Math.round(Math.random() * 15), stateId: 2, stateName: EMOTIONS[2].name, timestamp: ts }
  if (hr >= 92 && hr < 118 && hrv < 28 && gsr > 240) return { ...EMOTIONS[3], confidence: 65 + Math.round(Math.random() * 15), stateId: 3, stateName: EMOTIONS[3].name, timestamp: ts }
  if (hr >= 112 && hrv < 18 && gsr > 340) return { ...EMOTIONS[4], confidence: 70 + Math.round(Math.random() * 20), stateId: 4, stateName: EMOTIONS[4].name, timestamp: ts }
  return { ...EMOTIONS[5], confidence: 40 + Math.round(Math.random() * 20), stateId: 5, stateName: EMOTIONS[5].name, timestamp: ts }
}

export function calcStress(hr: number, hrv: number, gsr: number) {
  let s = 0
  if (hr > 80) s += Math.min(35, (hr - 80) * 0.6)
  if (hrv < 30) s += Math.min(30, (30 - hrv) * 1.2)
  if (gsr > 200) s += Math.min(35, (gsr - 200) * 0.12)
  return Math.min(100, Math.max(0, Math.round(s)))
}

export function calcWellness(stress: number, hr: number, hrv: number): number {
  const w = 100 - stress * 0.5 - Math.max(0, Math.abs(hr - 72) - 10) * 0.3 + Math.min(20, hrv * 0.3)
  return Math.min(100, Math.max(0, Math.round(w)))
}

export function genEvent(emotion: EmotionResult, phys: PhysData, stress: number): EventLog {
  const lat = 51.1694 + Math.random() * 0.02 - 0.01
  const lng = 71.4491 + Math.random() * 0.02 - 0.01
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(), emotion, heartRate: phys.heartRate, hrv: phys.hrvRmssd,
    temperature: phys.temperature, stress, note: '', activityTag: '',
    location: { lat, lng },
  }
}

export function genTriggerEvents(): { id: string; trigger: string; frequency: number; timeOfDay: string; severity: 'low'|'medium'|'high' }[] {
  return [
    { id: 't1', trigger: 'Crowded places', frequency: 12, timeOfDay: 'Afternoon', severity: 'high' },
    { id: 't2', trigger: 'Loud noises', frequency: 8, timeOfDay: 'Morning', severity: 'medium' },
    { id: 't3', trigger: 'New environment', frequency: 6, timeOfDay: 'Any', severity: 'high' },
    { id: 't4', trigger: 'Change in routine', frequency: 5, timeOfDay: 'Morning', severity: 'medium' },
    { id: 't5', trigger: 'Social interaction', frequency: 4, timeOfDay: 'Afternoon', severity: 'low' },
  ]
}

export function genRouteHistory(days = 1): {lat:number;lng:number;ts:number;stress:number;emotion?:string}[] {
  const points: any[] = []
  const startLat = 51.1694, startLng = 71.4491
  const now = Date.now()
  for (let i = 0; i < 50; i++) {
    points.push({
      lat: startLat + Math.sin(i * 0.5) * 0.01 + Math.random() * 0.005,
      lng: startLng + Math.cos(i * 0.3) * 0.01 + Math.random() * 0.005,
      ts: now - (50 - i) * 180000,
      stress: Math.round(20 + Math.sin(i * 0.7) * 25 + Math.random() * 15),
      emotion: EMOTIONS[Math.floor(Math.random() * 5)].name,
    })
  }
  return points
}

export function genHeatmapData(): {lat:number;lng:number;intensity:number}[] {
  const data = []
  for (let i = 0; i < 30; i++) {
    data.push({
      lat: 51.1694 + Math.random() * 0.03 - 0.015,
      lng: 71.4491 + Math.random() * 0.03 - 0.015,
      intensity: Math.round(Math.random() * 100),
    })
  }
  return data
}
