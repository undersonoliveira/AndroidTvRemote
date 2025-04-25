import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme';

// Create context
export const ThemeContext = createContext();

// Theme storage key
const THEME_PREFERENCE_KEY = '@wifi_remote:theme_preference';

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? darkTheme : lightTheme);
  const [themePreference, setThemePreference] = useState('system'); // 'light', 'dark', or 'system'
  
  // Load theme preference from storage
  useEffect(() => {
    (async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        
        if (savedPreference) {
          setThemePreference(savedPreference);
          
          if (savedPreference === 'light') {
            setTheme(lightTheme);
          } else if (savedPreference === 'dark') {
            setTheme(darkTheme);
          } else {
            // System preference
            setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
          }
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    })();
  }, []);
  
  // Update theme when system color scheme changes
  useEffect(() => {
    if (themePreference === 'system') {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [systemColorScheme, themePreference]);
  
  // Toggle between light and dark theme
  const toggleTheme = async () => {
    try {
      let newTheme, newPreference;
      
      if (theme.dark) {
        newTheme = lightTheme;
        newPreference = 'light';
      } else {
        newTheme = darkTheme;
        newPreference = 'dark';
      }
      
      setTheme(newTheme);
      setThemePreference(newPreference);
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newPreference);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Set a specific theme
  const setSpecificTheme = async (preference) => {
    try {
      let newTheme;
      
      if (preference === 'light') {
        newTheme = lightTheme;
      } else if (preference === 'dark') {
        newTheme = darkTheme;
      } else {
        // System preference
        newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
      }
      
      setTheme(newTheme);
      setThemePreference(preference);
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme,
        setTheme: setSpecificTheme,
        themePreference
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
