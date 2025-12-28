import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Subscription, SUBSCRIPTION_PLANS } from '@/types/models';
import { subscriptionAPI } from '@/services/api.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionContextType {
  subscription: Subscription;
  isLoading: boolean;
  canAddClient: () => Promise<boolean>;
  upgradePlan: (plan: 'free' | 'pro' | 'business', billingCycle?: 'monthly' | 'yearly') => Promise<void>;
  hasFeature: (feature: string) => boolean;
  refreshSubscription: () => Promise<void>;
}

const defaultSubscription: Subscription = {
  id: '',
  userId: '',
  plan: 'free',
  billingCycle: 'monthly',
  startDate: new Date().toISOString(),
  endDate: null,
  isActive: true,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription>(defaultSubscription);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      // Only try to load subscription if user is logged in
      const token = await AsyncStorage.getItem('gym_auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await subscriptionAPI.get();
      if (response.success && response.subscription) {
        setSubscription(response.subscription);
      }
    } catch (error) {
      // Silently fail - user will see login screen
      // console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canAddClient = async (): Promise<boolean> => {
    try {
      const response = await subscriptionAPI.canAddClient();
      return response.success && response.canAdd;
    } catch (error) {
      // console.error('Error checking client limit:', error);
      return false;
    }
  };

  const upgradePlan = async (plan: 'free' | 'pro' | 'business', billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    try {
      const response = await subscriptionAPI.update(plan, billingCycle);
      if (response.success && response.subscription) {
        setSubscription(response.subscription);
      }
    } catch (error) {
      // console.error('Error upgrading plan:', error);
      throw error;
    }
  };

  const hasFeature = (feature: string): boolean => {
    const planDetails = SUBSCRIPTION_PLANS[subscription.plan];
    return planDetails.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
  };

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        canAddClient,
        upgradePlan,
        hasFeature,
        refreshSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
