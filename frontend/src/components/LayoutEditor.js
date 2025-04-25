import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

// Context
import { RemoteLayoutContext } from '../context/RemoteLayoutContext';
import { ThemeContext } from '../context/ThemeContext';

// Button configuration with user-friendly names and icons
const buttonConfig = {
  power: { name: 'Power', icon: 'power' },
  volume: { name: 'Volume Controls', icon: 'volume-2' },
  channels: { name: 'Channel Controls', icon: 'chevrons-up' },
  dpad: { name: 'Directional Pad', icon: 'navigation' },
  keypad: { name: 'Numeric Keypad', icon: 'hash' },
  shortcuts: { name: 'App Shortcuts', icon: 'grid' },
  voice: { name: 'Voice Control', icon: 'mic' },
  keyboard: { name: 'Virtual Keyboard', icon: 'type' },
};

export default function LayoutEditor({ onClose }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { 
    buttonVisibility, 
    buttonOrder,
    favoriteButtons,
    toggleButtonVisibility,
    toggleFavoriteButton,
    moveButton
  } = useContext(RemoteLayoutContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('layouts.customizeLayout')}
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Feather name="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
          {t('layouts.dragToReorder')}
        </Text>
        
        {buttonOrder.map((buttonId) => (
          <Animated.View key={buttonId} style={styles.buttonItem}>
            <View style={styles.buttonControls}>
              <Switch
                value={buttonVisibility[buttonId]}
                onValueChange={() => toggleButtonVisibility(buttonId)}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={buttonVisibility[buttonId] ? theme.colors.buttonText : '#f4f3f4'}
              />
              
              <TouchableOpacity 
                style={[
                  styles.favoriteButton,
                  favoriteButtons.includes(buttonId) ? 
                    { backgroundColor: theme.colors.primary } : 
                    { borderColor: theme.colors.border, borderWidth: 1 }
                ]}
                onPress={() => toggleFavoriteButton(buttonId)}
              >
                <Feather 
                  name="star" 
                  size={16} 
                  color={favoriteButtons.includes(buttonId) ? 
                    theme.colors.buttonText : 
                    theme.colors.text
                  } 
                />
              </TouchableOpacity>
            </View>
            
            <View style={[
              styles.buttonInfo,
              { 
                opacity: buttonVisibility[buttonId] ? 1 : 0.5,
                backgroundColor: theme.colors.cardHighlight 
              }
            ]}>
              <View style={styles.buttonNameSection}>
                <View style={[
                  styles.buttonIcon, 
                  { backgroundColor: theme.colors.primary }
                ]}>
                  <Feather 
                    name={buttonConfig[buttonId].icon} 
                    size={16} 
                    color={theme.colors.buttonText} 
                  />
                </View>
                <Text style={[styles.buttonName, { color: theme.colors.text }]}>
                  {t(`buttons.${buttonId}`, buttonConfig[buttonId].name)}
                </Text>
              </View>
              
              <View style={styles.reorderButtons}>
                <TouchableOpacity 
                  style={styles.moveButton}
                  onPress={() => moveButton(buttonId, 'up')}
                >
                  <Feather name="chevron-up" size={20} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.moveButton}
                  onPress={() => moveButton(buttonId, 'down')}
                >
                  <Feather name="chevron-down" size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: theme.colors.text }]}>
            {t('layouts.layoutTips')}
          </Text>
          <View style={styles.helpItem}>
            <Feather name="eye" size={16} color={theme.colors.primary} style={styles.helpIcon} />
            <Text style={[styles.helpText, { color: theme.colors.secondaryText }]}>
              {t('layouts.visibilityTip')}
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Feather name="star" size={16} color={theme.colors.primary} style={styles.helpIcon} />
            <Text style={[styles.helpText, { color: theme.colors.secondaryText }]}>
              {t('layouts.favoriteTip')}
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Feather name="arrow-up-down" size={16} color={theme.colors.primary} style={styles.helpIcon} />
            <Text style={[styles.helpText, { color: theme.colors.secondaryText }]}>
              {t('layouts.reorderTip')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    maxHeight: '80%',
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 5,
  },
  buttonItem: {
    marginBottom: 15,
  },
  buttonControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonName: {
    fontWeight: '500',
  },
  reorderButtons: {
    flexDirection: 'row',
  },
  moveButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpSection: {
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  helpTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  helpIcon: {
    marginRight: 10,
  },
  helpText: {
    fontSize: 13,
    flex: 1,
  }
});