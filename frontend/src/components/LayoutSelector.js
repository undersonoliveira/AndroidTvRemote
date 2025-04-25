import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';

// Contexts
import { ThemeContext } from '../context/ThemeContext';
import { RemoteLayoutContext } from '../context/RemoteLayoutContext';

const LayoutOption = ({ name, icon, isSelected, onSelect, theme }) => {
  // Animation values
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePress = () => {
    scale.value = withSpring(1.05, { damping: 10 });
    setTimeout(() => {
      scale.value = withTiming(1);
      onSelect();
    }, 100);
  };
  
  return (
    <Animated.View style={[animatedStyle, styles.layoutOptionContainer]}>
      <TouchableOpacity
        style={[
          styles.layoutOption,
          { 
            backgroundColor: theme.colors.card,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border
          }
        ]}
        onPress={handlePress}
      >
        <View 
          style={[
            styles.layoutIcon, 
            { backgroundColor: isSelected ? theme.colors.primary : theme.colors.backgroundAlt }
          ]}
        >
          <Feather 
            name={icon} 
            size={28} 
            color={isSelected ? theme.colors.buttonText : theme.colors.text} 
          />
        </View>
        <Text style={[styles.layoutName, { color: theme.colors.text }]}>
          {name}
        </Text>
        
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary }]}>
            <Feather name="check" size={14} color={theme.colors.buttonText} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LayoutSelector({ onClose }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { 
    availableLayouts, 
    currentLayout,
    setCurrentLayout
  } = useContext(RemoteLayoutContext);
  
  // Fade animation for the modal
  const fadeOpacity = useSharedValue(0);
  
  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOpacity.value
    };
  });
  
  React.useEffect(() => {
    fadeOpacity.value = withTiming(1, { duration: 300 });
  }, []);
  
  const handleClose = () => {
    fadeOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(onClose, 200);
  };
  
  const handleSelectLayout = (layoutId) => {
    setCurrentLayout(layoutId);
    handleClose();
  };
  
  const layoutOptions = [
    { id: 'basic', name: t('remote.basicLayout'), icon: 'square' },
    { id: 'full', name: t('remote.fullLayout'), icon: 'grid' },
    { id: 'compact', name: t('remote.compactLayout'), icon: 'pocket' },
    { id: 'media', name: t('remote.mediaLayout'), icon: 'play-circle' },
    { id: 'gaming', name: t('remote.gamingLayout'), icon: 'target' },
    { id: 'custom', name: t('remote.customLayout'), icon: 'sliders' }
  ];
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.modalBackground },
        fadeStyle
      ]}
    >
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('remote.selectLayout')}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Feather name="x" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
          {t('remote.layoutTip')}
        </Text>
        
        <FlatList
          data={layoutOptions}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.optionsGrid}
          renderItem={({ item }) => (
            <LayoutOption
              name={item.name}
              icon={item.icon}
              isSelected={currentLayout === item.id}
              onSelect={() => handleSelectLayout(item.id)}
              theme={theme}
            />
          )}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    width: '85%',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  subtitle: {
    fontSize: 14,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  optionsGrid: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  layoutOptionContainer: {
    width: '50%',
    padding: 5,
    marginBottom: 10,
  },
  layoutOption: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    aspectRatio: 1,
    position: 'relative',
  },
  layoutIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  layoutName: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});