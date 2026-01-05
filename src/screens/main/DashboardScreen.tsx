import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/contexts/ClientContext';
import { useState } from 'react';
import { Users, UserCheck, UserX, IndianRupee, Plus, Bell, Eye, EyeOff } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getExpiringClients, formatCurrency } from '@/utils/membership.utils';

cssInterop(Users, { className: { target: "style" } });
cssInterop(UserCheck, { className: { target: "style" } });
cssInterop(UserX, { className: { target: "style" } });
cssInterop(IndianRupee, { className: { target: "style" } });
cssInterop(Plus, { className: { target: "style" } });
cssInterop(Bell, { className: { target: "style" } });
cssInterop(Eye, { className: { target: "style" } });
cssInterop(EyeOff, { className: { target: "style" } });

const StatCard = ({ title, value, icon: Icon, color = "#84cc16" }: any) => (
  <Card className="flex-1 mr-2 mb-2 min-w-[150px]">
    <View className="flex-row justify-between items-start mb-2">
      <Icon size={20} color={color} />
      <Text className="text-xs text-muted-foreground">{title}</Text>
    </View>
    <Text className="text-2xl font-bold text-foreground">{value}</Text>
  </Card>
);

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { clients, isLoading } = useClients();
  const [showRevenue, setShowRevenue] = useState(false); // Hidden by default

  const activeClients = clients.filter(c => c.isActive);
  const expiredClients = clients.filter(c => !c.isActive);
  const totalRevenue = clients.reduce((sum, c) => sum + c.fee, 0);
  const expiringClients = getExpiringClients(clients, 7);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#84cc16" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header with GymHub branding and gym logo */}
        <View className="flex-row justify-between items-center py-6">
          <View>
            <Text className="text-2xl font-bold text-foreground">GymHub</Text>
            <Text className="text-muted-foreground">Welcome back, {user?.name}</Text>
          </View>
          <View className="flex-row items-center">
            {expiringClients.length > 0 && (
              <TouchableOpacity 
                className="w-10 h-10 bg-destructive/20 items-center justify-center rounded-xl mr-2"
                onPress={() => navigation.navigate('NotificationCenter')}
              >
                <Bell size={20} color="#ef4444" />
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">{expiringClients.length}</Text>
                </View>
              </TouchableOpacity>
            )}
            {/* Gym Logo - Clickable to Settings */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              {user?.gymLogo ? (
                <View className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary">
                  <Image
                    source={{ uri: user.gymLogo }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View className="w-12 h-12 bg-primary/20 rounded-xl items-center justify-center">
                  <Text className="text-primary font-bold text-lg">
                    {user?.gymName?.charAt(0).toUpperCase() || 'G'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <StatCard title="Total Clients" value={clients.length} icon={Users} />
          <StatCard title="Active" value={activeClients.length} icon={UserCheck} />
          <StatCard title="Expired" value={expiredClients.length} icon={UserX} color="#ef4444" />
          
          {/* Revenue Card with Hide/Show Toggle */}
          <Card className="flex-1 mr-2 mb-2 min-w-[150px]">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-row items-center gap-2">
                <IndianRupee size={20} color="#84cc16" />
                <Text className="text-xs text-muted-foreground">Revenue</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRevenue(!showRevenue)}>
                {showRevenue ? (
                  <Eye size={16} color="#A1A1AA" />
                ) : (
                  <EyeOff size={16} color="#A1A1AA" />
                )}
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {showRevenue ? formatCurrency(totalRevenue) : '••••••'}
            </Text>
          </Card>
        </View>

        {/* Add Client Button - Centered and Larger */}
        <TouchableOpacity
          className="bg-primary rounded-2xl p-6 mb-6 items-center justify-center shadow-lg"
          onPress={() => navigation.navigate('AddClient')}
          activeOpacity={0.8}
        >
          <View className="w-16 h-16 bg-primary-foreground/10 rounded-full items-center justify-center mb-3">
            <Plus size={32} color="#0d0f14" />
          </View>
          <Text className="text-primary-foreground font-bold text-lg">Add New Client</Text>
          <Text className="text-primary-foreground/70 text-sm mt-1">Tap to register a new member</Text>
        </TouchableOpacity>

        {expiringClients.length > 0 && (
          <Card className="mb-6 bg-destructive/10 border-destructive/30">
            <View className="flex-row items-center mb-2">
              <Bell size={16} color="#ef4444" />
              <Text className="text-destructive font-bold ml-2">Expiring Soon</Text>
            </View>
            <Text className="text-muted-foreground text-sm">
              {expiringClients.length} membership{expiringClients.length > 1 ? 's' : ''} expiring within 7 days
            </Text>
          </Card>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
