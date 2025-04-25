import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// Predefined layouts
export const LAYOUTS = {
  basic: {
    buttonOrder: ['power', 'volume', 'dpad', 'channels'],
    buttonVisibility: {
      power: true,
      volume: true,
      dpad: true,
      channels: true,
      keypad: false,
      shortcuts: false,
      voice: false,
      keyboard: false
    }
  },
  full: {
    buttonOrder: ['power', 'volume', 'dpad', 'channels', 'keypad', 'shortcuts', 'voice', 'keyboard'],
    buttonVisibility: {
      power: true,
      volume: true,
      dpad: true,
      channels: true,
      keypad: true,
      shortcuts: true,
      voice: true,
      keyboard: true
    }
  },
  compact: {
    buttonOrder: ['power', 'volume', 'dpad'],
    buttonVisibility: {
      power: true,
      volume: true,
      dpad: true,
      channels: false,
      keypad: false,
      shortcuts: false,
      voice: false,
      keyboard: false
    }
  },
  media: {
    buttonOrder: ['power', 'volume', 'dpad', 'shortcuts', 'voice'],
    buttonVisibility: {
      power: true,
      volume: true,
      dpad: true,
      channels: false,
      keypad: false,
      shortcuts: true,
      voice: true,
      keyboard: false
    }
  },
  gaming: {
    buttonOrder: ['power', 'dpad', 'keyboard'],
    buttonVisibility: {
      power: true,
      volume: false,
      dpad: true,
      channels: false,
      keypad: false,
      shortcuts: false,
      voice: false,
      keyboard: true
    }
  },
  custom: {
    buttonOrder: ['power', 'volume', 'dpad', 'channels', 'keypad', 'shortcuts', 'voice', 'keyboard'],
    buttonVisibility: {
      power: true,
      volume: true,
      dpad: true,
      channels: true,
      keypad: true,
      shortcuts: true,
      voice: true,
      keyboard: true
    }
  }
};

// Create context
export const RemoteLayoutContext = createContext();

export const RemoteLayoutProvider = ({ children }) => {
  // Default layout is 'full'
  const [currentLayout, setCurrentLayout] = useState('full');
  const [isEditMode, setIsEditMode] = useState(false);
  const [buttonOrder, setButtonOrder] = useState(LAYOUTS.full.buttonOrder);
  const [buttonVisibility, setButtonVisibility] = useState(LAYOUTS.full.buttonVisibility);
  const [favoriteButtons, setFavoriteButtons] = useState([]);
  const [customLayout, setCustomLayout] = useState(null);
  
  // Load saved layout on mount
  useEffect(() => {
    loadSavedLayout();
  }, []);
  
  // Save button order and visibility when they change
  useEffect(() => {
    if (currentLayout === 'custom') {
      saveLayoutToStorage();
    }
  }, [buttonOrder, buttonVisibility, favoriteButtons, currentLayout]);
  
  // Load layout when currentLayout changes
  useEffect(() => {
    if (currentLayout === 'custom' && customLayout) {
      setButtonOrder(customLayout.buttonOrder);
      setButtonVisibility(customLayout.buttonVisibility);
    } else if (LAYOUTS[currentLayout]) {
      setButtonOrder(LAYOUTS[currentLayout].buttonOrder);
      setButtonVisibility(LAYOUTS[currentLayout].buttonVisibility);
    }
  }, [currentLayout, customLayout]);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };
  
  // Toggle a button as favorite
  const toggleFavoriteButton = (buttonId) => {
    setFavoriteButtons(prev => {
      if (prev.includes(buttonId)) {
        return prev.filter(id => id !== buttonId);
      } else {
        return [...prev, buttonId];
      }
    });
  };
  
  // Load saved layout from AsyncStorage
  const loadSavedLayout = async () => {
    try {
      const savedLayout = await AsyncStorage.getItem(STORAGE_KEYS.LAYOUT);
      const savedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      const savedCurrentLayout = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LAYOUT);
      
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout);
        setCustomLayout(parsedLayout);
      }
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavoriteButtons(parsedFavorites);
      }
      
      if (savedCurrentLayout) {
        setCurrentLayout(savedCurrentLayout);
      }
    } catch (error) {
      console.error('Error loading saved layout:', error);
    }
  };
  
  // Save current layout to AsyncStorage
  const saveLayoutToStorage = async () => {
    try {
      const layoutToSave = {
        buttonOrder,
        buttonVisibility
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.LAYOUT, JSON.stringify(layoutToSave));
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteButtons));
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LAYOUT, currentLayout);
    } catch (error) {
      console.error('Error saving layout:', error);
    }
  };
  
  // Save current layout as custom
  const saveCustomLayout = () => {
    const newCustomLayout = {
      buttonOrder,
      buttonVisibility
    };
    
    setCustomLayout(newCustomLayout);
    setCurrentLayout('custom');
  };
  
  // Reset layout to default
  const resetToDefault = () => {
    setButtonOrder(LAYOUTS.full.buttonOrder);
    setButtonVisibility(LAYOUTS.full.buttonVisibility);
    setFavoriteButtons([]);
  };
  
  return (
    <RemoteLayoutContext.Provider
      value={{
        currentLayout,
        setCurrentLayout,
        isEditMode,
        toggleEditMode,
        buttonOrder,
        setButtonOrder,
        buttonVisibility,
        setButtonVisibility,
        favoriteButtons,
        toggleFavoriteButton,
        availableLayouts: Object.keys(LAYOUTS),
        resetToDefault,
        saveCustomLayout
      }}
    >
      {children}
    </RemoteLayoutContext.Provider>
  );
};