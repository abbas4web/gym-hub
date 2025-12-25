import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  const { clients, isLoading, searchClients } = useClients();

  const filteredClients = searchClients(searchQuery);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#84cc16" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4">
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
          containerClassName="mb-6"
        />

        <FlatList
          data={filteredClients}
          renderItem={({ item }) => (
            <ClientCard client={item} onPress={() => {}} />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-muted-foreground">
                {searchQuery ? 'No clients found' : 'No clients yet'}
              </Text>
              {!searchQuery && (
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
