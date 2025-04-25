import { Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../utils/constants';

// Mock TV devices for demonstration
const mockDevices = [
  {
    id: '1',
    name: 'Living Room TV',
    model: 'Samsung Smart TV',
    ip: '192.168.1.100',
    status: 'online'
  },
  {
    id: '2',
    name: 'Bedroom TV',
    model: 'LG Android TV',
    ip: '192.168.1.101',
    status: 'online'
  },
  {
    id: '3',
    name: 'Kitchen TV',
    model: 'Sony Bravia',
    ip: '192.168.1.102',
    status: 'offline'
  }
];

/**
 * Discover Android TVs on the local network
 * @returns {Promise<Array>} List of discovered TV devices
 */
export const discoverDevices = async () => {
  try {
    // In a real implementation, this would make an API call to the backend
    // For demonstration, we're using mock data
    
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Filter only online devices
    return mockDevices.filter(device => device.status === 'online');
  } catch (error) {
    console.error('Error discovering devices:', error);
    throw new Error('Failed to discover devices');
  }
};

/**
 * Stop the discovery process
 */
export const stopDiscovery = async () => {
  // In a real implementation, this would cancel any ongoing discovery
  // No action needed for the mock implementation
};

/**
 * Pair with a specific TV device
 * @param {string} deviceId - ID of the device to pair with
 * @param {string} pin - Pairing PIN code
 * @returns {Promise<Object>} The paired device
 */
export const pairWithDevice = async (deviceId, pin) => {
  try {
    // In a real implementation, this would send the PIN to the backend for pairing
    // For demonstration, we're using mock data
    
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation (in a real app, this would be done on the server)
    if (pin !== '1234' && deviceId !== '1' && deviceId !== '2') {
      throw new Error('Invalid PIN');
    }
    
    // Find the device
    const device = mockDevices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error('Device not found');
    }
    
    // Return the paired device with some additional information
    return {
      ...device,
      paired: true,
      pairingTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error pairing with device:', error);
    throw new Error('Failed to pair with device');
  }
};

/**
 * Get a list of paired devices
 * @returns {Promise<Array>} List of paired devices
 */
export const getPairedDevices = async () => {
  try {
    // In a real implementation, this would get the list from local storage or backend
    // For demonstration, we're returning an empty array
    return [];
  } catch (error) {
    console.error('Error getting paired devices:', error);
    throw new Error('Failed to get paired devices');
  }
};

/**
 * Remove a paired device
 * @param {string} deviceId - ID of the device to unpair
 */
export const unpairDevice = async (deviceId) => {
  try {
    // In a real implementation, this would remove the device from local storage or backend
    // No action needed for the mock implementation
  } catch (error) {
    console.error('Error unpairing device:', error);
    throw new Error('Failed to unpair device');
  }
};
