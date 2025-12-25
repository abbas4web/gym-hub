import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/contexts/ClientContext';
import { Users, UserCheck, UserX, DollarSign, Plus, Bell } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getExpiringClients, formatCurrency } from '@/utils/membership.utils';

cssInterop(Users, { className: { target: "style" } });
cssInterop(UserCheck, { className: { target: "style" } });
cssInterop(UserX, { className: { target: "style" } });
cssInterop(DollarSign, { className: { target: "style" } });
cssInterop(Plus, { className: { target: "style" } });
cssInterop(Bell, { className: { target: "style" } });

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
      <ScrollView className="flex-1 px-4">
        <View className="flex-row justify-between items-center py-6">
          <View>
            <Text className="text-2xl font-bold text-foreground">Dashboard</Text>
            <Text className="text-muted-foreground">Welcome back, {user?.name}</Text>
          </View>
          <View className="flex-row">
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
            <TouchableOpacity 
              className="w-10 h-10 bg-primary items-center justify-center rounded-xl"
              onPress={() => navigation.navigate('Clients')}
            >
              <Plus size={24} color="#0d0f14" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row flex-wrap justify-between mb-6">
          <StatCard title="Total Clients" value={clients.length} icon={Users} />
          <StatCard title="Active" value={activeClients.length} icon={UserCheck} />
          <StatCard title="Expired" value={expiredClients.length} icon={UserX} color="#ef4444" />
          <StatCard title="Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} />
        </View>

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

        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">Recent Activity</Text>
          {clients.length === 0 ? (
            <Card className="items-center py-8">
              <Users size={40} color="#a1a1aa" />
              <Text className="text-muted-foreground mt-4">No clients yet</Text>
              <Text className="text-muted-foreground text-sm">Add your first client to get started</Text>
            </Card>
          ) : (
            clients.slice(0, 5).map(client => (
              <TouchableOpacity 
                key={client.id}
                onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
              >
                <Card className="mb-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    {client.photo ? (
                      <Image
                        source={{ uri: client.photo }}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
                        <Text className="text-primary font-bold">{client.name.charAt(0)}</Text>
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="text-foreground font-medium">{client.name}</Text>
                      <Text className="text-muted-foreground text-xs">{client.membershipType}</Text>
                    </View>
                  </View>
                  <Badge variant={client.isActive ? 'active' : 'expired'}>
                    {client.isActive ? 'Active' : 'Expired'}
                  </Badge>
                </View>
              </Card>
            </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
