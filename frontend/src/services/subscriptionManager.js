import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_KEYS, API_URL, TRIAL_DURATION } from '../utils/constants';

/**
 * Check if the user has premium access
 * @returns {Promise<boolean>} True if the user has premium access
 */
export const checkPremiumAccess = async () => {
  try {
    // Verificar status de assinatura no backend
    const response = await axios.post(`${API_URL}/api/subscription/check`, {
      // Por enquanto estamos usando IDs simulados
      userId: 'user123'
    });
    
    if (response.data.hasSubscription) {
      return true;
    }
    
    // Se não tem assinatura ativa, verificar se o período de teste ainda está válido
    const remainingTime = await getRemainingTrialTime();
    return remainingTime > 0;
  } catch (error) {
    console.error('Error checking premium access:', error);
    
    // Modo offline ou erro: verificar localmente se o período de teste ainda está válido
    const remainingTime = await getRemainingTrialTime();
    return remainingTime > 0;
  }
};

/**
 * Get the remaining trial time in milliseconds
 * @returns {Promise<number>} Remaining trial time in milliseconds
 */
export const getRemainingTrialTime = async () => {
  try {
    // Verificar status de teste no backend
    const response = await axios.post(`${API_URL}/api/subscription/trial/status`, {
      userId: 'user123'
    });
    
    if (response.data.inTrial) {
      return response.data.remainingTime;
    }
    
    return 0;
  } catch (error) {
    console.error('Error checking trial status:', error);
    
    // Modo offline ou erro: verificar localmente
    try {
      const trialInfo = await AsyncStorage.getItem(STORAGE_KEYS.TRIAL_INFO);
      
      if (!trialInfo) {
        return 0;
      }
      
      const { startTime, hasStarted } = JSON.parse(trialInfo);
      
      if (!hasStarted) {
        return TRIAL_DURATION;
      }
      
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const remainingTime = Math.max(0, TRIAL_DURATION - elapsedTime);
      
      return remainingTime;
    } catch (localError) {
      console.error('Error checking local trial status:', localError);
      return 0;
    }
  }
};

/**
 * Purchase a premium subscription
 * @param {string} planId - ID of the subscription plan
 * @returns {Promise<Object>} Subscription information
 */
export const purchasePremium = async (planId) => {
  try {
    const response = await axios.post(`${API_URL}/api/subscription/purchase`, {
      userId: 'user123',
      planId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error purchasing premium:', error);
    throw error;
  }
};

/**
 * Create a payment intent for Stripe
 * @param {string} planId - ID of the subscription plan
 * @returns {Promise<Object>} Payment intent
 */
export const createPaymentIntent = async (planId) => {
  try {
    const response = await axios.post(`${API_URL}/api/subscription/create-payment-intent`, {
      userId: 'user123',
      planId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Create a subscription in Stripe
 * @param {string} planId - ID of the subscription plan
 * @returns {Promise<Object>} Subscription information
 */
export const createSubscription = async (planId) => {
  try {
    const response = await axios.post(`${API_URL}/api/subscription/create-subscription`, {
      userId: 'user123',
      planId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Cancel a premium subscription
 * @returns {Promise<boolean>} True if the cancellation was successful
 */
export const cancelSubscription = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/subscription/cancel`, {
      userId: 'user123'
    });
    
    return response.data.success;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Get all available subscription plans
 * @returns {Promise<Array>} Array of subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/subscription/plans`);
    return response.data.plans;
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    throw error;
  }
};

/**
 * Check the trial status and start it if it hasn't started yet
 * @returns {Promise<void>}
 */
export const checkTrialStatus = async () => {
  try {
    // Verificar se o período de teste já foi iniciado localmente
    const trialInfo = await AsyncStorage.getItem(STORAGE_KEYS.TRIAL_INFO);
    
    if (trialInfo) {
      // O período de teste já existe, nada a fazer
      return;
    }
    
    // Iniciar período de teste no backend
    try {
      const response = await axios.post(`${API_URL}/api/subscription/trial/start`, {
        userId: 'user123'
      });
      
      // Salvar informação localmente
      await AsyncStorage.setItem(STORAGE_KEYS.TRIAL_INFO, JSON.stringify({
        startTime: response.data.startTime,
        hasStarted: true
      }));
    } catch (serverError) {
      console.error('Error starting trial on server:', serverError);
      
      // Modo offline ou erro no servidor: iniciar localmente
      const currentTime = new Date().getTime();
      await AsyncStorage.setItem(STORAGE_KEYS.TRIAL_INFO, JSON.stringify({
        startTime: currentTime,
        hasStarted: true
      }));
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
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error resetting app data:', error);
  }
};