const express = require('express');
const router = express.Router();
const discoveryService = require('../services/discoveryService');

/**
 * @route POST /api/pairing/pin
 * @desc Pair with a TV using PIN code
 * @access Public
 */
router.post('/pin', async (req, res, next) => {
  try {
    const { deviceId, pin } = req.body;
    
    if (!deviceId || !pin) {
      return res.status(400).json({
        status: 'error',
        message: 'Device ID and PIN are required',
      });
    }
    
    // Validate PIN format (should be 4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        status: 'error',
        message: 'PIN must be a 4-digit number',
      });
    }
    
    const pairedDevice = await discoveryService.pairWithDevice(deviceId, pin);
    
    res.json({
      status: 'success',
      message: 'Device paired successfully',
      data: {
        device: pairedDevice,
      },
    });
  } catch (error) {
    // Format specific errors for pairing failures
    if (error.message === 'Invalid PIN') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid PIN code',
      });
    }
    
    if (error.message === 'Device not found') {
      return res.status(404).json({
        status: 'error',
        message: 'Device not found',
      });
    }
    
    if (error.message === 'Connection timeout') {
      return res.status(408).json({
        status: 'error',
        message: 'Connection timed out while trying to pair with the device',
      });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/pairing/qr
 * @desc Pair with a TV using QR code data
 * @access Public
 */
router.post('/qr', async (req, res, next) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({
        status: 'error',
        message: 'QR code data is required',
      });
    }
    
    // Parse the QR code data
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (e) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid QR code format',
      });
    }
    
    // Validate the parsed data
    if (!parsedData.deviceId || !parsedData.pin) {
      return res.status(400).json({
        status: 'error',
        message: 'QR code must contain deviceId and pin',
      });
    }
    
    const pairedDevice = await discoveryService.pairWithDevice(
      parsedData.deviceId, 
      parsedData.pin
    );
    
    res.json({
      status: 'success',
      message: 'Device paired successfully',
      data: {
        device: pairedDevice,
      },
    });
  } catch (error) {
    // Handle specific errors
    if (error.message === 'Invalid QR code') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid QR code data',
      });
    }
    
    next(error);
  }
});

/**
 * @route DELETE /api/pairing/:deviceId
 * @desc Unpair (forget) a TV device
 * @access Public
 */
router.delete('/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    
    await discoveryService.unpairDevice(deviceId);
    
    res.json({
      status: 'success',
      message: 'Device unpaired successfully',
    });
  } catch (error) {
    if (error.message === 'Device not found') {
      return res.status(404).json({
        status: 'error',
        message: 'Device not found or not paired',
      });
    }
    
    next(error);
  }
});

/**
 * @route GET /api/pairing/generate-pin/:deviceId
 * @desc Generate a new PIN for pairing (debug/testing only)
 * @access Public
 */
router.get('/generate-pin/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    
    // This is only for testing/debugging - in a real implementation,
    // the PIN would be generated on the TV side
    const pin = await discoveryService.generatePairingPin(deviceId);
    
    res.json({
      status: 'success',
      data: {
        deviceId,
        pin,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
