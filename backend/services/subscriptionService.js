const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');

// Load environment variables
dotenv.config();

// Initialize Stripe if API key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

// Subscription plans
const SUBSCRIPTION_PLANS = {
  daily: {
    id: 'daily',
    name: 'Daily Pass',
    period: 'day',
    price: 0.99,
    currency: 'USD',
    stripe_price_id: process.env.STRIPE_PRICE_DAILY,
    trial_days: 0,
  },
  weekly: {
    id: 'weekly',
    name: 'Weekly Pass',
    period: 'week',
    price: 2.99,
    currency: 'USD',
    stripe_price_id: process.env.STRIPE_PRICE_WEEKLY,
    trial_days: 0,
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly Premium',
    period: 'month',
    price: 7.99,
    currency: 'USD',
    stripe_price_id: process.env.STRIPE_PRICE_MONTHLY,
    trial_days: 0,
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Premium',
    period: 'year',
    price: 59.99,
    currency: 'USD',
    stripe_price_id: process.env.STRIPE_PRICE_YEARLY,
    trial_days: 0,
    best_value: true,
  },
};

// Trial duration in milliseconds
const TRIAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Mock user data storage (in a real app, this would be a database)
const users = {};

/**
 * Check subscription status for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Subscription status
 */
const checkSubscriptionStatus = async (userId) => {
  try {
    // Ensure user exists
    ensureUserExists(userId);
    
    const user = users[userId];
    
    // Check if user has an active subscription
    if (user.subscription && user.subscription.status === 'active') {
      return {
        hasActiveSubscription: true,
        subscription: user.subscription,
        trialActive: false,
      };
    }
    
    // Check if user is in trial period
    const trialStatus = await checkTrialStatus(userId);
    
    return {
      hasActiveSubscription: false,
      subscription: user.subscription || null,
      trialActive: trialStatus.isActive,
      trialRemaining: trialStatus.remainingTime,
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw new Error(`Failed to check subscription status: ${error.message}`);
  }
};

/**
 * Check trial status for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Trial status information
 */
const checkTrialStatus = async (userId) => {
  try {
    // Ensure user exists
    ensureUserExists(userId);
    
    const user = users[userId];
    
    // If user hasn't started a trial yet
    if (!user.trialStartTime) {
      return {
        isActive: false,
        hasStarted: false,
        remainingTime: TRIAL_DURATION,
      };
    }
    
    // Calculate remaining trial time
    const now = new Date().getTime();
    const trialStart = new Date(user.trialStartTime).getTime();
    const elapsed = now - trialStart;
    const remainingTime = Math.max(0, TRIAL_DURATION - elapsed);
    
    return {
      isActive: remainingTime > 0,
      hasStarted: true,
      startTime: user.trialStartTime,
      remainingTime,
    };
  } catch (error) {
    console.error('Error checking trial status:', error);
    throw new Error(`Failed to check trial status: ${error.message}`);
  }
};

/**
 * Start trial for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Trial information
 */
const startTrial = async (userId) => {
  try {
    // Ensure user exists
    ensureUserExists(userId);
    
    const user = users[userId];
    
    // Check if user has already used their trial
    if (user.trialStartTime) {
      const trialStatus = await checkTrialStatus(userId);
      
      if (!trialStatus.isActive) {
        throw new Error('Trial already used');
      }
      
      return trialStatus;
    }
    
    // Start trial
    const now = new Date().toISOString();
    user.trialStartTime = now;
    
    return {
      isActive: true,
      hasStarted: true,
      startTime: now,
      remainingTime: TRIAL_DURATION,
    };
  } catch (error) {
    console.error('Error starting trial:', error);
    throw new Error(`Failed to start trial: ${error.message}`);
  }
};

/**
 * Purchase a subscription for a user
 * @param {string} userId - User ID
 * @param {string} planId - Subscription plan ID
 * @returns {Promise<Object>} Subscription information
 */
const purchaseSubscription = async (userId, planId) => {
  try {
    // Ensure user exists
    ensureUserExists(userId);
    
    // Validate plan
    if (!SUBSCRIPTION_PLANS[planId]) {
      throw new Error('Invalid subscription plan');
    }
    
    const plan = SUBSCRIPTION_PLANS[planId];
    const user = users[userId];
    
    // In a real implementation, this would integrate with a payment provider
    // For demonstration, we'll simulate a successful purchase
    
    // Create subscription
    const subscription = {
      id: uuidv4(),
      userId,
      planId,
      planName: plan.name,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: calculateEndDate(plan.period),
      renewalDate: calculateEndDate(plan.period),
      price: plan.price,
      currency: plan.currency,
      autoRenew: true,
    };
    
    // Save subscription to user
    user.subscription = subscription;
    
    return subscription;
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    throw new Error(`Failed to purchase subscription: ${error.message}`);
  }
};

/**
 * Create a payment intent for Stripe
 * @param {string} userId - User ID
 * @param {string} planId - Subscription plan ID
 * @returns {Promise<Object>} Payment intent
 */
const createPaymentIntent = async (userId, planId) => {
  try {
    // Ensure Stripe is initialized
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }
    
    // Ensure user exists
    ensureUserExists(userId);
    
    // Validate plan
    if (!SUBSCRIPTION_PLANS[planId]) {
      throw new Error('Invalid subscription plan');
    }
    
    const plan = SUBSCRIPTION_PLANS[planId];
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(plan.price * 100), // Convert to cents
      currency: plan.currency.toLowerCase(),
      metadata: {
        userId,
        planId,
      },
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
};

/**
 * Cancel a subscription for a user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const cancelSubscription = async (userId) => {
  try {
    // Ensure user exists
    ensureUserExists(userId);
    
    const user = users[userId];
    
    // Check if user has an active subscription
    if (!user.subscription || user.subscription.status !== 'active') {
      throw new Error('No active subscription found');
    }
    
    // Update subscription status
    user.subscription.status = 'canceled';
    user.subscription.cancelDate = new Date().toISOString();
    
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

/**
 * Get all available subscription plans
 * @returns {Promise<Array>} Array of subscription plans
 */
const getSubscriptionPlans = async () => {
  return Object.values(SUBSCRIPTION_PLANS);
};

/**
 * Create a subscription in Stripe
 * @param {string} userId - User ID
 * @param {string} planId - Subscription plan ID
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise<Object>} Subscription information
 */
const createSubscription = async (userId, planId, paymentMethodId) => {
  try {
    // Ensure Stripe is initialized
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }
    
    // Ensure user exists
    ensureUserExists(userId);
    
    // Validate plan
    if (!SUBSCRIPTION_PLANS[planId]) {
      throw new Error('Invalid subscription plan');
    }
    
    const plan = SUBSCRIPTION_PLANS[planId];
    const user = users[userId];
    
    // Ensure user has a Stripe customer ID
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      // Create customer
      const customer = await stripe.customers.create({
        email: user.email || `user-${userId}@example.com`,
        name: user.name || `User ${userId}`,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      
      customerId = customer.id;
      user.stripeCustomerId = customerId;
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: plan.stripe_price_id,
        },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    // Save subscription details to user
    user.subscription = {
      id: subscription.id,
      userId,
      planId,
      planName: plan.name,
      status: subscription.status,
      startDate: new Date(subscription.created * 1000).toISOString(),
      stripeSubscriptionId: subscription.id,
      price: plan.price,
      currency: plan.currency,
      autoRenew: true,
    };
    
    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscription: user.subscription,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

/**
 * Ensure a user exists in our mock database
 * @param {string} userId - User ID to check/create
 */
const ensureUserExists = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!users[userId]) {
    // Create a new user
    users[userId] = {
      id: userId,
      createdAt: new Date().toISOString(),
    };
  }
};

/**
 * Calculate the end date based on period
 * @param {string} period - 'day', 'week', 'month', or 'year'
 * @returns {string} ISO date string
 */
const calculateEndDate = (period) => {
  const now = new Date();
  
  switch (period) {
    case 'day':
      now.setDate(now.getDate() + 1);
      break;
    case 'week':
      now.setDate(now.getDate() + 7);
      break;
    case 'month':
      now.setMonth(now.getMonth() + 1);
      break;
    case 'year':
      now.setFullYear(now.getFullYear() + 1);
      break;
    default:
      throw new Error('Invalid period');
  }
  
  return now.toISOString();
};

module.exports = {
  checkSubscriptionStatus,
  checkTrialStatus,
  startTrial,
  purchaseSubscription,
  createPaymentIntent,
  cancelSubscription,
  getSubscriptionPlans,
  createSubscription,
};
