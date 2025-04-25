import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from '../i18n';

// Create context
export const LanguageContext = createContext();

// Language storage key
const LANGUAGE_PREFERENCE_KEY = '@wifi_remote:language_preference';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  
  // Load language preference from storage
  useEffect(() => {
    (async () => {
      try {
        // Try to get stored language preference
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY);
        
        if (savedLanguage) {
          // If a language preference was found, use it
          setLanguageState(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        } else {
          // Otherwise, use device locale if it's one of our supported languages
          const deviceLanguage = Localization.locale.split('-')[0];
          const supportedLanguages = ['en', 'pt', 'es', 'fr', 'ru', 'de', 'zh', 'ja'];
          
          if (supportedLanguages.includes(deviceLanguage)) {
            setLanguageState(deviceLanguage);
            i18n.changeLanguage(deviceLanguage);
            await AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, deviceLanguage);
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    })();
  }, []);
  
  // Function to change the language
  const setLanguage = async (languageCode) => {
    try {
      setLanguageState(languageCode);
      i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, languageCode);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
