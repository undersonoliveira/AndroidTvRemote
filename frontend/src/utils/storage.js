import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for persisting and retrieving data
 */

// Storage keys
export const KEYS = {
  PAIRED_DEVICES: '@wifi_remote:paired_devices',
  THEME_PREFERENCE: '@wifi_remote:theme_preference',
  LANGUAGE_PREFERENCE: '@wifi_remote:language_preference',
  SUBSCRIPTION_STATUS: '@wifi_remote:subscription_status',
  TRIAL_START: '@wifi_remote:trial_start',
};

/**
 * Store an item in AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {Promise<void>}
 */
export const storeItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing item at key "${key}":`, error);
    throw new Error('Failed to store data');
  }
};

/**
 * Get an item from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any>} The stored value, or null if not found
 */
export const getItem = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error retrieving item at key "${key}":`, error);
    return null;
  }
};

/**
 * Remove an item from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<void>}
 */
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item at key "${key}":`, error);
    throw new Error('Failed to remove data');
  }
};

/**
 * Clear all app data from AsyncStorage
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
  try {
    // Get all keys that belong to the app
    const allKeys = await AsyncStorage.getAllKeys();
    const appKeys = allKeys.filter(key => key.startsWith('@wifi_remote:'));
    
    // Remove all app data
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('Failed to clear all data');
  }
};

/**
 * Store a paired device
 * @param {Object} device - Device to store
 * @returns {Promise<Array>} Updated list of paired devices
 */
export const storePairedDevice = async (device) => {
  try {
    // Get existing paired devices
    const pairedDevices = await getItem(KEYS.PAIRED_DEVICES) || [];
    
    // Check if device is already paired
    const deviceIndex = pairedDevices.findIndex(d => d.id === device.id);
    
    if (deviceIndex >= 0) {
      // Update existing device
      pairedDevices[deviceIndex] = {
        ...device,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new device
      pairedDevices.push({
        ...device,
        pairedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // Store updated list
    await storeItem(KEYS.PAIRED_DEVICES, pairedDevices);
    
    return pairedDevices;
  } catch (error) {
    console.error('Error storing paired device:', error);
    throw new Error('Failed to store paired device');
  }
};

/**
 * Remove a paired device
 * @param {string} deviceId - ID of the device to remove
 * @returns {Promise<Array>} Updated list of paired devices
 */
export const removePairedDevice = async (deviceId) => {
  try {
    // Get existing paired devices
    const pairedDevices = await getItem(KEYS.PAIRED_DEVICES) || [];
    
    // Filter out the device to remove
    const updatedDevices = pairedDevices.filter(d => d.id !== deviceId);
    
    // Store updated list
    await storeItem(KEYS.PAIRED_DEVICES, updatedDevices);
    
    return updatedDevices;
  } catch (error) {
    console.error('Error removing paired device:', error);
    throw new Error('Failed to remove paired device');
  }
};

/**
 * Get all paired devices
 * @returns {Promise<Array>} List of paired devices
 */
export const getPairedDevices = async () => {
  try {
    return await getItem(KEYS.PAIRED_DEVICES) || [];
  } catch (error) {
    console.error('Error getting paired devices:', error);
    return [];
  }
};
