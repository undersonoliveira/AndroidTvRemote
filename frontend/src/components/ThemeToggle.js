import React, { useContext } from 'react';
import { Switch, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <Switch
      trackColor={{ false: '#767577', true: theme.colors.primary }}
      thumbColor={theme.dark ? '#f4f3f4' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleTheme}
      value={theme.dark}
    />
  );
}

const styles = StyleSheet.create({
  // No styles needed
});
