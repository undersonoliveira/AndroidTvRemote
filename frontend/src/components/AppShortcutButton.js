import React, { useContext } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';

// Contexts
import { RemoteLayoutContext } from '../context/RemoteLayoutContext';

export default function AppShortcutButton({ 
  name, 
  icon, 
  color, 
  onPress, 
  theme, 
  isPremium, 
  appId 
}) {
  const { isEditMode, favoriteButtons, toggleFavoriteButton } = useContext(RemoteLayoutContext);
  const isFavorite = appId && favoriteButtons.includes(appId);
  
  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue('0deg');
  
  // Animated styles for the button
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: rotate.value }
      ]
    };
  });
  
  // Shake animation for edit mode
  const shakeAnimation = () => {
    rotate.value = withSequence(
      withTiming('-5deg', { duration: 100 }),
      withTiming('5deg', { duration: 100 }),
      withTiming('0deg', { duration: 100 })
    );
  };
  
  // Handle press with animation
  const handlePress = () => {
    // Scale animation
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1)
    );
    
    // If in edit mode, toggle favorite status
    if (isEditMode && appId) {
      shakeAnimation();
      toggleFavoriteButton(appId);
    } else {
      // Otherwise, perform the normal action
      onPress();
    }
  };
  
  return (
    <Animated.View style={[animatedStyle, styles.animatedContainer]}>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: theme.colors.card,
            borderColor: isFavorite ? color : theme.colors.border,
            borderWidth: isFavorite ? 2 : 1,
          }
        ]}
        onPress={handlePress}
        onLongPress={isEditMode ? undefined : shakeAnimation}
        delayLongPress={200}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Feather name={icon} size={20} color="white" />
        </View>
        <Text style={[styles.appName, { color: theme.colors.text }]}>
          {name}
        </Text>
        
        {isPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: theme.colors.premium }]}>
            <Text style={styles.premiumBadgeText}>PRO</Text>
          </View>
        )}
        
        {isEditMode && (
          <View style={[
            styles.editBadge, 
            { backgroundColor: isFavorite ? color : theme.colors.card }
          ]}>
            <Feather 
              name={isFavorite ? "star" : "plus"} 
              size={14} 
              color={isFavorite ? "#FFFFFF" : theme.colors.text} 
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    width: '48%',
    marginBottom: 15,
  },
  container: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 14,
    fontWeight: '500',
  },
  premiumBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
});
