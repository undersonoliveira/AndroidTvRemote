import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for layout preferences
const LAYOUT_PREFS_KEY = '@wifi_remote:layout_preferences';

// Predefined layouts
export const LAYOUTS = {
  STANDARD: 'standard',
  COMPACT: 'compact', 
  EXPANDED: 'expanded',
  CUSTOM: 'custom',
};

// Default button visibility for each layout
const defaultButtonVisibility = {
  [LAYOUTS.STANDARD]: {
    power: true,
    volume: true,
    channels: true,
    dpad: true,
    keypad: true,
    shortcuts: true,
    voice: true,
    keyboard: true,
  },
  [LAYOUTS.COMPACT]: {
    power: true,
    volume: true,
    channels: false,
    dpad: true,
    keypad: false,
    shortcuts: true,
    voice: false,
    keyboard: false,
  },
  [LAYOUTS.EXPANDED]: {
    power: true,
    volume: true,
    channels: true,
    dpad: true,
    keypad: true,
    shortcuts: true,
    voice: true,
    keyboard: true,
  },
  [LAYOUTS.CUSTOM]: {
    power: true,
    volume: true,
    channels: true,
    dpad: true,
    keypad: true,
    shortcuts: true,
    voice: true,
    keyboard: true,
  },
};

// Button order for each layout
const defaultButtonOrder = {
  [LAYOUTS.STANDARD]: [
    'power',
    'volume',
    'dpad',
    'channels',
    'keypad',
    'shortcuts',
    'voice',
    'keyboard',
  ],
  [LAYOUTS.COMPACT]: [
    'power',
    'volume',
    'dpad',
    'shortcuts',
  ],
  [LAYOUTS.EXPANDED]: [
    'power',
    'volume',
    'dpad',
    'channels',
    'keypad',
    'shortcuts',
    'voice',
    'keyboard',
  ],
  [LAYOUTS.CUSTOM]: [
    'power',
    'volume',
    'dpad',
    'channels',
    'keypad',
    'shortcuts',
    'voice',
    'keyboard',
  ],
};

// Favorite buttons (highlighted)
const defaultFavoriteButtons = {
  [LAYOUTS.STANDARD]: ['power', 'volume', 'dpad'],
  [LAYOUTS.COMPACT]: ['power', 'dpad'],
  [LAYOUTS.EXPANDED]: ['power', 'volume', 'dpad', 'shortcuts'],
  [LAYOUTS.CUSTOM]: ['power', 'volume', 'dpad'],
};

export const RemoteLayoutContext = createContext();

export const RemoteLayoutProvider = ({ children }) => {
  const [currentLayout, setCurrentLayout] = useState(LAYOUTS.STANDARD);
  const [buttonVisibility, setButtonVisibility] = useState(defaultButtonVisibility[LAYOUTS.STANDARD]);
  const [buttonOrder, setButtonOrder] = useState(defaultButtonOrder[LAYOUTS.STANDARD]);
  const [favoriteButtons, setFavoriteButtons] = useState(defaultFavoriteButtons[LAYOUTS.STANDARD]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load saved preferences on component mount
  useEffect(() => {
    loadLayoutPreferences();
  }, []);

  // Load layout preferences from AsyncStorage
  const loadLayoutPreferences = async () => {
    try {
      const savedPrefs = await AsyncStorage.getItem(LAYOUT_PREFS_KEY);
      
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        
        setCurrentLayout(prefs.currentLayout || LAYOUTS.STANDARD);
        setButtonVisibility(prefs.buttonVisibility || defaultButtonVisibility[LAYOUTS.STANDARD]);
        setButtonOrder(prefs.buttonOrder || defaultButtonOrder[LAYOUTS.STANDARD]);
        setFavoriteButtons(prefs.favoriteButtons || defaultFavoriteButtons[LAYOUTS.STANDARD]);
      }
    } catch (error) {
      console.error('Error loading layout preferences:', error);
    }
  };

  // Save layout preferences to AsyncStorage
  const saveLayoutPreferences = async () => {
    try {
      const prefsToSave = {
        currentLayout,
        buttonVisibility,
        buttonOrder,
        favoriteButtons,
      };
      
      await AsyncStorage.setItem(LAYOUT_PREFS_KEY, JSON.stringify(prefsToSave));
    } catch (error) {
      console.error('Error saving layout preferences:', error);
    }
  };

  // Change to a predefined layout
  const changeLayout = (layoutName) => {
    if (Object.values(LAYOUTS).includes(layoutName)) {
      setCurrentLayout(layoutName);
      
      if (layoutName !== LAYOUTS.CUSTOM) {
        // Reset to default settings for the selected layout
        setButtonVisibility(defaultButtonVisibility[layoutName]);
        setButtonOrder(defaultButtonOrder[layoutName]);
        setFavoriteButtons(defaultFavoriteButtons[layoutName]);
      }
      
      // Save changes
      saveLayoutPreferences();
    }
  };

  // Toggle button visibility
  const toggleButtonVisibility = (buttonId) => {
    if (currentLayout !== LAYOUTS.CUSTOM) {
      // Switch to custom layout if modifying a predefined layout
      setCurrentLayout(LAYOUTS.CUSTOM);
    }
    
    const updatedVisibility = {
      ...buttonVisibility,
      [buttonId]: !buttonVisibility[buttonId],
    };
    
    setButtonVisibility(updatedVisibility);
    saveLayoutPreferences();
  };

  // Toggle favorite button status
  const toggleFavoriteButton = (buttonId) => {
    if (currentLayout !== LAYOUTS.CUSTOM) {
      // Switch to custom layout if modifying a predefined layout
      setCurrentLayout(LAYOUTS.CUSTOM);
    }
    
    let updatedFavorites;
    
    if (favoriteButtons.includes(buttonId)) {
      // Remove from favorites
      updatedFavorites = favoriteButtons.filter(id => id !== buttonId);
    } else {
      // Add to favorites
      updatedFavorites = [...favoriteButtons, buttonId];
    }
    
    setFavoriteButtons(updatedFavorites);
    saveLayoutPreferences();
  };

  // Reorder buttons
  const moveButton = (buttonId, direction) => {
    if (currentLayout !== LAYOUTS.CUSTOM) {
      // Switch to custom layout if modifying a predefined layout
      setCurrentLayout(LAYOUTS.CUSTOM);
    }
    
    const currentIndex = buttonOrder.indexOf(buttonId);
    
    if (currentIndex === -1) return; // Button not found
    
    let newIndex;
    if (direction === 'up') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'down') {
      newIndex = Math.min(buttonOrder.length - 1, currentIndex + 1);
    } else {
      return; // Invalid direction
    }
    
    // Don't proceed if already at the edge
    if (newIndex === currentIndex) return;
    
    // Create a new array with the button moved
    const updatedOrder = [...buttonOrder];
    updatedOrder.splice(currentIndex, 1);
    updatedOrder.splice(newIndex, 0, buttonId);
    
    setButtonOrder(updatedOrder);
    saveLayoutPreferences();
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Reset to default layout
  const resetToDefault = () => {
    setCurrentLayout(LAYOUTS.STANDARD);
    setButtonVisibility(defaultButtonVisibility[LAYOUTS.STANDARD]);
    setButtonOrder(defaultButtonOrder[LAYOUTS.STANDARD]);
    setFavoriteButtons(defaultFavoriteButtons[LAYOUTS.STANDARD]);
    saveLayoutPreferences();
  };

  return (
    <RemoteLayoutContext.Provider
      value={{
        currentLayout,
        buttonVisibility,
        buttonOrder,
        favoriteButtons,
        isEditMode,
        changeLayout,
        toggleButtonVisibility,
        toggleFavoriteButton,
        moveButton,
        toggleEditMode,
        resetToDefault,
      }}
    >
      {children}
    </RemoteLayoutContext.Provider>
  );
};