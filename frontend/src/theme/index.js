// Definição dos temas da aplicação

// Tema claro
export const lightTheme = {
  isDark: false,
  colors: {
    primary: '#2196F3',
    primaryDark: '#1565C0',
    secondary: '#FF4081',
    background: '#F9F9F9',
    backgroundAlt: '#EAEAEA',
    card: '#FFFFFF',
    text: '#212121',
    secondaryText: '#757575',
    border: '#E0E0E0',
    notification: '#FF4081',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    buttonText: '#FFFFFF',
    power: '#F44336',
    premium: '#FFD700',
    modalBackground: 'rgba(0, 0, 0, 0.5)',
  },
};

// Tema escuro
export const darkTheme = {
  isDark: true,
  colors: {
    primary: '#2196F3',
    primaryDark: '#1565C0',
    secondary: '#FF4081',
    background: '#121212',
    backgroundAlt: '#1E1E1E',
    card: '#272727',
    text: '#FFFFFF',
    secondaryText: '#AAAAAA',
    border: '#444444',
    notification: '#FF4081',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    buttonText: '#FFFFFF',
    power: '#F44336',
    premium: '#FFD700',
    modalBackground: 'rgba(0, 0, 0, 0.7)',
  },
};

// Espaçamento consistente
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tipografia
export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

// Bordas arredondadas
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: '50%',
};

// Sombras
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Animações
export const animations = {
  timing: {
    fast: 200,
    medium: 300,
    slow: 500,
  },
  spring: {
    damping: 8,
    mass: 1,
    stiffness: 100,
  },
};