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

### Running the App in Replit

1. Start the backend server:
```bash
cd backend
npm install
node server.js
```

2. For local development with React Native:
```bash
cd frontend
npm install
npx expo start
```

### Testing Device Discovery and Pairing

The app includes a simulated discovery and pairing flow that you can test without actual Android TV devices:

1. Launch the app and navigate to the discovery screen
2. The app will automatically discover simulated TV devices on your "network"
3. Select a device from the list to begin the pairing process
4. When prompted for a PIN, enter `1234` (this is the test PIN for all simulated devices)
5. After successful pairing, you'll be taken to the remote control screen
6. You can test all remote control functions which will simulate sending commands to the TV

### Demo Credentials

For testing the premium features during development:

- Test PIN for all devices: `1234`
- Test User ID: (automatically generated)
- Test Period: 1 day free trial

### Stripe Integration

This app is configured to use Stripe for subscription payments. To enable Stripe payments:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Obtain your API keys from the Stripe Dashboard
3. Create subscription products and prices in the Stripe Dashboard
4. Set the following environment variables:
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
   ```

### Subscription Plans

The app offers four subscription plans:

| Plan | Duration | Price (USD) |
|------|----------|-------------|
| Daily | 1 day | $0.99 |
| Weekly | 7 days | $2.99 |
| Monthly | 30 days | $7.99 |
| Yearly | 365 days | $59.99 |

All plans provide access to the same premium features.
