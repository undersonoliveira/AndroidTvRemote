import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Services
import { 
  checkPremiumAccess, 
  purchasePremium, 
  getRemainingTrialTime 
} from '../services/subscriptionManager';

// Context
import { ThemeContext } from '../context/ThemeContext';

const subscriptionPlans = [
  { id: 'daily', period: 'day', price: 0.99 },
  { id: 'weekly', period: 'week', price: 2.99 },
  { id: 'monthly', period: 'month', price: 7.99 },
  { id: 'yearly', period: 'year', price: 59.99, bestValue: true },
];

export default function SubscriptionScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [trialTimeRemaining, setTrialTimeRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      const hasAccess = await checkPremiumAccess();
      setHasPremiumAccess(hasAccess);
      
      if (!hasAccess) {
        const remainingTime = await getRemainingTrialTime();
        setTrialTimeRemaining(remainingTime);
      }
    } catch (error) {
      console.error('Failed to load subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await purchasePremium(selectedPlan);
      setHasPremiumAccess(true);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return t('subscription.trialEnded');
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return t('subscription.timeRemaining', { hours, minutes });
    } else {
      return t('subscription.minutesRemaining', { minutes });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1512149673953-1e251807ec7c' }}
            style={styles.heroImage}
          />
        </View>
        
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {hasPremiumAccess 
              ? t('subscription.premiumActive') 
              : t('subscription.unlockPremium')
            }
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.secondaryText }]}>
            {hasPremiumAccess 
              ? t('subscription.enjoyPremium') 
              : t('subscription.description')
            }
          </Text>
          
          {!hasPremiumAccess && trialTimeRemaining !== null && (
            <View style={[styles.trialBanner, { backgroundColor: theme.colors.card }]}>
              <Feather name="clock" size={18} color={theme.colors.primary} style={styles.trialIcon} />
              <Text style={[styles.trialText, { color: theme.colors.text }]}>
                {formatTimeRemaining(trialTimeRemaining)}
              </Text>
            </View>
          )}
        </View>

        {!hasPremiumAccess && (
          <>
            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: theme.colors.premium }]}>
                  <Feather name="mic" size={18} color="white" />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    {t('subscription.voiceControl')}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.secondaryText }]}>
                    {t('subscription.voiceControlDesc')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: theme.colors.premium }]}>
                  <Feather name="type" size={18} color="white" />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    {t('subscription.virtualKeyboard')}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.secondaryText }]}>
                    {t('subscription.keyboardDesc')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: theme.colors.premium }]}>
                  <Feather name="star" size={18} color="white" />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    {t('subscription.customShortcuts')}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.secondaryText }]}>
                    {t('subscription.shortcutsDesc')}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.plansContainer}>
              <Text style={[styles.plansTitle, { color: theme.colors.text }]}>
                {t('subscription.choosePlan')}
              </Text>
              
              <View style={styles.planCards}>
                {subscriptionPlans.map((plan) => (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planCard,
                      { 
                        backgroundColor: selectedPlan === plan.id ? theme.colors.cardSelected : theme.colors.card,
                        borderColor: selectedPlan === plan.id ? theme.colors.primary : theme.colors.border
                      }
                    ]}
                    onPress={() => handlePlanSelect(plan.id)}
                  >
                    {plan.bestValue && (
                      <View style={[styles.bestValueBadge, { backgroundColor: theme.colors.premium }]}>
                        <Text style={styles.bestValueText}>
                          {t('subscription.bestValue')}
                        </Text>
                      </View>
                    )}
                    
                    <Text style={[styles.planPeriod, { color: theme.colors.text }]}>
                      {t(`subscription.${plan.period}`)}
                    </Text>
                    <Text style={[styles.planPrice, { color: theme.colors.text }]}>
                      ${plan.price}
                    </Text>
                    
                    {selectedPlan === plan.id && (
                      <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary }]}>
                        <Feather name="check" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.purchaseButton, 
                  { 
                    backgroundColor: theme.colors.premium,
                    opacity: isPurchasing ? 0.7 : 1
                  }
                ]}
                onPress={handlePurchase}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.purchaseButtonText}>
                    {t('subscription.subscribe')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.termsText, { color: theme.colors.secondaryText }]}>
              {t('subscription.terms')}
            </Text>
          </>
        )}
        
        {hasPremiumAccess && (
          <View style={styles.activeSubscriptionContainer}>
            <View style={[styles.successIcon, { backgroundColor: theme.colors.success }]}>
              <Feather name="check" size={40} color="white" />
            </View>
            
            <Text style={[styles.thankYouText, { color: theme.colors.text }]}>
              {t('subscription.thankYou')}
            </Text>
            
            <TouchableOpacity 
              style={[styles.returnButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.returnButtonText}>
                {t('subscription.returnToRemote')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  trialIcon: {
    marginRight: 8,
  },
  trialText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuresContainer: {
    padding: 20,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  plansContainer: {
    padding: 20,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  planCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  planCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  bestValueText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planPeriod: {
    fontSize: 16,
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseButton: {
    width: '100%',
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 15,
  },
  activeSubscriptionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  returnButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
