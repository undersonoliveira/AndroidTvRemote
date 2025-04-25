import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { STORAGE_KEYS } from '../utils/constants';
import { lightTheme, darkTheme } from '../theme';

// Criar o contexto
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', ou 'system'
  const [theme, setTheme] = useState(lightTheme);
  
  // Carregar tema salvo
  useEffect(() => {
    loadSavedTheme();
  }, []);
  
  // Aplicar tema com base na configuração
  useEffect(() => {
    applyTheme(themeMode);
    
    // Escutar mudanças no tema do sistema se estiver no modo 'system'
    if (themeMode === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      });
      
      return () => {
        subscription.remove();
      };
    }
  }, [themeMode]);
  
  // Carregar o tema salvo
  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (savedTheme) {
        const userPrefs = JSON.parse(savedTheme);
        if (userPrefs.theme) {
          setThemeMode(userPrefs.theme);
        }
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }
  };
  
  // Aplicar tema com base no modo
  const applyTheme = (mode) => {
    if (mode === 'light') {
      setTheme(lightTheme);
    } else if (mode === 'dark') {
      setTheme(darkTheme);
    } else {
      // Sistema
      const colorScheme = Appearance.getColorScheme();
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    }
  };
  
  // Alternar tema
  const toggleTheme = async () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newThemeMode);
    
    try {
      const savedPrefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      const userPrefs = savedPrefs ? JSON.parse(savedPrefs) : {};
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify({
          ...userPrefs,
          theme: newThemeMode
        })
      );
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Definir tema específico
  const setSpecificTheme = async (mode) => {
    setThemeMode(mode);
    
    try {
      const savedPrefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      const userPrefs = savedPrefs ? JSON.parse(savedPrefs) : {};
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify({
          ...userPrefs,
          theme: mode
        })
      );
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
        setTheme: setSpecificTheme,
        isDarkMode: theme === darkTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};