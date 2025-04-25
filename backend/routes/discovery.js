const express = require('express');
const router = express.Router();
const discoveryService = require('../services/discoveryService');

/**
 * @route GET /api/discovery
 * @desc Discover Android TVs on the local network
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    const devices = await discoveryService.discoverDevices();
    res.json({
      status: 'success',
      data: {
        devices,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/discovery/stop
 * @desc Stop the discovery process
 * @access Public
 */
router.get('/stop', async (req, res, next) => {
  try {
    await discoveryService.stopDiscovery();
    res.json({
      status: 'success',
      message: 'Discovery stopped',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/discovery/recent
 * @desc Get recently discovered devices
 * @access Public
 */
router.get('/recent', async (req, res, next) => {
  try {
    const devices = await discoveryService.getRecentDevices();
    res.json({
      status: 'success',
      data: {
        devices,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/discovery/:deviceId
 * @desc Get a specific device by ID
 * @access Public
 */
router.get('/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = await discoveryService.getDeviceById(deviceId);
    
    if (!device) {
      return res.status(404).json({
        status: 'error',
        message: 'Device not found',
      });
    }
    
    res.json({
      status: 'success',
      data: {
        device,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/discovery/scan
 * @desc Trigger a new scan for devices with custom options
 * @access Public
 */
router.post('/scan', async (req, res, next) => {
  try {
    const options = req.body;
    const devices = await discoveryService.scanWithOptions(options);
    res.json({
      status: 'success',
      data: {
        devices,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/discovery/paired
 * @desc Get all paired devices
 * @access Public
 */
router.get('/paired', async (req, res, next) => {
  try {
    const devices = await discoveryService.getPairedDevices();
    res.json({
      status: 'success',
      data: {
        devices,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
