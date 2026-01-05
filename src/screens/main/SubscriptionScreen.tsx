import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubscriptionScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-foreground text-2xl font-bold mb-4">Subscription Plans</Text>
      <Text className="text-muted-foreground text-center">
        Coming soon! Upgrade to Pro or Business plans.
      </Text>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
