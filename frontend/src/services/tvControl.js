import axios from 'axios';
import { API_URL } from '../utils/constants';

/**
 * Send power command to a TV
 * @param {string} deviceId - ID of the target device
 * @returns {Promise<boolean>} Success status
 */
export const sendPowerCommand = async (deviceId) => {
  try {
    const response = await axios.post(`${API_URL}/api/control/power`, {
      deviceId
    });
    
    if (response.data.status === 'success') {
      console.log(`Power command sent to device ${deviceId}`);
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to send power command');
    }
  } catch (error) {
    console.error('Error sending power command:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to send power command');
    }
    throw new Error('Failed to send power command');
  }
};

/**
 * Send volume command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} action - 'up', 'down', or 'mute'
 * @returns {Promise<boolean>} Success status
 */
export const sendVolumeCommand = async (deviceId, action) => {
  try {
    const response = await axios.post(`${API_URL}/api/control/volume`, {
      deviceId,
      action
    });
    
    if (response.data.status === 'success') {
      console.log(`Volume ${action} command sent to device ${deviceId}`);
      return true;
    } else {
      throw new Error(response.data.message || `Failed to send volume ${action} command`);
    }
  } catch (error) {
    console.error(`Error sending volume ${action} command:`, error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `Failed to send volume ${action} command`);
    }
    throw new Error(`Failed to send volume ${action} command`);
  }
};

/**
 * Send channel command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} action - 'up', 'down', 'guide', or 'number'
 * @param {string} [number] - Channel number (only for 'number' action)
 * @returns {Promise<boolean>} Success status
 */
export const sendChannelCommand = async (deviceId, action, number) => {
  try {
    const payload = { deviceId, action };
    
    if (action === 'number' && number) {
      payload.number = number;
    }
    
    const response = await axios.post(`${API_URL}/api/control/channel`, payload);
    
    if (response.data.status === 'success') {
      if (action === 'number') {
        console.log(`Channel number ${number} command sent to device ${deviceId}`);
      } else {
        console.log(`Channel ${action} command sent to device ${deviceId}`);
      }
      return true;
    } else {
      throw new Error(response.data.message || `Failed to send channel ${action} command`);
    }
  } catch (error) {
    console.error(`Error sending channel ${action} command:`, error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `Failed to send channel ${action} command`);
    }
    throw new Error(`Failed to send channel ${action} command`);
  }
};

/**
 * Send directional pad command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} direction - 'up', 'down', 'left', 'right', or 'ok'
 * @returns {Promise<boolean>} Success status
 */
export const sendDirectionalCommand = async (deviceId, direction) => {
  try {
    const response = await axios.post(`${API_URL}/api/control/directional`, {
      deviceId,
      direction
    });
    
    if (response.data.status === 'success') {
      console.log(`Direction ${direction} command sent to device ${deviceId}`);
      return true;
    } else {
      throw new Error(response.data.message || `Failed to send direction ${direction} command`);
    }
  } catch (error) {
    console.error(`Error sending direction ${direction} command:`, error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `Failed to send direction ${direction} command`);
    }
    throw new Error(`Failed to send direction ${direction} command`);
  }
};

/**
 * Send text input to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} text - Text to send
 * @returns {Promise<boolean>} Success status
 */
export const sendInputTextCommand = async (deviceId, text) => {
  try {
    const response = await axios.post(`${API_URL}/api/control/text`, {
      deviceId,
      text
    });
    
    if (response.data.status === 'success') {
      console.log(`Text input "${text}" sent to device ${deviceId}`);
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to send text input');
    }
  } catch (error) {
    console.error('Error sending text input:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to send text input');
    }
    throw new Error('Failed to send text input');
  }
};

/**
 * Send voice command to a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} command - Voice command text
 * @returns {Promise<boolean>} Success status
 */
export const sendVoiceCommand = async (deviceId, command) => {
  try {
    const response = await axios.post(`${API_URL}/api/control/voice`, {
      deviceId,
      command
    });
    
    if (response.data.status === 'success') {
      console.log(`Voice command "${command}" sent to device ${deviceId}`);
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to send voice command');
    }
  } catch (error) {
    console.error('Error sending voice command:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to send voice command');
    }
    throw new Error('Failed to send voice command');
  }
};

/**
 * Launch an app on a TV
 * @param {string} deviceId - ID of the target device
 * @param {string} appId - ID or name of the app to launch
 * @returns {Promise<boolean>} Success status
 */
export const launchApp = async (deviceId, appId) => {
  try {
    const response = await axios.post(`${API_URL}/api/control/app`, {
      deviceId,
      appId
    });
    
    if (response.data.status === 'success') {
      console.log(`App ${appId} launched on device ${deviceId}`);
      return true;
    } else {
      throw new Error(response.data.message || `Failed to launch app ${appId}`);
    }
  } catch (error) {
    console.error(`Error launching app ${appId}:`, error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `Failed to launch app ${appId}`);
    }
    throw new Error(`Failed to launch app ${appId}`);
  }
};
