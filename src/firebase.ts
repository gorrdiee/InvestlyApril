import { initializeApp, FirebaseApp } from 'firebase/app'
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut,
} from 'firebase/auth'
import {
  getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where,
  orderBy, onSnapshot, Timestamp, Firestore,
} from 'firebase/firestore'
import type { UserProfile, BLEDevice, EventLog, AppSettings, Observer, GeoZone } from './types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app: FirebaseApp
let db: Firestore

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  }
  return { app, db }
}

// Auth
export function getFirebaseAuth() {
  initFirebase()
  return getAuth(app)
}

export async function registerUser(email: string, password: string, name: string, type: string) {
  initFirebase()
  const auth = getAuth(app)
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await setDoc(doc(db, 'users', cred.user.uid), {
    name, email, profileType: type, createdAt: Timestamp.now(),
    settings: {
      theme: 'dark', accentColor: '#00d4ff', fontSize: 'medium', units: 'metric',
      language: 'en', dataRetentionDays: 90, researchSharing: false,
      quietHours: { enabled: false, start: '22:00', end: '07:00', overrideRed: false, overrideSOS: true },
      predictiveAlerts: true, dndMode: false,
    },
  })
  return cred.user
}

export async function loginUser(email: string, password: string) {
  initFirebase()
  const auth = getAuth(app)
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function loginWithGoogle() {
  initFirebase()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  // Create user doc if first time
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', cred.user.uid), {
      name: cred.user.displayName || 'User',
      email: cred.user.email,
      profileType: 'asd_user',
      createdAt: Timestamp.now(),
      settings: {
        theme: 'dark', accentColor: '#00d4ff', fontSize: 'medium', units: 'metric',
        language: 'en', dataRetentionDays: 90, researchSharing: false,
        quietHours: { enabled: false, start: '22:00', end: '07:00', overrideRed: false, overrideSOS: true },
        predictiveAlerts: true, dndMode: false,
      },
    })
  }
  return cred.user
}

export async function logoutUser() {
  initFirebase()
  await signOut(getAuth(app))
}

export function onAuthChange(cb: (user: User | null) => void) {
  initFirebase()
  return onAuthStateChanged(getAuth(app), cb)
}

// Firestore — User Profile
export async function getUserProfile(uid: string) {
  initFirebase()
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function saveUserSettings(uid: string, settings: any) {
  initFirebase()
  await setDoc(doc(db, 'users', uid), { settings }, { merge: true })
}

export async function saveUserProfile(uid: string, data: Partial<UserProfile>) {
  initFirebase()
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

// Firestore — Events
export async function saveEvent(uid: string, event: EventLog) {
  initFirebase()
  await addDoc(collection(db, 'users', uid, 'events'), event)
}

export function subscribeEvents(uid: string, cb: (events: EventLog[]) => void) {
  initFirebase()
  const q = query(collection(db, 'users', uid, 'events'), orderBy('timestamp', 'desc'))
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => d.data() as EventLog))
  })
}

// Firestore — Devices
export async function saveDevice(uid: string, device: BLEDevice) {
  initFirebase()
  await setDoc(doc(db, 'users', uid, 'devices', device.id), device)
}

export async function getDevices(uid: string) {
  initFirebase()
  const snap = await getDoc(doc(db, 'users', uid, 'devices', 'paired'))
  return snap.exists() ? snap.data() : { devices: [] }
}

// Web Bluetooth API
export async function scanBLEDevices(): Promise<BLEDevice[]> {
  if (!navigator.bluetooth) {
    throw new Error('Web Bluetooth not supported. Use Chrome/Edge.')
  }
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [],
  })
  return [{
    id: device.id,
    name: device.name || 'Unknown Device',
    rssi: -60,
    batteryLevel: Math.round(Math.random() * 30 + 70),
    isConnected: true,
    deviceType: 'badge',
  }]
}

export async function connectBLEDevice(deviceId: string) {
  // Web Bluetooth connection would happen here
  // For now return simulated success
  return true
}
