import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const SUBSCRIPTION_STATUS_KEY = '@wifi_remote:subscription_status';
const TRIAL_START_KEY = '@wifi_remote:trial_start';

// Trial duration in milliseconds (1 day)
const TRIAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if the user has premium access
 * @returns {Promise<boolean>} True if the user has premium access
 */
export const checkPremiumAccess = async () => {
  try {
    // Check if the user has an active subscription
    const subscriptionStatus = await AsyncStorage.getItem(SUBSCRIPTION_STATUS_KEY);
    if (subscriptionStatus === 'active') {
      return true;
    }
    
    // Check if the user is still within the trial period
    const trialTimeRemaining = await getRemainingTrialTime();
    return trialTimeRemaining > 0;
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
};

/**
 * Get the remaining trial time in milliseconds
 * @returns {Promise<number>} Remaining trial time in milliseconds
 */
export const getRemainingTrialTime = async () => {
  try {
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
    return 0;
  }
};

/**
 * Purchase a premium subscription
 * @param {string} planId - ID of the subscription plan
 * @returns {Promise<boolean>} True if the purchase was successful
 */
export const purchasePremium = async (planId) => {
  try {
    // In a real implementation, this would integrate with a payment provider
    // For demonstration, we're just simulating a successful purchase
    
    // Simulating payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store the subscription status
    await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
    
    console.log(`Purchased plan: ${planId}`);
    return true;
  } catch (error) {
    console.error('Error purchasing premium:', error);
    throw new Error('Failed to purchase premium');
  }
};

/**
 * Cancel a premium subscription
 * @returns {Promise<boolean>} True if the cancellation was successful
 */
export const cancelSubscription = async () => {
  try {
    // In a real implementation, this would integrate with a payment provider
    // For demonstration, we're just simulating a successful cancellation
    
    // Simulating cancellation processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the subscription status
    await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'canceled');
    
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
};

/**
 * Check the trial status and start it if it hasn't started yet
 * @returns {Promise<void>}
 */
export const checkTrialStatus = async () => {
  try {
    const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
    
    if (!trialStartStr) {
      // If there's no trial start time recorded, start the trial now
      const now = new Date().getTime();
      await AsyncStorage.setItem(TRIAL_START_KEY, now.toString());
    }
  } catch (error) {
    console.error('Error checking trial status:', error);
  }
};

/**
 * Reset all app data (for testing purposes)
 * @returns {Promise<void>}
 */
export const resetAppData = async () => {
  try {
    await AsyncStorage.removeItem(SUBSCRIPTION_STATUS_KEY);
    await AsyncStorage.removeItem(TRIAL_START_KEY);
  } catch (error) {
    console.error('Error resetting app data:', error);
    throw new Error('Failed to reset app data');
  }
};
