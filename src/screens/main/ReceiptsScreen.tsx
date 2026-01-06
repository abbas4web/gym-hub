import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClients } from '@/contexts/ClientContext';
import { Search, Receipt as ReceiptIcon } from 'lucide-react-native';
import { styled } from 'nativewind';
import { Input } from '@/components/ui/Input';
import { ReceiptCard } from '@/components/ReceiptCard';

const StyledSearch = styled(Search);
const StyledReceiptIcon = styled(ReceiptIcon);

const ReceiptsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { receipts, isLoading } = useClients();

  const filteredReceipts = receipts.filter(receipt =>
    receipt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.id.includes(searchQuery)
  );

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
        <Text className="text-2xl font-bold text-foreground mb-6">Receipts</Text>

        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search receipts..."
          icon={<StyledSearch size={20} color="#a1a1aa" />}
          containerClassName="mb-6"
        />

        <FlatList
          data={filteredReceipts}
          renderItem={({ item }) => (
            <ReceiptCard 
              receipt={item} 
              onPress={() => navigation.navigate('ReceiptDetail', { receiptId: item.id })} 
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <StyledReceiptIcon size={48} color="#a1a1aa" />
              <Text className="text-muted-foreground mt-4">
                {searchQuery ? 'No receipts found' : 'No receipts yet'}
              </Text>
              <Text className="text-muted-foreground text-sm mt-2">
                Receipts are generated automatically when you add or renew clients
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ReceiptsScreen;
