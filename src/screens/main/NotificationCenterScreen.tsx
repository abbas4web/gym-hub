import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, BellOff } from 'lucide-react-native';
import { useClients } from '@/contexts/ClientContext';
import { ClientCard } from '@/components/ClientCard';
import { getExpiringClients, getExpiredClients } from '@/utils/membership.utils';
import { styled } from 'nativewind';

const StyledArrowLeft = styled(ArrowLeft);
const StyledBellOff = styled(BellOff);

const NotificationCenterScreen = ({ navigation }: any) => {
  const { clients } = useClients();
  const expiringClients = getExpiringClients(clients, 7);
  const expiredClients = getExpiredClients(clients, 30); // Show clients expired in the last 30 days

  // Combine and sort by date (upcoming/recent first)
  const allNotifications = [...expiringClients, ...expiredClients].sort((a, b) => 
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <StyledArrowLeft size={24} color="#84cc16" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Notifications</Text>
      </View>

      <FlatList
        data={allNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 pt-4">
            <ClientCard 
              client={item} 
              onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })} 
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-8">
            <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mb-4">
              <StyledBellOff size={32} color="#a1a1aa" />
            </View>
            <Text className="text-foreground font-bold text-lg mb-2">All caught up!</Text>
            <Text className="text-muted-foreground text-center">
              No memberships are expiring soon or have expired recently.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationCenterScreen;
