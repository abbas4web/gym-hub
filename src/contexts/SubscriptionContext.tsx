import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanType, BillingCycle, Subscription, PLANS, Plan } from '@/types/subscription';

const SUBSCRIPTION_KEY = 'gym_subscription';

interface SubscriptionContextType {
  subscription: Subscription;
  currentPlan: Plan;
  updateSubscription: (planId: PlanType, billingCycle: BillingCycle) => void;
  cancelSubscription: () => void;
  canAddClient: (currentClientCount: number) => boolean;
  hasFeature: (feature: keyof Plan['limits']) => boolean;
  isUpgradeNeeded: (feature: keyof Plan['limits']) => boolean;
}

const defaultSubscription: Subscription = {
  planId: 'free',
  billingCycle: 'monthly',
  status: 'active',
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  clientsUsed: 0,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription>(() => {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);
    return stored ? JSON.parse(stored) : defaultSubscription;
  });

  const currentPlan = PLANS.find(p => p.id === subscription.planId) || PLANS[0];

  useEffect(() => {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  }, [subscription]);

  const updateSubscription = (planId: PlanType, billingCycle: BillingCycle) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));
    
    setSubscription({
      ...subscription,
      planId,
      billingCycle,
      status: 'active',
      currentPeriodEnd: endDate.toISOString(),
    });
  };

  const cancelSubscription = () => {
    setSubscription({
      ...subscription,
      status: 'cancelled',
    });
  };

  const canAddClient = (currentClientCount: number) => {
    return currentClientCount < currentPlan.limits.maxClients;
  };

  const hasFeature = (feature: keyof Plan['limits']) => {
    return currentPlan.limits[feature] === true || 
           (typeof currentPlan.limits[feature] === 'number' && currentPlan.limits[feature] > 0);
  };

  const isUpgradeNeeded = (feature: keyof Plan['limits']) => {
    return !hasFeature(feature);
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      currentPlan,
      updateSubscription,
      cancelSubscription,
      canAddClient,
      hasFeature,
      isUpgradeNeeded,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
