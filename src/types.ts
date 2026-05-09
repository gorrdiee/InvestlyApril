export interface EmotionResult {
  stateId: 0|1|2|3|4|5; stateName: string; color: string; icon: string; confidence: number; timestamp: number
}
export interface PhysData {
  timestamp: number; heartRate: number; hrvRmssd: number; temperature: number; gsr: number;
  accelerometer: {x:number;y:number;z:number}; battery: number
}
export interface BLEDevice {
  id: string; name: string; rssi: number; batteryLevel: number; isConnected: boolean; deviceType: 'neckband'|'badge'
}
export interface UserProfile {
  id: string; name: string; profileType: 'asd_user'|'observer'; email: string; phone?: string;
  photoUrl?: string; createdAt: number; age?: number; diagnosis?: string; timezone?: string
}
export interface AlertThreshold {
  maxHR: number; maxTemp: number; maxStress: number; delay: 'instant'|'1min'|'5min';
  notifyAnxiety: boolean; notifyStress: boolean; notifyConnLost: boolean; notifyLowBat: boolean; lowBatThreshold: number
}
export interface NotificationRec {
  id: string; timestamp: number; type: string; title: string; message: string; isRead: boolean
}
export interface EventLog {
  id: string; timestamp: number; emotion: EmotionResult; heartRate: number; hrv: number; temperature: number; stress: number; note?: string; activityTag?: string; location?: {lat:number;lng:number}
}
export interface BadgeSettings {
  brightness: number; flashMode: string; silentMode: boolean;
  colors: Record<number, string>
}
export interface AppSettings {
  language: string; theme: string; accentColor: string; fontSize: string; units: string; dataRetentionDays: number; researchSharing: boolean;
  quietHours: { enabled: boolean; start: string; end: string; overrideRed: boolean; overrideSOS: boolean };
  predictiveAlerts: boolean; dndMode: boolean; dndUntil?: number
}
export interface GeoLocation { lat: number; lng: number; accuracy?: number; address?: string }
export interface GeoZone {
  id: string; name: string; lat: number; lng: number; radius: number; color: string;
  notifyOnEnter: boolean; notifyOnExit: boolean
}
export interface RoutePoint {
  lat: number; lng: number; timestamp: number; emotion?: EmotionResult; stress: number
}
export interface ChatMessage {
  id: string; from: 'user'|'ai'; text: string; ts: number
}
export interface Observer {
  id: string; name: string; role: 'parent'|'teacher'|'doctor'|'therapist'; avatar?: string;
  liveStatus: boolean; viewHistory: boolean; viewGps: boolean; receiveSos: boolean; pushOnEscalation: boolean;
  active: boolean
}
export interface EmergencyContact {
  id: string; name: string; phone: string; relation: string
}
export interface AISuggestion {
  id: string; type: 'insight'|'warning'|'tip'|'report'; title: string; message: string; ts: number; read: boolean
}
export interface TriggerEvent {
  id: string; trigger: string; frequency: number; timeOfDay: string; severity: 'low'|'medium'|'high'
}
export interface JournalNote {
  id: string; timestamp: number; note: string; tags: string[]
}
