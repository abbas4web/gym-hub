import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isSubscribed: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useState(true); // Default to true for now

  const checkSubscription = async () => {
    // Mock check
    setIsSubscribed(true);
  };

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, checkSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
