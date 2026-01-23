import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { User, LogOut, Moon, Sun, CreditCard } from 'lucide-react-native';
import { styled } from 'nativewind';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SUBSCRIPTION_PLANS } from '@/types/models';
import { usePopup } from '@/hooks/usePopup';
import CustomPopup from '@/components/CustomPopup';

const StyledUser = styled(User);
const StyledLogOut = styled(LogOut);
const StyledMoon = styled(Moon);
const StyledSun = styled(Sun);
const StyledCreditCard = styled(CreditCard);

const SettingsScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();
  const { popupState, showConfirm, hidePopup } = usePopup();

  const handleLogout = () => {
    showConfirm(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        await logout();
      }
    );
  };

  const planDetails = SUBSCRIPTION_PLANS[subscription.plan];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CustomPopup {...popupState} onClose={hidePopup} />
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-6">Settings</Text>

        {/* User Profile */}
        <Card className="mb-6">
          <View className="flex-row items-center mb-4">
            {user?.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                className="w-16 h-16 rounded-full mr-4"
              />
            ) : (
              <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mr-4">
                <Text className="text-primary font-bold text-xl">
                  {getInitials(user?.name || 'U')}
                </Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-foreground font-bold text-lg">{user?.name}</Text>
              <Text className="text-muted-foreground">{user?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              className="bg-primary/20 px-4 py-2 rounded-lg"
            >
              <Text className="text-primary font-bold text-sm">Edit</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Gym Information */}
        {user?.gym_name && (
          <Card className="mb-6">
            <View className="flex-row items-center mb-4">
              {user?.gym_logo ? (
                <Image
                  source={{ uri: user.gym_logo }}
                  className="w-16 h-16 rounded-lg mr-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-16 h-16 bg-primary/20 rounded-lg items-center justify-center mr-4">
                  <Text className="text-primary font-bold text-2xl">
                    {user.gym_name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-muted-foreground text-xs mb-1">Gym Name</Text>
                <Text className="text-foreground font-bold text-lg">{user.gym_name}</Text>
              </View>
            </View>

            {/* Membership Plans */}
            {user?.membership_plans && user.membership_plans.length > 0 && (
              <View>
                <Text className="text-foreground font-bold mb-3">Membership Plans</Text>
                {user.membership_plans.map((plan, index) => (
                  <View 
                    key={index}
                    className="bg-muted/50 rounded-lg p-3 mb-2"
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold">{plan.name}</Text>
                        <Text className="text-muted-foreground text-xs mt-1">
                          {plan.duration} {plan.duration === 1 ? 'month' : 'months'}
                        </Text>
                      </View>
                      <View className="bg-primary/20 px-3 py-1 rounded-full">
                        <Text className="text-primary font-bold">₹{plan.fee}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Manage Staff - Only for Owners */}
        {user?.role !== 'worker' && (
          <Card className="mb-6">
            <TouchableOpacity
              onPress={() => navigation.navigate('ManageStaff')}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <User size={20} color="#84cc16" />
                <Text className="text-foreground font-bold ml-2">Manage Staff</Text>
              </View>
              <Text className="text-primary font-medium">→</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Subscription */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <StyledCreditCard size={20} color="#84cc16" />
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
              <StyledMoon size={20} color="#84cc16" />
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
            <StyledLogOut size={20} color="#ffffff" />
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
