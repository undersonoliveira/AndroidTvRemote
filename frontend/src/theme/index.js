// Theme configuration for the app
// Provides light and dark themes with color schemes

// Light theme colors
export const lightTheme = {
  dark: false,
  colors: {
    primary: '#4F46E5', // Main brand color (indigo)
    background: '#FFFFFF', // Background of screens
    card: '#F9FAFB', // Background of cards, inputs, etc.
    text: '#1F2937', // Primary text color
    secondaryText: '#6B7280', // Secondary, less prominent text
    border: '#E5E7EB', // Borders for cards, inputs, etc.
    notification: '#EF4444', // Notification/Error color (red)
    success: '#10B981', // Success color (green)
    warning: '#F59E0B', // Warning color (amber)
    error: '#EF4444', // Error color (red)
    power: '#EF4444', // Power button color (red)
    premium: '#F59E0B', // Premium feature indicator (amber)
    buttonText: '#FFFFFF', // Text on primary colored buttons
    placeholder: '#9CA3AF', // Placeholder text color
    selected: '#EEF2FF', // Background for selected items
    cardSelected: '#F3F4F6', // Background for selected cards
    // Additional colors for specific features
    mute: '#6B7280', // Mute button color
    info: '#60A5FA', // Informational color (blue)
    link: '#2563EB', // Link color (blue)
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay for modals
  }
};

// Dark theme colors
export const darkTheme = {
  dark: true,
  colors: {
    primary: '#6366F1', // Main brand color (indigo, slightly lighter for dark mode)
    background: '#111827', // Background of screens
    card: '#1F2937', // Background of cards, inputs, etc.
    text: '#F9FAFB', // Primary text color
    secondaryText: '#9CA3AF', // Secondary, less prominent text
    border: '#374151', // Borders for cards, inputs, etc.
    notification: '#EF4444', // Notification/Error color (red)
    success: '#10B981', // Success color (green)
    warning: '#F59E0B', // Warning color (amber)
    error: '#EF4444', // Error color (red)
    power: '#EF4444', // Power button color (red)
    premium: '#F59E0B', // Premium feature indicator (amber)
    buttonText: '#FFFFFF', // Text on primary colored buttons
    placeholder: '#6B7280', // Placeholder text color
    selected: '#312E81', // Background for selected items
    cardSelected: '#374151', // Background for selected cards
    // Additional colors for specific features
    mute: '#9CA3AF', // Mute button color
    info: '#60A5FA', // Informational color (blue)
    link: '#3B82F6', // Link color (blue)
    overlay: 'rgba(0, 0, 0, 0.75)', // Overlay for modals
  }
};

// Shared spacing values for consistent layout
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography styles for consistent text rendering
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};

// Border radius values for consistent styling
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999, // For circular elements
};

// Shadow styles for elevation
export const shadows = {
  light: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  dark: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

// Animation timing configurations
export const animations = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

// Export combined theme objects
export default {
  light: {
    ...lightTheme,
    spacing,
    typography,
    borderRadius,
    shadows: shadows.light,
    animations,
  },
  dark: {
    ...darkTheme,
    spacing,
    typography,
    borderRadius,
    shadows: shadows.dark,
    animations,
  },
};
