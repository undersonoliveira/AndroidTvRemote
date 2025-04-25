import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Modal
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

// Components
import RemoteButton from '../components/RemoteButton';
import NumericKeypad from '../components/NumericKeypad';
import AppShortcutButton from '../components/AppShortcutButton';
import VoiceControlButton from '../components/VoiceControlButton';
import OneClickLayoutButton from '../components/OneClickLayoutButton';

// Services
import { 
  sendPowerCommand, 
  sendVolumeCommand, 
  sendChannelCommand,
  sendInputTextCommand,
  sendDirectionalCommand
} from '../services/tvControl';
import { checkPremiumAccess } from '../services/subscriptionManager';

// Context
import { ThemeContext } from '../context/ThemeContext';
import { RemoteLayoutContext } from '../context/RemoteLayoutContext';

export default function RemoteControlScreen({ route, navigation }) {
  const { device } = route.params;
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  
  const [isMuted, setIsMuted] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [premiumFeatureRequested, setPremiumFeatureRequested] = useState('');

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const hasAccess = await checkPremiumAccess();
    setHasPremiumAccess(hasAccess);
  };

  const handlePowerButton = async () => {
    try {
      await sendPowerCommand(device.id);
      // Play click sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/click.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('remote.commandFailed')
      );
    }
  };

  const handleVolumeButton = async (action) => {
    try {
      if (action === 'mute') {
        await sendVolumeCommand(device.id, 'mute');
        setIsMuted(!isMuted);
      } else {
        await sendVolumeCommand(device.id, action);
      }
      
      // Play click sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/click.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('remote.commandFailed')
      );
    }
  };

  const handleChannelButton = async (action) => {
    try {
      await sendChannelCommand(device.id, action);
      
      // Play click sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/click.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('remote.commandFailed')
      );
    }
  };

  const handleDirectionalPad = async (direction) => {
    try {
      await sendDirectionalCommand(device.id, direction);
      
      // Play click sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/click.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('remote.commandFailed')
      );
    }
  };

  const handleKeypadNumber = async (number) => {
    try {
      await sendChannelCommand(device.id, 'number', number);
      
      // Play click sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/click.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('remote.commandFailed')
      );
    }
  };

  const handlePremiumFeature = (feature) => {
    if (!hasPremiumAccess) {
      setPremiumFeatureRequested(feature);
      setShowPremiumPrompt(true);
      return;
    }

    if (feature === 'voice') {
      // VoiceControlButton component handles the voice control logic
    } else if (feature === 'keyboard') {
      // Navigate to virtual keyboard screen
      navigation.navigate('VirtualKeyboard', { device });
    }
  };

  const handleUpgradePress = () => {
    setShowPremiumPrompt(false);
    navigation.navigate('Subscription');
  };

  // Function to render remote control sections based on buttonOrder and visibility
  const renderControlSections = () => {
    return buttonOrder.map(buttonId => {
      if (!buttonVisibility[buttonId]) return null;
      
      // Determine if this button is a favorite
      const isFavorite = favoriteButtons.includes(buttonId);
      
      // Special style for favorite buttons
      const favoriteStyle = isFavorite ? {
        borderColor: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
      } : null;
      
      switch (buttonId) {
        case 'power':
          return (
            <View key="power" style={[styles.powerSection, favoriteStyle]}>
              <TouchableOpacity 
                style={[styles.powerButton, { backgroundColor: theme.colors.power }]}
                onPress={handlePowerButton}
              >
                <Feather name="power" size={24} color={theme.colors.buttonText} />
              </TouchableOpacity>
            </View>
          );
          
        case 'volume':
          return (
            <View key="volume" style={[styles.controlSection, favoriteStyle]}>
              <View style={styles.volumeControls}>
                <RemoteButton 
                  icon="volume-x" 
                  label={t('remote.mute')}
                  onPress={() => handleVolumeButton('mute')}
                  theme={theme}
                  isActive={isMuted}
                />
                <RemoteButton 
                  icon="volume-1" 
                  label={t('remote.volumeDown')}
                  onPress={() => handleVolumeButton('down')}
                  theme={theme}
                />
                <RemoteButton 
                  icon="volume-2" 
                  label={t('remote.volumeUp')}
                  onPress={() => handleVolumeButton('up')}
                  theme={theme}
                />
              </View>
            </View>
          );
          
        case 'dpad':
          return (
            <View key="dpad" style={[styles.dPadSection, favoriteStyle]}>
              <View style={styles.dPadRow}>
                <View style={styles.dPadPlaceholder} />
                <TouchableOpacity 
                  style={[styles.dPadButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleDirectionalPad('up')}
                >
                  <Feather name="chevron-up" size={30} color={theme.colors.buttonText} />
                </TouchableOpacity>
                <View style={styles.dPadPlaceholder} />
              </View>
              
              <View style={styles.dPadRow}>
                <TouchableOpacity 
                  style={[styles.dPadButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleDirectionalPad('left')}
                >
                  <Feather name="chevron-left" size={30} color={theme.colors.buttonText} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dPadCenterButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleDirectionalPad('ok')}
                >
                  <Text style={[styles.dPadCenterText, { color: theme.colors.buttonText }]}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dPadButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleDirectionalPad('right')}
                >
                  <Feather name="chevron-right" size={30} color={theme.colors.buttonText} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dPadRow}>
                <View style={styles.dPadPlaceholder} />
                <TouchableOpacity 
                  style={[styles.dPadButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleDirectionalPad('down')}
                >
                  <Feather name="chevron-down" size={30} color={theme.colors.buttonText} />
                </TouchableOpacity>
                <View style={styles.dPadPlaceholder} />
              </View>
            </View>
          );
          
        case 'channels':
          return (
            <View key="channels" style={[styles.controlSection, favoriteStyle]}>
              <View style={styles.channelControls}>
                <RemoteButton 
                  icon="chevrons-down" 
                  label={t('remote.channelDown')}
                  onPress={() => handleChannelButton('down')}
                  theme={theme}
                />
                <RemoteButton 
                  icon="list" 
                  label={t('remote.guide')}
                  onPress={() => handleChannelButton('guide')}
                  theme={theme}
                />
                <RemoteButton 
                  icon="chevrons-up" 
                  label={t('remote.channelUp')}
                  onPress={() => handleChannelButton('up')}
                  theme={theme}
                />
              </View>
            </View>
          );
          
        case 'keypad':
          return (
            <View key="keypad" style={favoriteStyle}>
              <TouchableOpacity 
                style={[
                  styles.keypadButton, 
                  { 
                    backgroundColor: showKeypad ? theme.colors.primary : theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setShowKeypad(!showKeypad)}
              >
                <Feather 
                  name="hash" 
                  size={20} 
                  color={showKeypad ? theme.colors.buttonText : theme.colors.text} 
                />
                <Text 
                  style={[
                    styles.keypadButtonText, 
                    { 
                      color: showKeypad ? theme.colors.buttonText : theme.colors.text 
                    }
                  ]}
                >
                  {t('remote.numpad')}
                </Text>
              </TouchableOpacity>

              {showKeypad && (
                <View style={styles.keypadSection}>
                  <NumericKeypad onPress={handleKeypadNumber} theme={theme} />
                </View>
              )}
            </View>
          );
          
        case 'shortcuts':
          return (
            <View key="shortcuts" style={[styles.shortcutsSection, favoriteStyle]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('remote.shortcuts')}
              </Text>
              <View style={styles.shortcutsGrid}>
                <AppShortcutButton 
                  name="Netflix" 
                  icon="play" 
                  color="#E50914"
                  onPress={() => handlePremiumFeature('app-netflix')}
                  theme={theme}
                  isPremium={!hasPremiumAccess}
                  appId="netflix"
                />
                <AppShortcutButton 
                  name="YouTube" 
                  icon="youtube" 
                  color="#FF0000"
                  onPress={() => handlePremiumFeature('app-youtube')}
                  theme={theme}
                  isPremium={!hasPremiumAccess}
                  appId="youtube"
                />
                <AppShortcutButton 
                  name="Prime" 
                  icon="video" 
                  color="#00A8E1"
                  onPress={() => handlePremiumFeature('app-prime')}
                  theme={theme}
                  isPremium={!hasPremiumAccess}
                  appId="prime"
                />
                <AppShortcutButton 
                  name={t('remote.more')} 
                  icon="grid" 
                  color="#747474"
                  onPress={() => handlePremiumFeature('app-more')}
                  theme={theme}
                  isPremium={!hasPremiumAccess}
                  appId="more"
                />
              </View>
            </View>
          );
          
        case 'voice':
          return (
            <View key="voice" style={favoriteStyle}>
              <VoiceControlButton 
                onPress={() => handlePremiumFeature('voice')}
                device={device}
                theme={theme}
                isPremium={!hasPremiumAccess}
                hasPremiumAccess={hasPremiumAccess}
              />
            </View>
          );
          
        case 'keyboard':
          return (
            <View key="keyboard" style={[styles.premiumSection, favoriteStyle]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('remote.premiumFeatures')}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.keyboardButton, 
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border 
                  }
                ]}
                onPress={() => handlePremiumFeature('keyboard')}
              >
                <View style={styles.keyboardButtonContent}>
                  <Feather name="type" size={24} color={theme.colors.text} />
                  <Text style={[styles.keyboardButtonText, { color: theme.colors.text }]}>
                    {t('remote.keyboard')}
                  </Text>
                </View>
                {!hasPremiumAccess && (
                  <View style={[styles.premiumBadge, { backgroundColor: theme.colors.premium }]}>
                    <Text style={styles.premiumBadgeText}>PRO</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
          
        default:
          return null;
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.deviceInfoBar}>
        <Text style={[styles.deviceName, { color: theme.colors.text }]}>
          {device.name}
        </Text>
        <TouchableOpacity 
          style={[styles.disconnectButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('DeviceDiscovery')}
        >
          <Feather name="x-circle" size={18} color={theme.colors.text} />
          <Text style={[styles.disconnectText, { color: theme.colors.text }]}>
            {t('remote.disconnect')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.remoteContent}>
        {renderControlSections()}
      </ScrollView>
      
      {/* One-tap Layout Customization Button */}
      <OneClickLayoutButton />

      {/* Premium Feature Prompt Modal */}
      <Modal
        visible={showPremiumPrompt}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Feather name="star" size={40} color={theme.colors.premium} style={styles.modalIcon} />
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t('subscription.premiumFeature')}
            </Text>
            <Text style={[styles.modalDescription, { color: theme.colors.secondaryText }]}>
              {t('subscription.featureDescription')}
            </Text>
            <TouchableOpacity 
              style={[styles.upgradeButton, { backgroundColor: theme.colors.premium }]}
              onPress={handleUpgradePress}
            >
              <Text style={styles.upgradeButtonText}>
                {t('subscription.upgrade')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowPremiumPrompt(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.secondaryText }]}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deviceInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  disconnectText: {
    fontSize: 14,
    marginLeft: 5,
  },
  remoteContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  powerSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  powerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlSection: {
    marginBottom: 20,
  },
  volumeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  channelControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dPadSection: {
    marginBottom: 20,
  },
  dPadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  dPadButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  dPadCenterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  dPadCenterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dPadPlaceholder: {
    width: 60,
    height: 60,
    margin: 5,
  },
  keypadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 20,
  },
  keypadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  keypadSection: {
    marginBottom: 20,
  },
  shortcutsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  premiumSection: {
    marginBottom: 30,
  },
  premiumButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyboardButton: {
    flex: 1,
    marginLeft: 10,
    height: 80,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  keyboardButtonContent: {
    alignItems: 'center',
  },
  keyboardButtonText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  upgradeButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 16,
  },
});
