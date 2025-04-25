import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function DeviceListItem({ device, onPress, theme }) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border 
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Feather name="tv" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.deviceName, { color: theme.colors.text }]}>
          {device.name}
        </Text>
        <Text style={[styles.deviceInfo, { color: theme.colors.secondaryText }]}>
          {device.model} • {device.ip}
        </Text>
      </View>
      <Feather name="chevron-right" size={22} color={theme.colors.secondaryText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  deviceInfo: {
    fontSize: 14,
  },
});
