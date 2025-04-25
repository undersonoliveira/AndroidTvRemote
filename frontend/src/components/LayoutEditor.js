import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import DraggableFlatList from 'react-native-draggable-flatlist';

// Contexts
import { ThemeContext } from '../context/ThemeContext';
import { RemoteLayoutContext } from '../context/RemoteLayoutContext';

// Button Item component for the draggable list
const ButtonItem = ({ item, isVisible, onToggleVisibility, theme, drag, isActive }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: isActive ? theme.colors.backgroundAlt : theme.colors.card,
      borderColor: isActive ? theme.colors.primary : theme.colors.border,
    };
  });
  
  let iconName = 'circle';
  let buttonLabel = item.label;
  
  // Determine icon based on button type
  switch (item.id) {
    case 'power':
      iconName = 'power';
      break;
    case 'volume':
      iconName = 'volume-2';
      break;
    case 'dpad':
      iconName = 'navigation';
      break;
    case 'channels':
      iconName = 'tv';
      break;
    case 'keypad':
      iconName = 'hash';
      break;
    case 'shortcuts':
      iconName = 'grid';
      break;
    case 'voice':
      iconName = 'mic';
      break;
    case 'keyboard':
      iconName = 'type';
      break;
    default:
      iconName = 'circle';
  }
  
  return (
    <Animated.View style={[styles.buttonItemContainer, animatedStyle]}>
      <TouchableOpacity 
        style={styles.dragHandle}
        onLongPress={drag}
      >
        <Feather name="menu" size={22} color={theme.colors.secondaryText} />
      </TouchableOpacity>
      
      <View style={styles.buttonInfo}>
        <Feather name={iconName} size={20} color={theme.colors.text} />
        <Text style={[styles.buttonLabel, { color: theme.colors.text }]}>
          {buttonLabel}
        </Text>
      </View>
      
      <Switch
        value={isVisible}
        onValueChange={onToggleVisibility}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={isVisible ? theme.colors.buttonText : theme.colors.background}
      />
    </Animated.View>
  );
};

export default function LayoutEditor({ onClose }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { 
    buttonOrder, 
    setButtonOrder,
    buttonVisibility, 
    setButtonVisibility,
    resetToDefault,
    saveCustomLayout
  } = useContext(RemoteLayoutContext);
  
  // Map button IDs to labels
  const buttonItems = buttonOrder.map(id => ({
    id,
    label: t(`remote.${id === 'dpad' ? 'guide' : id}`)
  }));
  
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
  
  const handleResetLayout = () => {
    resetToDefault();
  };
  
  const handleSaveLayout = () => {
    saveCustomLayout();
    handleClose();
  };
  
  const toggleButtonVisibility = (buttonId) => {
    setButtonVisibility({
      ...buttonVisibility,
      [buttonId]: !buttonVisibility[buttonId]
    });
  };
  
  const handleDragEnd = ({ data }) => {
    setButtonOrder(data.map(item => item.id));
  };
  
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
            {t('remote.editLayout')}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Feather name="x" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
          {t('remote.dragToReorder')}
        </Text>
        
        <View style={styles.listContainer}>
          <DraggableFlatList
            data={buttonItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item, drag, isActive }) => (
              <ButtonItem 
                item={item}
                isVisible={buttonVisibility[item.id]}
                onToggleVisibility={() => toggleButtonVisibility(item.id)}
                theme={theme}
                drag={drag}
                isActive={isActive}
              />
            )}
            onDragEnd={handleDragEnd}
            contentContainerStyle={styles.dragListContent}
          />
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
            onPress={handleResetLayout}
          >
            <Feather name="refresh-cw" size={18} color={theme.colors.text} />
            <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
              {t('remote.resetLayout')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSaveLayout}
          >
            <Feather name="save" size={18} color={theme.colors.buttonText} />
            <Text style={[styles.actionButtonText, { color: theme.colors.buttonText }]}>
              {t('remote.saveLayout')}
            </Text>
          </TouchableOpacity>
        </View>
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
  listContainer: {
    flex: 1,
    minHeight: 300,
  },
  dragListContent: {
    paddingHorizontal: 20,
  },
  buttonItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dragHandle: {
    paddingRight: 15,
  },
  buttonInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: '45%',
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});