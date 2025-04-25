const express = require('express');
const router = express.Router();
const subscriptionService = require('../services/subscriptionService');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Checking for Stripe API key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe integration will not work properly.');
}

/**
 * @route POST /api/subscription/check
 * @desc Check subscription status
 * @access Public
 */
router.post('/check', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required',
      });
    }
    
    const subscriptionStatus = await subscriptionService.checkSubscriptionStatus(userId);
    
    res.json({
      status: 'success',
      data: subscriptionStatus,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/subscription/trial/status
 * @desc Check trial period status
 * @access Public
 */
router.post('/trial/status', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required',
      });
    }
    
    const trialStatus = await subscriptionService.checkTrialStatus(userId);
    
    res.json({
      status: 'success',
      data: trialStatus,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/subscription/trial/start
 * @desc Start trial period for a user
 * @access Public
 */
router.post('/trial/start', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required',
      });
    }
    
    const trialInfo = await subscriptionService.startTrial(userId);
    
    res.json({
      status: 'success',
      message: 'Trial period started successfully',
      data: trialInfo,
    });
  } catch (error) {
    if (error.message === 'Trial already used') {
      return res.status(400).json({
        status: 'error',
        message: 'User has already used their trial period',
      });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/subscription/purchase
 * @desc Purchase a subscription plan
 * @access Public
 */
router.post('/purchase', async (req, res, next) => {
  try {
    const { userId, planId } = req.body;
    
    if (!userId || !planId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID and plan ID are required',
      });
    }
    
    const subscription = await subscriptionService.purchaseSubscription(userId, planId);
    
    res.json({
      status: 'success',
      message: 'Subscription purchased successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/subscription/create-payment-intent
 * @desc Create a payment intent for Stripe
 * @access Public
 */
router.post('/create-payment-intent', async (req, res, next) => {
  try {
    const { userId, planId } = req.body;
    
    if (!userId || !planId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID and plan ID are required',
      });
    }
    
    const paymentIntent = await subscriptionService.createPaymentIntent(userId, planId);
    
    res.json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/subscription/cancel
 * @desc Cancel a subscription
 * @access Public
 */
router.post('/cancel', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required',
      });
    }
    
    await subscriptionService.cancelSubscription(userId);
    
    res.json({
      status: 'success',
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/subscription/plans
 * @desc Get all available subscription plans
 * @access Public
 */
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await subscriptionService.getSubscriptionPlans();
    
    res.json({
      status: 'success',
      data: {
        plans,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/subscription/create-subscription
 * @desc Create a subscription for a user (Stripe)
 * @access Public
 */
router.post('/create-subscription', async (req, res, next) => {
  try {
    const { userId, planId, paymentMethodId } = req.body;
    
    if (!userId || !planId || !paymentMethodId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID, plan ID, and payment method ID are required',
      });
    }
    
    const subscription = await subscriptionService.createSubscription(userId, planId, paymentMethodId);
    
    res.json({
      status: 'success',
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
