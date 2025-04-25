import { Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../utils/constants';

/**
 * Discover Android TVs on the local network
 * @returns {Promise<Array>} List of discovered TV devices
 */
export const discoverDevices = async () => {
  try {
    // Make API call to backend to discover devices
    const response = await axios.get(`${API_URL}/api/discovery`);
    
    if (response.data.status === 'success') {
      return response.data.data.devices;
    } else {
      throw new Error(response.data.message || 'Failed to discover devices');
    }
  } catch (error) {
    console.error('Error discovering devices:', error);
    throw new Error('Failed to discover devices');
  }
};

/**
 * Stop the discovery process
 */
export const stopDiscovery = async () => {
  try {
    // Call backend to stop discovery
    await axios.get(`${API_URL}/api/discovery/stop`);
  } catch (error) {
    console.error('Error stopping discovery:', error);
    // Non-critical error, so we don't throw
  }
};

/**
 * Pair with a specific TV device
 * @param {string} deviceId - ID of the device to pair with
 * @param {string} pin - Pairing PIN code
 * @returns {Promise<Object>} The paired device
 */
export const pairWithDevice = async (deviceId, pin) => {
  try {
    // Call backend to pair with device using PIN
    const response = await axios.post(`${API_URL}/api/pairing/pin`, {
      deviceId,
      pin
    });
    
    if (response.data.status === 'success') {
      return response.data.data.device;
    } else {
      throw new Error(response.data.message || 'Failed to pair with device');
    }
  } catch (error) {
    console.error('Error pairing with device:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to pair with device');
    }
    throw new Error('Failed to pair with device');
  }
};

/**
 * Get a list of paired devices
 * @returns {Promise<Array>} List of paired devices
 */
export const getPairedDevices = async () => {
  try {
    // Call backend to get paired devices
    const response = await axios.get(`${API_URL}/api/discovery/paired`);
    
    if (response.data.status === 'success') {
      return response.data.data.devices;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error getting paired devices:', error);
    // Return empty array on error to avoid crashing
    return [];
  }
};

/**
 * Remove a paired device
 * @param {string} deviceId - ID of the device to unpair
 */
export const unpairDevice = async (deviceId) => {
  try {
    // Call backend to unpair device
    const response = await axios.delete(`${API_URL}/api/pairing/${deviceId}`);
    
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to unpair device');
    }
  } catch (error) {
    console.error('Error unpairing device:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to unpair device');
    }
    throw new Error('Failed to unpair device');
  }
};
