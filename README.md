# Wi-Fi Remote Control for Android TV

A mobile application (iOS & Android) that allows users to control any Android TV via Wi-Fi. The app offers secure pairing, a modern and intuitive interface, basic remote control functions, and premium features including voice control, virtual keyboard, and customizable app shortcuts.

![Remote Control Screenshot](https://images.unsplash.com/photo-1521931961826-fe48677230a5)

## Features

### Basic Features (Free Trial - 1 Day)
- TV discovery on local Wi-Fi networks
- Secure pairing with PIN code or QR code
- Power on/off control
- Volume control (up/down/mute)
- Channel navigation
- Numeric keypad
- Directional pad navigation

### Premium Features
- Voice control for natural language commands
- Virtual keyboard for easy text input
- Customizable app shortcuts for Netflix, YouTube, Prime Video, etc.
- Ad-free experience

### Additional Features
- Dark mode support
- Multiple language support (8 languages)
- Intuitive and responsive UI

## Supported Languages
- 🇬🇧 English
- 🇧🇷 Portuguese
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇷🇺 Russian
- 🇩🇪 German
- 🇨🇳 Chinese (Simplified)
- 🇯🇵 Japanese

## Technical Architecture

### Frontend (React Native with Expo)
- React Navigation for app navigation
- Context API for state management
- i18next for internationalization
- AsyncStorage for local data persistence
- Expo modules for hardware features

### Backend (Node.js with Express)
- RESTful API for device discovery and control
- SSDP/mDNS implementation for TV discovery
- ADB over TCP or Android TV API for device control
- Stripe integration for in-app purchases

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/wifi-remote-android-tv.git
cd wifi-remote-android-tv
