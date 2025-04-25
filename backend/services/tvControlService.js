/**
 * TV Control Service
 * Handles sending commands to Android TVs
 */

// Mock device connections (for development/testing)
const deviceConnections = {
  // key: deviceId, value: connection object
};

/**
 * Send power command to a TV
 * @param {string} deviceId - ID of the target device
 * @returns {Promise<boolean>} Success status
 */
const sendPowerCommand = async (deviceId) => {
  try {
    // In a real implementation, this would send an ADB command or use the TV's API
    // For demonstration, we'll simulate sending the command
    
    // Check if device is connected
    ensureDeviceConnected(deviceId);
    
    // Simulate command delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log(`Power command sent to device ${deviceId}`);
    return true;
  } catch (error) {
    console.error('Error sending power command:', error);
    throw new Error(`Failed to send power command: ${error.message}`);
  }
};

/**
 * Send volume command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} action - 'up', 'down', or 'mute'
 * @returns {Promise<boolean>} Success status
 */
const sendVolumeCommand = async (deviceId, action) => {
  try {
    // Check if device is connected
    ensureDeviceConnected(deviceId);
    
    // Validate action
    if (!['up', 'down', 'mute'].includes(action)) {
      throw new Error('Invalid volume action');
    }
    
    // Simulate command delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`Volume ${action} command sent to device ${deviceId}`);
    return true;
  } catch (error) {
    console.error(`Error sending volume ${action} command:`, error);
    throw new Error(`Failed to send volume ${action} command: ${error.message}`);
  }
};

/**
 * Send channel command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} action - 'up', 'down', 'guide', or 'number'
 * @param {string} [number] - Channel number (only for 'number' action)
 * @returns {Promise<boolean>} Success status
 */
const sendChannelCommand = async (deviceId, action, number) => {
  try {
    // Check if device is connected
    ensureDeviceConnected(deviceId);
    
    // Validate action
    if (!['up', 'down', 'guide', 'number'].includes(action)) {
      throw new Error('Invalid channel action');
    }
    
    // Validate number for 'number' action
    if (action === 'number' && (number === undefined || !/^\d+$/.test(number))) {
      throw new Error('Valid channel number required for "number" action');
    }
    
    // Simulate command delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    if (action === 'number') {
      console.log(`Channel number ${number} command sent to device ${deviceId}`);
    } else {
      console.log(`Channel ${action} command sent to device ${deviceId}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error sending channel ${action} command:`, error);
    throw new Error(`Failed to send channel ${action} command: ${error.message}`);
  }
};

/**
 * Send directional pad command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} direction - 'up', 'down', 'left', 'right', or 'ok'
 * @returns {Promise<boolean>} Success status
 */
const sendDirectionalCommand = async (deviceId, direction) => {
  try {
    // Check if device is connected
    ensureDeviceConnected(deviceId);
    
    // Validate direction
    if (!['up', 'down', 'left', 'right', 'ok'].includes(direction)) {
      throw new Error('Invalid direction');
    }
    
    // Simulate command delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`Direction ${direction} command sent to device ${deviceId}`);
    return true;
  } catch (error) {
    console.error(`Error sending direction ${direction} command:`, error);
    throw new Error(`Failed to send direction ${direction} command: ${error.message}`);
  }
};

/**
 * Send text input to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} text - Text to send
 * @returns {Promise<boolean>} Success status
 */
const sendInputTextCommand = async (deviceId, text) => {
  try {
    // Check if device is connected
    ensureDeviceConnected(deviceId);
    
    // Validate text
    if (text === undefined) {
      throw new Error('Text is required');
    }
    
    // Simulate command delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log(`Text input "${text}" sent to device ${deviceId}`);
    return true;
  } catch (error) {
    console.error('Error sending text input:', error);
    throw new Error(`Failed to send text input: ${error.message}`);
  }
};

/**
 * Send voice command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} command - Voice command text
 * @returns {Promise<boolean>} Success status
 */
const sendVoiceCommand = async (deviceId, command) => {
  try {
    // Check if device is connected
    ensureDeviceConnected(deviceId);
    
    // Validate command
    if (!command) {
      throw new Error('Voice command is required');
    }
    
    // Simulate command delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Voice command "${command}" sent to device ${deviceId}`);
    return true;
  } catch (error) {
    console.error('Error sending voice command:', error);
    throw new Error(`Failed to send voice command: ${error.message}`);
  }
};

/**
 * Launch an app on a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} appId - ID or name of the app to launch
 * @returns {Promise<boolean>} Success status
 */
const launchApp = async (deviceId, appId) => {
  try {
    // Check if device is connected
    ensureDeviceConnected(deviceId);
    
    // Validate appId
    if (!appId) {
      throw new Error('App ID is required');
    }
    
    // Simulate command delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    console.log(`App ${appId} launched on device ${deviceId}`);
    return true;
  } catch (error) {
    console.error(`Error launching app ${appId}:`, error);
    throw new Error(`Failed to launch app ${appId}: ${error.message}`);
  }
};

/**
 * Ensure a device is connected before sending commands
 * @param {string} deviceId - Device ID to check
 * @throws {Error} If device is not connected
 */
const ensureDeviceConnected = (deviceId) => {
  // In a real implementation, this would check if the device is connected
  // For demonstration, we'll assume the device is connected if deviceId is valid
  
  // Basic validation for deviceId
  if (!deviceId) {
    throw new Error('Device ID is required');
  }
  
  // Check if device is in our mock list (1, 2, or 3)
  if (!['1', '2', '3'].includes(deviceId)) {
    throw new Error('Device not found or not paired');
  }
  
  // For device #3 (which is "offline" in our mock data), throw an error
  if (deviceId === '3') {
    throw new Error('Device is offline');
  }
  
  // If device isn't in our connections map, "connect" to it
  if (!deviceConnections[deviceId]) {
    deviceConnections[deviceId] = {
      connected: true,
      lastCommand: null,
      connectionTime: new Date().toISOString(),
    };
  }
};

module.exports = {
  sendPowerCommand,
  sendVolumeCommand,
  sendChannelCommand,
  sendDirectionalCommand,
  sendInputTextCommand,
  sendVoiceCommand,
  launchApp,
};
