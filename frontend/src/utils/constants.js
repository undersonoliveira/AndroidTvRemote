// API Constants
export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'
  : `https://${window.location.hostname}:8000`;

// Storage Keys (used in addition to those defined in storage.js)
export const STORAGE_KEYS = {
  RECENT_DEVICES: '@wifi_remote:recent_devices',
  USER_PREFERENCES: '@wifi_remote:user_preferences',
  LAYOUT: '@wifi_remote:custom_layout',
  FAVORITES: '@wifi_remote:favorite_buttons',
  CURRENT_LAYOUT: '@wifi_remote:current_layout',
};

// Default app settings
export const DEFAULT_SETTINGS = {
  theme: 'system', // 'light', 'dark', or 'system'
  language: 'en',
  hapticFeedback: true,
  soundEffects: true,
  showTips: true,
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  DAILY: {
    id: 'daily',
    period: 'day',
    price: 0.99,
    currency: 'USD',
  },
  WEEKLY: {
    id: 'weekly',
    period: 'week',
    price: 2.99,
    currency: 'USD',
  },
  MONTHLY: {
    id: 'monthly',
    period: 'month',
    price: 7.99,
    currency: 'USD',
    default: true,
  },
  YEARLY: {
    id: 'yearly',
    period: 'year',
    price: 59.99,
    currency: 'USD',
    bestValue: true,
  },
};

// Feature flags
export const FEATURES = {
  VOICE_CONTROL: 'voice_control',
  VIRTUAL_KEYBOARD: 'virtual_keyboard',
  CUSTOM_SHORTCUTS: 'custom_shortcuts',
};

// Trial duration in milliseconds
export const TRIAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: '🇬🇧 English' },
  { code: 'pt', name: '🇧🇷 Português' },
  { code: 'es', name: '🇪🇸 Español' },
  { code: 'fr', name: '🇫🇷 Français' },
  { code: 'ru', name: '🇷🇺 Русский' },
  { code: 'de', name: '🇩🇪 Deutsch' },
  { code: 'zh', name: '🇨🇳 简体中文' },
  { code: 'ja', name: '🇯🇵 日本語' },
];

// Popular streaming apps for shortcuts
export const STREAMING_APPS = [
  {
    id: 'netflix',
    name: 'Netflix',
    icon: 'play',
    color: '#E50914',
    packageName: 'com.netflix.mediaclient',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'youtube',
    color: '#FF0000',
    packageName: 'com.google.android.youtube.tv',
  },
  {
    id: 'prime',
    name: 'Prime Video',
    icon: 'video',
    color: '#00A8E1',
    packageName: 'com.amazon.amazonvideo.livingroom',
  },
  {
    id: 'disney',
    name: 'Disney+',
    icon: 'film',
    color: '#0063E5',
    packageName: 'com.disney.disneyplus',
  },
  {
    id: 'hulu',
    name: 'Hulu',
    icon: 'tv',
    color: '#1CE783',
    packageName: 'com.hulu.livingroomplus',
  },
  {
    id: 'hbo',
    name: 'HBO Max',
    icon: 'film',
    color: '#702D8D',
    packageName: 'com.hbo.hbonow',
  }
];

// Connection types
export const CONNECTION_TYPES = {
  WIFI: 'wifi',
  BLUETOOTH: 'bluetooth',
};

// Remote control command types
export const COMMANDS = {
  POWER: 'power',
  VOLUME_UP: 'volume_up',
  VOLUME_DOWN: 'volume_down',
  MUTE: 'mute',
  CHANNEL_UP: 'channel_up',
  CHANNEL_DOWN: 'channel_down',
  GUIDE: 'guide',
  DIRECTION_UP: 'direction_up',
  DIRECTION_DOWN: 'direction_down',
  DIRECTION_LEFT: 'direction_left',
  DIRECTION_RIGHT: 'direction_right',
  SELECT: 'select',
  HOME: 'home',
  BACK: 'back',
  MENU: 'menu',
  INPUT: 'input',
  NUMBER: 'number',
};
