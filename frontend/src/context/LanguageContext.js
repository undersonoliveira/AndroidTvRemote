import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import i18n from '../i18n';

// Criar o contexto
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);
  
  // Carregar idioma salvo
  useEffect(() => {
    loadSavedLanguage();
  }, []);
  
  // Carregar o idioma salvo
  const loadSavedLanguage = async () => {
    try {
      const savedPrefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (savedPrefs) {
        const userPrefs = JSON.parse(savedPrefs);
        if (userPrefs.language) {
          changeLanguage(userPrefs.language);
        }
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };
  
  // Alterar idioma
  const changeLanguage = async (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    
    try {
      const savedPrefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      const userPrefs = savedPrefs ? JSON.parse(savedPrefs) : {};
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify({
          ...userPrefs,
          language: lang
        })
      );
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};