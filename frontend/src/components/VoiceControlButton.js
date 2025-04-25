import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

// Services
import { sendVoiceCommand } from '../services/tvControl';

export default function VoiceControlButton({ onPress, device, theme, isPremium, hasPremiumAccess }) {
  const [isListening, setIsListening] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  
  useEffect(() => {
    // Check microphone permissions
    if (hasPremiumAccess) {
      (async () => {
        try {
          const { status } = await Speech.requestPermissionsAsync();
          setHasMicPermission(status === 'granted');
        } catch (error) {
          console.log('Error requesting microphone permission:', error);
        }
      })();
    }
  }, [hasPremiumAccess]);
  
  const handleVoiceControlPress = async () => {
    if (isPremium) {
      onPress();
      return;
    }
    
    if (!hasMicPermission) {
      const { status } = await Speech.requestPermissionsAsync();
      setHasMicPermission(status === 'granted');
      if (status !== 'granted') return;
    }
    
    if (isListening) {
      // Stop listening
      Speech.stop();
      setIsListening(false);
    } else {
      // Start listening
      setIsListening(true);
      
      try {
        // Mock implementation for demonstration
        // In a real app, this would use a speech recognition library
        setTimeout(async () => {
          const mockCommand = "play netflix";
          await sendVoiceCommand(device.id, mockCommand);
          setIsListening(false);
        }, 3000);
      } catch (error) {
        console.error('Voice recognition failed:', error);
        setIsListening(false);
      }
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isListening ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border 
        }
      ]}
      onPress={handleVoiceControlPress}
    >
      <View style={styles.content}>
        {isListening ? (
          <ActivityIndicator color={theme.colors.buttonText} size="small" />
        ) : (
          <Feather 
            name="mic" 
            size={24} 
            color={isListening ? theme.colors.buttonText : theme.colors.text} 
          />
        )}
        <Text 
          style={[
            styles.buttonText, 
            { 
              color: isListening ? theme.colors.buttonText : theme.colors.text 
            }
          ]}
        >
          {isListening ? 'Listening...' : 'Voice'}
        </Text>
      </View>
      
      {isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: theme.colors.premium }]}>
          <Text style={styles.premiumBadgeText}>PRO</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  content: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
  },
  premiumBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
