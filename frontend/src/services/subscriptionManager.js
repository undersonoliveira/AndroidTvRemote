import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../utils/constants';

// Storage keys
const USER_ID_KEY = '@wifi_remote:user_id';
const SUBSCRIPTION_STATUS_KEY = '@wifi_remote:subscription_status';
const TRIAL_START_KEY = '@wifi_remote:trial_start';

// Trial duration is configured on the server
// Here we use 24 hours as a fallback
const TRIAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Make sure we have a user ID
 * @returns {Promise<string>} User ID
 */
const ensureUserId = async () => {
  try {
    let userId = await AsyncStorage.getItem(USER_ID_KEY);
    
    if (!userId) {
      // Generate a random user ID if none exists
      userId = `user_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    }
    
    return userId;
  } catch (error) {
    console.error('Error ensuring user ID:', error);
    return null;
  }
};

/**
 * Check if the user has premium access
 * @returns {Promise<boolean>} True if the user has premium access
 */
export const checkPremiumAccess = async () => {
  try {
    const userId = await ensureUserId();
    
    // Call the backend to check subscription status
    const response = await axios.post(`${API_URL}/api/subscription/check`, { userId });
    
    if (response.data.status === 'success') {
      // Store the subscription status locally for offline access
      await AsyncStorage.setItem(
        SUBSCRIPTION_STATUS_KEY, 
        response.data.data.hasActiveSubscription ? 'active' : 'inactive'
      );
      
      return response.data.data.hasActiveSubscription;
    }
    
    // Fallback to local check if backend call fails
    const subscriptionStatus = await AsyncStorage.getItem(SUBSCRIPTION_STATUS_KEY);
    if (subscriptionStatus === 'active') {
      return true;
    }
    
    // Check if the user is still within the trial period
    const trialTimeRemaining = await getRemainingTrialTime();
    return trialTimeRemaining > 0;
  } catch (error) {
    console.error('Error checking premium access:', error);
    
    // If API call fails, use local data
    const subscriptionStatus = await AsyncStorage.getItem(SUBSCRIPTION_STATUS_KEY);
    if (subscriptionStatus === 'active') {
      return true;
    }
    
    const trialTimeRemaining = await getRemainingTrialTime();
    return trialTimeRemaining > 0;
  }
};

/**
 * Get the remaining trial time in milliseconds
 * @returns {Promise<number>} Remaining trial time in milliseconds
 */
export const getRemainingTrialTime = async () => {
  try {
    const userId = await ensureUserId();
    
    // Call the backend to check trial status
    const response = await axios.post(`${API_URL}/api/subscription/trial/status`, { userId });
    
    if (response.data.status === 'success') {
      return response.data.data.remainingTime;
    }
    
    // Fallback to local calculation if backend call fails
    const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
    
    if (!trialStartStr) {
      // If there's no trial start time recorded, start the trial now
      const now = new Date().getTime();
      await AsyncStorage.setItem(TRIAL_START_KEY, now.toString());
      return TRIAL_DURATION;
    }
    
    const trialStart = parseInt(trialStartStr, 10);
    const now = new Date().getTime();
    const elapsed = now - trialStart;
    
    return Math.max(0, TRIAL_DURATION - elapsed);
  } catch (error) {
    console.error('Error getting remaining trial time:', error);
    
    // If API call fails, use local data
    const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
    
    if (!trialStartStr) {
      const now = new Date().getTime();
      await AsyncStorage.setItem(TRIAL_START_KEY, now.toString());
      return TRIAL_DURATION;
    }
    
    const trialStart = parseInt(trialStartStr, 10);
    const now = new Date().getTime();
    const elapsed = now - trialStart;
    
    return Math.max(0, TRIAL_DURATION - elapsed);
  }
};

/**
 * Purchase a premium subscription
 * @param {string} planId - ID of the subscription plan
 * @returns {Promise<Object>} Subscription information
 */
export const purchasePremium = async (planId) => {
  try {
    const userId = await ensureUserId();
    
    // Call the backend to initiate purchase
    const response = await axios.post(`${API_URL}/api/subscription/purchase`, {
      userId,
      planId
    });
    
    if (response.data.status === 'success') {
      // Store the subscription status
      await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
      
      console.log(`Purchased plan: ${planId}`);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to purchase premium');
    }
  } catch (error) {
    console.error('Error purchasing premium:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to purchase premium');
    }
    throw new Error('Failed to purchase premium');
  }
};

/**
 * Create a payment intent for Stripe
 * @param {string} planId - ID of the subscription plan
 * @returns {Promise<Object>} Payment intent
 */
export const createPaymentIntent = async (planId) => {
  try {
    const userId = await ensureUserId();
    
    // Call the backend to create payment intent
    const response = await axios.post(`${API_URL}/api/subscription/create-payment-intent`, {
      userId,
      planId
    });
    
    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create payment intent');
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to create payment intent');
    }
    throw new Error('Failed to create payment intent');
  }
};

/**
 * Create a subscription in Stripe
 * @param {string} planId - ID of the subscription plan
 * @returns {Promise<Object>} Subscription information
 */
export const createSubscription = async (planId) => {
  try {
    const userId = await ensureUserId();
    
    // Call the backend to create subscription
    const response = await axios.post(`${API_URL}/api/subscription/create-subscription`, {
      userId,
      planId
    });
    
    if (response.data.status === 'success') {
      // Store the subscription status
      await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
      
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create subscription');
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to create subscription');
    }
    throw new Error('Failed to create subscription');
  }
};

/**
 * Cancel a premium subscription
 * @returns {Promise<boolean>} True if the cancellation was successful
 */
export const cancelSubscription = async () => {
  try {
    const userId = await ensureUserId();
    
    // Call the backend to cancel subscription
    const response = await axios.post(`${API_URL}/api/subscription/cancel`, { userId });
    
    if (response.data.status === 'success') {
      // Update the subscription status
      await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'canceled');
      
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to cancel subscription');
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to cancel subscription');
    }
    throw new Error('Failed to cancel subscription');
  }
};

/**
 * Get all available subscription plans
 * @returns {Promise<Array>} Array of subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    // Call the backend to get subscription plans
    const response = await axios.get(`${API_URL}/api/subscription/plans`);
    
    if (response.data.status === 'success') {
      return response.data.data.plans;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    // Return empty array on error to avoid crashing
    return [];
  }
};

/**
 * Check the trial status and start it if it hasn't started yet
 * @returns {Promise<void>}
 */
export const checkTrialStatus = async () => {
  try {
    const userId = await ensureUserId();
    
    // Call the backend to check/start trial
    const response = await axios.post(`${API_URL}/api/subscription/trial/start`, { userId });
    
    if (response.data.status === 'success') {
      // Store the trial start time locally
      await AsyncStorage.setItem(TRIAL_START_KEY, response.data.data.startTime.toString());
    } else {
      // Fallback to local trial start if backend call fails
      const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
      
      if (!trialStartStr) {
        // If there's no trial start time recorded, start the trial now
        const now = new Date().getTime();
        await AsyncStorage.setItem(TRIAL_START_KEY, now.toString());
      }
    }
  } catch (error) {
    console.error('Error checking trial status:', error);
    
    // If API call fails, use local data
    const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
    
    if (!trialStartStr) {
      // If there's no trial start time recorded, start the trial now
      const now = new Date().getTime();
      await AsyncStorage.setItem(TRIAL_START_KEY, now.toString());
    }
  }
};

/**
 * Reset all app data (for testing purposes)
 * @returns {Promise<void>}
 */
export const resetAppData = async () => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
    await AsyncStorage.removeItem(SUBSCRIPTION_STATUS_KEY);
    await AsyncStorage.removeItem(TRIAL_START_KEY);
  } catch (error) {
    console.error('Error resetting app data:', error);
    throw new Error('Failed to reset app data');
  }
};
