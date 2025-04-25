const express = require('express');
const router = express.Router();
const tvControlService = require('../services/tvControlService');

/**
 * @route POST /api/control/power
 * @desc Send power command to a TV
 * @access Public
 */
router.post('/power', async (req, res, next) => {
  try {
    const { deviceId } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID is required',
      });
    }
    
    await tvControlService.sendPowerCommand(deviceId);
    
    res.json({
      status: 'success',
      message: 'Power command sent successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/control/volume
 * @desc Send volume command to a TV
 * @access Public
 */
router.post('/volume', async (req, res, next) => {
  try {
    const { deviceId, action } = req.body;
    
    if (!deviceId || !action) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID and action are required',
      });
    }
    
    // Validate action
    const validActions = ['up', 'down', 'mute'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid action. Must be one of: ${validActions.join(', ')}`,
      });
    }
    
    await tvControlService.sendVolumeCommand(deviceId, action);
    
    res.json({
      status: 'success',
      message: `Volume ${action} command sent successfully`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/control/channel
 * @desc Send channel command to a TV
 * @access Public
 */
router.post('/channel', async (req, res, next) => {
  try {
    const { deviceId, action, number } = req.body;
    
    if (!deviceId || !action) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID and action are required',
      });
    }
    
    // Validate action
    const validActions = ['up', 'down', 'guide', 'number'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid action. Must be one of: ${validActions.join(', ')}`,
      });
    }
    
    // If action is 'number', validate number
    if (action === 'number' && (number === undefined || !/^\d+$/.test(number))) {
      return res.status(400).json({
        status: 'error',
        message: 'A valid channel number is required for "number" action',
      });
    }
    
    await tvControlService.sendChannelCommand(deviceId, action, number);
    
    res.json({
      status: 'success',
      message: `Channel ${action} command sent successfully`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/control/directional
 * @desc Send directional pad command to a TV
 * @access Public
 */
router.post('/directional', async (req, res, next) => {
  try {
    const { deviceId, direction } = req.body;
    
    if (!deviceId || !direction) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID and direction are required',
      });
    }
    
    // Validate direction
    const validDirections = ['up', 'down', 'left', 'right', 'ok'];
    if (!validDirections.includes(direction)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid direction. Must be one of: ${validDirections.join(', ')}`,
      });
    }
    
    await tvControlService.sendDirectionalCommand(deviceId, direction);
    
    res.json({
      status: 'success',
      message: `Direction ${direction} command sent successfully`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/control/text
 * @desc Send text input to a TV
 * @access Public
 */
router.post('/text', async (req, res, next) => {
  try {
    const { deviceId, text } = req.body;
    
    if (!deviceId || text === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID and text are required',
      });
    }
    
    await tvControlService.sendInputTextCommand(deviceId, text);
    
    res.json({
      status: 'success',
      message: 'Text input sent successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/control/voice
 * @desc Send voice command to a TV
 * @access Public
 */
router.post('/voice', async (req, res, next) => {
  try {
    const { deviceId, command } = req.body;
    
    if (!deviceId || !command) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID and voice command are required',
      });
    }
    
    await tvControlService.sendVoiceCommand(deviceId, command);
    
    res.json({
      status: 'success',
      message: 'Voice command sent successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/control/app
 * @desc Launch an app on a TV
 * @access Public
 */
router.post('/app', async (req, res, next) => {
  try {
    const { deviceId, appId } = req.body;
    
    if (!deviceId || !appId) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID and app ID are required',
      });
    }
    
    await tvControlService.launchApp(deviceId, appId);
    
    res.json({
      status: 'success',
      message: `App ${appId} launched successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
