import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import DeviceListItem from '../components/DeviceListItem';

// Services
import { discoverDevices, stopDiscovery } from '../services/tvDiscovery';

// Context
import { ThemeContext } from '../context/ThemeContext';

export default function DeviceDiscoveryScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [devices, setDevices] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    startDiscovery();
    
    return () => {
      stopDiscovery();
    };
  }, []);

  const startDiscovery = async () => {
    setIsSearching(true);
    try {
      const foundDevices = await discoverDevices();
      setDevices(foundDevices);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('discovery.errorMessage')
      );
    } finally {
      setIsSearching(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    startDiscovery();
  };

  const handleDeviceSelect = (device) => {
    navigation.navigate('Pairing', { device });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('discovery.findYourTV')}
        </Text>
        
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleRefresh}
          disabled={isSearching}
        >
          <Feather 
            name="refresh-cw" 
            size={20} 
            color={theme.colors.buttonText} 
          />
        </TouchableOpacity>
      </View>
      
      {devices.length === 0 && !isSearching ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1585282263861-f55e341878f8' }}
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {t('discovery.noDevicesFound')}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.secondaryText }]}>
            {t('discovery.checkConnection')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={({ item }) => (
            <DeviceListItem 
              device={item}
              onPress={() => handleDeviceSelect(item)}
              theme={theme}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={() => (
            <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
              {t('discovery.availableDevices')}
            </Text>
          )}
          ListFooterComponent={isSearching && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
                {t('discovery.searching')}
              </Text>
            </View>
          ) : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
