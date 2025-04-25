import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function RemoteButton({ icon, label, onPress, theme, isActive = false }) {
  const animatedScale = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.9,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 3,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Animated.View style={{
      transform: [{ scale: animatedScale }],
      flex: 1,
      margin: 5,
    }}>
      <TouchableOpacity
        style={[
          styles.button,
          { 
            backgroundColor: isActive ? theme.colors.primary : theme.colors.card,
            borderColor: theme.colors.border
          }
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <Feather 
          name={icon} 
          size={24} 
          color={isActive ? theme.colors.buttonText : theme.colors.text} 
        />
        <Text 
          style={[
            styles.label, 
            { 
              color: isActive ? theme.colors.buttonText : theme.colors.text
            }
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});
