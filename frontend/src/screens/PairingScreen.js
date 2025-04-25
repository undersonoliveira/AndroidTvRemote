import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SafeAreaView } from 'react-native-safe-area-context';

// Services
import { pairWithDevice } from '../services/tvDiscovery';

// Context
import { ThemeContext } from '../context/ThemeContext';

export default function PairingScreen({ route, navigation }) {
  const { device } = route.params;
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  
  const [pin, setPin] = useState('');
  const [isPairing, setIsPairing] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    if (scanMode) {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [scanMode]);

  const handlePairWithPin = async () => {
    if (pin.length !== 4) {
      Alert.alert(
        t('common.error'),
        t('pairing.invalidPin')
      );
      return;
    }

    await attemptPairing(pin);
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanMode(false);
    
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.deviceId === device.id && parsedData.pin) {
        await attemptPairing(parsedData.pin);
      } else {
        throw new Error('Invalid QR code');
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('pairing.invalidQRCode')
      );
    }
  };

  const attemptPairing = async (pairingPin) => {
    setIsPairing(true);
    
    try {
      const pairedDevice = await pairWithDevice(device.id, pairingPin);
      navigation.replace('RemoteControl', { device: pairedDevice });
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('pairing.pairingFailed')
      );
    } finally {
      setIsPairing(false);
    }
  };

  if (scanMode) {
    if (hasPermission === null) {
      return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    
    if (hasPermission === false) {
      return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            {t('pairing.cameraPermission')}
          </Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => setScanMode(false)}
          >
            <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
              {t('common.goBack')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerTarget} />
        </View>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: theme.colors.card }]}
          onPress={() => setScanMode(false)}
        >
          <Feather name="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.deviceInfo}>
          <Feather name="tv" size={50} color={theme.colors.primary} />
          <Text style={[styles.deviceName, { color: theme.colors.text }]}>
            {device.name}
          </Text>
          <Text style={[styles.deviceModel, { color: theme.colors.secondaryText }]}>
            {device.model}
          </Text>
        </View>

        <View style={styles.pairingSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('pairing.enterPin')}
          </Text>
          <Text style={[styles.instructions, { color: theme.colors.secondaryText }]}>
            {t('pairing.instructions')}
          </Text>

          <View style={styles.pinContainer}>
            <TextInput
              style={[
                styles.pinInput, 
                { 
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }
              ]}
              value={pin}
              onChangeText={setPin}
              placeholder="0000"
              placeholderTextColor={theme.colors.placeholder}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.pairButton, 
              { 
                backgroundColor: theme.colors.primary,
                opacity: isPairing ? 0.7 : 1 
              }
            ]}
            onPress={handlePairWithPin}
            disabled={isPairing}
          >
            {isPairing ? (
              <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                {t('pairing.pairDevice')}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.orText, { color: theme.colors.secondaryText }]}>
              {t('common.or')}
            </Text>
            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
          </View>

          <TouchableOpacity 
            style={[
              styles.scanButton, 
              { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border
              }
            ]}
            onPress={() => setScanMode(true)}
          >
            <Feather name="camera" size={20} color={theme.colors.text} style={styles.scanIcon} />
            <Text style={[styles.scanButtonText, { color: theme.colors.text }]}>
              {t('pairing.scanQRCode')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  deviceInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  deviceModel: {
    fontSize: 16,
    marginTop: 4,
  },
  pairingSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  pinInput: {
    width: 120,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
  },
  pairButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  scanButton: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIcon: {
    marginRight: 10,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
