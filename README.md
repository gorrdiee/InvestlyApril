# AuraLink Mobile Application

Cross-platform mobile application for iOS and Android that serves as the central hub for the AuraLink wearable system. The app receives physiological data from a Bluetooth Low Energy (BLE) neckband device, classifies emotional states using an on-device machine learning model, displays real-time information to caregivers, and sends alerts when the user is in distress.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native 0.73 |
| Language | TypeScript |
| BLE Communication | react-native-ble-manager |
| Local Database | SQLite |
| ML Inference | On-device classification algorithm |
| State Management | Redux Toolkit + Redux Persist |
| Navigation | React Navigation 6 |
| Charts | react-native-chart-kit |
| Notifications | Firebase Cloud Messaging + Local Notifications |
| Authentication | Firebase Auth |
| i18n | i18next (EN, RU, KZ) |

## Platform Requirements

- **iOS**: 16.0 and above
- **Android**: API 29 (Android 10) and above

## Features

### P0 - MVP
- [x] BLE device connection and data streaming
- [x] Real-time Dashboard with emotion state display
- [x] ML-based emotion classification (6 states)
- [x] SOS emergency button
- [x] Local notifications

### P1 - First Release
- [x] Authentication (Email, Phone OTP, Google, Apple)
- [x] Alert threshold configuration
- [x] Event log with annotations
- [x] History and analytics screens
- [x] Badge settings control

### P2 - Nice to Have
- [x] Multi-observer management
- [x] Report export (PDF, CSV)
- [x] Pattern detection
- [ ] OTA firmware updates

### P3 - Future
- [ ] Federated learning for personalization
- [ ] Voice annotations
- [ ] GPS triggers
- [ ] Family chat

## Emotional States

| ID | State | Color | HEX | Description |
|----|-------|-------|-----|-------------|
| 0 | Calm | Blue | #2196F3 | Low HR, high HRV, low GSR |
| 1 | Joy | Green | #4CAF50 | Moderate HR, normal HRV |
| 2 | Mild Unease | Yellow | #FFC107 | Slightly elevated HR, reduced HRV |
| 3 | Anxiety | Orange | #FF9800 | Elevated HR, low HRV, rising GSR |
| 4 | Stress/Overload | Red | #F44336 | High HR, very low HRV, high GSR |
| 5 | Transitional | White | #FFFFFF | Mixed or unstable signals |

## Project Structure

```
auralink-mobile/
├── App.tsx                         # Main application entry
├── index.js                        # RN entry point
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── babel.config.js                 # Babel configuration
├── metro.config.js                 # Metro bundler configuration
├── app.json                        # App metadata
├── android/                        # Android native code
├── ios/                            # iOS native code
└── src/
    ├── components/                 # Reusable UI components
    │   ├── EmotionWidget.tsx
    │   ├── StatWidget.tsx
    │   ├── ConnectionBar.tsx
    │   ├── MiniGraph.tsx
    │   ├── SOSButton.tsx
    │   ├── ActionButton.tsx
    │   ├── Card.tsx
    │   └── SettingRow.tsx
    ├── screens/                    # App screens
    │   ├── Auth/
    │   │   └── LoginScreen.tsx
    │   ├── Dashboard/
    │   │   └── DashboardScreen.tsx
    │   ├── History/
    │   │   └── HistoryScreen.tsx
    │   ├── Devices/
    │   │   ├── DevicesScreen.tsx
    │   │   ├── DeviceScanScreen.tsx
    │   │   └── BadgeSettingsScreen.tsx
    │   ├── Alerts/
    │   │   └── AlertsScreen.tsx
    │   ├── Profile/
    │   │   └── ProfileScreen.tsx
    │   └── Onboarding/
    │       └── OnboardingScreen.tsx
    ├── navigation/                 # Navigation configuration
    │   ├── RootNavigator.tsx
    │   ├── MainTabs.tsx
    │   └── DeviceStack.tsx
    ├── store/                      # Redux store
    │   ├── index.ts
    │   ├── appSlice.ts
    │   └── authSlice.ts
    ├── services/                   # Business logic services
    │   ├── bleManager.ts
    │   ├── mlService.ts
    │   ├── databaseService.ts
    │   ├── notificationService.ts
    │   └── authService.ts
    ├── hooks/                      # Custom React hooks
    │   ├── useBLE.ts
    │   └── useTheme.ts
    ├── config/                     # Configuration
    │   ├── constants.ts
    │   └── theme.ts
    ├── i18n/                       # Internationalization
    │   ├── index.ts
    │   └── translations.ts
    ├── types/                      # TypeScript types
    │   └── index.ts
    └── assets/                     # Images, fonts, etc.
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native CLI
- Xcode (for iOS development, macOS only)
- Android Studio (for Android development)
- JDK 17 (for Android)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auralink-mobile
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install CocoaPods (iOS only):
```bash
cd ios && pod install && cd ..
```

4. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Download `google-services.json` for Android and place it in `android/app/`
   - Download `GoogleService-Info.plist` for iOS and place it in `ios/`
   - Add the file to the Xcode project

### Running the App

**Android:**
```bash
npm run android
# or
yarn android
```

**iOS:**
```bash
npm run ios
# or
yarn ios
```

### Building for Production

**Android APK:**
```bash
cd android
./gradlew assembleRelease
```

**Android AAB (for Play Store):**
```bash
cd android
./gradlew bundleRelease
```

**iOS:**
1. Open `ios/AuraLink.xcworkspace` in Xcode
2. Select "Any iOS Device" as the target
3. Product > Archive
4. Distribute App through App Store Connect

## BLE Data Protocol

The neckband sends JSON data packets every 1-5 seconds:

```json
{
  "timestamp": 1704067200000,
  "heart_rate": 78,
  "hrv_rmssd": 32.5,
  "temperature": 36.7,
  "gsr": 245,
  "accelerometer_x": 0.12,
  "accelerometer_y": -0.05,
  "accelerometer_z": 9.81,
  "battery": 87
}
```

## Alert Triggers

| Trigger | Condition |
|---------|-----------|
| Anxiety detected | State changes to Orange (3) |
| Stress detected | State changes to Red (4) |
| Sustained stress | >2 minutes in non-calm state |
| Connection lost | No data for >5 minutes |
| Low battery | Device battery <15% |
| SOS pressed | Immediate alert |

## Accessibility

- VoiceOver/TalkBack compatible
- Minimum 44x44 touch targets
- Color blindness support (text labels alongside colors)
- High contrast mode
- Dynamic text sizing
- Haptic feedback for important events

## Languages

- English (en)
- Russian (ru)
- Kazakh (kz)

## Performance Targets

| Metric | Target |
|--------|--------|
| Dashboard latency | <2 seconds |
| Cold start time | <3 seconds |
| RAM usage (background) | <100 MB |
| Battery drain | <5% per hour |
| ML inference time | <500 ms |

## License

Proprietary - All rights reserved.

## Support

For support, contact the AuraLink development team.
