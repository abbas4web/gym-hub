import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { mockClients } from '@/hooks/useGymData';
import { Users, UserCheck, UserX, DollarSign, Plus } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(Users, { className: { target: "style" } });
cssInterop(UserCheck, { className: { target: "style" } });
cssInterop(UserX, { className: { target: "style" } });
cssInterop(DollarSign, { className: { target: "style" } });
cssInterop(Plus, { className: { target: "style" } });

const StatCard = ({ title, value, icon: Icon, color = "#84cc16" }: any) => (
  <View className="flex-1 bg-card p-4 rounded-xl border border-border mr-2 mb-2 min-w-[150px]">
    <View className="flex-row justify-between items-start mb-2">
      <Icon size={20} color={color} />
      <Text className="text-xs text-muted-foreground">{title}</Text>
    </View>
    <Text className="text-2xl font-bold text-foreground">{value}</Text>
  </View>
);

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const clients = mockClients;

  const activeClients = clients.filter(c => c.status === 'Active');
  const expiredClients = clients.filter(c => c.status === 'Expired');
  const totalRevenue = clients.reduce((sum, c) => sum + c.fee, 0);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="flex-row justify-between items-center py-6">
          <View>
            <Text className="text-2xl font-bold text-foreground">Dashboard</Text>
            <Text className="text-muted-foreground">Welcome back, {user?.name}</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 bg-secondary items-center justify-center rounded-xl"
            onPress={() => navigation.navigate('Clients')}
          >
            <Plus size={24} color="#fcfcfc" />
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between mb-6">
          <StatCard title="Total Clients" value={clients.length} icon={Users} />
          <StatCard title="Active" value={activeClients.length} icon={UserCheck} />
          <StatCard title="Expired" value={expiredClients.length} icon={UserX} color="#ef4444" />
          <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        </View>

        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">Recent Activity</Text>
          {clients.length === 0 ? (
            <View className="bg-card p-8 rounded-xl items-center border border-border">
              <Users size={40} color="#272a30" />
              <Text className="text-muted-foreground mt-4">No clients yet</Text>
            </View>
          ) : (
            clients.slice(0, 5).map(client => (
              <View key={client.id} className="bg-card p-4 mb-3 rounded-xl border border-border flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center mr-3">
                    <Text className="text-primary font-bold">{client.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="text-foreground font-medium">{client.name}</Text>
                    <Text className="text-muted-foreground text-xs">{client.membershipType}</Text>
                  </View>
                </View>
                <Text className={client.status === 'Expired' ? "text-destructive" : "text-primary"}>
                  {client.status}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
