import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockClients } from '@/hooks/useGymData';
import { Search, Plus, Phone, Mail } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(Search, { className: { target: "style" } });
cssInterop(Plus, { className: { target: "style" } });
cssInterop(Phone, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });

const ClientsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const clients = mockClients;

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderClientItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-card p-4 mb-3 rounded-xl border border-border">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center mr-3">
            <Text className="text-primary font-bold text-lg">{item.name.charAt(0)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-bold text-lg">{item.name}</Text>
            <Text className="text-muted-foreground text-sm">{item.membershipType} Membership</Text>
          </View>
        </View>
        <View className={`px-2 py-1 rounded-md ${item.status === 'Active' ? 'bg-primary/20' : 'bg-destructive/20'}`}>
          <Text className={`text-xs font-bold ${item.status === 'Active' ? 'text-primary' : 'text-destructive'}`}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View className="flex-row mt-4 pt-4 border-t border-border">
        <TouchableOpacity className="flex-1 flex-row items-center justify-center">
          <Phone size={16} color="#a1a1aa" />
          <Text className="text-muted-foreground ml-2">Call</Text>
        </TouchableOpacity>
        <View className="w-[1px] h-full bg-border" />
        <TouchableOpacity className="flex-1 flex-row items-center justify-center">
          <Mail size={16} color="#a1a1aa" />
          <Text className="text-muted-foreground ml-2">Email</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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

        <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border mb-6">
          <Search size={20} color="#a1a1aa" />
          <TextInput
            className="flex-1 ml-3 text-foreground"
            placeholder="Search clients..."
            placeholderTextColor="#a1a1aa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredClients}
          renderItem={renderClientItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-muted-foreground">No clients found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientsScreen;
