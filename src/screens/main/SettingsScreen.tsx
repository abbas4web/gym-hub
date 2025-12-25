import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { User, LogOut, Moon, Sun, CreditCard } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SUBSCRIPTION_PLANS } from '@/types/models';

cssInterop(User, { className: { target: "style" } });
cssInterop(LogOut, { className: { target: "style" } });
cssInterop(Moon, { className: { target: "style" } });
cssInterop(Sun, { className: { target: "style" } });
cssInterop(CreditCard, { className: { target: "style" } });

const SettingsScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => await logout() },
      ]
    );
  };

  const planDetails = SUBSCRIPTION_PLANS[subscription.plan];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-2xl font-bold text-foreground mb-6">Settings</Text>

        {/* User Profile */}
        <Card className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mr-4">
              <User size={32} color="#84cc16" />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-bold text-lg">{user?.name}</Text>
              <Text className="text-muted-foreground">{user?.email}</Text>
            </View>
          </View>
        </Card>

        {/* Subscription */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <CreditCard size={20} color="#84cc16" />
              <Text className="text-foreground font-bold ml-2">Subscription</Text>
            </View>
            <View className="bg-primary/20 px-3 py-1 rounded-full">
              <Text className="text-primary font-bold capitalize">{subscription.plan}</Text>
            </View>
          </View>
          <Text className="text-muted-foreground text-sm mb-3">
            {planDetails.features[0]}
          </Text>
          {subscription.plan === 'free' && (
            <Button
              onPress={() => navigation.navigate('Subscription')}
              variant="primary"
              size="sm"
            >
              Upgrade Plan
            </Button>
          )}
        </Card>

        {/* Theme Toggle - Placeholder */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Moon size={20} color="#84cc16" />
              <Text className="text-foreground font-medium ml-2">Dark Mode</Text>
            </View>
            <Text className="text-muted-foreground text-sm">Always On</Text>
          </View>
        </Card>

        {/* Logout */}
        <Button
          onPress={handleLogout}
          variant="destructive"
          className="mt-4"
        >
          <View className="flex-row items-center">
            <LogOut size={20} color="#ffffff" />
            <Text className="text-white font-bold ml-2">Logout</Text>
          </View>
        </Button>

        <View className="mt-8 items-center">
          <Text className="text-muted-foreground text-sm">Gym Hub v1.0.0</Text>
          <Text className="text-muted-foreground text-xs mt-1">
            © 2024 All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
