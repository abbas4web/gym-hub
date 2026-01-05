import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClients } from '@/contexts/ClientContext';
import { Search, Plus } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Input } from '@/components/ui/Input';
import { ClientCard } from '@/components/ClientCard';

cssInterop(Search, { className: { target: "style" } });
cssInterop(Plus, { className: { target: "style" } });

const ClientsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Expired'>('All');
  const { clients, isLoading, searchClients } = useClients();

  const getFilteredClients = () => {
    // First apply search
    let filtered = searchClients(searchQuery);

    // Then apply status filter
    if (statusFilter === 'All') return filtered;

    return filtered.filter(client => {
      switch (statusFilter) {
        case 'Active':
          return client.isActive && !!client.adharPhoto;
        case 'Pending':
          return client.isActive && !client.adharPhoto;
        case 'Expired':
          return !client.isActive;
        default:
          return true;
      }
    });
  };

  const filteredClients = getFilteredClients();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#84cc16" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 py-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-foreground">Clients</Text>
          <TouchableOpacity 
            className="w-10 h-10 bg-primary items-center justify-center rounded-xl"
            onPress={() => navigation.navigate('AddClient')}
          >
            <Plus size={24} color="#0d0f14" />
          </TouchableOpacity>
        </View>

        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search clients..."
          icon={<Search size={20} color="#a1a1aa" />}
          containerClassName="mb-4"
        />

        {/* Status Filters */}
        <View className="mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {['All', 'Active', 'Pending', 'Expired'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status as any)}
                className={`px-4 py-2 rounded-full border ${
                  statusFilter === status 
                    ? 'bg-primary border-primary' 
                    : 'bg-card border-border'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  statusFilter === status ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredClients}
          renderItem={({ item }) => (
            <ClientCard 
              client={item} 
              onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })} 
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 px-8">
              <Text className="text-muted-foreground text-center">
                {searchQuery 
                  ? `No clients matching "${searchQuery}"`
                  : statusFilter === 'All'
                    ? "You haven't added any clients yet"
                    : `No ${statusFilter.toLowerCase()} clients found`}
              </Text>
              {!searchQuery && statusFilter === 'All' && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddClient')}
                  className="mt-4 bg-primary px-6 py-3 rounded-xl"
                >
                  <Text className="text-primary-foreground font-bold">Add First Client</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientsScreen;
